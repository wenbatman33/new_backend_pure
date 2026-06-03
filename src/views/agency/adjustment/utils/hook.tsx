import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import adjustForm from "../adjustForm.vue";
import reviewForm from "../reviewForm.vue";
import {
  getAgencyAdjustmentList,
  getAgencyAdjustmentDetail,
  createAgencyAdjustment,
  reviewAgencyAdjustment,
  type AdjustmentItem
} from "@/api/agency";
import type {
  AdjustFormItemProps,
  AdjustmentDetail,
  ReviewFormProps
} from "./types";

/** 異動類型：1特殊上分 2傭金派發 3會員上分 4特殊扣款 */
export function getAdjustTypeOptions() {
  return [
    { label: $t("agency.walletData1"), value: 1 },
    { label: $t("agency.walletData2"), value: 2 },
    { label: $t("agency.walletData3"), value: 3 },
    { label: $t("agency.walletData4"), value: 4 }
  ];
}

/** 狀態：0全部 1通過 2部份通過 3未審核 4不通過 */
export function getStatusOptions() {
  return [
    { label: $t("agency.all"), value: 0, color: "" },
    { label: $t("agency.pass"), value: 1, color: "#00EC00" },
    { label: $t("agency.littlePass"), value: 2, color: "#FF0000" },
    { label: $t("agency.notReview"), value: 3, color: "#FFD306" },
    { label: $t("agency.noPass"), value: 4, color: "#0000C6" }
  ];
}

export function useAgencyAdjustment() {
  const typeOptions = getAdjustTypeOptions();
  const statusOptions = getStatusOptions();

  const searchForm = reactive({
    type: 0,
    status: 0,
    // 預設今日區間
    applyStartTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm"),
    applyEndTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm")
  });
  // 綁定 el-date-picker 的範圍值
  const dateRange = ref<[string, string]>([
    searchForm.applyStartTime,
    searchForm.applyEndTime
  ]);

  const dataList = ref<AdjustmentItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const typeMap: Record<number, string> = {
    1: $t("agency.walletData1"),
    2: $t("agency.walletData2"),
    3: $t("agency.walletData3"),
    4: $t("agency.walletData4")
  };

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("agency.name"), prop: "subject", minWidth: 120 },
    {
      label: $t("agency.transactionType"),
      prop: "type",
      minWidth: 140,
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    {
      label: $t("agency.status"),
      prop: "status",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const target =
          statusOptions.find(item => item.value === row.status) ??
          statusOptions[3];
        return <span style={{ color: target.color }}>{target.label}</span>;
      }
    },
    { label: $t("agency.applicationTime"), prop: "applyDate", minWidth: 170 },
    { label: $t("agency.lastUpdatedTime"), prop: "reviewDate", minWidth: 170 },
    { label: $t("agency.remark"), prop: "desc", minWidth: 200 },
    {
      label: $t("agency.totalApplyPeople"),
      prop: "applyCount",
      minWidth: 120
    },
    {
      label: $t("agency.approvedPeople"),
      prop: "auditCount",
      minWidth: 120
    },
    { label: $t("agency.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyAdjustmentList({
        type: searchForm.type,
        status: searchForm.status,
        applyStartTime: searchForm.applyStartTime,
        applyEndTime: searchForm.applyEndTime,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 日期區間變更
  function onDateChange(val: [string, string] | null) {
    if (val && val.length === 2) {
      searchForm.applyStartTime = val[0];
      searchForm.applyEndTime = val[1];
    } else {
      searchForm.applyStartTime = "";
      searchForm.applyEndTime = "";
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.type = 0;
    searchForm.status = 0;
    searchForm.applyStartTime = dayjs().startOf("day").format("YYYY-MM-DD HH:mm");
    searchForm.applyEndTime = dayjs().endOf("day").format("YYYY-MM-DD HH:mm");
    dateRange.value = [searchForm.applyStartTime, searchForm.applyEndTime];
    onSearch();
  }

  // 新增上下分申請單
  function openAdjustDialog() {
    addDialog({
      title: $t("agency.wallet1"),
      props: {
        formInline: {
          subject: "",
          type: 0,
          turnoverTimes: "",
          desc: "",
          targetList: []
        }
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(adjustForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as AdjustFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (!curData.targetList || curData.targetList.length === 0) {
            message($t("agency.needOnePeople"), { type: "error" });
            return;
          }
          const { success } = await createAgencyAdjustment({
            subject: curData.subject,
            type: curData.type,
            turnoverTimes: Number(curData.turnoverTimes) || 0,
            desc: curData.desc,
            targetList: curData.targetList.map(item => ({
              agencyAccount: item.agencyAccount,
              amount: Number(item.amount) || 0
            }))
          });
          if (success) {
            message($t("agency.wallet1"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 審核 / 詳情
  async function openReviewDialog(row: AdjustmentItem) {
    const { data } = await getAgencyAdjustmentDetail({ id: row.id });
    const detail = (data ?? {}) as AdjustmentDetail;
    const isReviewed = !!detail.reviewAdminAccount;
    const props: ReviewFormProps = {
      detail,
      isReviewed
    };
    addDialog({
      title: isReviewed
        ? $t("agency.detailData")
        : $t("agency.reviewApplicationForm"),
      props,
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: isReviewed,
      contentRenderer: () => h(reviewForm, { ref: formRef }),
      beforeSure: async done => {
        if (isReviewed) {
          done();
          return;
        }
        const targetList = (detail.list ?? []).map(item => ({
          operationID: item.id,
          permitStatus: item.status,
          // 不通過必填原因
          reason: item.remark ?? ""
        }));
        // 不通過(2) 必填原因
        const invalid = targetList.some(
          item => item.permitStatus === 2 && !item.reason
        );
        if (invalid) {
          message($t("agency.noPassNeedReason"), { type: "error" });
          return;
        }
        const { success } = await reviewAgencyAdjustment({
          batchID: detail.id,
          targetList
        });
        if (success) {
          message($t("agency.review"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    typeOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onDateChange,
    resetForm,
    openAdjustDialog,
    openReviewDialog
  };
}
