import { ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { changeRedColorForNegative } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getGameGroupReport,
  getGameGroupReportTotal,
  refreshGameGroupReport
} from "@/api/report";
import type { SearchFormProps, ReportRow, ReportTotal } from "./types";

export function useReportGameGroup() {
  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    memberAccount: "",
    includesTest: 0
  });

  const dataList = ref<ReportRow[]>([]);
  const totalData = ref<ReportTotal>({});
  const loading = ref(true);
  // 实际送出的查询参数（提供导出沿用）
  const searchParams = ref<Record<string, any>>({});

  // 是否含测试帐号选项
  const includesTestOptions = [
    { label: $t("report.no"), value: 0 },
    { label: $t("report.yes"), value: 1 }
  ];

  // 表格标题：最后更新时间
  const title = computed(
    () => `${$t("report.lastUpdate")}：${totalData.value.lastUpdatedAt || ""}`
  );

  const columns: TableColumnList = [
    {
      label: $t("report.typeAndVendor"),
      prop: "gameGroupName",
      width: 180,
      fixed: "left"
    },
    {
      label: $t("report.totalTurnover"),
      prop: "betAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.betAmount)}</span>
      )
    },
    {
      label: $t("report.killNumber"),
      prop: "kill",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.kill)}</span>
      )
    },
    {
      label: $t("report.companyProfit"),
      prop: "totalWinAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.totalWinAmount)}</span>
      )
    },
    {
      label: $t("report.bettorsNumber"),
      prop: "betPeople",
      // 厂商明细列（无 gameTypeName）提供前往胜负名单连结
      cellRenderer: ({ row }) =>
        !row.gameTypeName ? (
          <a
            href={`/report/winner?gameGroupID=${row.gameGroupID}&start=${searchParams.value.reportDateStart}&end=${searchParams.value.reportDateEnd}`}
            target="_blank"
            style="color: var(--el-color-primary)"
          >
            {row.betPeople}
          </a>
        ) : (
          <span>{row.betPeople}</span>
        )
    },
    {
      label: $t("report.bettorsCount"),
      prop: "betCount",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.betCount)}</span>
      )
    },
    {
      label: $t("report.activityFlow"),
      prop: "eventBetAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.eventBetAmount)}</span>
      )
    }
  ];

  // 合计列（pure-table show-summary 用）
  function summaryMethod({ columns: cols }) {
    return cols.map((col, index) => {
      if (index === 0) return $t("report.total");
      const val = totalData.value[col.property as keyof ReportTotal];
      return val ?? "";
    });
  }

  async function onSearch() {
    // 有填时间却没填日期时提醒
    if (!searchForm.reportDateStart || !searchForm.reportDateEnd) {
      message($t("report.plzKeyDate"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const params = {
        reportDateStart: searchForm.reportDateStart,
        reportDateEnd: searchForm.reportDateEnd,
        memberAccount: searchForm.memberAccount || "",
        includesTest: searchForm.includesTest
      };
      searchParams.value = params;

      const [{ data }, totalRes] = await Promise.all([
        getGameGroupReport(params),
        getGameGroupReportTotal(params)
      ]);

      totalData.value = totalRes?.data?.list?.[0] ?? {};

      // 把后端 gameTypeData + data 组成树状结构
      const list: ReportRow[] = [];
      (data?.list ?? []).forEach((item: any) => {
        const parent = { ...item.gameTypeData };
        parent.gameGroupName = parent.gameTypeName;
        list.push({ ...parent, children: item.data });
      });
      dataList.value = list;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.reportDateStart = dayjs()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.reportDateEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    searchForm.memberAccount = "";
    searchForm.includesTest = 0;
    onSearch();
  }

  // 导出 Excel
  function handleExport() {
    exportExcel("/backend/report/gamegroup/export", searchParams.value);
  }

  // 手动更新报表（沿用旧 refresh endpoint）
  async function handleUpdate() {
    const { success } = await refreshGameGroupReport();
    if (success) {
      message($t("report.updateSuccess"), { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    includesTestOptions,
    title,
    loading,
    columns,
    dataList,
    summaryMethod,
    onSearch,
    resetForm,
    handleExport,
    handleUpdate
  };
}
