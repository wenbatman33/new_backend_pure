import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getSiteFunctionSettings, putSiteFunctionSettings } from "@/api/operator";
import type { SiteFunctionFormData } from "./types";

// 把後端傳回的 league（陣列或字串）轉成顯示用字串
function toLeagueText(value: any): string {
  if (Array.isArray(value)) return value.join(",");
  return value || "";
}

// 把顯示用字串轉回 number[] 給後端
function toLeagueList(value: any): number[] {
  if (Array.isArray(value))
    return value.map((item: any) => Number(item)).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item: string) => Number(item.trim()))
    .filter(Boolean);
}

export function useSiteFunction() {
  const loading = ref(false);

  // 表單預設值
  const formData = reactive<SiteFunctionFormData>({
    phone_edit: false,
    modify_password_mode: 1,
    email_show: false,
    email_verfiy: false,
    email_get_password: false,
    luckmoney_active: false,
    chatroom_entrance: false,
    lobbyxinliQuickBetWidget: false,
    lobbySabaQuickBetWidget: false,
    sabaWidgetID: "",
    eventLeague: false,
    eventLeagueID: "",
    websocketMatchScheduleStatus: false,
    websocketMatchScheduleLeague: "",
    websocketMatchSchedulePreEventTime: undefined,
    home_lottery: false,
    home_lottery_title: "",
    home_lottery_link: "",
    welfare: false,
    specific_1: false,
    specific_title: "",
    specific_link: ""
  });

  // 載入設定
  async function reload() {
    loading.value = true;
    try {
      const { success, data } = await getSiteFunctionSettings();
      if (!success || !data) return;
      const websocketMatchSchedule = (data as any).websocketMatchSchedule || {};
      Object.assign(formData, {
        welfare: data.welfare === 1,
        phone_edit: data.phone_edit === 1,
        luckmoney_active: data.luckmoney_active === 1,
        specific_1: data.specific_1 === 1,
        specific_title: data.specific_title || "",
        specific_link: data.specific_link || "",
        modify_password_mode: data.modify_password_mode,
        home_lottery: data.home_lottery === 1,
        chatroom_entrance: data.chatroom_entrance === 1,
        lobbyxinliQuickBetWidget: data.lobbyxinliQuickBetWidget === 1,
        lobbySabaQuickBetWidget: data.lobbySabaQuickBetWidget === 1,
        sabaWidgetID: data.sabaWidgetID || "",
        eventLeague: data.eventLeague === 1,
        eventLeagueID: data.eventLeagueID || "",
        websocketMatchScheduleStatus:
          websocketMatchSchedule.status === 1 ||
          (data as any).preMatchBroadcast === 1,
        websocketMatchScheduleLeague: toLeagueText(
          websocketMatchSchedule.league || (data as any).preMatchBroadcastLeagueID
        ),
        websocketMatchSchedulePreEventTime:
          websocketMatchSchedule.preEventTime ||
          (data as any).preMatchBroadcastBeforeMinutes ||
          undefined,
        home_lottery_title: data.home_lottery_title || "",
        home_lottery_link: data.home_lottery_link || "",
        email_verfiy: data.email_verfiy === 1,
        email_get_password: data.email_get_password === 1,
        email_show: data.email_show === 1
      });
    } finally {
      loading.value = false;
    }
  }

  // 儲存設定
  async function handleSubmit() {
    loading.value = true;
    const payload = {
      welfare: formData.welfare ? 1 : 2,
      phone_edit: formData.phone_edit ? 1 : 2,
      luckmoney_active: formData.luckmoney_active ? 1 : 2,
      specific_1: formData.specific_1 ? 1 : 2,
      specific_title: formData.specific_title || "",
      specific_link: formData.specific_link || "",
      modify_password_mode: formData.modify_password_mode,
      home_lottery: formData.home_lottery ? 1 : 2,
      chatroom_entrance: formData.chatroom_entrance ? 1 : 2,
      lobbyxinliQuickBetWidget: formData.lobbyxinliQuickBetWidget ? 1 : 2,
      lobbySabaQuickBetWidget: formData.lobbySabaQuickBetWidget ? 1 : 2,
      sabaWidgetID: formData.sabaWidgetID || "",
      eventLeague: formData.eventLeague ? 1 : 2,
      eventLeagueID: formData.eventLeagueID || "",
      websocketMatchSchedule: {
        status: formData.websocketMatchScheduleStatus ? 1 : 2,
        league: toLeagueList(formData.websocketMatchScheduleLeague),
        preEventTime: formData.websocketMatchSchedulePreEventTime || 0
      },
      home_lottery_title: formData.home_lottery_title || "",
      home_lottery_link: formData.home_lottery_link || "",
      email_verfiy: formData.email_verfiy ? 1 : 2,
      email_get_password: formData.email_get_password ? 1 : 2,
      email_show: formData.email_show ? 1 : 2
    };
    try {
      const { success } = await putSiteFunctionSettings(payload);
      if (success) {
        message($t("operator.updateSuccess"), { type: "success" });
        reload();
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    reload();
  });

  return {
    loading,
    formData,
    reload,
    handleSubmit
  };
}
