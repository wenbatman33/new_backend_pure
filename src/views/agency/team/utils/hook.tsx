import { ref, reactive } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getTeamAgency } from "@/api/agency";
import type { TeamAgencyColumn, TeamSearchForm } from "./types";

export function useTeam() {
  const searchForm = reactive<TeamSearchForm>({
    agencyID: "",
    agencyAccount: "",
    startDate: "",
    endDate: ""
  });

  const loading = ref(false);
  // 7 個時間區段的資料（today/yesterday/thisWeek/lastWeek/thisMonth/lastMonth/custom）
  const tableData = ref<TeamAgencyColumn[]>([]);
  const teamAgencyCount = ref(0);
  // 實際送出查詢時的參數（匯出沿用）
  const searchParams = ref<Record<string, any>>({});

  // 表頭（七個時間區段）
  const columns = [
    {
      title: $t("agency.teamColumn2"),
      key: "today",
      helpMsg: [$t("agency.teamHelpMessage1")]
    },
    { title: $t("agency.teamColumn3"), key: "yesterday", helpMsg: null },
    {
      title: $t("agency.teamColumn4"),
      key: "thisWeek",
      helpMsg: [$t("agency.teamHelpMessage1"), $t("agency.teamHelpMessage2")]
    },
    { title: $t("agency.teamColumn5"), key: "lastWeek", helpMsg: null },
    {
      title: $t("agency.teamColumn6"),
      key: "thisMonth",
      helpMsg: [$t("agency.teamHelpMessage1")]
    },
    { title: $t("agency.teamColumn7"), key: "lastMonth", helpMsg: null },
    { title: $t("agency.teamColumn8"), key: "custom", helpMsg: null }
  ];

  function buildParams() {
    const params: Record<string, any> = {
      startDate: searchForm.startDate,
      endDate: searchForm.endDate
    };
    if (searchForm.agencyID !== "") params.agencyID = searchForm.agencyID;
    if (searchForm.agencyAccount !== "")
      params.agencyAccount = searchForm.agencyAccount;
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams();
      searchParams.value = params;
      const { data } = await getTeamAgency(params);
      tableData.value = data?.list ?? [];
      teamAgencyCount.value = data?.teamAgencyCount ?? 0;
    } catch {
      tableData.value = [];
      teamAgencyCount.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.agencyAccount = "";
    searchForm.startDate = "";
    searchForm.endDate = "";
  }

  function handleExport() {
    exportExcel("/backend/report/teamAgency/export", searchParams.value);
  }

  // 取某時間區段某欄位數值並格式化
  function cell(index: number, field: keyof TeamAgencyColumn, decimal = 0) {
    const row = tableData.value[index];
    if (!row) return "-";
    return commaDecimalFormat(row[field] as number, decimal);
  }

  return {
    searchForm,
    loading,
    columns,
    tableData,
    teamAgencyCount,
    onSearch,
    resetForm,
    handleExport,
    cell
  };
}
