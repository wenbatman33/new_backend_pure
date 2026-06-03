import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getLmReport, getLmReportTotal } from "@/api/luckmoney";
import type { SearchFormProps, ReportRow } from "./types";

// 数值渲染：空值显示 "-"，否则千分位
const fmt = (text: any, n = 0) =>
  text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(text, n);

// 负数标红
const fmtRed = (text: any, n = 2) => {
  const val = fmt(text, n);
  return Number(text) >= 0 ? (
    <span>{val}</span>
  ) : (
    <span style="color:#F00">{val}</span>
  );
};

export function useLmGameGroup() {
  // 默认查询区间：今日 00:00:00 ~ 23:59:59
  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    memberAccount: "",
    gameAccount: ""
  });

  // 日期区间选择器绑定（[开始, 结束]）
  const dateRange = ref<[Date, Date]>([
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ]);

  const dataList = ref<ReportRow[]>([]);
  const totalData = ref<ReportRow>({});
  const lastUpdatedAt = ref("");
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: $t("luckmoney.typeAndVendor"),
      prop: "gameGroupName",
      width: 180,
      fixed: "left"
    },
    {
      label: $t("luckmoney.betAmount"),
      prop: "betAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.betAmount, 2)}</span>
    },
    {
      label: $t("luckmoney.killNumber"),
      prop: "kill",
      cellRenderer: ({ row }) => {
        const val = fmt(row.kill, 2) + "%";
        return Number(row.kill) >= 0 ? (
          <span>{val}</span>
        ) : (
          <span style="color:#F00">{val}</span>
        );
      }
    },
    {
      label: $t("luckmoney.companyProfit"),
      prop: "totalWinAmount",
      align: "right",
      cellRenderer: ({ row }) => fmtRed(row.totalWinAmount, 2)
    },
    {
      label: $t("luckmoney.betPeople"),
      prop: "betPeople",
      cellRenderer: ({ row }) =>
        !row.gameTypeName ? (
          <a
            href={`/luckmoney/playerReport?gameGroupID=${row.gameGroupID}&start=${searchForm.reportDateStart}&end=${searchForm.reportDateEnd}&memberAccount=${searchForm.memberAccount}`}
            target="_blank"
          >
            {row.betPeople}
          </a>
        ) : (
          <span>{fmt(row.betPeople)}</span>
        )
    },
    {
      label: $t("luckmoney.betNumber"),
      prop: "betCount",
      cellRenderer: ({ row }) => <span>{fmt(row.betCount)}</span>
    },
    {
      label: $t("luckmoney.activityFlow"),
      prop: "eventBetAmount",
      align: "right",
      cellRenderer: ({ row }) => fmtRed(row.eventBetAmount, 2)
    }
  ];

  // 同步日期选择器 -> searchForm
  function syncDate() {
    if (dateRange.value && dateRange.value.length === 2) {
      searchForm.reportDateStart = dayjs(dateRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.reportDateEnd = dayjs(dateRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      searchForm.reportDateStart = "";
      searchForm.reportDateEnd = "";
    }
  }

  async function onSearch() {
    syncDate();
    if (!searchForm.reportDateStart || !searchForm.reportDateEnd) {
      message($t("luckmoney.plzKeyDate"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const params = {
        reportDateStart: searchForm.reportDateStart,
        reportDateEnd: searchForm.reportDateEnd,
        memberAccount: searchForm.memberAccount || "",
        gameAccount: searchForm.gameAccount || ""
      };
      const { data } = await getLmReport(params);
      const { data: totalRes } = await getLmReportTotal(params);

      totalData.value = totalRes?.list?.[0] ?? {};
      lastUpdatedAt.value = totalData.value.lastUpdatedAt ?? "";

      const list: ReportRow[] = [];
      (data?.list ?? []).forEach((item: any) => {
        item.gameTypeData.gameGroupName = item.gameTypeData.gameTypeName;
        list.push({ ...item.gameTypeData, children: item.data });
      });
      dataList.value = list;
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.memberAccount = "";
    searchForm.gameAccount = "";
    dateRange.value = [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ];
    onSearch();
  }

  // 汇出 Excel
  function handleExport() {
    syncDate();
    exportExcel("/backend/report/gamegroup/export/lm", {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      memberAccount: searchForm.memberAccount || "",
      gameAccount: searchForm.gameAccount || ""
    });
  }

  // 合计行渲染
  function summaryMethod({ columns: cols }) {
    return cols.map((col, index) => {
      if (index === 0) return $t("luckmoney.total");
      const key = col.property as keyof ReportRow;
      const val = totalData.value[key];
      if (val === undefined || val === null || val === "") return "-";
      if (key === "betPeople" || key === "betCount") return fmt(val);
      return fmt(val, 2);
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    lastUpdatedAt,
    onSearch,
    resetForm,
    handleExport,
    summaryMethod
  };
}
