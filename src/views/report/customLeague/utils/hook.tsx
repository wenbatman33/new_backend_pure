import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { formatAmount, formatAmountWithRed } from "@/utils/number";
import { arrayToOptions } from "@/utils/options";
import { exportExcel } from "@/utils/report";
import dayjs from "dayjs";
import {
  getLeagueList,
  getCustomLeagueReport,
  type LeagueOption,
  type ReportRow,
  type ReportTotalCell
} from "@/api/report";
import DetailDialog from "../detail.vue";
import { h } from "vue";

const EXPORT_REPORT_URL = "/backend/league/custom/log/list/export";

export function useCustomLeague() {
  const searchForm = reactive<{ date: any; leagueID: number[] }>({
    date: [],
    leagueID: []
  });

  const loading = ref(false);
  const dataList = ref<ReportRow[]>([]);
  // 動態欄位（依選擇的聯賽生成）
  const columns = ref<TableColumnList>([]);
  // 聯賽下拉選項
  const leagueOptions = ref<{ label: string; value: number }[]>([]);
  const leagueListData = ref<LeagueOption[]>([]);
  // 總計列資料
  const summaryData = ref<Record<string, any>>({});
  // 最近一次查詢參數（匯出用）
  const lastParams = ref<Record<string, any>>({});

  // 開啟詳情對話框
  function openDetailDialog(
    leagueName: string,
    leagueID: number,
    date: string
  ) {
    addDialog({
      title: `${leagueName}: ${date}`,
      width: "80%",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(DetailDialog, { leagueName, leagueID, date })
    });
  }

  // 依選擇聯賽生成欄位（日期 + 每聯賽三欄）
  function buildColumns(leagueData: LeagueOption[]): TableColumnList {
    const cols: TableColumnList = [
      {
        label: $t("report.date"),
        prop: "date",
        fixed: "left",
        width: 150
      }
    ];
    leagueData.forEach(league => {
      const { leagueName, leagueID } = league;
      // 投注人數（可點擊開詳情）
      cols.push({
        label: `${leagueName}${$t("report.betPeople")}`,
        prop: `betPeople_${leagueID}`,
        width: 150,
        cellRenderer: ({ row }) => {
          const val = row[`betPeople_${leagueID}`];
          return Number(val) > 0 ? (
            <el-link
              type="primary"
              onClick={() => openDetailDialog(leagueName, leagueID, row.date)}
            >
              {val}
            </el-link>
          ) : (
            <span>{Number(val) || 0}</span>
          );
        }
      });
      // 流水
      cols.push({
        label: `${leagueName}${$t("report.betAmount")}`,
        prop: `betAmount_${leagueID}`,
        width: 150,
        cellRenderer: ({ row }) => (
          <span>{formatAmount(row[`betAmount_${leagueID}`] || 0)}</span>
        )
      });
      // 會員輸贏
      cols.push({
        label: `${leagueName}${$t("report.winAmount")}`,
        prop: `winAmount_${leagueID}`,
        width: 150,
        cellRenderer: ({ row }) => (
          <span>{formatAmountWithRed(row[`winAmount_${leagueID}`] || 0)}</span>
        )
      });
    });
    return cols;
  }

  // 總計列（pure-table summary 用）
  function getSummaries(param: { columns: any[] }) {
    const { columns: cols } = param;
    const sums: (string | any)[] = [];
    cols.forEach((column, index) => {
      if (index === 0) {
        sums[index] = $t("report.total");
        return;
      }
      const prop: string = column.property;
      if (!prop) {
        sums[index] = "";
        return;
      }
      const val = summaryData.value[prop];
      if (val === undefined || val === null) {
        sums[index] = "";
      } else if (prop.startsWith("winAmount_")) {
        sums[index] = formatAmountWithRed(val);
      } else if (prop.startsWith("betAmount_")) {
        sums[index] = formatAmount(val);
      } else {
        sums[index] = val;
      }
    });
    return sums;
  }

  async function onSearch() {
    if (!searchForm.date || searchForm.date.length !== 2) {
      message($t("report.rangePicker"), { type: "warning" });
      return;
    }
    if (!searchForm.leagueID || searchForm.leagueID.length === 0) {
      message($t("report.leagueSelect"), { type: "warning" });
      return;
    }
    loading.value = true;
    try {
      const params: Record<string, any> = {
        startTime: dayjs(searchForm.date[0]).format("YYYY-MM-DD"),
        endTime: dayjs(searchForm.date[1]).format("YYYY-MM-DD"),
        leagueID: searchForm.leagueID.join(",")
      };
      lastParams.value = { ...params };
      const { data } = await getCustomLeagueReport(params);
      const list: ReportRow[] = data?.list ?? [];
      // 展開每列的聯賽資料成扁平欄位
      list.forEach(item => {
        (item.list || []).forEach(cell => {
          item[`betPeople_${cell.leagueID}`] = cell.betPeople;
          item[`betAmount_${cell.leagueID}`] = cell.betAmount;
          item[`winAmount_${cell.leagueID}`] = cell.winAmount;
        });
      });
      dataList.value = list;
      // 總計
      const totals: ReportTotalCell[] = data?.total ?? [];
      const sum: Record<string, any> = {};
      totals.forEach(item => {
        sum[`betPeople_${item.leagueID}`] = item.totalBetPeople;
        sum[`betAmount_${item.leagueID}`] = item.totalBetAmount;
        sum[`winAmount_${item.leagueID}`] = item.totalWinAmount;
      });
      summaryData.value = sum;
      // 依選擇的聯賽動態生成欄位
      const argLeagueID = searchForm.leagueID;
      const selected = leagueListData.value.filter(l =>
        argLeagueID.includes(l.leagueID)
      );
      columns.value = buildColumns(selected);
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.date = [];
    searchForm.leagueID = [];
    dataList.value = [];
    columns.value = [];
    summaryData.value = {};
  }

  function handleExport() {
    if (!lastParams.value.leagueID) {
      message($t("report.leagueSelect"), { type: "warning" });
      return;
    }
    exportExcel(
      EXPORT_REPORT_URL,
      lastParams.value,
      `${$t("report.menuCustomLeague")}${lastParams.value.startTime}-${lastParams.value.endTime}.zip`
    );
  }

  async function loadLeagueOptions() {
    const { data } = await getLeagueList();
    leagueListData.value = data?.list ?? [];
    leagueOptions.value = arrayToOptions(
      leagueListData.value,
      "leagueID",
      "leagueName"
    );
  }

  onMounted(() => {
    loadLeagueOptions();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    leagueOptions,
    onSearch,
    resetForm,
    handleExport,
    getSummaries
  };
}
