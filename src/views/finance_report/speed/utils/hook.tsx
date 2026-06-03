import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { getSpeedList } from "@/api/finance_report";
import type { SpeedResult, SpeedRow, SpeedSearchForm } from "./types";

// 把秒數格式化為 HH:mm:ss
function formatSecond(secs: number | string): string {
  const s = Number(secs) || 0;
  const hr = Math.floor(s / 3600);
  const min = Math.floor((s - hr * 3600) / 60);
  const sec = Math.floor(s - hr * 3600 - min * 60);
  return (
    String(hr).padStart(2, "0") +
    ":" +
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0")
  );
}

// 把一列資料（title + 0~23 數值）組成 row 物件
function setRow(
  title: string,
  data: (number | string)[],
  asTime = false
): SpeedRow {
  const row: SpeedRow = { title };
  for (let i = 0; i < 24; i++) {
    const v = data?.[i] ?? 0;
    row[String(i)] = asTime ? formatSecond(v) : Number(v);
  }
  return row;
}

export function useSpeed() {
  const searchForm = reactive<SpeedSearchForm>({
    date: dayjs().format("YYYY-MM-DD")
  });

  const loading = ref(true);
  // 兩張表格的資料
  const depositList = ref<SpeedRow[]>([]);
  const withdrawalList = ref<SpeedRow[]>([]);
  // 平均完成速度
  const depositTotalSpeed = ref<number>(0);
  const withdrawalTotalSpeed = ref<number>(0);
  // 圖表所需的原始資料
  const chartResult = ref<SpeedResult | null>(null);

  // 動態產生 0-1 ~ 23-24 共 24 個時段欄位
  const hourColumns: TableColumnList = [];
  for (let n = 0; n < 24; n++) {
    hourColumns.push({
      label: `${n}-${n + 1}`,
      prop: String(n),
      width: 90
    });
  }

  const columns: TableColumnList = [
    {
      label: `${$t("finance_report.time")}(hour)`,
      prop: "title",
      width: 150,
      fixed: "left"
    },
    ...hourColumns
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getSpeedList({ date: searchForm.date });
      const res = data as SpeedResult;
      chartResult.value = res;
      depositTotalSpeed.value = res?.depositTotalSpeed ?? 0;
      withdrawalTotalSpeed.value = res?.withdrawalTotalSpeed ?? 0;

      // 存款表格
      depositList.value = [
        setRow($t("finance_report.piecesOf"), res?.depositCount ?? []),
        setRow($t("finance_report.amount"), res?.depositAmount ?? []),
        setRow(
          $t("finance_report.completionSpeedOfEachTransaction"),
          res?.depositSpeed ?? [],
          true
        )
      ];

      // 提款表格
      withdrawalList.value = [
        setRow($t("finance_report.piecesOf"), res?.withdrawalCount ?? []),
        setRow($t("finance_report.amount"), res?.withdrawalAmount ?? []),
        setRow(
          $t("finance_report.financialReviewTime"),
          res?.withdrawalFinancialCheckSpeed ?? [],
          true
        ),
        setRow(
          $t("finance_report.riskControlReviewTime"),
          res?.withdrawalRiskCheckSpeed ?? [],
          true
        ),
        setRow(
          $t("finance_report.withdrawalTime"),
          res?.payoutSpeed ?? [],
          true
        ),
        setRow(
          $t("finance_report.completionSpeedOfEachTransaction"),
          res?.withdrawalSpeed ?? [],
          true
        )
      ];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    searchForm.date = dayjs().format("YYYY-MM-DD");
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    depositList,
    withdrawalList,
    depositTotalSpeed,
    withdrawalTotalSpeed,
    chartResult,
    onSearch,
    resetForm
  };
}
