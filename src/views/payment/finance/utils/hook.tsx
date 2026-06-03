import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag, ElInput } from "element-plus";
import editForm from "../form.vue";
import {
  getFinanceList,
  postFinanceCreate,
  putFinanceEdit,
  deleteFinance,
  putFinanceDefault,
  getFinanceAmountConfig,
  putFinanceAmountConfig
} from "@/api/payment";
import type { FormItemProps, FinanceRow } from "./types";

// 幣別顯示
function currencyText(v: number) {
  if (v === 1) return $t("payment.currencyFiat");
  if (v === 2) return "USDT-ERC";
  if (v === 3) return "USDT-TRC";
  if (v === 4) return $t("payment.numberRMB");
  return String(v ?? "");
}

export function useFinance() {
  const searchForm = reactive({
    status: 1,
    maintain: 0
  });
  const dataList = ref<FinanceRow[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("payment.all"), value: 0 },
    { label: $t("payment.open"), value: 1 },
    { label: $t("payment.closeText"), value: 2 }
  ];

  const maintainOptions = [
    { label: $t("payment.all"), value: 0 },
    { label: $t("payment.inMaintenance"), value: 1 },
    { label: $t("payment.normal"), value: 2 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("payment.name"),
      prop: "name",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <div class="flex items-center">
          {row.isDefault
            ? h(ElTag, { color: "#01A39D", effect: "dark", size: "small" }, () =>
                $t("payment.defaultTag")
              )
            : null}
          <span class="ml-1">{row.name}</span>
        </div>
      )
    },
    { label: $t("payment.remark"), prop: "note", minWidth: 140 },
    {
      label: $t("payment.currency"),
      prop: "currency",
      width: 110,
      cellRenderer: ({ row }) => <span>{currencyText(row.currency)}</span>
    },
    { label: $t("payment.routeNum"), prop: "nums", width: 100 },
    {
      label: $t("payment.showStatus"),
      prop: "status",
      width: 110,
      cellRenderer: ({ row }) => (
        <ElTag type={row.status === 1 ? "success" : "info"} effect="plain">
          {row.status === 1 ? $t("payment.open") : $t("payment.closeText")}
        </ElTag>
      )
    },
    {
      label: $t("payment.maintainStatus"),
      prop: "maintain",
      width: 110,
      cellRenderer: ({ row }) => (
        <ElTag type={row.maintain === 1 ? "warning" : "success"} effect="plain">
          {row.maintain === 1 ? $t("payment.inMaintenance") : $t("payment.normal")}
        </ElTag>
      )
    },
    { label: $t("payment.updatedAt"), prop: "updatedAt", width: 170 },
    { label: $t("payment.executor"), prop: "updatedUser", width: 130 },
    { label: $t("payment.operate"), fixed: "right", width: 320, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getFinanceList({
        status: searchForm.status,
        maintain: searchForm.maintain
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? data?.list?.length ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 1;
    searchForm.maintain = 0;
    onSearch();
  }

  // 新增 / 編輯 顯示項目
  function openDialog(title = "add", row?: FinanceRow) {
    addDialog({
      title:
        title === "add" ? $t("payment.addItem") : $t("payment.editItem"),
      props: {
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          note: row?.note ?? "",
          currency: row?.currency ?? 1,
          nums: row?.nums ?? 0,
          status: row?.status ?? 2,
          maintain: row?.maintain ?? 1,
          filterSetting: (row?.filterSetting ?? []).map(n => Number(n)),
          icon: row?.icon ?? "",
          isRecommend: row?.isRecommend ?? false,
          needRealName: row?.needRealName ?? false,
          tooltip: row?.tooltip ?? "",
          hasDoc: row?.hasDoc ?? false,
          docTitle: row?.docTitle ?? "",
          docURL: row?.docURL ?? "",
          quickAmount: row?.quickAmount ?? ""
        }
      },
      width: "720px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = title === "add" ? postFinanceCreate : putFinanceEdit;
          const { success } = await fn(curData);
          if (success) {
            message(
              `${curData.name} ${
                title === "add" ? $t("payment.add") : $t("payment.edit")
              }${$t("payment.showSuccess")}`,
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 切換顯示狀態（開啟/關閉）
  async function handleToggleStatus(row: FinanceRow) {
    const target = row.status === 2 ? 1 : 2;
    const { success } = await putFinanceEdit({
      ...row,
      filterSetting: (row.filterSetting ?? []).map(n => Number(n)),
      status: target
    } as FormItemProps);
    if (success) {
      message($t("payment.editSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 切換維護狀態
  async function handleToggleMaintain(row: FinanceRow) {
    const target = row.maintain === 2 ? 1 : 2;
    const { success } = await putFinanceEdit({
      ...row,
      filterSetting: (row.filterSetting ?? []).map(n => Number(n)),
      maintain: target
    } as FormItemProps);
    if (success) {
      message($t("payment.editSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 設為預設
  async function handleSetDefault(row: FinanceRow) {
    const { success } = await putFinanceDefault({ id: row.id });
    if (success) {
      message($t("payment.editSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 刪除顯示項目
  function handleDelete(row: FinanceRow) {
    ElMessageBox.confirm($t("payment.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteFinance({ financeID: row.id });
        if (success) {
          message($t("payment.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 站台充值金額設定
  async function openAmountConfig() {
    const { data } = await getFinanceAmountConfig();
    const formInline = reactive({ amount: data?.amount ?? "" });
    addDialog({
      title: $t("payment.rechargeSetting"),
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h("div", { class: "px-4" }, [
          h("div", { class: "mb-2" }, $t("payment.rechargeAmountTip")),
          h(ElInput, {
            modelValue: formInline.amount,
            "onUpdate:modelValue": (v: string) => (formInline.amount = v),
            clearable: true,
            placeholder: $t("payment.quickAmountPhd")
          })
        ]),
      beforeSure: async done => {
        const { success } = await putFinanceAmountConfig({
          amount: formInline.amount
        });
        if (success) {
          message($t("payment.editSuccess"), { type: "success" });
          done();
        }
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    maintainOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleToggleStatus,
    handleToggleMaintain,
    handleSetDefault,
    handleDelete,
    openAmountConfig
  };
}
