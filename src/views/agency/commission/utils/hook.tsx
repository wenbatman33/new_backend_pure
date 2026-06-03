import { h, ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { exportExcel } from "@/utils/report";
import {
  getAgencyCommissionList,
  getChildAgencyCommissionList,
  getOfferAgencyCommissionList,
  getCommissionDistributedCalc,
  getChildCommissionDistributedCalc,
  reviewAgencyCommission,
  reviewChildAgencyCommission,
  reviewOfferAgencyCommission
} from "@/api/agency";
import type {
  CommissionItem,
  DistributedCalc,
  ChildDistributedCalc
} from "./types";
import checkContent from "../checkContent.vue";

// 結算週期選項：1 月結 / 2 週結
const billingCycleOptions = () => [
  { label: $t("agency.commissionBillingMonth"), value: "1" },
  { label: $t("agency.commissionBillingWeek"), value: "2" }
];

// 狀態文字 + 顏色
function renderStatus(text: number) {
  let word = $t("agency.commissionStatusPending");
  let color = "#FF9224";
  if (text === 2) word = $t("agency.commissionPass");
  if (text === 3) word = $t("agency.commissionDeny");
  if (text === 4) word = $t("agency.commissionDelayed");
  if (text === 5) word = $t("agency.commissionRollback");
  if (text === 6) word = $t("agency.commissionDistributedToFirst");
  if (text === 7) word = $t("agency.commissionPostponedToNext");
  switch (text) {
    case 2:
    case 6:
      color = "#00EC00";
      break;
    case 3:
      color = "#FF0000";
      break;
    default:
      color = "#FF9224";
  }
  return h("span", { style: `color:${color}` }, word);
}

const num = (v: any) => {
  try {
    return Number(v || "0").toLocaleString();
  } catch {
    return v;
  }
};

const redIfNegative = (v: any) =>
  Number(v) < 0 ? h("span", { style: "color:#F00" }, v) : v;

// 日期欄位渲染（月結直接顯示，週結顯示區間）
function renderDateCell(row: CommissionItem, isWeek: boolean) {
  if (!isWeek) return row.date;
  return `${dayjs(row.date).format("YYYY-MM-DD")}~${dayjs(row.date)
    .add(6, "day")
    .format("YYYY-MM-DD")}`;
}

/**
 * @param tab 1=一代佣金 2=二代佣金 3=佣金派發
 */
export function useCommission(tab: 1 | 2 | 3) {
  const searchForm = reactive({
    agencyID: "",
    displayZero: false,
    billingCycle: "1",
    // 月結用 month、週結用 week，存 dayjs 物件
    date:
      tab === 0 ? null : dayjs().subtract(1, "month") // 預設上個月
  });

  const dataList = ref<CommissionItem[]>([]);
  const loading = ref(false);
  // 派發合計
  const distributedCalc = ref<DistributedCalc>({ cnt: 0, amount: 0 });
  const childDistributedCalc = ref<ChildDistributedCalc>({
    cnt: 0,
    childCommissionAmount: 0,
    childBonusAmount: 0
  });
  // 由 billingCycle 決定 month/week
  const reportDateType = computed(() =>
    searchForm.billingCycle === "1" ? "month" : "week"
  );
  const isWeek = computed(() => reportDateType.value === "week");

  // 已派發欄位名稱（一代/派發看 deliveredAt，二代看 childDeliveredAt）
  const deliverKey = tab === 2 ? "childDeliveredAt" : "deliveredAt";
  const statusKey = tab === 2 ? "childStatus" : "status";

  // 摘要：待派發筆數
  const passCount = computed(
    () =>
      dataList.value.filter(
        item => item.setStatus === 2 && (item as any)[deliverKey] === ""
      ).length
  );
  // 一代：通過總佣金
  const passAmount = computed(() =>
    dataList.value
      .filter(item => item.setStatus === 2 && item.deliveredAt === "")
      .reduce((t, item) => t + Number(item.totalCommission), 0)
      .toFixed(2)
  );
  // 二代/派發：通過佣金金額
  const passChildCommission = computed(() =>
    dataList.value
      .filter(
        item => item.setStatus === 2 && (item as any)[deliverKey] === ""
      )
      .reduce((t, item) => t + Number(item.childCommissionAmount), 0)
      .toFixed(2)
  );
  // 二代/派發：通過尊享福利金額
  const passChildBonus = computed(() =>
    dataList.value
      .filter(
        item => item.setStatus === 2 && (item as any)[deliverKey] === ""
      )
      .reduce((t, item) => t + Number(item.childBonusAmount), 0)
      .toFixed(2)
  );

  // 是否顯示派發按鈕（有任一筆狀態為待處理）
  const commissionShow = computed(() =>
    dataList.value.some(item => (item as any)[statusKey] === 1)
  );
  // 派發按鈕是否禁用（沒有任何已設定狀態的未派發列則禁用）
  const commissionDisabled = computed(
    () =>
      !dataList.value.some(
        item =>
          [2, 3, 4].includes(item.setStatus as number) &&
          (item as any)[deliverKey] === ""
      )
  );

  // 操作欄是否可顯示審核按鈕
  function canOperate(row: CommissionItem) {
    return (row as any)[deliverKey] === "";
  }

  // 設定某列的審核狀態
  function setRowStatus(row: CommissionItem, value: number) {
    const target = dataList.value.find(item => item.id === row.id);
    if (target) target.setStatus = value;
  }

  // ---- 欄位定義 ----
  const baseColumns = computed<TableColumnList>(() => {
    const cols: TableColumnList = [
      {
        label: $t("agency.commissionDate"),
        prop: "date",
        width: 200,
        cellRenderer: ({ row }) => <span>{renderDateCell(row, isWeek.value)}</span>
      },
      { label: $t("agency.commissionDeliveredAt"), prop: "deliveredAt", width: 180 },
      { label: "ID", prop: "agencyID", width: 80 }
    ];

    // tab3 多一個結算週期欄
    if (tab === 3) {
      cols.push({
        label: $t("agency.commissionBillingCycle"),
        prop: "billingCycle",
        width: 100,
        cellRenderer: ({ row }) => {
          if (row.billingCycle == 1)
            return <span>{$t("agency.commissionBillingMonth")}</span>;
          if (row.billingCycle == 2)
            return <span>{$t("agency.commissionBillingWeek")}</span>;
          return <span>--</span>;
        }
      });
    }

    if (tab === 1) {
      cols.push(
        { label: $t("agency.commissionAgencyName"), prop: "agencyName", width: 150 },
        {
          label: $t("agency.commissionAgencyAccount"),
          prop: "agencyAccount",
          width: 150
        },
        {
          label: $t("agency.commissionParentAgencyId"),
          prop: "parentAgencyId",
          width: 150
        }
      );
    } else {
      cols.push(
        {
          label: $t("agency.commissionAgencyAccount"),
          prop: "agencyAccount",
          width: 150
        },
        {
          label: $t("agency.commissionParentAgencyId"),
          prop: "parentAgencyId",
          width: 150
        },
        { label: $t("agency.commissionAgencyName"), prop: "agencyName", width: 150 }
      );
    }

    cols.push(
      {
        label: $t("agency.commissionWallet"),
        prop: "wallet",
        cellRenderer: ({ row }) => <span>{num(row.wallet)}</span>
      }
    );

    if (tab === 1) {
      cols.push({
        label: $t("agency.commissionPercent"),
        prop: "commissionPercent",
        width: 100
      });
    }

    cols.push(
      {
        label: $t("agency.commissionActiveMemberCount"),
        prop: "activeMemberCount",
        width: 100
      },
      {
        label: $t("agency.commissionFirstDepositCount"),
        prop: "firstDepositCount",
        width: 100
      }
    );

    if (tab === 1) {
      cols.push({
        label: $t("agency.commissionTotalWinAmount"),
        prop: "totalWinAmount",
        width: 100,
        cellRenderer: ({ row }) => <span>{num(row.totalWinAmount)}</span>
      });
    }

    // 一代欄位順序：金流欄位放在佣金之前；二代/派發放在佣金之後
    const moneyCols: TableColumnList = [
      {
        label: $t("agency.commissionRechargeAmount"),
        prop: "rechargeAmount",
        cellRenderer: ({ row }) => <span>{num(row.rechargeAmount)}</span>
      },
      {
        label: $t("agency.commissionWithdrawAmount"),
        prop: "withdrawAmount",
        cellRenderer: ({ row }) => <span>{num(row.withdrawAmount)}</span>
      },
      {
        label: $t("agency.commissionBetAmount"),
        prop: "betAmount",
        cellRenderer: ({ row }) => <span>{num(row.betAmount)}</span>
      },
      {
        label: $t("agency.commissionPlatformCharge"),
        prop: "platformCharge",
        cellRenderer: ({ row }) => <span>{num(row.platformCharge)}</span>
      },
      {
        label: $t("agency.commissionTotalBonus"),
        prop: "totalBonus",
        cellRenderer: ({ row }) => <span>{num(row.totalBonus)}</span>
      },
      {
        label: $t("agency.commissionTotalCharge"),
        prop: "totalCharge",
        cellRenderer: ({ row }) => <span>{num(row.totalCharge)}</span>
      },
      {
        label: $t("agency.commissionNetProfit"),
        prop: "netProfit",
        cellRenderer: ({ row }) => <span>{num(row.netProfit)}</span>
      }
    ];

    const commissionCols: TableColumnList = [
      {
        label: isWeek.value
          ? $t("agency.commissionWeekTotalCommission")
          : $t("agency.commissionMonthTotalCommission"),
        prop: "totalCommission",
        cellRenderer: ({ row }) => <span>{num(row.totalCommission)}</span>
      },
      {
        label: isWeek.value
          ? $t("agency.commissionWeekLastTotalCommission")
          : $t("agency.commissionMonthLastTotalCommission"),
        prop: "lastTotalCommission",
        cellRenderer: ({ row }) => <span>{redIfNegative(num(row.lastTotalCommission))}</span>
      }
    ];

    if (tab === 1) {
      cols.push(...moneyCols);
      cols.push(...commissionCols);
      cols.push(
        {
          label: $t("agency.commissionChildCommissionAmount"),
          prop: "childCommissionAmount",
          cellRenderer: ({ row }) => <span>{num(row.childCommissionAmount)}</span>
        },
        {
          label: $t("agency.commissionChildBonusAmount"),
          prop: "childBonusAmount",
          cellRenderer: ({ row }) => <span>{num(row.childBonusAmount)}</span>
        },
        {
          label: $t("agency.commissionPercentOfSameDevice"),
          prop: "percentOfSameDevice",
          width: 150
        }
      );
    } else {
      cols.push(...commissionCols);
      cols.push(...moneyCols);
      cols.push(
        {
          label: $t("agency.commissionChildTotalWinAmount"),
          prop: "childTotalWinAmount",
          cellRenderer: ({ row }) => <span>{num(row.childTotalWinAmount)}</span>
        },
        {
          label: $t("agency.commissionChildCommissionAmount"),
          prop: "childCommissionAmount",
          cellRenderer: ({ row }) => <span>{num(row.childCommissionAmount)}</span>
        },
        {
          label: $t("agency.commissionChildBonusAmount"),
          prop: "childBonusAmount",
          cellRenderer: ({ row }) => <span>{num(row.childBonusAmount)}</span>
        }
      );
    }

    // 狀態欄
    cols.push({
      label: $t("agency.commissionDistributeStatus"),
      prop: statusKey,
      fixed: "right",
      width: 100,
      cellRenderer: ({ row }) => renderStatus((row as any)[statusKey])
    });

    // 操作欄
    cols.push({
      label: $t("agency.commissionOperation"),
      fixed: "right",
      width: tab === 2 ? 160 : 240,
      slot: "operation"
    });

    return cols;
  });

  // 把 date 轉成送出字串
  function buildParams() {
    const type = reportDateType.value;
    const params: Record<string, any> = {
      displayZero: searchForm.displayZero ? 1 : 2,
      billingCycle: searchForm.billingCycle,
      date: dayjs(searchForm.date as any)
        .startOf(type)
        .format("YYYY-MM-DD HH:mm:ss")
    };
    if (searchForm.agencyID) params.agencyID = searchForm.agencyID;
    return params;
  }

  let lastParams: Record<string, any> = {};

  async function onSearch() {
    loading.value = true;
    const params = buildParams();
    lastParams = params;
    try {
      let listRes;
      if (tab === 1) listRes = await getAgencyCommissionList(params);
      else if (tab === 2) listRes = await getChildAgencyCommissionList(params);
      else listRes = await getOfferAgencyCommissionList(params);

      const list: CommissionItem[] = (listRes?.data?.list ?? []) as any;
      list.forEach(item => {
        // status 為 4（延期）時，預設選項回到待處理
        if (item.status === 4 && tab !== 2) item.setStatus = 1;
        else item.setStatus = (item as any)[statusKey] || 1;
      });
      dataList.value = list;

      // 派發合計
      if (tab === 1) {
        const calc = await getCommissionDistributedCalc(params);
        distributedCalc.value = calc?.data ?? { cnt: 0, amount: 0 };
      } else {
        const calc = await getChildCommissionDistributedCalc(params);
        childDistributedCalc.value =
          calc?.data ?? { cnt: 0, childCommissionAmount: 0, childBonusAmount: 0 };
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.agencyID = "";
    searchForm.displayZero = false;
    searchForm.billingCycle = "1";
    searchForm.date = dayjs().subtract(1, "month");
    onSearch();
  }

  // 匯出 EXCEL
  function handleExport() {
    const url =
      tab === 1
        ? "/backend/agency/commission/agencyCommissionExport"
        : tab === 2
          ? "/backend/agency/commission/childAgencyCommissionExport"
          : "/backend/agency/commission/agencyCommissionOfferExport";
    exportExcel(url, lastParams);
  }

  // 派發審核對話框
  function openCheckDialog() {
    // 只取待派發且本次設為通過(2)的列進審核清單
    const rows = dataList.value.filter(
      item => (item as any)[deliverKey] === "" && item.setStatus === 2
    );
    const dateStr = dayjs(searchForm.date as any)
      .startOf(reportDateType.value)
      .format("YYYY-MM-DD HH:mm:ss");
    const summary = {
      num: passCount.value,
      amount: tab === 1 ? passAmount.value : passChildCommission.value,
      amount2: tab === 2 ? passChildBonus.value : ""
    };
    addDialog({
      title: $t("agency.commissionCheckTitle"),
      width: "1200px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        rows,
        summary,
        tab,
        dateStr
      },
      contentRenderer: () => h(checkContent, { rows, summary, tab, dateStr }),
      beforeSure: async done => {
        const all = dataList.value.filter(
          item => (item as any)[deliverKey] === ""
        );
        const params = {
          date: dateStr,
          agreeIDs: all
            .filter(item => item.setStatus === 2)
            .map(item => item.id)
            .toString(),
          denyIDs: all
            .filter(item => item.setStatus === 3)
            .map(item => item.id)
            .toString(),
          delayIDs: all
            .filter(item => item.setStatus === 4)
            .map(item => item.id)
            .toString(),
          billingCycle: Number(searchForm.billingCycle)
        };
        let res;
        if (tab === 1) res = await reviewAgencyCommission(params);
        else if (tab === 2) res = await reviewChildAgencyCommission(params);
        else res = await reviewOfferAgencyCommission(params);
        if (res?.success) {
          message($t("agency.commissionDistributeSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dataList,
    loading,
    columns: baseColumns,
    reportDateType,
    isWeek,
    billingCycleOptions: billingCycleOptions(),
    distributedCalc,
    childDistributedCalc,
    passCount,
    passAmount,
    passChildCommission,
    passChildBonus,
    commissionShow,
    commissionDisabled,
    canOperate,
    setRowStatus,
    onSearch,
    resetForm,
    handleExport,
    openCheckDialog
  };
}
