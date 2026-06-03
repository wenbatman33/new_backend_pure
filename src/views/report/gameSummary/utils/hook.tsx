import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import { commaDecimalFormat } from "@/utils/number";
import reCalcForm from "../reCalcForm.vue";
import bettingLogForm from "../bettingLogForm.vue";
import bettingLogSetting from "../bettingLogSetting.vue";
import {
  getReport,
  addTaskNoc,
  getBettingLog,
  addBettingLog,
  updateBettingLog,
  delBettingLogById,
  getGameGroupDropdown,
  type GameSummaryItem,
  type BettingLogItem
} from "@/api/report";
import type {
  GameGroupOption,
  ReCalcFormItemProps,
  BettingLogFormItemProps
} from "./types";

/** 流水帐设定选项 */
export const timeColumnOptions = [
  { label: $t("report.betTimeVendor"), value: "bet_time" },
  { label: $t("report.betTimeLocal"), value: "bet_time_local" },
  { label: $t("report.settlementTimeVendor"), value: "settlement_time" },
  { label: $t("report.settlementTimeLocal"), value: "settlement_time_local" }
];

/** 纪录状态选项 */
export const statusFilterOptions = [
  { label: $t("report.allBetStatus"), value: 1 },
  { label: $t("report.finishedStatus"), value: 2 }
];

export function useGameSummary() {
  const today = dayjs().format("YYYY-MM-DD");
  const searchForm = reactive({
    start: today,
    end: today,
    gameGroupID: "" as string | number
  });
  // 报表日期区间（绑定 el-date-picker）
  const dateRange = ref<[string, string]>([today, today]);

  const dataList = ref<GameSummaryItem[]>([]);
  const loading = ref(false);
  // 游戏厂商下拉选项
  const gameGroupList = ref<GameGroupOption[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 9999,
    currentPage: 1,
    background: true,
    hideOnSinglePage: true
  });

  const columns: TableColumnList = [
    { label: $t("report.date"), prop: "date", width: 220, fixed: "left" },
    { label: $t("report.vendorName"), prop: "name", minWidth: 300 },
    {
      label: $t("report.validBetAmount"),
      prop: "betAmount",
      width: 200,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.betAmount, 2)}</span>
      )
    },
    {
      label: $t("report.totalBetAmount"),
      prop: "totalBetAmount",
      width: 200,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalBetAmount, 2)}</span>
      )
    }
  ];

  async function onSearch() {
    if (dateRange.value?.length === 2) {
      searchForm.start = dateRange.value[0];
      searchForm.end = dateRange.value[1];
    }
    if (!searchForm.gameGroupID) {
      message($t("report.gameVendorRequired"), { type: "warning" });
      return;
    }
    loading.value = true;
    try {
      const { data } = await getReport({
        start: searchForm.start,
        end: searchForm.end,
        gameGroupID: searchForm.gameGroupID
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dateRange.value = [today, today];
    searchForm.gameGroupID = "";
    dataList.value = [];
    pagination.total = 0;
  }

  /** 手动补流水对话框 */
  const reCalcRef = ref();
  function openReCalcDialog() {
    addDialog({
      title: $t("report.manualReCalc"),
      props: {
        formInline: {
          module: "",
          startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
        },
        gameGroupList: gameGroupList.value
      },
      width: "700px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(reCalcForm, { ref: reCalcRef }),
      beforeSure: (done, { options }) => {
        const FormRef = reCalcRef.value.getRef();
        const curData = options.props.formInline as ReCalcFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (dayjs(curData.startTime).isAfter(dayjs(curData.endTime))) {
            message($t("report.startGtEnd"), { type: "error" });
            return;
          }
          if (dayjs(curData.endTime).diff(dayjs(curData.startTime), "day") > 1) {
            message($t("report.rangeOverOneDay"), { type: "error" });
            return;
          }
          const { success } = await addTaskNoc({
            startTime: curData.startTime,
            endTime: curData.endTime,
            module: curData.module
          });
          if (success) {
            message($t("report.reCalcSuccess"), { type: "success" });
            done();
          }
        });
      }
    });
  }

  /* ---------------- 厂商设置（子表 CRUD） ---------------- */
  const bettingDataList = ref<BettingLogItem[]>([]);
  const bettingLoading = ref(false);

  async function loadBettingLog() {
    bettingLoading.value = true;
    try {
      const { data } = await getBettingLog({});
      bettingDataList.value = data?.list ?? [];
    } finally {
      bettingLoading.value = false;
    }
  }

  const bettingFormRef = ref();
  /** 新增 / 编辑 单笔厂商流水设定 */
  function openBettingLogEdit(row?: BettingLogItem) {
    const isEdit = !!row?.id;
    addDialog({
      title: isEdit
        ? $t("report.editVendorSetting")
        : $t("report.addVendorSetting"),
      props: {
        formInline: {
          id: row?.id,
          gameGroupID: row?.gameGroupID ?? "",
          timeColumn: row?.timeColumn ?? "",
          statusFilter: row?.statusFilter ?? ""
        },
        gameGroupList: gameGroupList.value
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(bettingLogForm, { ref: bettingFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = bettingFormRef.value.getRef();
        const curData = options.props.formInline as BettingLogFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const found = gameGroupList.value.find(
            el => el.value === curData.gameGroupID
          );
          const name = found?.name ?? found?.label ?? "";
          const payload = { ...curData, name };
          const { success } = isEdit
            ? await updateBettingLog(payload)
            : await addBettingLog(payload);
          if (success) {
            message(
              isEdit ? $t("report.editSuccess") : $t("report.addSuccess"),
              { type: "success" }
            );
            done();
            loadBettingLog();
          }
        });
      }
    });
  }

  function handleBettingDelete(row: BettingLogItem) {
    ElMessageBox.confirm($t("report.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await delBettingLogById(row.id);
        if (success) {
          message($t("report.deleteSuccess"), { type: "success" });
          loadBettingLog();
        }
      })
      .catch(() => {});
  }

  /** 打开厂商设置主对话框（内含子表组件 bettingLogSetting.vue） */
  function openBettingLogSetting() {
    loadBettingLog();
    addDialog({
      title: $t("report.vendorSetting"),
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () =>
        h(bettingLogSetting, {
          dataList: bettingDataList.value,
          loading: bettingLoading.value,
          onAdd: () => openBettingLogEdit(),
          onEdit: (row: BettingLogItem) => openBettingLogEdit(row),
          onDelete: (row: BettingLogItem) => handleBettingDelete(row)
        })
    });
  }

  onMounted(async () => {
    // 载入游戏厂商下拉
    try {
      const { data } = await getGameGroupDropdown();
      gameGroupList.value = data?.gameGroup ?? [];
    } catch {
      gameGroupList.value = [];
    }
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    pagination,
    gameGroupList,
    onSearch,
    resetForm,
    openReCalcDialog,
    bettingDataList,
    bettingLoading,
    loadBettingLog,
    openBettingLogSetting,
    openBettingLogEdit,
    handleBettingDelete
  };
}
