import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import reviewForm from "../review.vue";
import {
  getAdjustmentList,
  deleteAdjustmentApply,
  reviewAdjustmentApply
} from "@/api/member";
import type { AdjustmentItem, AdjustmentMember } from "./types";

// 申請狀態
export const statusOptions = [
  { label: $t("member.adjustmentStatus1"), value: 1 },
  { label: $t("member.adjustmentStatus5"), value: 2 },
  { label: $t("member.notReview"), value: 3 },
  { label: $t("member.noPass"), value: 4 }
];

// 錢包類型
export const typeOptions = [
  { label: $t("member.centerWallet"), value: 1 },
  { label: $t("member.addBonusWallet"), value: 2 },
  { label: $t("member.existingBonusWallet"), value: 3 }
];

// 調整原因
export const adjustReasonOptions = [
  { value: 1, label: $t("member.distributeRedEnvelops") },
  { value: 2, label: $t("member.deductIllegalProfits") },
  { value: 3, label: $t("member.innerMemberTestNumber") },
  { value: 4, label: $t("member.financeSpecialDeposit") },
  { value: 5, label: $t("member.marketingSpecialDeposit") },
  { value: 6, label: $t("member.transferSpecialDeposit") },
  { value: 7, label: $t("member.riskViolationBetDeduct") },
  { value: 8, label: $t("member.rickControlEedEnvelopsDistribute") },
  { value: 9, label: $t("member.gameWalletNegativeNumber") },
  { value: 10, label: $t("member.manufactorPayoutError") },
  { value: 11, label: $t("member.closeProduct") },
  { value: 12, label: $t("member.testMemberDeposit") },
  { value: 13, label: $t("member.offlineEventPayout") },
  { value: 14, label: $t("member.onlineEventDeposit") },
  { value: 15, label: $t("member.thirdPartyDepositError") }
];

const statusColor = ["", "green", "orange", "red", ""];

export function useAdjustment() {
  const searchForm = reactive({
    subject: "",
    status: 0,
    type: 0,
    start: "",
    end: ""
  });
  // 日期範圍（綁定 el-date-picker 的 daterange）
  const dateRange = ref<[Date, Date] | []>([]);
  const dataList = ref<AdjustmentItem[]>([]);
  const loading = ref(true);
  const reviewRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "adjustmentID", width: 80 },
    { label: $t("member.lmSection7"), prop: "subject", width: 150 },
    {
      label: $t("member.type"),
      prop: "type",
      cellRenderer: ({ row }) => (
        <span>
          {typeOptions.find(e => e.value === Number(row.type))?.label ?? ""}
        </span>
      )
    },
    {
      label: $t("member.adjustmentReason"),
      prop: "reason",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>
          {adjustReasonOptions.find(e => e.value === row.reason)?.label ?? ""}
        </span>
      )
    },
    { label: $t("member.explain"), prop: "description", width: 150 },
    {
      label: $t("member.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const found = statusOptions.find(e => e.value === Number(row.status));
        return found
          ? h(
              "span",
              { style: `color:${statusColor[found.value] || ""}` },
              found.label
            )
          : h("span", "");
      }
    },
    { label: $t("member.applyTime"), prop: "createdAt", width: 160 },
    { label: $t("member.lastUpdate"), prop: "updatedAt", width: 160 },
    { label: $t("member.totalApplyPeople"), prop: "applyCount", width: 90 },
    {
      label: $t("member.approvePeople"),
      prop: "passCount",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>
          {row.passCount}/{row.applyCount}
        </span>
      )
    },
    {
      label: $t("member.scoreUpAndDown"),
      prop: "adjustmentType",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>
          {row.adjustmentType === "1"
            ? $t("member.highScore")
            : $t("member.lowerScore")}
        </span>
      )
    },
    {
      label: $t("member.frontDeskInstructions"),
      prop: "feDescription",
      width: 140
    },
    { label: $t("member.operate"), fixed: "right", width: 140, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    const [start, end] = dateRange.value ?? [];
    try {
      const { data } = await getAdjustmentList({
        subject: searchForm.subject,
        status: searchForm.status,
        type: searchForm.type,
        start: start ? formatDate(start) : "",
        end: end ? formatDate(end) : "",
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function formatDate(d: Date) {
    const dt = new Date(d);
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${dt.getFullYear()}-${m}-${day}`;
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.subject = "";
    searchForm.status = 0;
    searchForm.type = 0;
    dateRange.value = [];
    pagination.currentPage = 1;
    onSearch();
  }

  // 審核 / 檢視申請單
  function openReviewDialog(row: AdjustmentItem, isReviewed = false) {
    // 名單預設值處理：審核態預設同意、清空原因
    const memberList: AdjustmentMember[] = (row.memberList ?? []).map(m => ({
      ...m,
      status: isReviewed ? m.status : 1,
      reason: isReviewed ? m.reason : ""
    }));
    addDialog({
      title: isReviewed
        ? $t("member.dataDetail")
        : $t("member.reviewApplicationForm"),
      props: {
        detail: row,
        memberList,
        isReviewed,
        typeOptions,
        adjustReasonOptions
      },
      width: "820px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: isReviewed,
      contentRenderer: () => h(reviewForm, { ref: reviewRef }),
      beforeSure: (done, { options }) => {
        if (isReviewed) {
          done();
          return;
        }
        const list = reviewRef.value.getMemberList() as AdjustmentMember[];
        // 不同意必填原因
        const invalid = list.some(
          m => Number(m.status) === 2 && (!m.reason || m.reason.trim() === "")
        );
        if (invalid) {
          message($t("member.noPassNeedReason"), { type: "error" });
          return;
        }
        reviewAdjustmentApply({
          adjustmentID: (options.props as any).detail.adjustmentID,
          list
        }).then(({ success }) => {
          if (success) {
            message($t("member.reviewSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: AdjustmentItem) {
    ElMessageBox.confirm($t("member.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteAdjustmentApply(row.adjustmentID);
        if (success) {
          message($t("member.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    statusOptions,
    typeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openReviewDialog,
    handleDelete
  };
}
