import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getConfigLayout,
  putConfigLayout,
  postConfigDeployLayout
} from "@/api/systemManage";

export function useConfigTmpKey() {
  const loading = ref(false);
  // JSON 文字內容（用 textarea 編輯，取代舊版 json-editor-vue）
  const jsonText = ref("{}");

  // 取得設定
  async function getData() {
    loading.value = true;
    try {
      const { success, data } = await getConfigLayout();
      if (success) {
        const configs = data?.dynamicConfigs ?? {};
        jsonText.value = JSON.stringify(configs, null, 2);
      }
    } finally {
      loading.value = false;
    }
  }

  // 解析目前 textarea 內容，失敗回 null 並提示
  function parseJson(): Record<string, any> | null {
    try {
      const parsed = JSON.parse(jsonText.value);
      return parsed;
    } catch {
      message($t("systemManage.configTmpKeyJsonInvalid"), { type: "error" });
      return null;
    }
  }

  // 格式化（美化縮排）
  function formatJson() {
    const parsed = parseJson();
    if (parsed === null) return;
    jsonText.value = JSON.stringify(parsed, null, 2);
  }

  // 儲存設定（PUT）
  async function handleSubmit() {
    const dynamicConfigs = parseJson();
    if (dynamicConfigs === null) return;
    loading.value = true;
    try {
      const { success } = await putConfigLayout({ dynamicConfigs });
      if (success) {
        message($t("systemManage.configTmpKeyUpdateSuccess"), {
          type: "success"
        });
        await getData();
      }
    } finally {
      loading.value = false;
    }
  }

  // 發布設定（POST）
  async function handleDeploy() {
    loading.value = true;
    try {
      const { success } = await postConfigDeployLayout();
      if (success) {
        message($t("systemManage.configTmpKeyDeploySuccess"), {
          type: "success"
        });
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
    jsonText,
    getData,
    formatJson,
    handleSubmit,
    handleDeploy
  };
}
