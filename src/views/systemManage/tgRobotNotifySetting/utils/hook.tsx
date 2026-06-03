import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getConfigTelegramBot,
  putConfigTelegramBot
} from "@/api/systemManage";
import type { TgRobotNotifyForm } from "./types";

export function useTgRobotNotifySetting() {
  // 表单资料
  const form = reactive<TgRobotNotifyForm>({
    open: false,
    chatId: "",
    manual: ""
  });
  const loading = ref(false);
  const saving = ref(false);

  // 读取设定
  async function getConfig() {
    loading.value = true;
    try {
      const { success, data } = await getConfigTelegramBot();
      if (success && data) {
        form.open = !!data.open;
        form.chatId = data.chatId ?? "";
        form.manual = data.manual ?? "";
      }
    } finally {
      loading.value = false;
    }
  }

  // 关闭开关时清空 chatId（沿用旧逻辑）
  function handleSwitchChange(val: boolean) {
    if (val === false) form.chatId = "";
  }

  // 保存设定
  async function handleSave() {
    saving.value = true;
    try {
      const { success } = await putConfigTelegramBot({
        open: form.open,
        chatId: form.chatId
      });
      if (success) {
        message($t("systemManage.tgRobotNotifySaveSuccess"), { type: "success" });
        getConfig();
      }
    } finally {
      saving.value = false;
    }
  }

  onMounted(() => {
    getConfig();
  });

  return {
    form,
    loading,
    saving,
    getConfig,
    handleSwitchChange,
    handleSave
  };
}
