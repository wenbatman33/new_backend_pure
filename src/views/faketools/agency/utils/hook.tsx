import dayjs from "dayjs";
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  bulkCreateAgency,
  bulkCreateMember,
  createDepositAndLog,
  recalcReportMemberAll,
  recalcReportAgencyDaily,
  recalcAgencyCommissionMonthly,
  getGameGroups
} from "@/api/faketools";
import type {
  BulkAgencyParams,
  BulkMemberParams,
  AgencyLogParams,
  ReportDateParams
} from "./types";

export function useAgency() {
  // 遊戲代理下拉
  const gameGroup = ref<Array<{ label: string; value: string }>>([]);

  // 卡片一：批次建立代理會員
  const bulkAgencyParams = reactive<BulkAgencyParams>({});
  const bulkAgencySuccess = ref(false);
  const agencyAccounts = ref<{
    list?: Array<{ agency_id: number; agency_account: string }>;
    regDate?: string;
    childAgencyCnt?: number;
    memberCnt?: number;
  }>({});
  const bulkAgencyLoading = ref(false);

  // 卡片二：批次建立代理直屬會員
  const bulkMemberParams = reactive<BulkMemberParams>({});
  const bulkMemberLoading = ref(false);

  // 卡片三：新增存款單與流水
  const agencyParams = reactive<AgencyLogParams>({
    date: dayjs().format("YYYY-MM-DD HH:mm")
  });
  const agencyLogSuccess = ref(false);
  const agencyLogFakeRes = ref<AgencyLogParams>({});
  const agencyLogLoading = ref(false);

  // 卡片四：更新代理報表
  const updateDate = reactive<ReportDateParams>({
    startTime: dayjs().format("YYYY-MM-DD"),
    endTime: dayjs().format("YYYY-MM-DD")
  });
  const reportLoading = ref(false);

  // 遊戲代理選擇：value 格式為 "id/name"
  function handleSelectChange(val: string) {
    if (!val) {
      agencyParams.gameListID = undefined;
      agencyParams.gameAgency = undefined;
      return;
    }
    const arr = val.split("/");
    agencyParams.gameListID = Number(arr[0]);
    agencyParams.gameAgency = arr[1];
  }

  // 卡片一：建立代理帳號
  async function bulkAgencyHandleOK() {
    if (
      bulkAgencyParams.startNumber == null ||
      bulkAgencyParams.endNumber == null
    ) {
      message($t("faketools.agencyNumberRequired"), { type: "error" });
      return;
    }
    bulkAgencyLoading.value = true;
    try {
      const { success, data } = await bulkCreateAgency(bulkAgencyParams);
      if (success) {
        agencyAccounts.value = {
          list: data?.list ?? [],
          regDate: bulkAgencyParams.regDate,
          childAgencyCnt: bulkAgencyParams.childAgencyCnt,
          memberCnt: bulkAgencyParams.memberCnt
        };
        bulkAgencySuccess.value = true;
        message($t("faketools.addSuccess"), { type: "success" });
      }
    } finally {
      bulkAgencyLoading.value = false;
    }
  }

  // 卡片二：建立代理直屬會員帳號
  async function bulkMemberHandleOK() {
    if (
      bulkMemberParams.startNumber == null ||
      bulkMemberParams.endNumber == null
    ) {
      message($t("faketools.agencyNumberRequired"), { type: "error" });
      return;
    }
    bulkMemberLoading.value = true;
    try {
      const { success } = await bulkCreateMember(bulkMemberParams);
      if (success) {
        message($t("faketools.addSuccess"), { type: "success" });
      }
    } finally {
      bulkMemberLoading.value = false;
    }
  }

  // 卡片三：新增存款單與流水
  async function agencyLogHandleOK() {
    const checkArray: Array<keyof AgencyLogParams> = [
      "agencyIDs",
      "memberCnt",
      "depositAmount",
      "gameAgency",
      "gameListID",
      "bettingAmount"
    ];
    const filled = checkArray.every(
      key => agencyParams[key] !== undefined && agencyParams[key] !== ""
    );
    if (!filled) {
      message($t("faketools.agencyLogFieldsRequired"), { type: "error" });
      return;
    }
    agencyLogLoading.value = true;
    try {
      const { success } = await createDepositAndLog(agencyParams);
      if (success) {
        agencyLogFakeRes.value = { ...agencyParams };
        agencyLogSuccess.value = true;
        message($t("faketools.addSuccess"), { type: "success" });
      }
    } finally {
      agencyLogLoading.value = false;
    }
  }

  // 卡片四：更新代理報表（依序重算三張報表）
  async function updateAgencyReport() {
    reportLoading.value = true;
    try {
      await recalcReportMemberAll(updateDate);
      await recalcReportAgencyDaily(updateDate);
      await recalcAgencyCommissionMonthly(updateDate);
      message($t("faketools.updateSuccess"), { type: "success" });
    } finally {
      reportLoading.value = false;
    }
  }

  // 匯入 Excel 後解析代理ID
  // TODO: 舊碼用 ImpExcel/aoaToSheetXlsx（@/components/Excel 未移植），暫以手動輸入代替，匯入/下載範例待補
  function importData(dataList: any[]) {
    agencyParams.agencyIDs = dataList?.[0]?.results
      ?.map((d: any) => d.agencyIDs)
      .join(",");
  }

  onMounted(async () => {
    const { success, data } = await getGameGroups();
    if (success) {
      gameGroup.value = (data?.list ?? []).map((game: any) => ({
        label: game.name,
        value: game.id + "/" + game.name
      }));
    }
  });

  return {
    gameGroup,
    bulkAgencyParams,
    bulkAgencySuccess,
    agencyAccounts,
    bulkAgencyLoading,
    bulkMemberParams,
    bulkMemberLoading,
    agencyParams,
    agencyLogSuccess,
    agencyLogFakeRes,
    agencyLogLoading,
    updateDate,
    reportLoading,
    handleSelectChange,
    bulkAgencyHandleOK,
    bulkMemberHandleOK,
    agencyLogHandleOK,
    updateAgencyReport,
    importData
  };
}
