import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { checkWhichCountry } from "@/utils/country";
import dayjs from "dayjs";
import editForm from "../form.vue";
import detailView from "../detail.vue";
import {
  getAgencyApplicationList,
  getAgencyApplicationDetail,
  putAgencyApplicationReview,
  getAgencyRankSettingOption,
  type AgencyApplicationItem
} from "@/api/agency";
import type { AuditFormItemProps } from "./types";
import { ElTag } from "element-plus";

// 業務類型對應
const businessTypeMap: Record<number, string> = {
  0: $t("agency.phDailyReportTable30"),
  1: $t("agency.agencyBusinessType1"),
  2: $t("agency.agencyBusinessType2")
};

// 審核狀態對應文字
const statusMap: Record<number, string> = {
  1: $t("agency.agencyApplication3"),
  2: $t("agency.agencyApplication4"),
  3: $t("agency.agencyApplication5")
};

// 審核狀態對應 el-tag 類型
const statusTagType: Record<number, "warning" | "success" | "danger"> = {
  1: "warning",
  2: "success",
  3: "danger"
};

export function useAgencyApplication() {
  const country = checkWhichCountry();

  const searchForm = reactive({
    id: "",
    agencyAccount: "",
    memberAccount: "",
    exactlyMatching: false,
    auditStatus: 0
  });
  // 申請時間 / 審核時間（日期區間）
  const applyTimeRange = ref<[string, string] | null>(null);
  const reviewTimeRange = ref<[string, string] | null>(null);

  const dataList = ref<AgencyApplicationItem[]>([]);
  const loading = ref(true);
  const auditFormRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 審核狀態下拉選項
  const auditStatusOptions = [
    { label: $t("agency.agencyMainForm9"), value: 0 },
    { label: $t("agency.agencyApplication3"), value: 1 },
    { label: $t("agency.agencyApplication4"), value: 2 },
    { label: $t("agency.agencyApplication5"), value: 3 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    {
      label: $t("agency.phDailyReportTable29"),
      prop: "businessType",
      cellRenderer: ({ row }) => (
        <span>{businessTypeMap[row.businessType] ?? "--"}</span>
      )
    },
    { label: $t("agency.agencyApplicationTable1"), prop: "memberID" },
    { label: $t("agency.agencyApplicationTable2"), prop: "agencyAccount" },
    { label: $t("agency.agencyApplicationTable3"), prop: "name" },
    { label: $t("agency.agencyApplicationTable4"), prop: "phone" },
    // VN 顯示 telegram，其餘顯示 email
    country === "VN"
      ? { label: "Telegram", prop: "telegram", width: 200 }
      : { label: $t("agency.agencyApplicationTable5"), prop: "email", width: 220 },
    { label: $t("agency.agencyApplicationTable6"), prop: "createdAt", width: 160 },
    { label: $t("agency.agencyApplicationTable7"), prop: "reviewTime", width: 160 },
    { label: $t("agency.agencyApplicationTable8"), prop: "adminAccount" },
    {
      label: $t("agency.agencyApplicationTable9"),
      prop: "auditStatus",
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          { type: statusTagType[row.auditStatus] ?? "info" },
          { default: () => statusMap[row.auditStatus] ?? row.auditStatus }
        )
    },
    {
      label: $t("agency.withdrawalTable3"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  function buildParams() {
    const params: Record<string, any> = {
      id: searchForm.id || undefined,
      agencyAccount: searchForm.agencyAccount || undefined,
      memberAccount: searchForm.memberAccount || undefined,
      exactlyMatching: searchForm.exactlyMatching,
      auditStatus: searchForm.auditStatus,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    if (applyTimeRange.value?.length === 2) {
      params.applicationStartTime = `${applyTimeRange.value[0]} 00:00`;
      params.applicationEndTime = `${applyTimeRange.value[1]} 23:59`;
    }
    if (reviewTimeRange.value?.length === 2) {
      params.reviewStartTime = `${reviewTimeRange.value[0]} 00:00`;
      params.reviewEndTime = `${reviewTimeRange.value[1]} 23:59`;
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyApplicationList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.exactlyMatching = false;
    searchForm.auditStatus = 0;
    applyTimeRange.value = null;
    reviewTimeRange.value = null;
    pagination.currentPage = 1;
    onSearch();
  }

  // 查看明細（唯讀）
  async function openDetail(row: AgencyApplicationItem) {
    const { data } = await getAgencyApplicationDetail({ id: row.id });
    addDialog({
      title: $t("agency.agencyApplicationDetailModal1"),
      width: "60%",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(detailView, { detail: { ...row, ...(data ?? {}) } })
    });
  }

  // 審核（僅 auditStatus===1 時可用）
  async function openAudit(row: AgencyApplicationItem) {
    const { data: detail } = await getAgencyApplicationDetail({ id: row.id });
    const { data: rankData } = await getAgencyRankSettingOption();
    const rankGroupOptions = (rankData?.list ?? []).map((item: any) => ({
      label: `${item.value} / ${item.label}`,
      value: item.value
    }));

    addDialog({
      title: $t("agency.agencyApplicationAuditModal1"),
      width: "60%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          calculative: true,
          remark: "",
          agencyAccount: detail?.agencyAccount ?? row.agencyAccount ?? "",
          isFirstLayerAgency: 1,
          rankGroupID: "",
          offerPercent: 0,
          businessType: detail?.businessType ?? 1,
          netProfitBase: 1,
          totalBonus: true,
          totalCharge: true,
          platformCharge: true,
          billingCycle: country === "CN" ? "1" : "2"
        },
        detail: { ...row, ...(detail ?? {}) },
        rankGroupOptions
      },
      contentRenderer: () => h(editForm, { ref: auditFormRef }),
      // 自訂底部：拒絕 / 通過
      footerButtons: [
        {
          label: $t("agency.agencyApplicationAuditModal3"),
          type: "danger",
          btnClick: ({ dialog: { options, index } }) =>
            submitReview(row.id, 3, options, index)
        },
        {
          label: $t("agency.agencyApplicationAuditModal4"),
          type: "success",
          btnClick: ({ dialog: { options, index } }) =>
            submitReview(row.id, 2, options, index)
        }
      ]
    });
  }

  function submitReview(id: number, auditStatus: number, options: any, index: number) {
    const FormRef = auditFormRef.value.getRef();
    const cur = options.props.formInline as AuditFormItemProps;
    FormRef.validate(async (valid: boolean) => {
      if (!valid) return;
      const param: Record<string, any> = {
        id,
        auditStatus,
        remark: cur.remark,
        calculative: cur.calculative,
        rankGroupID: cur.rankGroupID || undefined,
        totalCharge: cur.totalCharge ? 1 : 2,
        totalBonus: cur.totalBonus ? 1 : 2,
        platformCharge: cur.platformCharge ? 1 : 2,
        billingCycle: cur.billingCycle,
        isFirstLayerAgency: cur.isFirstLayerAgency,
        netProfitBase: cur.netProfitBase,
        offerPercent: cur.businessType === 2 ? cur.offerPercent : undefined,
        businessType: cur.businessType,
        agencyAccount: cur.agencyAccount
      };
      const { success } = await putAgencyApplicationReview(param);
      if (success) {
        message($t("agency.agencyApplicationAuditModal10"), { type: "success" });
        // 關閉對話框
        const { closeDialog } = await import("@/components/ReDialog");
        closeDialog(options, index);
        onSearch();
      } else {
        message($t("agency.agencyApplicationAuditModal9"), { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    applyTimeRange,
    reviewTimeRange,
    auditStatusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDetail,
    openAudit,
    handleSizeChange,
    handleCurrentChange,
    dayjs
  };
}
