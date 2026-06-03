import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { getAgencyOperationNote, type OperationNoteItem } from "@/api/agency";

// 操作類型對應表（沿用舊碼 1~8）
const opTypeMap: Record<number, string> = {
  1: $t("agency.operationRecordType1"),
  2: $t("agency.operationRecordType2"),
  3: $t("agency.operationRecordType3"),
  4: $t("agency.operationRecordType4"),
  5: $t("agency.operationRecordType5"),
  6: $t("agency.operationRecordType6"),
  7: $t("agency.operationRecordType7"),
  8: $t("agency.operationRecordType8")
};

export function useOperationRecord() {
  // 預設時間範圍：本月初 ~ 今日結束
  const defaultRange: [Date, Date] = [
    dayjs().startOf("month").startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ];

  const searchForm = reactive<{
    adminAccount: string;
    opType: number | undefined;
    dateRange: [Date, Date] | null;
  }>({
    adminAccount: "",
    opType: undefined,
    dateRange: defaultRange
  });

  const dataList = ref<OperationNoteItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 操作類型下拉選項
  const opTypeOptions = [
    { label: $t("agency.operationRecordType1"), value: 1 },
    { label: $t("agency.operationRecordType2"), value: 2 },
    { label: $t("agency.operationRecordType3"), value: 3 },
    { label: $t("agency.operationRecordType4"), value: 4 },
    { label: $t("agency.operationRecordType5"), value: 5 },
    { label: $t("agency.operationRecordType6"), value: 6 },
    { label: $t("agency.operationRecordType7"), value: 7 },
    { label: $t("agency.operationRecordType8"), value: 8 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("agency.operationRecordTime"),
      prop: "createdAt",
      width: 170,
      sortable: true
    },
    {
      label: $t("agency.operationRecordOpType"),
      prop: "opType",
      width: 140,
      cellRenderer: ({ row }) => <span>{opTypeMap[row.opType] ?? ""}</span>
    },
    {
      label: $t("agency.operationRecordContent"),
      prop: "opContent"
    },
    {
      label: $t("agency.operationRecordAdmin"),
      prop: "opAdmin",
      width: 150
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const [startTime, endTime] = searchForm.dateRange ?? [];
      const { data } = await getAgencyOperationNote({
        adminAccount: searchForm.adminAccount,
        opType: searchForm.opType,
        startTime: startTime
          ? dayjs(startTime).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        endTime: endTime
          ? dayjs(endTime).format("YYYY-MM-DD HH:mm:ss")
          : undefined
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.adminAccount = "";
    searchForm.opType = undefined;
    searchForm.dateRange = defaultRange;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    opTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm
  };
}
