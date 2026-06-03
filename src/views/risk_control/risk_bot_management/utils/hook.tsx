import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getBotConfig, setBotConfig } from "@/api/risk_control";
import type { BotConfig } from "./types";

export function useRiskBotManagement() {
  const botConfig = ref<BotConfig>({});
  // 提款博彩游戏类型（多选 checkbox），存档时转为逗号字串 withdrawalGameType
  const platform = ref<string[]>([]);
  const loading = ref(false);
  const saving = ref(false);

  async function loadConfig() {
    loading.value = true;
    try {
      const { success, data } = await getBotConfig();
      if (success) {
        botConfig.value = data ?? {};
        platform.value = botConfig.value.withdrawalGameType
          ? String(botConfig.value.withdrawalGameType).split(",").filter(Boolean)
          : [];
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleSave() {
    // 把平台类型转成字串
    botConfig.value.withdrawalGameType = platform.value
      ? platform.value.toString()
      : "";
    botConfig.value.gameTransferMonitorAmount = Number(
      botConfig.value.gameTransferMonitorAmount
    );
    saving.value = true;
    try {
      const { success } = await setBotConfig(botConfig.value);
      if (success) {
        message($t("risk_control.updateSuccess"), { type: "success" });
        await loadConfig();
      }
    } finally {
      saving.value = false;
    }
  }

  onMounted(() => {
    loadConfig();
  });

  return {
    botConfig,
    platform,
    loading,
    saving,
    loadConfig,
    handleSave
  };
}
