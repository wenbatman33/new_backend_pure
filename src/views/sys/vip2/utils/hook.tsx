import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getVipJobLog } from "@/api/sys";
import type { SearchFormProps } from "./types";

// 需特別處理（點擊彈出完整內容）的欄位
const POPOVER_FIELDS = ["response", "url"];

export function useVip2() {
  const searchForm = reactive<SearchFormProps>({
    module: "",
    start: "",
    end: ""
  });
  const dataList = ref<Record<string, any>[]>([]);
  const loading = ref(false);
  const tableTitle = ref("");

  // 依後端回傳的第一筆資料動態產生欄位
  const columns = ref<TableColumnList>([]);

  function buildColumns(list: Record<string, any>[]) {
    if (!list || list.length === 0) {
      columns.value = [];
      return;
    }
    columns.value = Object.keys(list[0]).map(key => {
      if (POPOVER_FIELDS.includes(key)) {
        return {
          label: key,
          prop: key,
          showOverflowTooltip: true,
          width: 150,
          slot: key
        };
      }
      return { label: key, prop: key };
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getVipJobLog({
        module: searchForm.module,
        start: searchForm.start,
        end: searchForm.end
      });
      const list = (success ? data?.list : []) ?? [];
      tableTitle.value = searchForm.module;
      dataList.value = list;
      buildColumns(list);
      if (list.length === 0) {
        message($t("sys.vip2NoData"), { type: "error" });
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dataList.value = [];
    columns.value = [];
    tableTitle.value = "";
  }

  return {
    searchForm,
    loading,
    columns,
    dataList,
    tableTitle,
    onSearch,
    resetForm
  };
}
