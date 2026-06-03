import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { getAnalysisData } from "@/api/dashboard";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AnalysisData } from "./types";

// 分析頁資料 hook：載入圖表所需的全部統計資料
export function useAnalysis() {
  const loading = ref(true);
  const data = ref<AnalysisData | null>(null);

  async function fetchData() {
    loading.value = true;
    try {
      const { success, data: res } = await getAnalysisData();
      if (success) {
        data.value = res;
      } else {
        message($t("dashboard.loadFailed"), { type: "error" });
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchData);

  return {
    loading,
    data,
    fetchData
  };
}
