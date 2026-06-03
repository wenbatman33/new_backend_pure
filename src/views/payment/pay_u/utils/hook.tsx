import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { copyTextToClipboard } from "@pureadmin/utils";
import editForm from "../form.vue";
import moneyForm from "../moneyForm.vue";
import freezeForm from "../freezeForm.vue";
import transferForm from "../transferForm.vue";
import tradeForm from "../tradeForm.vue";
import {
  getPayUList,
  createPayU,
  editPayU,
  payUMoneyIn,
  payUMoneyOut,
  payUFreeze,
  payUUnFreeze,
  payUTransfer,
  createPayUTrade,
  type PayUItem
} from "@/api/payment";
import type {
  UcardFormItemProps,
  MoneyFormItemProps,
  FreezeFormItemProps,
  TransferFormItemProps,
  TradeFormItemProps
} from "./types";

// 用途类型显示文案与 tag 类型
const useTypeMap: Record<number, { text: string; type: string }> = {
  1: { text: $t("payment.payUType1"), type: "primary" },
  2: { text: $t("payment.payUType2"), type: "warning" },
  3: { text: $t("payment.payUType3"), type: "danger" },
  4: { text: $t("payment.payUType4"), type: "success" }
};

// 钱包类型：2 ERC / 3 TRC
const walletTypeMap: Record<number, string> = { 2: "ERC", 3: "TRC" };

export function usePayU() {
  const searchForm = reactive({
    name: "",
    useType: "",
    type: "",
    status: "0"
  });
  const dataList = ref<PayUItem[]>([]);
  const loading = ref(true);
  // 合计列
  const summary = reactive({ balance: 0, todayIn: 0, todayOut: 0 });

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const useTypeOptions = [
    { label: $t("payment.all"), value: -1 },
    { label: $t("payment.payUUseType1"), value: 0 },
    { label: $t("payment.payUType1"), value: 1 },
    { label: $t("payment.payUType2"), value: 2 },
    { label: $t("payment.payUType3"), value: 3 },
    { label: $t("payment.payUType4"), value: 4 }
  ];
  const walletTypeOptions = [
    { label: $t("payment.all"), value: "0" },
    { label: "ERC", value: "2" },
    { label: "TRC", value: "3" }
  ];
  const statusOptions = [
    { label: $t("payment.all"), value: "0" },
    { label: $t("payment.enable"), value: "1" },
    { label: $t("payment.disable"), value: "2" }
  ];

  function handleCopy(address: string) {
    const ok = copyTextToClipboard(address ?? "");
    message(ok ? $t("payment.copySuccess") : $t("payment.fail"), {
      type: ok ? "success" : "error"
    });
  }

  const columns: TableColumnList = [
    { label: $t("payment.payUName"), prop: "name", width: 150 },
    {
      label: $t("payment.payUWalletType"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => <span>{walletTypeMap[row.type] ?? ""}</span>
    },
    {
      label: $t("payment.payUUseType"),
      prop: "useType",
      width: 110,
      cellRenderer: ({ row }) => {
        const m = useTypeMap[row.useType];
        return m ? (
          <el-tag type={m.type} effect="light">
            {m.text}
          </el-tag>
        ) : (
          <span>-</span>
        );
      }
    },
    {
      label: $t("payment.payUTodayIn"),
      prop: "todayIn",
      width: 110,
      cellRenderer: ({ row }) => <span>{Number(row.todayIn).toLocaleString()}</span>
    },
    {
      label: $t("payment.payUTodayOut"),
      prop: "todayOut",
      width: 110,
      cellRenderer: ({ row }) => <span>{Number(row.todayOut).toLocaleString()}</span>
    },
    {
      label: $t("payment.payUBalance"),
      prop: "balance",
      width: 110,
      cellRenderer: ({ row }) => <span>{Number(row.balance).toLocaleString()}</span>
    },
    { label: $t("payment.payUAddress"), prop: "address", minWidth: 220 },
    {
      label: $t("payment.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span
          style={{
            color:
              String(row.status) === "1"
                ? "var(--el-color-success)"
                : "var(--el-color-danger)"
          }}
        >
          {String(row.status) === "1" ? $t("payment.enable") : $t("payment.disable")}
        </span>
      )
    },
    { label: $t("payment.operate"), fixed: "right", width: 300, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPayUList({
        name: searchForm.name,
        useType: searchForm.useType,
        type: searchForm.type,
        status: searchForm.status
      });
      const list = data?.list ?? [];
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
      summary.balance = list.reduce((s, v) => s + Number(v.balance || 0), 0);
      summary.todayIn = list.reduce((s, v) => s + Number(v.todayIn || 0), 0);
      summary.todayOut = list.reduce((s, v) => s + Number(v.todayOut || 0), 0);
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = "0";
    onSearch();
  }

  // 新增 / 编辑 U 帐户
  function openDialog(row?: PayUItem) {
    const isUpdate = !!row;
    const formRef = ref();
    addDialog({
      title: isUpdate ? $t("payment.payUUcard1") : $t("payment.payUUcard2"),
      props: {
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          type: row?.type ?? 2,
          useType: row?.useType ?? 0,
          address: row?.address ?? "",
          originalAmount: row?.originalAmount ?? "",
          isUpdate
        }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as UcardFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (isUpdate) {
            const { success } = await editPayU({
              id: curData.id,
              name: curData.name,
              type: curData.type,
              useType: curData.useType,
              address: curData.address
            });
            if (success) {
              message(`${$t("payment.editSuccess")}${curData.name}`, {
                type: "success"
              });
              done();
              onSearch();
            }
          } else {
            const { success } = await createPayU({
              name: curData.name,
              type: curData.type,
              useType: curData.useType,
              address: curData.address,
              originalAmount: Number(curData.originalAmount)
            });
            if (success) {
              message(`${$t("payment.success")}${curData.name}`, {
                type: "success"
              });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  // 启用 / 停用
  async function handleChangeStatus(row: PayUItem) {
    const nextStatus = Number(row.status) === 1 ? 2 : 1;
    const { success } = await editPayU({
      id: row.id,
      name: row.name,
      type: row.type,
      useType: row.useType,
      address: row.address,
      status: nextStatus
    });
    if (success) {
      message(`${$t("payment.editSuccess")}${row.name}`, { type: "success" });
      onSearch();
    }
  }

  // 商户下发 / 充值商户号
  function openMoneyDialog(row: PayUItem, mode: "in" | "out") {
    const formRef = ref();
    addDialog({
      title: mode === "in" ? $t("payment.payUMoneyIn") : $t("payment.payUMoneyOut"),
      props: {
        mode,
        formInline: {
          id: row.id,
          targetSN: "",
          targetID: undefined,
          payChannelName: undefined,
          amount: "",
          exchangeRate: "",
          exchangeAmount: "",
          fee: ""
        }
      },
      width: "550px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(moneyForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as MoneyFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (curData.targetSN && curData.targetID === undefined) {
            message($t("payment.payUMoneyMerchantNotExist"), { type: "error" });
            return;
          }
          const payload = {
            id: curData.id,
            targetID: Number(curData.targetID),
            amount: Number(curData.amount),
            exchangeRate: Number(curData.exchangeRate),
            exchangeAmount: Number(curData.exchangeAmount),
            fee: Number(curData.fee)
          };
          const { success } =
            mode === "in"
              ? await payUMoneyIn(payload)
              : await payUMoneyOut(payload);
          if (success) {
            message($t("payment.payUMoneySuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 冻结 / 解冻
  function openFreezeDialog(row: PayUItem, mode: "lock" | "unlock") {
    const formRef = ref();
    addDialog({
      title: mode === "lock" ? $t("payment.payUFreeze") : $t("payment.payUUnFreeze"),
      props: {
        mode,
        formInline: { id: row.id, amount: "", note: "" }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(freezeForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FreezeFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            id: curData.id,
            amount: Number(curData.amount),
            note: curData.note
          };
          const { success } =
            mode === "lock"
              ? await payUFreeze(payload)
              : await payUUnFreeze(payload);
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // U 转帐
  function openTransferDialog(row: PayUItem) {
    const formRef = ref();
    const targetOptions = dataList.value
      .filter(item => item.id !== row.id)
      .map(item => ({ label: item.address, value: item.id }));
    addDialog({
      title: $t("payment.payUTransfer"),
      props: {
        targetOptions,
        formInline: {
          id: row.id,
          targetID: undefined,
          amount: "",
          fee: "",
          thirdID: "",
          note: ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(transferForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as TransferFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await payUTransfer({
            id: curData.id,
            targetID: Number(curData.targetID),
            amount: Number(curData.amount),
            fee: Number(curData.fee),
            thirdID: curData.thirdID,
            note: curData.note
          });
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 资金异动
  function openTradeDialog(row: PayUItem) {
    const formRef = ref();
    addDialog({
      title: $t("payment.payUTradeTitle"),
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          subjectID: "",
          tradeTime: "",
          amount: "",
          fee: "",
          description: ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tradeForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as TradeFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await createPayUTrade({
            id: curData.id,
            subjectID: curData.subjectID,
            tradeTime: curData.tradeTime,
            amount: Number(curData.amount),
            fee: curData.fee === "" ? undefined : Number(curData.fee),
            description: curData.description
          });
          if (success) {
            message($t("payment.payUTrade2"), { type: "success" });
            done();
          }
        });
      }
    });
  }

  // 另开 U 帐户明细（账单）
  function openBill(row: PayUItem) {
    const url = `/finance_report/usdt_report?usdtID=${row.id}`;
    window.open(url, "_blank");
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    useTypeOptions,
    walletTypeOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    summary,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleChangeStatus,
    openMoneyDialog,
    openFreezeDialog,
    openTransferDialog,
    openTradeDialog,
    openBill,
    handleCopy
  };
}
