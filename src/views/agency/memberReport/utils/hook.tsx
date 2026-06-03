import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getMemberReport,
  getMemberReportTagGroup,
  MEMBER_REPORT_API
} from "@/api/agency";
import type {
  MemberReportRow,
  TagGroup,
  SearchFormProps
} from "./types";

export function useMemberReport() {
  // 平台類別下拉選項
  const platformTypeOptions = [
    { label: $t("agency.memberReportPlatformAll"), value: 0 },
    { label: "v1", value: 1 },
    { label: "v2", value: 2 }
  ];

  const searchForm = reactive<SearchFormProps>({
    agencyID: "",
    agencyAccount: "",
    startTime: dayjs().startOf("month").format("YYYY-MM-DD 00:00"),
    endTime: dayjs().format("YYYY-MM-DD 23:59"),
    platformType: 0
  });

  // 日期範圍（給 el-date-picker 雙向綁定，再回寫 startTime/endTime）
  const dateRange = ref<[Date, Date]>([
    dayjs().startOf("month").toDate(),
    dayjs().toDate()
  ]);

  const dataList = ref<MemberReportRow[]>([]);
  const loading = ref(false);
  // 標籤群組顏色對照
  const tagColor = ref<TagGroup[]>([]);
  // 合計資料
  const totalData = reactive<Record<string, any>>({});

  const pagination = reactive({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  // 漲跌色（綠正紅負）
  const renderColorAmount = (text: any) => {
    const color = Number(text) >= 0 ? "#00BB00" : "#F00";
    return <span style={{ color }}>{commaDecimalFormat(text, 2)}</span>;
  };

  const columns: TableColumnList = [
    {
      label: $t("agency.memberReportAccount"),
      prop: "memberAccount",
      cellRenderer: ({ row }) => {
        // platformType === 2 可點擊跳轉會員明細
        if (row.platformType === 2) {
          return (
            <a
              href="javascript:void(0)"
              onClick={() => handleAccount(row.memberID)}
            >
              {row.memberAccount}
            </a>
          );
        }
        return <span>{row.memberAccount}</span>;
      }
    },
    {
      label: $t("agency.memberReportPlatform"),
      prop: "platformType",
      width: 80,
      cellRenderer: ({ row }) => {
        if (row.platformType === 1) return <span>v1</span>;
        if (row.platformType === 2) return <span>v2</span>;
        return <span>{row.platformType === "-" ? "-" : ""}</span>;
      }
    },
    {
      label: $t("agency.memberReportSameDevice"),
      prop: "useSameDeviceId",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{row.useSameDeviceId === 1 ? $t("agency.yes") : $t("agency.no")}</span>
      )
    },
    {
      label: $t("agency.memberReportBetAmount"),
      prop: "betAmount",
      width: 120,
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betAmount, 2)}</span>
    },
    {
      label: $t("agency.memberReportTotalWin"),
      prop: "totalWinAmount",
      width: 120,
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderColorAmount(row.totalWinAmount)
    },
    {
      label: $t("agency.memberReportRecharge"),
      prop: "rechargeAmount",
      width: 120,
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.rechargeAmount, 2)}</span>
      )
    },
    {
      label: $t("agency.memberReportRechargeCount"),
      prop: "rechargeCount",
      width: 120
    },
    {
      label: $t("agency.memberReportWithdraw"),
      prop: "withdrawAmount",
      width: 120,
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.withdrawAmount, 2)}</span>
      )
    },
    {
      label: $t("agency.memberReportWithdrawDiff"),
      prop: "withdrawDepositDiff",
      width: 120,
      align: "right",
      cellRenderer: ({ row }) => renderColorAmount(row.withdrawDepositDiff)
    },
    {
      label: $t("agency.memberReportTransfer"),
      prop: "transferMember",
      width: 120,
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.transferMember, 2)}</span>
      )
    },
    {
      label: $t("agency.memberReportActiveStatus"),
      prop: "activeStatus",
      width: 120,
      cellRenderer: ({ row }) => {
        if (row.activeStatus === "-") return <span>-</span>;
        return (
          <span>
            {row.activeStatus === 1
              ? $t("agency.memberReportActive")
              : $t("agency.memberReportInactive")}
          </span>
        );
      }
    },
    {
      label: $t("agency.memberReportLastLogin"),
      prop: "lastLoginTime",
      width: 180
    },
    {
      label: $t("agency.memberReportRegTime"),
      prop: "regTime",
      width: 180
    },
    {
      label: $t("agency.memberReportTags"),
      prop: "tags",
      width: 350,
      cellRenderer: ({ row }) => {
        if (!Array.isArray(row.tags) || row.tags.length === 0) {
          return <span />;
        }
        return (
          <div>
            {row.tags.map(tag => {
              const group = tagColor.value.find(g => g.id === tag.tagGroupID);
              return (
                <el-tag
                  key={tag.id}
                  style={{ marginRight: "5px", marginBottom: "5px" }}
                  color={group?.color}
                  effect="dark"
                >
                  {tag.name}
                  <br />
                  {tag.updatedAt}
                </el-tag>
              );
            })}
          </div>
        );
      }
    }
  ];

  // 將日期範圍回寫到 searchForm
  function syncDateRange() {
    if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
      searchForm.startTime = dayjs(dateRange.value[0]).format("YYYY-MM-DD 00:00");
      searchForm.endTime = dayjs(dateRange.value[1]).format("YYYY-MM-DD 23:59");
    }
  }

  // 組查詢參數（過濾空值）
  function buildParams(extra: Record<string, any> = {}) {
    syncDateRange();
    const params: Record<string, any> = {
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      platformType: searchForm.platformType,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...extra
    };
    if (searchForm.agencyID) params.agencyID = searchForm.agencyID;
    if (searchForm.agencyAccount) params.agencyAccount = searchForm.agencyAccount;
    return params;
  }

  async function onSearch() {
    // 舊邏輯：未填代理ID/帳號時不查詢，回空
    if (!searchForm.agencyID && !searchForm.agencyAccount) {
      dataList.value = [];
      pagination.total = 0;
      Object.keys(totalData).forEach(k => delete totalData[k]);
      return;
    }
    loading.value = true;
    try {
      const { data } = await getMemberReport(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      // 合計列資料
      Object.assign(totalData, {
        memberAccount: $t("agency.memberReportTotal"),
        platformType: "-",
        activeStatus: "-",
        lastLoginTime: "-",
        regTime: "-",
        betAmount: data?.sumBetAmount,
        rechargeAmount: data?.sumRechargeAmount,
        totalWinAmount: data?.sumTotalWinAmount,
        transferMember: data?.sumTransferMember,
        withdrawAmount: data?.sumWithdrawAmount,
        withdrawDepositDiff: data?.sumWithdrawDepositDiff,
        rechargeCount: data?.sumRechargeCount
      });
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.agencyAccount = "";
    searchForm.platformType = 0;
    dateRange.value = [dayjs().startOf("month").toDate(), dayjs().toDate()];
    onSearch();
  }

  // 匯出（沿用舊 endpoint，帶 pageSize 5000）
  function handleExport() {
    exportExcel(
      MEMBER_REPORT_API,
      buildParams({ pageSize: 5000, page: 1 }),
      "agencyMemberReport.csv"
    );
  }

  function handleAccount(memberID) {
    window.open("/memberDetail/detail/" + memberID);
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(async () => {
    try {
      const { data } = await getMemberReportTagGroup();
      tagColor.value = data?.list ?? [];
    } catch {
      tagColor.value = [];
    }
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    platformTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    totalData,
    onSearch,
    resetForm,
    handleExport,
    handleSizeChange,
    handleCurrentChange
  };
}
