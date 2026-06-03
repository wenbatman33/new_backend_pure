import { ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getPromotionReport } from "@/api/report";
import type {
  PromotionSearchForm,
  PromotionRow,
  PromotionBonus
} from "./types";

// 导出 endpoint（沿用旧码字串）
const EXPORT_URL = "/backend/report/promotion/search/export";

export function usePromotion() {
  // 搜寻条件，预设当月区间
  const searchForm = reactive<PromotionSearchForm>({
    dateType: 1,
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD"),
    agencyID: "",
    walletType: 1
  });

  const loading = ref(true);
  // 当前实际渲染用的日期类型（送出查询后才同步，避免切换下拉立即变动表头）
  const showDateType = ref(1);
  // 表格资料（已扁平化）
  const dataList = ref<Record<string, any>[]>([]);
  // 原始 bonus 合计列
  const bonusList = ref<PromotionBonus[]>([]);
  // 总派彩
  const totalDividends = ref<number | string>(0);
  // 最近一次查询参数（供导出沿用）
  const lastParams = ref<Record<string, any>>({});

  const dateTypeOptions = [
    { label: $t("report.dailyReport"), value: 1 },
    { label: $t("report.weeklyReport"), value: 2 },
    { label: $t("report.monthlyReport"), value: 3 }
  ];

  const walletTypeOptions = [
    { label: $t("report.centerWallet"), value: 1 },
    { label: $t("report.luckyMoney"), value: 2 }
  ];

  // 日期栏位格式化（依报表类型显示区间）
  function formatDateCell(text: string) {
    if (!text || text === $t("report.total")) return text;
    switch (showDateType.value) {
      case 2: {
        const start = text.substring(0, 10);
        return `${start} ~ ${dayjs(start).add(6, "day").format("YYYY-MM-DD")}`;
      }
      case 3:
        return `${dayjs(text).startOf("month").format("YYYY-MM-DD")} ~ ${dayjs(text)
          .endOf("month")
          .format("YYYY-MM-DD")}`;
      default:
        return text;
    }
  }

  // 数值显示（去逗号后再格式化），decimal>0 时保留小数
  function fmt(text: any, decimal: number) {
    if (text === "-" || text === undefined || text === null) return "-";
    const raw = typeof text === "string" ? text.replace(/,/g, "") : text;
    return commaDecimalFormat(raw, decimal);
  }

  // 动态产生表格栏位（依优惠项目展开父子栏）
  const columns = computed<TableColumnList>(() => {
    const firstRow =
      rawList.value.length > 0 ? rawList.value[0].list ?? [] : [];
    const promotionMapping = firstRow.map(item => ({
      id: item.promotionID,
      name: item.promotionName
    }));
    const parents = bonusList.value
      .map(b => promotionMapping.find(p => p.id === b.promotionID))
      .filter(Boolean) as { id: number | string; name: string }[];

    const base: TableColumnList = [
      {
        label: $t("report.date"),
        prop: "date",
        width: 220,
        fixed: "left",
        cellRenderer: ({ row }) => <span>{formatDateCell(row.date)}</span>
      }
    ];

    const promotionCols: TableColumnList = parents.map(p => ({
      label: p.name,
      align: "center",
      children: [
        {
          label: $t("report.dividendsPaid"),
          prop: `bonus${p.id}`,
          align: "right",
          minWidth: 140,
          cellRenderer: ({ row }) => <span>{fmt(row[`bonus${p.id}`], 2)}</span>
        },
        {
          label: $t("report.recipientsNumber"),
          prop: `memberCnt${p.id}`,
          align: "right",
          minWidth: 120,
          cellRenderer: ({ row }) => (
            <span>{fmt(row[`memberCnt${p.id}`], 0)}</span>
          )
        }
      ]
    }));

    return base.concat(promotionCols);
  });

  // 原始 list（供 columns 取首列 promotion 名称）
  const rawList = ref<PromotionRow[]>([]);

  // 合计列（pure-table summary-method）
  function getSummaries(param: { columns: any[]; data: any[] }) {
    const { columns: cols } = param;
    const sums: string[] = [];
    const bonusMap: Record<string, PromotionBonus> = {};
    bonusList.value.forEach(b => {
      bonusMap[`bonus${b.promotionID}`] = b;
      bonusMap[`memberCnt${b.promotionID}`] = b;
    });
    cols.forEach((col, index) => {
      if (index === 0) {
        sums[index] = $t("report.total");
        return;
      }
      const prop: string = col.property;
      if (!prop) {
        sums[index] = "";
        return;
      }
      if (prop.startsWith("bonus")) {
        sums[index] = fmt(bonusMap[prop]?.bonus, 2);
      } else if (prop.startsWith("memberCnt")) {
        sums[index] = fmt(bonusMap[prop]?.memberCnt, 0);
      } else {
        sums[index] = "";
      }
    });
    return sums;
  }

  function buildParams() {
    const params: Record<string, any> = {
      type: searchForm.dateType,
      reportStart: dayjs(searchForm.reportDateStart)
        .startOf("day")
        .format("YYYY-MM-DD"),
      reportEnd: dayjs(searchForm.reportDateEnd)
        .endOf("day")
        .format("YYYY-MM-DD"),
      agencyID: searchForm.agencyID,
      walletType: searchForm.walletType
    };
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === "") {
        delete params[key];
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams();
      lastParams.value = params;
      const { data } = await getPromotionReport(params);
      const result = data ?? { list: [], bonus: [], total: 0 };
      rawList.value = result.list ?? [];
      bonusList.value = result.bonus ?? [];
      totalDividends.value = result.total ?? 0;
      showDateType.value = searchForm.dateType;

      // 将每列的 list 扁平化成 bonus{id}/memberCnt{id}
      dataList.value = (result.list ?? []).map((item: PromotionRow) => {
        const flat: Record<string, any> = { date: item.date };
        (item.list ?? []).forEach(d => {
          flat[`bonus${d.promotionID}`] = d.bonus;
          flat[`memberCnt${d.promotionID}`] = d.memberCnt;
        });
        return flat;
      });
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    searchForm.dateType = 1;
    searchForm.reportDateStart = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("month").format("YYYY-MM-DD");
    searchForm.agencyID = "";
    searchForm.walletType = 1;
    onSearch();
  }

  // 切换报表类型时，将日期对齐到周首尾 / 月首尾
  function onDateTypeChange() {
    if (searchForm.dateType === 2) {
      searchForm.reportDateStart = dayjs(searchForm.reportDateStart)
        .startOf("week")
        .format("YYYY-MM-DD");
      searchForm.reportDateEnd = dayjs(searchForm.reportDateEnd)
        .endOf("week")
        .format("YYYY-MM-DD");
    } else if (searchForm.dateType === 3) {
      searchForm.reportDateStart = dayjs(searchForm.reportDateStart)
        .startOf("month")
        .format("YYYY-MM-DD");
      searchForm.reportDateEnd = dayjs(searchForm.reportDateEnd)
        .endOf("month")
        .format("YYYY-MM-DD");
    }
  }

  function handleExport() {
    exportExcel(EXPORT_URL, lastParams.value, "promotion_report.csv");
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    totalDividends,
    dateTypeOptions,
    walletTypeOptions,
    onSearch,
    resetForm,
    onDateTypeChange,
    handleExport,
    getSummaries
  };
}
