import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { findByValue } from "@/utils/options";
import { isArray } from "@/utils/is";
import { exportExcel } from "@/utils/report";
import {
  getAgencyList,
  getAgencyRankGroupOptions,
  type AgencyListItem
} from "@/api/agency";
import type { AgencySearchForm, ParentAgency } from "./types";

// 業務類型
const businessTypeOptions = [
  { label: $t("agency.agencyBusinessType1"), value: 1 },
  { label: $t("agency.agencyBusinessType2"), value: 2 }
];
// 淨利基準
const netProfitBaseOptions = [
  { label: $t("agency.winOrLose"), value: 1 },
  { label: $t("agency.depositAndWithdrawalReduce"), value: 2 },
  { label: $t("agency.turnover"), value: 3 }
];

export function useAgencyMain() {
  const router = useRouter();

  const searchForm = reactive<AgencySearchForm>({
    agencyID: "",
    agencyAccount: "",
    exactlyMatching: 2,
    rankGroupID: "",
    isCredit: 0,
    giveOffer: 0,
    reviewStartTime: "",
    reviewEndTime: "",
    activeStatus: 0,
    status: 0,
    ignoreZeroWallet: true,
    parentAgencyAccount: "",
    businessType: 0
  });

  const dataList = ref<AgencyListItem[]>([]);
  const parentAgencyData = ref<ParentAgency[]>([]);
  const rankGroupOptions = ref<Array<{ label: string; value: any }>>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是否授信
  const creditMap: Record<number, string> = {
    1: $t("agency.addAgencyModal13"),
    2: $t("agency.addAgencyModal14")
  };
  // 結算週期
  const billingCycleMap: Record<number, string> = {
    1: $t("agency.agencyMainTable11"),
    2: $t("agency.agencyMainTable12")
  };

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    {
      label: $t("agency.agencyMainTable1"),
      prop: "account",
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => openDetail(row.id)}>
          {row.account}
        </el-link>
      )
    },
    { label: $t("agency.cellphone"), prop: "phone" },
    {
      label: $t("agency.phDailyReportTable29"),
      prop: "businessType",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{findByValue(businessTypeOptions, row.businessType) || "-"}</span>
      )
    },
    {
      label: $t("agency.agencyMain16"),
      prop: "isCredit",
      width: 120,
      cellRenderer: ({ row }) => <span>{creditMap[row.isCredit] ?? ""}</span>
    },
    {
      label: $t("agency.agencyMainTable10"),
      prop: "billingCycle",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{billingCycleMap[row.billingCycle] ?? "--"}</span>
      )
    },
    { label: $t("agency.agencyMainTable2"), prop: "name" },
    { label: $t("agency.agencyMainTable13"), prop: "parentAgencyAccount" },
    {
      label: $t("agency.agencyMainTable14"),
      prop: "childAgencyCount",
      cellRenderer: ({ row }) =>
        Number(row.childAgencyCount) > 0 ? (
          <el-link
            type="primary"
            onClick={() => searchParentAgencyAccount(row.account)}
          >
            {row.childAgencyCount}
          </el-link>
        ) : (
          <span>{row.childAgencyCount}</span>
        )
    },
    {
      label: $t("agency.agencyMainTable5"),
      prop: "memberCount",
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => jumpToMemberList(row.id)}>
          {row.memberCount}
        </el-link>
      )
    },
    {
      label: $t("agency.agencyMainForm10"),
      prop: "giveOffer",
      cellRenderer: ({ row }) => (
        <span>
          {row.giveOffer == 1
            ? $t("agency.addAgencyModal13")
            : row.giveOffer == 2
              ? $t("agency.addAgencyModal14")
              : $t("agency.agencyMainForm9")}
        </span>
      )
    },
    {
      label: $t("agency.agencyMainTable15"),
      prop: "offerPercent",
      cellRenderer: ({ row }) => <span>{row.offerPercent}%</span>
    },
    {
      label: $t("agency.phDailyReportTable4"),
      prop: "rankGroupName",
      cellRenderer: ({ row }) => <span>{row.rankGroupName || "-"}</span>
    },
    {
      label: $t("agency.performanceReportTable66"),
      prop: "netProfitOption",
      cellRenderer: ({ row }) => {
        if (isArray(row.netProfitOption)) {
          const opts = row.netProfitOption.map((item: any) => {
            if (item.key === "total_bonus" && item.value === 1)
              return $t("agency.memberBonus");
            if (item.key === "platform_charge" && item.value === 1)
              return $t("agency.platformFee");
            if (item.key === "total_charge" && item.value === 1)
              return $t("agency.depositAndWithdrawalFees");
            return "";
          });
          return <span>{opts.filter((el: string) => el).join("/") || "-"}</span>;
        }
        return <span>-</span>;
      }
    },
    {
      label: $t("agency.netProfitBasis"),
      prop: "netProfitBase",
      cellRenderer: ({ row }) => (
        <span>{findByValue(netProfitBaseOptions, row.netProfitBase) || "-"}</span>
      )
    },
    {
      label: $t("agency.agencyMainTable6"),
      prop: "agencyWallet",
      sortable: true,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.agencyWallet, 2)}</span>
    },
    {
      label: $t("agency.agencyMainTable16"),
      prop: "agencyReturnProportion",
      cellRenderer: ({ row }) => <span>{row.agencyReturnProportion}‰</span>
    },
    {
      label: $t("agency.agencyMainTable7"),
      prop: "promotionLinks",
      cellRenderer: ({ row }) => (
        <span>
          {isArray(row.promotionLinks)
            ? row.promotionLinks.map((i: any) => i.promotionLink).join(" ")
            : ""}
        </span>
      )
    },
    {
      label: $t("agency.agencyMainTable17"),
      prop: "memberReturnProportion",
      cellRenderer: ({ row }) => <span>{row.memberReturnProportion}‰</span>
    },
    {
      label: $t("agency.childAgencyReportTable26"),
      prop: "activeStatus",
      cellRenderer: ({ row }) => (
        <span>
          {row.activeStatus === 1
            ? $t("agency.childAgencyReportTable28")
            : $t("agency.childAgencyReportTable29")}
        </span>
      )
    },
    { label: $t("agency.agencyMainTable18"), prop: "reviewTime" },
    { label: $t("agency.agencyMainTable8"), prop: "lastLoginTime" },
    { label: $t("agency.agencyMainTable9"), prop: "adminRemark" },
    { label: $t("agency.agencyMain7"), fixed: "right", width: 180, slot: "operation" }
  ];

  // 組查詢參數（沿用舊邏輯：ignoreZeroWallet 勾選送 2 否則 1，去除空值）
  function buildQuery() {
    const query: Record<string, any> = { ...searchForm };
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === "") delete query[key];
    });
    query.ignoreZeroWallet = searchForm.ignoreZeroWallet ? 2 : 1;
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyList(buildQuery());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      parentAgencyData.value = data?.parentAgencyData
        ? (Object.values(data.parentAgencyData) as ParentAgency[])
        : [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.exactlyMatching = 2;
    searchForm.ignoreZeroWallet = true;
    onSearch();
  }

  // 由麵包屑 / 下級數量點擊：以該帳號為上層代理重新查詢
  function searchParentAgencyAccount(account: string) {
    searchForm.parentAgencyAccount = account;
    searchForm.agencyAccount = "";
    onSearch();
  }

  // 麵包屑切回某層
  function setAgencyAccount(account: string) {
    searchForm.parentAgencyAccount = account;
    onSearch();
  }

  function openDetail(id: number) {
    const routeLocation = router.resolve({ path: `/agencyDetail/detail/${id}` });
    window.open(routeLocation.href, "_blank");
  }

  function jumpToMemberList(id: number) {
    router.push({ path: "/member/list", query: { agencyId: id } });
  }

  // 匯出
  function handleExport() {
    const query = buildQuery();
    if (!query.agencyID) delete query.agencyID;
    if (!query.rankGroupID) delete query.rankGroupID;
    exportExcel("/backend/agency/list/export", { ...query });
  }

  onMounted(async () => {
    const { data } = await getAgencyRankGroupOptions();
    rankGroupOptions.value = data?.list ?? [];
    onSearch();
  });

  return {
    searchForm,
    dataList,
    parentAgencyData,
    rankGroupOptions,
    businessTypeOptions,
    loading,
    columns,
    pagination,
    onSearch,
    resetForm,
    searchParentAgencyAccount,
    setAgencyAccount,
    openDetail,
    jumpToMemberList,
    handleExport
  };
}
