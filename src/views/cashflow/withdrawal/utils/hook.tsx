import { ref, reactive, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { getWithdrawal, postWithdrawalBeep } from "@/api/cashflow";
import type { WithdrawalItem, SearchFormProps, KeyValueItem } from "./types";

// 狀態色彩對應（沿用舊 ColorEnum 語意）
const COLOR = {
  WARNING: "#E6A23C",
  INFO: "#909399",
  SUCCESS: "#67C23A",
  ERROR: "#F56C6C",
  DEFAULT: "#606266"
};

// 狀態文案/顏色
function statusInfo(item?: KeyValueItem) {
  switch (item?.key) {
    case 1:
      return { text: $t("cashflow.statusPending"), color: COLOR.WARNING };
    case 2:
      return { text: $t("cashflow.statusToBeWithdrawn"), color: COLOR.WARNING };
    case 3:
      return { text: $t("cashflow.statusReject"), color: COLOR.INFO };
    case 4:
      return { text: $t("cashflow.statusWithdrawing"), color: COLOR.WARNING };
    case 5:
      return { text: $t("cashflow.statusFinish"), color: COLOR.SUCCESS };
    case 6:
      return { text: $t("cashflow.statusFailed"), color: COLOR.ERROR };
    default:
      return { text: item?.value ?? "", color: COLOR.DEFAULT };
  }
}

// 財務查核文案/顏色
function financialInfo(item?: KeyValueItem) {
  switch (item?.key) {
    case 1:
      return { text: $t("cashflow.statusPending"), color: COLOR.WARNING };
    case 2:
      return { text: $t("cashflow.statusReject"), color: COLOR.INFO };
    case 3:
      return { text: $t("cashflow.statusFinish"), color: COLOR.SUCCESS };
    case 6:
      return { text: $t("cashflow.statusUnderReview"), color: COLOR.WARNING };
    default:
      return { text: item?.value ?? "", color: COLOR.DEFAULT };
  }
}

// 風控查核文案/顏色
function riskInfo(item?: KeyValueItem) {
  switch (item?.key) {
    case 1:
      return { text: $t("cashflow.riskCheck1"), color: COLOR.WARNING };
    case 2:
      return { text: $t("cashflow.riskCheck2"), color: COLOR.INFO };
    case 3:
      return { text: $t("cashflow.riskCheck3"), color: COLOR.SUCCESS };
    case 4:
      return { text: "", color: COLOR.DEFAULT };
    default:
      return { text: item?.value ?? "", color: COLOR.DEFAULT };
  }
}

// Tag 風格渲染
function renderTag(info: { text: string; color: string }) {
  return (
    <span
      style={{
        color: info.color,
        border: `1px solid ${info.color}`,
        borderRadius: "4px",
        padding: "1px 6px",
        background: "transparent",
        whiteSpace: "pre-wrap"
      }}
    >
      {info.text}
    </span>
  );
}

export function useWithdrawal() {
  // 預設查詢區間：今日
  const searchForm = reactive<SearchFormProps>({
    withdrawalStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    withdrawalEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    memberAccount: "",
    orderSn: "",
    status: -1,
    withdrawalName: "",
    bankName: "",
    bankcardNo: "",
    updatedStart: "",
    updatedEnd: "",
    riskCheck: -1,
    payGroupID: -1,
    bankcardGroupID: -1,
    riskAuditName: "",
    riskAuditMinutes: "",
    snList: ""
  });

  const dataList = ref<WithdrawalItem[]>([]);
  const loading = ref(true);
  const showUTC = ref(false);
  const autoReload = ref(false);
  const intervalTime = ref(20);

  // 統計列（標題用）
  const summary = reactive({
    count: 0,
    total: 0,
    fee: 0,
    erctotal: 0,
    trctotal: 0
  });

  // 提款狀態下拉
  const statusOptions = [
    { label: $t("cashflow.all"), value: -1 },
    { label: $t("cashflow.statusPending"), value: 1 },
    { label: $t("cashflow.statusToBeWithdrawn"), value: 2 },
    { label: $t("cashflow.statusReject"), value: 3 },
    { label: $t("cashflow.statusWithdrawing"), value: 4 },
    { label: $t("cashflow.statusFinish"), value: 5 },
    { label: $t("cashflow.statusFailed"), value: 6 }
  ];

  // 風控查核下拉
  const riskOptions = [
    { label: $t("cashflow.all"), value: -1 },
    { label: $t("cashflow.riskCheck1"), value: 1 },
    { label: $t("cashflow.riskCheck2"), value: 2 },
    { label: $t("cashflow.riskCheck3"), value: 3 },
    { label: $t("cashflow.riskCheck4"), value: 4 }
  ];

  // TODO: 三方/銀行卡群組下拉需 payment 域 getPayGroups（未移植），暫以空陣列佔位
  const payGroupOptions = ref<{ label: string; value: number }[]>([
    { label: $t("cashflow.all"), value: -1 }
  ]);
  const bankcardGroupOptions = ref<{ label: string; value: number }[]>([
    { label: $t("cashflow.all"), value: -1 }
  ]);

  const columns: TableColumnList = [
    {
      label: $t("cashflow.transactionID"),
      prop: "transactionID",
      fixed: "left",
      width: 220
    },
    {
      label: $t("cashflow.withdrawalTime"),
      prop: "transactionTime",
      width: 160,
      cellRenderer: ({ row }) => (
        <span>
          {row.transactionTime
            ? dayjs(row.transactionTime).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    {
      label: `${$t("cashflow.withdrawalTime")} UTC+8`,
      prop: "transactionTimeUTC",
      width: 160,
      hide: () => !showUTC.value
    },
    {
      label: $t("cashflow.withdrawalAmount"),
      prop: "amount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{Number(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("cashflow.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => renderTag(statusInfo(row.status))
    },
    {
      label: $t("cashflow.merchantNumber"),
      prop: "snList",
      width: 130,
      cellRenderer: ({ row }) => (
        <div class="flex flex-col text-left">
          {(row.snList ?? []).map((sn: string) => (
            <div key={sn}>{sn}</div>
          ))}
        </div>
      )
    },
    {
      label: $t("cashflow.bankGroup"),
      width: 110,
      cellRenderer: ({ row }) => <span>{row.bankGroup?.value ?? ""}</span>
    },
    {
      label: $t("cashflow.memberAC"),
      width: 140,
      cellRenderer: ({ row }) => <span>{row.member?.value?.account ?? ""}</span>
    },
    {
      label: $t("cashflow.withdrawalName"),
      prop: "bankAccount",
      width: 110
    },
    {
      label: $t("cashflow.withdrawalBankName"),
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{row.bankName ? row.bankName : row.bankCode}</span>
      )
    },
    {
      label: $t("cashflow.memberBankNumber"),
      prop: "memberBankNo",
      width: 160
    },
    {
      label: $t("cashflow.financialCheck"),
      prop: "financialCheck",
      width: 110,
      cellRenderer: ({ row }) => renderTag(financialInfo(row.financialCheck))
    },
    {
      label: $t("cashflow.riskStatus"),
      prop: "riskCheck",
      width: 110,
      cellRenderer: ({ row }) => renderTag(riskInfo(row.riskCheck))
    },
    {
      label: $t("cashflow.riskCheckName"),
      prop: "riskCheckName",
      width: 110
    },
    {
      label: $t("cashflow.lastUpdate"),
      prop: "lastUpdate",
      width: 160,
      cellRenderer: ({ row }) => (
        <span>
          {row.lastUpdate
            ? dayjs(row.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    {
      label: `${$t("cashflow.lastUpdate")} UTC+8`,
      prop: "lastUpdateUTC",
      width: 160,
      hide: () => !showUTC.value
    },
    {
      label: $t("cashflow.updatedBy"),
      prop: "updatedBy",
      width: 110
    },
    {
      label: $t("cashflow.remark"),
      prop: "remark",
      width: 150
    }
  ];

  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  // 行樣式：標記紅底
  function rowStyle({ row }: { row: WithdrawalItem }) {
    return row.isWithdrawalColor === true
      ? { backgroundColor: "#ffd4d4" }
      : {};
  }

  function buildQuery() {
    const query: Record<string, any> = { ...searchForm, source: 1 };
    Object.keys(query).forEach(key => {
      const v = query[key];
      if (v === undefined || v === "" || v === -1) {
        delete query[key];
      }
    });
    return query;
  }

  async function onSearch() {
    // 須有提款時間區間
    if (!searchForm.withdrawalStart || !searchForm.withdrawalEnd) {
      return;
    }
    loading.value = true;
    try {
      const { data } = await getWithdrawal(buildQuery());
      const list = data?.list ?? [];
      list.forEach(item => {
        item.transactionTimeUTC = item.transactionTime
          ? dayjs(item.transactionTime).add(8, "hour").format("YYYY/MM/DD HH:mm:ss")
          : "";
        item.lastUpdateUTC = item.lastUpdate
          ? dayjs(item.lastUpdate).add(8, "hour").format("YYYY/MM/DD HH:mm:ss")
          : "";
      });
      dataList.value = list;
      summary.count = data?.count ?? 0;
      summary.total = data?.total ?? 0;
      summary.fee = data?.fee ?? 0;
      summary.erctotal = data?.erctotal ?? 0;
      summary.trctotal = data?.trctotal ?? 0;
      // 提款提示音檢查
      const beep = await postWithdrawalBeep();
      if (beep?.data?.hasMemberWithdrawal) {
        // TODO: makeSound 來自 @/utils/country（未移植），暫略
      }
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  // 自動重整排程
  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    const ms = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
      else scheduleReload();
    }, ms);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.withdrawalStart = dayjs()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.withdrawalEnd = dayjs()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    onSearch();
  }

  // 匯出 Excel（沿用舊 endpoint）。TODO: exportExcel 工具於 @/utils/report
  function handleExport() {
    // TODO: 以 @/utils/report 的 exportExcel 開新視窗下載 /backend/withdrawal/export
    // exportExcel("/backend/withdrawal/export", buildQuery());
  }

  onMounted(() => {
    onSearch();
  });

  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    searchForm,
    statusOptions,
    riskOptions,
    payGroupOptions,
    bankcardGroupOptions,
    loading,
    columns,
    dataList,
    summary,
    showUTC,
    autoReload,
    intervalTime,
    rowStyle,
    onSearch,
    resetForm,
    handleExport
  };
}
