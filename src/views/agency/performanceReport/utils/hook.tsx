import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { changeRedColorForNegative } from "@/utils/number";
import { countryCheck } from "@/utils/country";
import {
  getPerformanceReport,
  getPerformanceV2Report
} from "@/api/agency";
import type { PerformanceRow, GameGroupRow } from "./types";

// 正數綠色、負數紅色
function colorBySign(text: any) {
  if (Number(text) >= 0) {
    return <span style="color:#00BB00">{text}</span>;
  }
  return <span style="color:#F00">{text}</span>;
}

export function usePerformanceReport() {
  const searchForm = reactive({
    agencyID: "",
    agencyAccount: "",
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD")
  });
  // el-date-picker v-model 用的範圍陣列
  const dateRange = ref<[string, string]>([
    searchForm.reportDateStart,
    searchForm.reportDateEnd
  ]);

  const loading = ref(false);
  const showSubTable = ref(false);

  // 三個彙總區塊共用同一筆彙總資料
  const performanceData = ref<PerformanceRow[]>([]);
  // 遊戲分組績效（V2）
  const gameGroupData = ref<GameGroupRow[]>([]);

  // 區塊一：淨利彙總
  const productColumns: TableColumnList = [
    {
      label: $t("agency.netProfitOption"),
      prop: "netProfitOption",
      minWidth: 160,
      cellRenderer: ({ row }) => {
        const opt = row.netProfitOption;
        if (!Array.isArray(opt)) return <span>--</span>;
        return (
          <div>
            {opt.map((item: any, key: number) => (
              <div key={key}>
                {item.key === "totalBonus" && item.value === 1 && (
                  <p>{$t("agency.memberBonus")}</p>
                )}
                {item.key === "totalCharge" && item.value === 1 && (
                  <p>{$t("agency.depositAndWithdrawalFees")}</p>
                )}
                {item.key === "platformCharge" && item.value === 1 && (
                  <p>{$t("agency.platformFee")}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      label: $t("agency.totalBonus"),
      prop: "totalBonus",
      minWidth: 200,
      cellRenderer: ({ row }) => (
        <div>
          <p>
            {$t("agency.memberBonus")}: {row.totalBonus}
          </p>
          <p>
            {$t("agency.depositAndWithdrawalFees")}: {row.totalCharge}
          </p>
          <p>
            {$t("agency.platformFee")}: {row.platformCharge}
          </p>
        </div>
      )
    },
    {
      label: $t("agency.giveOffer"),
      prop: "giveOffer",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (row.giveOffer === 1) return <span>{$t("agency.giveOfferYes")}</span>;
        if (row.giveOffer === 2) return <span>{$t("agency.giveOfferNo")}</span>;
        return <span></span>;
      }
    },
    {
      label: $t("agency.playerCount"),
      prop: "playerCount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.playerCount)
    },
    {
      label: $t("agency.betAmount"),
      prop: "betAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.betAmount)
    },
    {
      label: $t("agency.totalWinAmount"),
      prop: "totalWinAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => colorBySign(row.totalWinAmount)
    },
    {
      label: $t("agency.killPercent"),
      prop: "killPercent",
      minWidth: 120,
      cellRenderer: ({ row }) => colorBySign(row.killPercent)
    }
  ];

  // 區塊二：代理彙總
  const agencyColumns: TableColumnList = [
    {
      label: $t("agency.regMemberCount"),
      prop: "regMemberCount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.regMemberCount)
    },
    {
      label: $t("agency.agencyRechargeAmount"),
      prop: "agencyRechargeAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyRechargeAmount)
    },
    {
      label: $t("agency.agencyWithdrawAmount"),
      prop: "agencyWithdrawAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyWithdrawAmount)
    },
    {
      label: $t("agency.agencyWithdrawRechargeDiff"),
      prop: "agencyWithdrawRechargeDiff",
      minWidth: 140,
      cellRenderer: ({ row }) => colorBySign(row.agencyWithdrawRechargeDiff)
    },
    {
      label: $t("agency.agencyManualDepositCount"),
      prop: "agencyManualDepositCount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyManualDepositCount)
    },
    {
      label: $t("agency.agencyManualDepositAmount"),
      prop: "agencyManualDepositAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyManualDepositAmount)
    },
    {
      label: countryCheck(["IN", "PH"])
        ? $t("agency.agencyNetProfitPh")
        : $t("agency.agencyNetProfit"),
      prop: "agencyNetProfit",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.agencyNetProfit)
    },
    {
      label: countryCheck(["IN", "PH"])
        ? $t("agency.agencyLastNetProfitPh")
        : $t("agency.agencyLastNetProfit"),
      prop: "agencyLastNetProfit",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyLastNetProfit)
    },
    {
      label: $t("agency.agencyCommissionAmount"),
      prop: "agencyCommissionAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.agencyCommissionAmount)
    },
    {
      label: $t("agency.totalChildCommissionAmount"),
      prop: "totalChildCommissionAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.totalChildCommissionAmount)
    },
    {
      label: $t("agency.totalCommission"),
      prop: "totalCommission",
      minWidth: 120,
      cellRenderer: ({ row }) => colorBySign(row.totalCommission)
    },
    {
      label: $t("agency.agencyWallet"),
      prop: "agencyWallet",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.agencyWallet)
    }
  ];

  // 區塊三：會員彙總
  const memberColumns: TableColumnList = [
    {
      label: $t("agency.rechargeCount"),
      prop: "rechargeCount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.rechargeCount)
    },
    {
      label: $t("agency.rechargeAmount"),
      prop: "rechargeAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.rechargeAmount)
    },
    {
      label: $t("agency.withdrawAmount"),
      prop: "withdrawAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.withdrawAmount)
    },
    {
      label: $t("agency.withdrawDepositDiff"),
      prop: "withdrawDepositDiff",
      minWidth: 120,
      cellRenderer: ({ row }) => colorBySign(row.withdrawDepositDiff)
    },
    {
      label: $t("agency.firstDepositCount"),
      prop: "firstDepositCount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.firstDepositCount)
    },
    {
      label: $t("agency.firstDepositAmount"),
      prop: "firstDepositAmount",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.firstDepositAmount)
    },
    {
      label: $t("agency.continueDepositCount"),
      prop: "continueDepositCount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.continueDepositCount)
    },
    {
      label: $t("agency.continueDepositAmount"),
      prop: "continueDepositAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.continueDepositAmount)
    },
    {
      label: $t("agency.totalCharge"),
      prop: "totalCharge",
      minWidth: 120,
      cellRenderer: ({ row }) => colorBySign(row.totalCharge)
    },
    {
      label: $t("agency.platformCharge"),
      prop: "platformCharge",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.platformCharge)
    },
    {
      label: $t("agency.totalBonus"),
      prop: "totalBonus",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.totalBonus)
    },
    {
      label: $t("agency.transferMemberCount"),
      prop: "transferMemberCount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.transferMemberCount)
    },
    {
      label: $t("agency.transferMemberAmount"),
      prop: "transferMemberAmount",
      minWidth: 140,
      cellRenderer: ({ row }) =>
        changeRedColorForNegative(row.transferMemberAmount)
    }
  ];

  // 遊戲分組績效列表
  const gameGroupColumns: TableColumnList = [
    { label: $t("agency.gameGroupName"), prop: "gameGroupName", minWidth: 120 },
    {
      label: $t("agency.gameGroupBetAmount"),
      prop: "betAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.betAmount)
    },
    {
      label: $t("agency.gameGroupWinAmount"),
      prop: "totalWinAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => changeRedColorForNegative(row.totalWinAmount)
    }
  ];

  async function onSearch() {
    loading.value = true;
    showSubTable.value = false;
    const [start, end] = dateRange.value ?? [];
    searchForm.reportDateStart = start ?? "";
    searchForm.reportDateEnd = end ?? "";
    const params: Record<string, any> = {
      agencyID: searchForm.agencyID,
      agencyAccount: searchForm.agencyAccount,
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      startTime: searchForm.reportDateStart,
      endTime: searchForm.reportDateEnd
    };
    // 移除空值
    Object.keys(params).forEach(k => {
      if (params[k] === "" || params[k] == null) delete params[k];
    });
    try {
      const { success, data } = await getPerformanceReport(params);
      if (success) {
        performanceData.value = data ? [data] : [];
        showSubTable.value = true;
      }
      const v2 = await getPerformanceV2Report(params);
      gameGroupData.value = v2?.data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.agencyAccount = "";
    dateRange.value = [
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().endOf("day").format("YYYY-MM-DD")
    ];
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    showSubTable,
    performanceData,
    gameGroupData,
    productColumns,
    agencyColumns,
    memberColumns,
    gameGroupColumns,
    onSearch,
    resetForm
  };
}
