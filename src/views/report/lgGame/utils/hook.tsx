import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import editForm from "../form.vue";
import {
  getReportLgGame,
  getReportToolRecalcReportMemberDailyGame
} from "@/api/report";
import type { FormItemProps } from "./types";

/** 投注来源映射 */
const bettingFromMap: Record<string, string> = {
  "1": $t("report.bettingFrom1"),
  "2": $t("report.stake")
};

export function useLgGame() {
  const searchForm = reactive({
    // 月份（送后端转 YYYY-MM-01），预设上个月
    date: dayjs().subtract(1, "month").format("YYYY-MM"),
    walletType: ""
  });
  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  /** 钱包类型选项：1 中心钱包游戏 / 2 现金券游戏 */
  const walletTypeOptions = [
    { label: $t("report.centerWalletGame"), value: 1 },
    { label: $t("report.cashCouponGame"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("report.group"), prop: "gameGroupName", minWidth: 120 },
    {
      label: $t("report.betAmount"),
      prop: "betAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betAmount)}</span>
    },
    {
      label: $t("report.stake"),
      prop: "groupBetAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.groupBetAmount)}</span>
      )
    },
    {
      label: $t("report.winOrLose"),
      prop: "winAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.winAmount)}</span>
    },
    { label: $t("report.feeRatio"), prop: "feeRatio", minWidth: 100 },
    {
      label: $t("report.bettingFrom"),
      prop: "bettingFrom",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <span>{bettingFromMap[String(row.bettingFrom)] ?? row.bettingFrom}</span>
      )
    },
    {
      label: $t("report.platformFee"),
      prop: "platformCharge",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.platformCharge)}</span>
      )
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getReportLgGame({
        // MonthPicker → 后端要 YYYY-MM-01
        date: searchForm.date
          ? dayjs(searchForm.date).format("YYYY-MM-01")
          : "",
        walletType: searchForm.walletType
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
    searchForm.date = dayjs().subtract(1, "month").format("YYYY-MM");
    searchForm.walletType = "";
    onSearch();
  }

  /** 手动重算 */
  function openRecalculateDialog() {
    addDialog({
      title: $t("report.manualUpdate"),
      props: {
        formInline: {
          startTime: dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      width: "450px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await getReportToolRecalcReportMemberDailyGame({
            startTime: curData.startTime,
            endTime: curData.endTime
          });
          if (success) {
            message($t("report.manualUpdate"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    walletTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openRecalculateDialog
  };
}
