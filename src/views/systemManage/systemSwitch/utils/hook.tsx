import { reactive, ref, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getSystemConfig,
  updateSystemConfig,
  getAutoupdatelggame,
  updateAutoupdatelggame,
  getSystemOperationLog
} from "@/api/systemManage";
import type { SystemConfig, OperationLogItem } from "./types";

// 預設值
function defaultConfig(): SystemConfig {
  return {
    register: true,
    login: true,
    loginGame: true,
    deposit: true,
    depositNeedMobileVerify: false,
    depositNeedBankcardVerify: false,
    manualDepositDoubleReview: false,
    depositRemind: false,
    depositAllowChoosePayChannelService: false,
    depositShowPromotion: false,
    depositNeedWithdrawalPasswordSet: false,
    withNeedBankcardVerify: false,
    withdrawal: true,
    withdrawalRiskVerify: false,
    pcMaintain: false,
    h5Maintain: false,
    pcMaintainMessage: "",
    h5MaintainMessage: "",
    withdrawalNeedMobileVerify: false,
    withdrawalNeedLoginPassword: false,
    withdrawalShowPrompt: false,
    payInfoNeedSMSVerify: false,
    withdrawPassawordSetNeedSMSVerify: false,
    withdrawPassawordForgetNeedSMSVerify: false,
    withdrawalNeedWithdrawPassaword: false,
    withdrawalNeedWithdrawRealName: false,
    withdrawalNeedTurnoverInsufficient: false,
    withdrawalCheckHasDeposit: false,
    deleteZombieJob: false,
    canAddOtherBankcard: false,
    virtualWithdrawalLenient: true,
    withdrawalBankcardNeedVerify: false,
    withdrawalPassAmount: 0,
    withdrawalPasswordCheckTimes: 0,
    withdrawalCheckPromotionEnable: false,
    usdtSmoothEnable: false,
    phoneOwnerAndRealNameSame: false,
    autoupdatelggame: false,
    smsVerifySmooth: false,
    smsExpireMinutes: 0
  };
}

export function useSystemSwitch() {
  const state = reactive<SystemConfig>(defaultConfig());

  async function loadConfig() {
    const { data } = await getSystemConfig();
    if (data) Object.assign(state, data);
    const auto = await getAutoupdatelggame();
    state.autoupdatelggame = auto?.data?.autoStatus === 1;
  }

  // 切換開關 / 設定數值並送出
  async function setSwitch(value: boolean | number, target: keyof SystemConfig) {
    (state as any)[target] = value;
    if (target === "autoupdatelggame") {
      await updateAutoupdatelggame({ autoStatus: state.autoupdatelggame ? 1 : 0 });
    } else {
      // 關閉[存款時允許用戶選擇線路]時必須關閉[存款是否顯示優惠]
      if (!state.depositAllowChoosePayChannelService) {
        state.depositShowPromotion = false;
      }
      // 關閉[提款時檢查提款流水限制]時需開啟[自動審核檢查領取優惠]
      if (!state.withdrawalNeedTurnoverInsufficient) {
        state.withdrawalCheckPromotionEnable = true;
      }
      // 開啟[USDT暢通]時的連動
      if (state.usdtSmoothEnable) {
        state.withdrawalNeedWithdrawPassaword = true;
        state.withdrawPassawordSetNeedSMSVerify = false;
        state.withdrawPassawordForgetNeedSMSVerify = true;
      }
      const { ...stateForApi } = state;
      await updateSystemConfig(stateForApi);
    }
    message($t("systemManage.updateSuccess"), { type: "success" });
  }

  // ===== 操作紀錄對話框 =====
  const recordVisible = ref(false);
  const recordLoading = ref(false);
  const recordList = ref<OperationLogItem[]>([]);
  const recordSearch = reactive({
    startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  });

  const recordColumns: TableColumnList = [
    { label: $t("systemManage.time"), prop: "createdAt", width: 200 },
    { label: $t("systemManage.operator"), prop: "account", width: 150 },
    { label: $t("systemManage.project"), prop: "action", width: 150 },
    {
      label: $t("systemManage.content"),
      prop: "subData",
      cellRenderer: ({ row }) => (
        <div>
          {(row.subData ?? []).map((item: any, idx: number) => (
            <p key={idx}>
              {item.column}：{item.oldValue} → {item.newValue}
            </p>
          ))}
        </div>
      )
    }
  ];

  async function searchRecord() {
    recordLoading.value = true;
    try {
      const { data } = await getSystemOperationLog({
        startTime: recordSearch.startTime,
        endTime: recordSearch.endTime
      });
      recordList.value = data?.list ?? [];
    } finally {
      recordLoading.value = false;
    }
  }

  function openRecord() {
    recordVisible.value = true;
    searchRecord();
  }

  onMounted(() => {
    loadConfig();
  });

  return {
    state,
    setSwitch,
    recordVisible,
    recordLoading,
    recordList,
    recordSearch,
    recordColumns,
    searchRecord,
    openRecord
  };
}
