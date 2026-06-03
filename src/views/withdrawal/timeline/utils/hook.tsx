import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getWithdrawalTimeline, getMoneyUseType } from "@/api/withdrawal";
import type { TimelineItem, UseTypeItem } from "./types";

export function useWithdrawalTimeline() {
  const route = useRoute();
  const loading = ref(true);
  const tableData = ref<TimelineItem[]>([]);
  const useType = ref<UseTypeItem[]>([]);

  /** 依 useTypeID 取得用途名称（中/英） */
  function formatUseType(type: number) {
    const found = useType.value.find(item => item.useTypeID === type);
    return found ? `${found.useTypeName}/${found.useTypeEnName}` : String(type);
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 先取用途类型对照表
      const { data: useTypeData } = await getMoneyUseType();
      useType.value = useTypeData?.list ?? [];

      // 再依路由 query（如 memberID）取时间轴资料
      const { data } = await getWithdrawalTimeline(route.query);
      tableData.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    tableData,
    useType,
    formatUseType,
    onSearch
  };
}
