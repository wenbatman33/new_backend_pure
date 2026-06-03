import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag } from "element-plus";
import detailForm from "../detail.vue";
import auditForm from "../audit.vue";
import {
  getAgencyChildList,
  getAgencyChildDetail,
  putAgencyChildPermit,
  putAgencyChildDeny,
  putAgencyBatchReview
} from "@/api/agency";
import type { ChildApplicationItem, ChildApplicationDetail } from "./types";

// 审核状态对应文案
const statusMap: Record<number, string> = {
  1: $t("agency.statusPending"),
  2: $t("agency.statusApproved"),
  3: $t("agency.statusRejected")
};
// 审核状态对应颜色
const statusColorMap: Record<number, string> = {
  1: "warning",
  2: "success",
  3: "danger"
};

export function useChildApplication() {
  const searchForm = reactive({
    agencyID: "",
    childAgencyID: "",
    agencyAccount: "",
    childAgencyAccount: "",
    exactlyMatching: 2,
    auditStatus: 0,
    // 申请时间预设当天起迄
    applyTimeRange: [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ] as [string, string],
    reviewTimeRange: [] as string[]
  });

  const dataList = ref<ChildApplicationItem[]>([]);
  const loading = ref(true);
  // 多选勾选的 id（仅待审核可勾）
  const selectedIds = ref<(number | string)[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("agency.statusAll"), value: 0 },
    { label: $t("agency.statusPending"), value: 1 },
    { label: $t("agency.statusApproved"), value: 2 },
    { label: $t("agency.statusRejected"), value: 3 }
  ];

  const matchOptions = [
    { label: $t("agency.exactMatch"), value: 1 },
    { label: $t("agency.fuzzyMatch"), value: 2 }
  ];

  const columns: TableColumnList = [
    { type: "selection", width: 55, selectable: row => Number(row.auditStatus) === 1 },
    { label: $t("agency.agencyID"), prop: "agencyID" },
    { label: $t("agency.agencyAccount"), prop: "agencyAccount" },
    { label: $t("agency.childAgencyID"), prop: "childAgencyID" },
    { label: $t("agency.childAgencyAccount"), prop: "childAgencyAccount" },
    { label: $t("agency.applyTime"), prop: "applyTime", minWidth: 160 },
    { label: $t("agency.reviewTime"), prop: "reviewTime", minWidth: 160 },
    {
      label: $t("agency.auditStatus"),
      prop: "auditStatus",
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          { type: (statusColorMap[row.auditStatus] ?? "info") as any },
          () => statusMap[row.auditStatus] ?? row.auditStatus
        )
    },
    { label: $t("agency.adminAccount"), prop: "adminAccount" },
    { label: $t("agency.action"), fixed: "right", width: 180, slot: "operation" }
  ];

  // 把 undefined / 空字串过滤掉
  function buildParams() {
    const params: Record<string, any> = {
      agencyID: searchForm.agencyID,
      childAgencyID: searchForm.childAgencyID,
      agencyAccount: searchForm.agencyAccount,
      childAgencyAccount: searchForm.childAgencyAccount,
      exactlyMatching: searchForm.exactlyMatching,
      auditStatus: searchForm.auditStatus
    };
    if (searchForm.applyTimeRange?.length === 2) {
      params.applyStartTime = searchForm.applyTimeRange[0];
      params.applyEndTime = searchForm.applyTimeRange[1];
    }
    if (searchForm.reviewTimeRange?.length === 2) {
      params.reviewStartTime = searchForm.reviewTimeRange[0];
      params.reviewEndTime = searchForm.reviewTimeRange[1];
    }
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === "") {
        delete params[key];
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    selectedIds.value = [];
    try {
      const { data } = await getAgencyChildList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.exactlyMatching = 2;
    searchForm.auditStatus = 0;
    searchForm.applyTimeRange = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ];
    searchForm.reviewTimeRange = [];
    onSearch();
  }

  // 表格多选变更
  function handleSelectionChange(rows: ChildApplicationItem[]) {
    selectedIds.value = rows.map(r => r.id);
  }

  // 批次审核：reviewType 1 同意 2 拒绝
  function handleBatchReview(reviewType: 1 | 2) {
    if (selectedIds.value.length === 0) {
      message($t("agency.pleaseSelectRow"), { type: "warning" });
      return;
    }
    const title =
      reviewType === 1
        ? $t("agency.confirmBatchPass")
        : $t("agency.confirmBatchReject");
    ElMessageBox.confirm(title, "", { type: "warning" })
      .then(async () => {
        const { success } = await putAgencyBatchReview({
          reviewIDs: selectedIds.value.join(","), // 申请单ID，非代理ID
          reviewType
        });
        if (success) {
          message($t("agency.operationSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 查看详情
  async function openDetail(row: ChildApplicationItem) {
    const { data } = await getAgencyChildDetail({ id: row.id });
    const detail = (data ?? {}) as ChildApplicationDetail;
    addDialog({
      title: $t("agency.childApplicationDetailTitle"),
      props: { detail },
      width: "60%",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(detailForm, { detail })
    });
  }

  // 审核（待审核才会进来）
  async function openAudit(row: ChildApplicationItem) {
    const { data } = await getAgencyChildDetail({ id: row.id });
    const detail = (data ?? {}) as ChildApplicationDetail;
    const formRef = ref();
    const formInline = reactive({
      id: row.id,
      remark: detail.remark ?? "",
      detail
    });
    addDialog({
      title: $t("agency.childApplicationAuditTitle"),
      props: { formInline },
      width: "60%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(auditForm, { ref: formRef, formInline }),
      // 自订页脚：拒绝 / 同意
      footerButtons: [
        {
          label: $t("agency.reject"),
          type: "danger",
          btnClick: ({ dialog: { options, index } }) =>
            doAudit("deny", formInline, options, index)
        },
        {
          label: $t("agency.approve"),
          type: "success",
          btnClick: ({ dialog: { options, index } }) =>
            doAudit("permit", formInline, options, index)
        }
      ] as any
    });
  }

  async function doAudit(
    action: "permit" | "deny",
    formInline: { id: number | string; remark: string },
    _options: any,
    index: number
  ) {
    const param = { id: formInline.id, remark: formInline.remark };
    const fn = action === "permit" ? putAgencyChildPermit : putAgencyChildDeny;
    const { success } = await fn(param);
    if (success) {
      message($t("agency.auditSuccess"), { type: "success" });
      // 关闭当前对话框
      closeDialog(_options, index);
      onSearch();
    } else {
      message($t("agency.auditFail"), { type: "error" });
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    matchOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSelectionChange,
    handleBatchReview,
    openDetail,
    openAudit
  };
}
