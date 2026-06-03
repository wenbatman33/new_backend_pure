import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getWithdrawalTime, putWithdrawalTime } from "@/api/systemManage";
import type { WithdrawalTimeData, DayConfig } from "./types";

// 一周七天与表单字段映射
const dayConfigs: DayConfig[] = [
  {
    titleKey: "systemManage.monday",
    startField: "withdrawalTimeMondayStart",
    endField: "withdrawalTimeMondayEnd"
  },
  {
    titleKey: "systemManage.tuesday",
    startField: "withdrawalTimeTuesdayStart",
    endField: "withdrawalTimeTuesdayEnd"
  },
  {
    titleKey: "systemManage.wednesday",
    startField: "withdrawalTimeWednesdayStart",
    endField: "withdrawalTimeWednesdayEnd"
  },
  {
    titleKey: "systemManage.thursday",
    startField: "withdrawalTimeThursdayStart",
    endField: "withdrawalTimeThursdayEnd"
  },
  {
    titleKey: "systemManage.friday",
    startField: "withdrawalTimeFridayStart",
    endField: "withdrawalTimeFridayEnd"
  },
  {
    titleKey: "systemManage.saturday",
    startField: "withdrawalTimeSaturdayStart",
    endField: "withdrawalTimeSaturdayEnd"
  },
  {
    titleKey: "systemManage.sunday",
    startField: "withdrawalTimeSundayStart",
    endField: "withdrawalTimeSundayEnd"
  }
];

function defaultData(): WithdrawalTimeData {
  return {
    withdrawalTimeEnable: false,
    withdrawalTimeMondayStart: "",
    withdrawalTimeMondayEnd: "",
    withdrawalTimeTuesdayStart: "",
    withdrawalTimeTuesdayEnd: "",
    withdrawalTimeWednesdayStart: "",
    withdrawalTimeWednesdayEnd: "",
    withdrawalTimeThursdayStart: "",
    withdrawalTimeThursdayEnd: "",
    withdrawalTimeFridayStart: "",
    withdrawalTimeFridayEnd: "",
    withdrawalTimeSaturdayStart: "",
    withdrawalTimeSaturdayEnd: "",
    withdrawalTimeSundayStart: "",
    withdrawalTimeSundayEnd: ""
  };
}

export function useWithdrawalTime() {
  const loading = ref(false);
  const formData = reactive<WithdrawalTimeData>(defaultData());

  // 判断该天的时间区间是否跨日（结束时间早于起始时间）
  function isCrossDay(start: string, end: string) {
    if (!start || !end) return false;
    const base = dayjs().format("YYYY-MM-DD");
    return dayjs(`${base} ${end}`).isBefore(dayjs(`${base} ${start}`));
  }

  // 起始时间选择回调，统一补足秒数为 00
  function onStartChange(field: keyof WithdrawalTimeData, val: string) {
    (formData[field] as string) = val
      ? dayjs(`2000-01-01 ${val}`).format("HH:mm:00")
      : "";
  }

  // 结束时间选择回调，统一补足秒数为 59
  function onEndChange(field: keyof WithdrawalTimeData, val: string) {
    (formData[field] as string) = val
      ? dayjs(`2000-01-01 ${val}`).format("HH:mm:59")
      : "";
  }

  async function getData() {
    loading.value = true;
    try {
      const { data } = await getWithdrawalTime();
      Object.assign(formData, defaultData(), data ?? {});
    } finally {
      loading.value = false;
    }
  }

  async function handleSubmit() {
    loading.value = true;
    try {
      const { success } = await putWithdrawalTime({ ...formData });
      if (success) {
        message($t("systemManage.updateSuccess"), { type: "success" });
        await getData();
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getData();
  });

  return {
    loading,
    formData,
    dayConfigs,
    isCrossDay,
    onStartChange,
    onEndChange,
    getData,
    handleSubmit
  };
}
