import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { getAgencyContributionReport } from "@/api/agency";
import type { ContributionItem, SearchForm } from "./types";

export function useContribution() {
  const router = useRouter();

  const todayStart = dayjs().startOf("day").format("YYYY-MM-DD 00:00:00");
  const todayEnd = dayjs().endOf("day").format("YYYY-MM-DD 23:59:59");

  const searchForm = reactive<SearchForm>({
    agencyAccount: "",
    startTime: todayStart,
    endTime: todayEnd
  });

  // 主代理統計（pure-table 需要陣列，故包成單筆陣列）
  const mainList = ref<ContributionItem[]>([]);
  // 下層代理列表
  const childList = ref<ContributionItem[]>([]);
  // 上層代理帳號（供「返回上層」使用）
  const parentAgency = ref<string>("");
  const loading = ref(false);

  // 主表共用欄位
  const baseColumns: TableColumnList = [
    { label: $t("agency.agencyAccount"), prop: "agencyAccount" },
    { label: $t("agency.parentAgencyAccount"), prop: "parentAgencyAccount" },
    {
      label: $t("agency.childAgencyCount"),
      prop: "childAgencyCount",
      slot: "childAgencyPeople"
    },
    {
      label: $t("agency.belongMemberPeople"),
      prop: "belongMemberCount"
    },
    { label: $t("agency.betMember"), prop: "betMember" },
    { label: $t("agency.betCount"), prop: "betCount" },
    { label: $t("agency.betAmount"), prop: "betAmount" },
    { label: $t("agency.winAmount"), prop: "winAmount" },
    { label: $t("agency.returnAmount"), prop: "returnAmount" },
    { label: $t("agency.totalWinAmount"), prop: "totalWinAmount" },
    { label: $t("agency.createdAt"), prop: "createdAt" }
  ];

  // 主表（含查投注紀錄操作欄）
  const columns: TableColumnList = [
    ...baseColumns,
    {
      label: $t("agency.operate"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  // 下層代理表（含檢視下層操作欄）
  const childColumns: TableColumnList = [
    ...baseColumns,
    {
      label: $t("agency.operate"),
      fixed: "right",
      width: 140,
      slot: "childOperation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {};
      Object.keys(searchForm).forEach(key => {
        const v = (searchForm as any)[key];
        if (v !== "" && v !== undefined && v !== null) params[key] = v;
      });
      const { data } = await getAgencyContributionReport(params);
      const main = data?.mainList;
      mainList.value = main ? [main] : [];
      childList.value = data?.childList ?? [];
      parentAgency.value = main?.parentAgencyAccount ?? "";
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.agencyAccount = "";
    searchForm.startTime = todayStart;
    searchForm.endTime = todayEnd;
    onSearch();
  }

  // 點代理帳號 → 以該帳號重新查詢（下鑽）
  function handleAgencyAccount(agency: string) {
    searchForm.agencyAccount = agency;
    onSearch();
  }

  // 返回上層代理
  function searchParentAgency() {
    if (!parentAgency.value) return;
    searchForm.agencyAccount = parentAgency.value;
    onSearch();
  }

  // 開新分頁導向其他模組（投注紀錄 / 會員列表）
  function routerHandler(id: string, path: string, isAgency: boolean) {
    const routeLocation = router.resolve({
      path,
      query: isAgency ? { agencyAccount: id } : { memberAccount: id }
    });
    window.open(routeLocation.href, "_blank");
  }

  function handleBettingRecord(row: ContributionItem) {
    routerHandler(row.agencyAccount, "/gameManagement/bettingRecord", true);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    childColumns,
    mainList,
    childList,
    parentAgency,
    onSearch,
    resetForm,
    handleAgencyAccount,
    searchParentAgency,
    handleBettingRecord
  };
}
