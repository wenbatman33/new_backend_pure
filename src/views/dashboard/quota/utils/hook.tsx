import { h, ref, computed, onMounted, type Ref } from "vue"; // h 用於 contentRenderer 載入 editForm
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { useECharts } from "@pureadmin/utils";
import { commaDecimalFormat } from "@/utils/number";
import { findByValue } from "@/utils/options";
import {
  getQuota,
  updateConfig,
  updateConfigName,
  getQuotaLog,
  createQuotaLog,
  settlement,
  getQuotaAdjustList,
  getQuotaReportMonth,
  postQuotaReportMonth,
  type QuotaInfo
} from "@/api/dashboard";
import editForm from "../form.vue";
import type { FormItemProps } from "./types";

// 用途類型選項
export const useTypeOptions = [
  { label: $t("dashboard.useTypeDeposit"), value: 1 },
  { label: $t("dashboard.useTypeWithdraw"), value: 2 },
  { label: $t("dashboard.useTypeOffset"), value: 3 },
  { label: $t("dashboard.useTypeWriteOff"), value: 4 },
  { label: $t("dashboard.platformWinLoss"), value: 5 }
];

export function useQuota() {
  const quotaData = ref<QuotaInfo>({} as QuotaInfo);
  const loading = ref(true);

  // 站台名稱行內編輯
  const isEditing = ref(false);
  const editedWebsiteName = ref("");

  // 圖表
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  // 依百分比決定顏色
  const colorClass = computed(() => {
    const p = Number(quotaData.value.percent) || 0;
    if (p >= 76) return "red";
    if (p >= 51) return "orange";
    return "green";
  });

  function renderChart() {
    const list = quotaData.value.list ?? [];
    setOptions({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", crossStyle: { color: "#999" } }
      },
      legend: { data: [""] },
      xAxis: [
        {
          type: "category",
          data: list.map(item => item.date?.slice(11, 16)),
          axisPointer: { type: "line", status: "show" }
        }
      ],
      yAxis: [{ type: "value" }],
      series: [
        {
          name: "",
          type: "line",
          data: list.map(item => item.winAmount),
          color: "#0080FF"
        }
      ]
    });
  }

  async function init() {
    loading.value = true;
    try {
      const { data } = await getQuota();
      quotaData.value = data ?? ({} as QuotaInfo);
      renderChart();
    } finally {
      loading.value = false;
    }
  }

  // 水位開關
  async function switchChange(val: boolean) {
    const { success } = await updateConfig({ verify: val });
    if (success) await init();
  }

  // 站台名稱編輯
  function startEditing() {
    editedWebsiteName.value = quotaData.value.websiteName;
    isEditing.value = true;
  }
  function cancelEdit() {
    isEditing.value = false;
  }
  async function submitEdit() {
    const { success } = await updateConfigName(editedWebsiteName.value);
    if (success) {
      quotaData.value.websiteName = editedWebsiteName.value;
      isEditing.value = false;
      await init();
    }
  }

  // ===== 入金明細彈窗（含新增） =====
  function openLogDialog() {
    const logList = ref<any[]>([]);
    const logLoading = ref(true);

    const columns: TableColumnList = [
      { label: $t("dashboard.createdAt"), prop: "createdAt", width: 150 },
      {
        label: $t("dashboard.formUseType"),
        prop: "useType",
        width: 120,
        cellRenderer: ({ row }) => (
          <span>{findByValue(useTypeOptions, row.useType)}</span>
        )
      },
      {
        label: $t("dashboard.startingAmount"),
        prop: "beforeMoney",
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.beforeMoney)}</span>
      },
      {
        label: $t("dashboard.transactionAmount"),
        prop: "adjustMoney",
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.adjustMoney)}</span>
      },
      {
        label: $t("dashboard.currentBalance"),
        prop: "afterMoney",
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.afterMoney)}</span>
      },
      { label: $t("dashboard.lastUpdate"), prop: "updatedAt", width: 150 },
      { label: $t("dashboard.updatedUser"), prop: "updatedUser", width: 120 }
    ];

    async function loadLog() {
      logLoading.value = true;
      try {
        const { data } = await getQuotaLog();
        logList.value = data?.list ?? [];
      } finally {
        logLoading.value = false;
      }
    }

    addDialog({
      title: $t("dashboard.logModalTitle"),
      width: "1200px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => (
        <div>
          <div class="flex items-center mb-4">
            <span class="text-[var(--el-text-color-secondary)] mr-4">
              {$t("dashboard.logModalNote")}
            </span>
            <el-button type="primary" onClick={() => openLogEditDialog(loadLog)}>
              {$t("dashboard.logModalAdd")}
            </el-button>
          </div>
          <pure-table
            data={logList.value}
            columns={columns}
            loading={logLoading.value}
            border
          />
        </div>
      ),
      open: () => loadLog()
    });
  }

  // ===== 新增入金明細表單彈窗 =====
  function openLogEditDialog(reloadLog: () => void) {
    const formRef = ref();
    addDialog({
      title: $t("dashboard.editModalTitle"),
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        websiteName: quotaData.value.websiteName,
        formInline: {
          useType: "",
          createdAt: "",
          adjustMoney: "",
          note: ""
        }
      },
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await createQuotaLog({ ...curData });
          if (success) {
            message($t("dashboard.success"), { type: "success" });
            done();
            reloadLog();
            init();
          }
        });
      }
    });
  }

  // ===== 額度異動日報彈窗 =====
  function openTransactionDialog() {
    const list = ref<any[]>([]);
    const tLoading = ref(true);
    const periodType = ref(5);
    const startTime = ref(dayjs().startOf("month").format("YYYY-MM-DD"));
    const endTime = ref(dayjs().endOf("month").format("YYYY-MM-DD"));

    const periodTypeList = [
      { label: $t("dashboard.today"), value: 1 },
      { label: $t("dashboard.yesterday"), value: 2 },
      { label: $t("dashboard.thisWeek"), value: 3 },
      { label: $t("dashboard.lastWeek"), value: 4 },
      { label: $t("dashboard.thisMonth"), value: 5 },
      { label: $t("dashboard.lastMonth"), value: 6 }
    ];

    const columns: TableColumnList = [
      { label: $t("dashboard.date"), prop: "date", width: 150 },
      {
        label: $t("dashboard.formUseType"),
        prop: "useType",
        width: 120,
        cellRenderer: ({ row }) => (
          <span>{findByValue(useTypeOptions, row.useType)}</span>
        )
      },
      {
        label: $t("dashboard.changesInQuota"),
        prop: "adjustBalance",
        cellRenderer: ({ row }) => (
          <span>{commaDecimalFormat(row.adjustBalance)}</span>
        )
      },
      {
        label: $t("dashboard.remainingBalance"),
        prop: "balance",
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.balance)}</span>
      }
    ];

    function applyPeriod(val: number) {
      switch (val) {
        case 1:
          startTime.value = dayjs().format("YYYY-MM-DD");
          endTime.value = dayjs().format("YYYY-MM-DD");
          break;
        case 2:
          startTime.value = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          endTime.value = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          break;
        case 3:
          startTime.value = dayjs().startOf("week").format("YYYY-MM-DD");
          endTime.value = dayjs().endOf("week").format("YYYY-MM-DD");
          break;
        case 4:
          startTime.value = dayjs()
            .subtract(1, "week")
            .startOf("week")
            .format("YYYY-MM-DD");
          endTime.value = dayjs()
            .subtract(1, "week")
            .endOf("week")
            .format("YYYY-MM-DD");
          break;
        case 5:
          startTime.value = dayjs().startOf("month").format("YYYY-MM-DD");
          endTime.value = dayjs().endOf("month").format("YYYY-MM-DD");
          break;
        case 6:
          startTime.value = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD");
          endTime.value = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format("YYYY-MM-DD");
          break;
      }
    }

    async function loadList() {
      tLoading.value = true;
      try {
        const { data } = await getQuotaAdjustList({
          startTime: startTime.value,
          endTime: endTime.value
        });
        list.value = data?.list ?? [];
      } finally {
        tLoading.value = false;
      }
    }

    async function onPeriodChange(val: number) {
      periodType.value = val;
      applyPeriod(val);
      await loadList();
    }

    addDialog({
      title: $t("dashboard.quotaChangeDailyReport"),
      width: "1200px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => (
        <div>
          <div class="flex items-center mb-4">
            <el-radio-group
              modelValue={periodType.value}
              onChange={(v: number) => onPeriodChange(v)}
            >
              {periodTypeList.map(item => (
                <el-radio-button key={item.value} value={item.value}>
                  {item.label}
                </el-radio-button>
              ))}
            </el-radio-group>
            <span class="ml-8">
              {startTime.value} ～ {endTime.value}
            </span>
          </div>
          <pure-table
            data={list.value}
            columns={columns}
            loading={tLoading.value}
            border
          />
        </div>
      ),
      open: () => loadList()
    });
  }

  // ===== 月額度統計報表彈窗 =====
  function openTotalDialog() {
    const list = ref<any[]>([]);
    const tLoading = ref(true);
    const startTime = ref(dayjs().subtract(11, "month").format("YYYY-MM"));
    const endTime = ref(dayjs().format("YYYY-MM"));

    const columns: TableColumnList = [
      { label: $t("dashboard.month"), prop: "date", width: 200 },
      {
        label: $t("dashboard.platformQuota"),
        prop: "quota",
        width: 250,
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.quota)}</span>
      },
      {
        label: $t("dashboard.usage"),
        prop: "winAmount",
        cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.winAmount)}</span>
      }
    ];

    async function loadList() {
      tLoading.value = true;
      try {
        const { data } = await getQuotaReportMonth({
          startTime: startTime.value,
          endTime: endTime.value
        });
        list.value = data?.list ?? [];
      } finally {
        tLoading.value = false;
      }
    }

    async function handleRefresh() {
      await postQuotaReportMonth();
      await loadList();
    }

    addDialog({
      title: $t("dashboard.monthlyQuotaStatisticsReport"),
      width: "1200px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => (
        <div>
          <div class="flex items-center mb-4">
            <el-date-picker
              modelValue={startTime.value}
              type="month"
              format="YYYY/MM"
              value-format="YYYY-MM"
              clearable={false}
              onUpdate:modelValue={(v: string) => {
                startTime.value = v;
                loadList();
              }}
            />
            <span class="mx-4">～</span>
            <el-date-picker
              modelValue={endTime.value}
              type="month"
              format="YYYY/MM"
              value-format="YYYY-MM"
              clearable={false}
              onUpdate:modelValue={(v: string) => {
                endTime.value = v;
                loadList();
              }}
            />
            <el-button class="ml-4" onClick={handleRefresh}>
              {$t("dashboard.redo")}
            </el-button>
          </div>
          <pure-table
            data={list.value}
            columns={columns}
            loading={tLoading.value}
            border
          />
        </div>
      ),
      open: () => loadList()
    });
  }

  // ===== 結算彈窗 =====
  function openSettlementDialog() {
    const settlementDate = ref(
      quotaData.value.settlementDate
        ? dayjs(quotaData.value.settlementDate).format("YYYY-MM-DD")
        : ""
    );
    const configWinAmount = quotaData.value.configWinAmount;
    const websiteName = quotaData.value.websiteName;

    addDialog({
      title: $t("dashboard.settlementModalTitle"),
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <div class="text-base leading-10">
          <div>
            {$t("dashboard.formWebsiteName")}：{websiteName}
          </div>
          <div class="flex items-center">
            <span>{$t("dashboard.settlementDate")}：</span>
            <el-date-picker
              modelValue={settlementDate.value}
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              disabledDate={(d: Date) => dayjs(d).isAfter(dayjs(), "day")}
              onUpdate:modelValue={(v: string) => (settlementDate.value = v)}
            />
          </div>
          <div>
            {$t("dashboard.settlementConfigWinAmount")}：
            {commaDecimalFormat(configWinAmount, 2)}
          </div>
          <div class="text-[var(--el-color-danger)]">
            {$t("dashboard.settlementCheckMessage")}
          </div>
        </div>
      ),
      beforeSure: async done => {
        const { success } = await settlement({ date: settlementDate.value });
        if (success) {
          message($t("dashboard.settlementSuccess"), { type: "success" });
          done();
          init();
        }
      }
    });
  }

  onMounted(() => {
    init();
  });

  return {
    quotaData,
    loading,
    isEditing,
    editedWebsiteName,
    chartRef,
    colorClass,
    init,
    switchChange,
    startEditing,
    cancelEdit,
    submitEdit,
    openLogDialog,
    openTransactionDialog,
    openTotalDialog,
    openSettlementDialog
  };
}
