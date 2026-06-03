import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getChannelService,
  createDeposit,
  searchDeposit,
  delDeposit,
  getReportDeposit
} from "@/api/faketools";
import type { CreateFormProps, SearchFormProps, DepositItem } from "./types";

export function useDeposit() {
  const loading = ref(false);
  const dataList = ref<DepositItem[]>([]);
  const multipleSelection = ref<DepositItem[]>([]);
  const channelOptions = ref<{ label: string; value: number | string }[]>([]);

  // 类型选项：1 会员帐号 / 2 输入ID
  const typeOptions = [
    { label: $t("faketools.memberAccount"), value: 1 },
    { label: $t("faketools.inputID"), value: 2 }
  ];

  // 币别选项
  const currencyOptions = [
    { label: $t("faketools.currencyCNY"), value: 1 },
    { label: "USDT-ERC", value: 2 },
    { label: "USDT-TRC", value: 3 },
    { label: "ECNY", value: 4 }
  ];

  // ---- 更新存款报表 ----
  const reportRange = ref<[Date, Date]>([
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ]);

  // ---- 新增存款表單 ----
  const createForm = reactive<CreateFormProps>({
    type: 1,
    members: "",
    depositAt: dayjs().format("YYYY-MM-DD"),
    depositTime: dayjs().format("HH:mm"),
    depositAmount: "",
    payChannelServiceID: "",
    currency: 1
  });

  // ---- 删除存款查询表單 ----
  const searchForm = reactive<SearchFormProps>({
    type: 1,
    members: "",
    qStartTime: dayjs().startOf("month").format("YYYY-MM-DD"),
    qEndTime: dayjs().format("YYYY-MM-DD")
  });

  const columns: TableColumnList = [
    { type: "selection", width: 55, align: "left" },
    { label: $t("faketools.orderID"), prop: "orderID", width: 160 },
    { label: $t("faketools.channel"), prop: "payChannelServiceName", width: 120 },
    {
      label: $t("faketools.currency"),
      prop: "currency",
      width: 80,
      cellRenderer: ({ row }) => (
        <span style="font-weight:600">{row.currency}</span>
      )
    },
    { label: $t("faketools.account"), prop: "memberAccount", width: 120 },
    { label: $t("faketools.memberID"), prop: "memberID", width: 90 },
    { label: $t("faketools.depositAmount"), prop: "depositAmount", width: 110 },
    { label: $t("faketools.depositDate"), prop: "depositAt", width: 170 }
  ];

  async function loadChannel() {
    const { success, data } = await getChannelService();
    if (success) {
      channelOptions.value = (data?.list ?? []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    }
  }

  // 更新存款报表
  async function handleReportDeposit() {
    const [start, end] = reportRange.value;
    const startTime = dayjs(start).format("YYYY-MM-DD 00:00:00");
    const endTime = dayjs(end).format("YYYY-MM-DD 23:59:59");
    const { success, data } = await getReportDeposit({ startTime, endTime });
    if (success) {
      dataList.value = data?.list ?? [];
      message($t("faketools.updateSuccess"), { type: "success" });
    }
  }

  // 新增存款送出
  async function handleCreate(formEl: any) {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
      if (!valid) return;
      if (!Number(createForm.depositAmount)) {
        message($t("faketools.amountMustBeNumber"), { type: "error" });
        return;
      }
      const form: Record<string, any> = {
        type: createForm.type,
        members: createForm.members.replace(/,\s*$/, ""),
        depositAmount: Number(createForm.depositAmount),
        depositAt: `${dayjs(createForm.depositAt).format("YYYY-MM-DD")} ${dayjs(
          `2000-01-01 ${createForm.depositTime}`
        ).format("HH:mm")}`,
        payChannelServiceID: createForm.payChannelServiceID,
        currency: createForm.currency
      };
      const { success } = await createDeposit(form);
      if (success) {
        message($t("faketools.createDepositSuccess"), { type: "success" });
      }
    });
  }

  // 删除存款查询
  async function handleSearch(formEl?: any) {
    if (formEl) {
      const valid = await formEl.validate().catch(() => false);
      if (!valid) return;
    }
    if (new Date(searchForm.qStartTime) > new Date(searchForm.qEndTime)) {
      message($t("faketools.startTimeGtEndTime"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const params = {
        type: searchForm.type,
        members: searchForm.members,
        qStartTime: searchForm.qStartTime,
        qEndTime: `${searchForm.qEndTime} 23:59:59`
      };
      const { success, data } = await searchDeposit(params);
      if (success) {
        dataList.value = data?.list ?? [];
      }
    } finally {
      loading.value = false;
    }
  }

  function handleSelectionChange(rows: DepositItem[]) {
    multipleSelection.value = rows;
  }

  // 批量删除已勾选
  function handleDelete() {
    ElMessageBox.confirm($t("faketools.confirmDeleteSelected"), "", {
      type: "warning"
    })
      .then(async () => {
        if (!multipleSelection.value.length) {
          message($t("faketools.selectAtLeastOne"), { type: "error" });
          return;
        }
        const orderIDs = multipleSelection.value.map(item => item.orderID);
        const { success } = await delDeposit({ orderIDs });
        if (success) {
          message($t("faketools.deleteSuccess"), { type: "success" });
          handleSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    loadChannel();
  });

  return {
    loading,
    dataList,
    columns,
    typeOptions,
    currencyOptions,
    channelOptions,
    reportRange,
    createForm,
    searchForm,
    handleReportDeposit,
    handleCreate,
    handleSearch,
    handleDelete,
    handleSelectionChange
  };
}
