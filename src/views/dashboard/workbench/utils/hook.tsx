import { ref, onMounted } from "vue";
import { getWorkbenchData } from "@/api/dashboard";
import type { WorkbenchData } from "./types";

export function useWorkbench() {
  const loading = ref(true);
  const data = ref<WorkbenchData>({
    stats: { todo: "0/0", project: 0, team: 0 },
    navItems: [],
    groupItems: [],
    dynamicInfoItems: [],
    saleRadar: { indicator: [], series: [] }
  });

  async function getData() {
    loading.value = true;
    try {
      const { success, data: res } = await getWorkbenchData();
      if (success) {
        data.value = res;
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
    data,
    getData
  };
}
