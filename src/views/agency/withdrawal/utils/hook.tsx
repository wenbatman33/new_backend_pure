import { h, ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import editForm from "../form.vue";
import {
  getAgencyWithdrawal,
  postAgencyWithdrawalAudit,
  postAgencyPayoutQuick,
  type WithdrawalItem
} from "@/api/agency";
import type { FormItemProps } from "./types";

// 狀態 → 文案/顏色
const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: $t("agency.adjustmentPending"), color: "#e6a23c" },
  2: { label: $t("agency.withdrawalToBeWithdrawn"), color: "#e6a23c" },
  3: { label: $t("agency.withdrawalFinancialReject"), color: "#909399" },
  4: { label: $t("agency.withdrawalWithdrawingMoney"), color: "#e6a23c" },
  5: { label: $t("agency.withdrawalFinish"), color: "#67c23a" },
  6: { label: $t("agency.withdrawalWithdrawalFailed"), color: "#f56c6c" }
};

// 審核狀態（財務/風控）→ 文案/顏色
const checkMap: Record<number, { label: string; color: string }> = {
  1: { label: $t("agency.adjustmentPending"), color: "#e6a23c" },
  2: { label: $t("agency.withdrawalFinancialReject"), color: "#909399" },
  3: { label: $t("agency.withdrawalFinish"), color: "#67c23a" },
  6: { label: $t("agency.withdrawalUnderReview"), color: "#e6a23c" }
};

export function useWithdrawal() {
  const router = useRouter();

  const searchForm = reactive({
    withdrawalStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    withdrawalEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    memberAccount: "",
    orderSn: "",
    status: "",
    withdrawalName: "",
    bankName: "",
    bankcardNo: ""
  });
  // 時間區間（el-date-picker datetimerange 綁定用）
  const dateRange = ref<[string, string]>([
    searchForm.withdrawalStart,
    searchForm.withdrawalEnd
  ]);

  const dataList = ref<WithdrawalItem[]>([]);
  const loading = ref(true);

  // 統計列（合計顯示在標題）
  const summary = reactive({
    count: 0,
    total: 0,
    fee: 0,
    erctotal: 0,
    trctotal: 0
  });

  // 自動刷新
  const autoReload = ref(false);
  const intervalTime = ref(20);
  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 狀態下拉選項
  const statusOptions = [
    { label: $t("agency.depositFormAll"), value: "" },
    { label: $t("agency.adjustmentPending"), value: 1 },
    { label: $t("agency.withdrawalToBeWithdrawn"), value: 2 },
    { label: $t("agency.withdrawalFinancialReject"), value: 3 },
    { label: $t("agency.withdrawalWithdrawingMoney"), value: 4 },
    { label: $t("agency.withdrawalFinish"), value: 5 },
    { label: $t("agency.withdrawalWithdrawalFailed"), value: 6 }
  ];

  const title = computed(
    () =>
      `${$t("agency.withdrawalTotalCount")}${summary.count}${$t(
        "agency.withdrawalCountUnit"
      )}，${$t("agency.withdrawalTotalAmount")} ${summary.total}、ERC：${
        summary.erctotal
      }、TRC：${summary.trctotal}；${$t("agency.withdrawalTotalFee")} ${
        summary.fee
      }`
  );

  // 開會員明細
  function openMember(row: WithdrawalItem) {
    if (row.member?.key) {
      const { href } = router.resolve({
        path: `/agencyDetail/detail/${row.member.key}`
      });
      window.open(href, "_blank");
    }
  }

  const columns: TableColumnList = [
    {
      label: $t("agency.withdrawalWithdrawNumber"),
      prop: "transactionID",
      fixed: "left",
      width: 200
    },
    {
      label: $t("agency.withdrawalTime"),
      prop: "transactionTime",
      width: 170,
      cellRenderer: ({ row }) => (
        <span>
          {row.transactionTime
            ? dayjs(row.transactionTime).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    {
      label: $t("agency.withdrawalAmount"),
      prop: "amount",
      cellRenderer: ({ row }) => (
        <span>{Number(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("agency.withdrawalAgencyAccount"),
      prop: "member",
      cellRenderer: ({ row }) => (
        <a
          style="color: var(--el-color-primary); cursor: pointer"
          onClick={() => openMember(row)}
        >
          {row.member?.value?.account || ""}
        </a>
      )
    },
    { label: $t("agency.withdrawalBankAccount"), prop: "bankAccount", width: 95 },
    {
      label: $t("agency.withdrawalPaymentMerchantNumber"),
      prop: "snList",
      width: 95,
      cellRenderer: ({ row }) => (
        <span>
          {Array.isArray(row.snList) ? row.snList.join(",") : row.snList}
        </span>
      )
    },
    {
      label: $t("agency.withdrawalBank"),
      prop: "bankCode",
      width: 95,
      cellRenderer: ({ row }) => <span>{row.bankName || row.bankCode}</span>
    },
    { label: $t("agency.withdrawalBankCardNumber"), prop: "memberBankNo" },
    {
      label: $t("agency.commonStatus"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const m = statusMap[row.status?.key];
        return (
          <span style={{ color: m?.color }}>
            {m?.label ?? row.status?.value}
          </span>
        );
      }
    },
    {
      label: $t("agency.withdrawalFinancialCheck"),
      prop: "financialCheck",
      width: 90,
      cellRenderer: ({ row }) => {
        const m = checkMap[row.financialCheck?.key];
        const color = m?.color ?? "#909399";
        return (
          <el-tag style={{ color, borderColor: color }} effect="plain">
            {m?.label ?? row.financialCheck?.value}
          </el-tag>
        );
      }
    },
    {
      label: $t("agency.withdrawalRiskCheck"),
      prop: "riskCheck",
      width: 90,
      cellRenderer: ({ row }) => {
        const m = checkMap[row.riskCheck?.key];
        const color = m?.color ?? "#909399";
        return (
          <el-tag style={{ color, borderColor: color }} effect="plain">
            {m?.label ?? row.riskCheck?.value}
          </el-tag>
        );
      }
    },
    {
      label: $t("agency.commonLastUpdate"),
      prop: "lastUpdate",
      width: 170,
      cellRenderer: ({ row }) => (
        <span>
          {row.lastUpdate
            ? dayjs(row.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    { label: $t("agency.commonExecutor"), prop: "updatedBy", width: 95 },
    { label: $t("agency.commonAction"), fixed: "right", width: 180, slot: "operation" }
  ];

  // 依狀態決定可用操作（沿用舊權限碼）
  function rowActions(row: WithdrawalItem) {
    const status = row.status?.key ?? -1;
    const list: { label: string; auth: string; click: () => void }[] = [];
    const financialReview = {
      label: $t("agency.adjustmentReview"),
      auth: "__btn_withdrawal_verify",
      click: () => {
        const { href } = router.resolve({
          path: `/withdrawal/financial/check/agency/${row.transactionID}`
        });
        window.open(href, "_blank");
      }
    };
    const autoPay = {
      label: $t("agency.withdrawalQuickWithdrawal"),
      auth: "__btn_withdrawal_autopay",
      click: async () => {
        const { success } = await postAgencyPayoutQuick({
          id: row.transactionID
        });
        if (success) {
          message($t("agency.withdrawalQuickWithdrawal"), { type: "success" });
          onSearch();
        }
      }
    };
    const record = {
      label: $t("agency.withdrawalViewHistory"),
      auth: "__btn_withdrawal_record",
      // TODO: GetNoteModal 尚未移植，先提示
      click: () => message($t("agency.commonNotMigrated"), { type: "warning" })
    };
    const remark = {
      label: $t("agency.memberAddNewNote"),
      auth: "__btn_withdrawal_remark",
      // TODO: PostNoteModal 尚未移植
      click: () => message($t("agency.commonNotMigrated"), { type: "warning" })
    };

    if (status === 1) {
      list.push(record, remark);
      if (row.financialCheck?.key !== 3) list.push(financialReview);
    } else if (status === 2) {
      list.push(autoPay, financialReview, record, remark);
    } else if (status === 3) {
      list.push(financialReview, record, remark);
    } else if (status === 4 || status === 5) {
      list.push(financialReview, record, remark);
    }
    return list.filter(a => hasAuth(a.auth));
  }

  async function onSearch() {
    loading.value = true;
    try {
      const query: Record<string, any> = {
        source: 2,
        withdrawalStart: dateRange.value?.[0],
        withdrawalEnd: dateRange.value?.[1],
        memberAccount: searchForm.memberAccount,
        orderSn: searchForm.orderSn,
        status: searchForm.status === "" ? undefined : searchForm.status,
        withdrawalName: searchForm.withdrawalName,
        bankName: searchForm.bankName,
        bankcardNo: searchForm.bankcardNo
      };
      Object.keys(query).forEach(k => {
        if (query[k] === undefined || query[k] === "") delete query[k];
      });
      const { data } = await getAgencyWithdrawal(query);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      summary.count = data?.count ?? 0;
      summary.total = data?.total ?? 0;
      summary.fee = data?.fee ?? 0;
      summary.erctotal = data?.erctotal ?? 0;
      summary.trctotal = data?.trctotal ?? 0;
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    const ms = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, ms);
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    dateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    searchForm.memberAccount = "";
    searchForm.orderSn = "";
    searchForm.status = "";
    searchForm.withdrawalName = "";
    searchForm.bankName = "";
    searchForm.bankcardNo = "";
    onSearch();
  }

  const formRef = ref();
  // 新增提款（後台代提）
  function openDialog() {
    addDialog({
      title: $t("agency.withdrawalAddTitle"),
      props: {
        formInline: {
          amount: "",
          type: 1,
          useExists: true,
          existsID: undefined,
          withdrawalName: "",
          bankcard: ""
        }
      },
      width: "520px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await postAgencyWithdrawalAudit({ ...curData });
          if (success) {
            message($t("agency.withdrawalAddTitle"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 匯出（TODO：xlsx 匯出工具尚未移植，先提示）
  function handleExport() {
    message($t("agency.commonNotMigrated"), { type: "warning" });
  }

  onMounted(() => {
    onSearch();
  });

  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    searchForm,
    dateRange,
    statusOptions,
    title,
    loading,
    columns,
    dataList,
    pagination,
    autoReload,
    intervalTime,
    rowActions,
    onSearch,
    resetForm,
    openDialog,
    handleExport
  };
}
