import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getLoginKickoutConfig,
  putLoginKickoutConfig
} from "@/api/risk_control";
import type { KickoutConfig } from "./types";

export function useOnlinePlayerMonitoring() {
  const loading = ref(false); // 讀取設定中
  const saving = ref(false); // 儲存中
  const onlineCount = ref(0); // 當前線上人數

  // 設定表單
  const formData = ref<Omit<KickoutConfig, "online_count">>({
    same_ip_enable: true,
    same_ip_limit: 0,
    same_device_enable: true,
    same_device_limit: 0
  });

  // 取得設定
  async function getConfig() {
    loading.value = true;
    try {
      const { data } = await getLoginKickoutConfig();
      if (!data) return;
      onlineCount.value = data.online_count ?? 0;
      formData.value = {
        same_ip_enable: data.same_ip_enable,
        same_ip_limit: data.same_ip_limit,
        same_device_enable: data.same_device_enable,
        same_device_limit: data.same_device_limit
      };
    } finally {
      loading.value = false;
    }
  }

  // 儲存設定
  async function handleSave() {
    saving.value = true;
    try {
      const { success } = await putLoginKickoutConfig(formData.value);
      if (success) {
        message($t("risk_control.updateSuccess"), { type: "success" });
      } else {
        message($t("risk_control.updateFailed"), { type: "error" });
      }
    } catch {
      message($t("risk_control.updateFailed"), { type: "error" });
    } finally {
      saving.value = false;
    }
  }

  onMounted(getConfig);

  return {
    loading,
    saving,
    onlineCount,
    formData,
    getConfig,
    handleSave
  };
}
