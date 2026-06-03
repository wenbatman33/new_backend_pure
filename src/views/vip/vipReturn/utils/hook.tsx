import { h, ref, reactive, onMounted } from "vue";
import { ElInput } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getConfigure, putConfigureReturnEdit } from "@/api/vip";
import type { ReturnItem } from "./types";

// 可編輯欄位（除了 level 以外都用 el-input，限制小數點後 2 位）
const editableFields = [
  "sportRefund",
  "sportUpperLimit",
  "personRefund",
  "personUpperLimit",
  "lotteryRefund",
  "lotteryUpperLimit",
  "esportRefund",
  "esportUpperLimit",
  "chessRefund",
  "chessUpperLimit",
  "fishRefund",
  "fishUpperLimit",
  "slotRefund",
  "slotUpperLimit",
  "minigameRefund",
  "minigameUpperLimit",
  "cockfightRefund",
  "cockfightUpperLimit",
  "bingoRefund",
  "bingoUpperLimit"
];

export function useVipReturn() {
  const dataList = ref<ReturnItem[]>([]);
  const loading = ref(true);

  // 可編輯欄位的 cell 渲染：輸入框，限制小數點後 2 位
  const renderInputCell = (row: ReturnItem, field: string) =>
    h(ElInput, {
      modelValue: row[field],
      "onUpdate:modelValue": (val: string) => {
        // 最多小數點後 2 位，超過則不更新
        if (
          val &&
          val.toString().includes(".") &&
          val.toString().split(".")[1].length > 2
        ) {
          return;
        }
        row[field] = val;
      }
    });

  // 完整欄位定義（依舊 tableData 順序）
  const allColumns: TableColumnList = [
    { label: $t("vip.level"), prop: "level", width: 80 },
    ...editableFields.map(field => ({
      label: $t(`vip.${field}`),
      prop: field,
      minWidth: 130,
      cellRenderer: ({ row }) => renderInputCell(row, field)
    }))
  ];

  // 依後端實際回傳的欄位動態過濾要顯示的欄位
  const columns = reactive<TableColumnList>([...allColumns]);

  function rebuildColumns(keys: string[]) {
    columns.splice(
      0,
      columns.length,
      ...allColumns.filter(col => keys.includes(col.prop as string))
    );
  }

  async function getData() {
    loading.value = true;
    try {
      const { success, data } = await getConfigure();
      if (success) {
        const list = (data?.returnList ?? []) as ReturnItem[];
        dataList.value = list;
        if (list.length) {
          rebuildColumns(Object.keys(list[0]));
        }
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleSubmit() {
    // 每筆把 level 以外的欄位轉成 Number 後送出
    const list = dataList.value.map(item => {
      const row: Record<string, number | string> = {};
      Object.keys(item).forEach(key => {
        row[key] = key === "level" ? item[key] : Number(item[key]);
      });
      return row;
    });

    const { success } = await putConfigureReturnEdit({ list });
    if (success) {
      message($t("vip.saveTextALL"), { type: "success" });
      getData();
    }
  }

  onMounted(() => {
    getData();
  });

  return {
    loading,
    columns,
    dataList,
    getData,
    handleSubmit
  };
}
