import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import operationRecord from "../operationRecord.vue";
import {
  getLoginPCConfig,
  getLoginH5Config,
  updateLoginPCConfig,
  updateLoginH5Config,
  getOperationLog
} from "@/api/systemManage";
import type { LoginSwitchForm } from "./types";

// 預設扁平表單值
function defaultForm(): LoginSwitchForm {
  return {
    registerVerify: 0,
    loginVerify: 0,
    loginSms: false,
    ipTwoPhaseEnable: false,
    ipTwoPhaseWhiteListLimit: 0,
    deviceIDTwoPhaseEnable: false,
    deviceIDTwoPhaseWhiteListLimit: 0,
    loginErrorLimit: "",
    loginLockTime: "",
    loginLockLimit: "",
    loginSmsInterval: "",
    loginSmsLimit: "",
    loginSmsGapTime: "",
    smsTimeLimit: "",
    forceUpdatePassword: 2,
    phoneShow: false,
    phoneRequired: false,
    nameShow: false,
    nameRequired: false,
    emailShow: false,
    emailRequired: false,
    reconfirm: false
  };
}

// 後端巢狀結構 → 扁平表單
function transformConfig(data: any): LoginSwitchForm {
  const login = data?.login ?? {};
  const register = data?.register ?? {};
  return {
    registerVerify: register.verifyType,
    loginVerify: login.verifyType,
    loginSms: login.smsVerify,
    loginErrorLimit: login.errorLimit,
    loginLockTime: login.lockTime,
    loginLockLimit: login.lockLimit,
    loginSmsInterval: login.smsInterval,
    loginSmsLimit: login.smsLimit,
    loginSmsGapTime: login.smsGapTime,
    smsTimeLimit: login.smsTimeLimit,
    deviceIDTwoPhaseEnable: login.deviceIDTwoPhaseEnable,
    deviceIDTwoPhaseWhiteListLimit: login.deviceIDTwoPhaseWhiteListLimit,
    ipTwoPhaseEnable: login.ipTwoPhaseEnable,
    ipTwoPhaseWhiteListLimit: login.ipTwoPhaseWhiteListLimit,
    phoneShow: register.phoneShow,
    phoneRequired: register.phoneRequired,
    nameShow: register.nameShow,
    nameRequired: register.nameRequired,
    emailShow: register.emailShow,
    emailRequired: register.emailRequired,
    reconfirm: register.reconfirm,
    forceUpdatePassword: login.forceUpdatePassword
  };
}

// 扁平表單 → 後端巢狀結構
function unTransformConfig(data: LoginSwitchForm) {
  return {
    login: {
      verifyType: data.loginVerify,
      smsVerify: data.loginSms,
      verifyLine: data.loginVerify,
      errorLimit: data.loginErrorLimit,
      lockTime: data.loginLockTime,
      lockLimit: data.loginLockLimit,
      smsInterval: data.loginSmsInterval,
      smsLimit: data.loginSmsLimit,
      smsGapTime: data.loginSmsGapTime,
      smsTimeLimit: data.smsTimeLimit,
      deviceIDTwoPhaseEnable: data.deviceIDTwoPhaseEnable,
      deviceIDTwoPhaseWhiteListLimit: data.deviceIDTwoPhaseWhiteListLimit,
      ipTwoPhaseEnable: data.ipTwoPhaseEnable,
      ipTwoPhaseWhiteListLimit: data.ipTwoPhaseWhiteListLimit,
      forceUpdatePassword: data.forceUpdatePassword
    },
    register: {
      verifyType: data.registerVerify,
      verifyLine: data.registerVerify === 0 ? 0 : data.registerVerify,
      phoneShow: data.phoneShow,
      phoneRequired: data.phoneRequired,
      nameShow: data.nameShow,
      nameRequired: data.nameRequired,
      emailShow: data.emailShow,
      emailRequired: data.emailRequired,
      emailVerify: data.registerVerify === 4,
      reconfirm: data.reconfirm
    }
  };
}

export function useLoginSwitch() {
  const pcForm = reactive<LoginSwitchForm>(defaultForm());
  const h5Form = reactive<LoginSwitchForm>(defaultForm());
  const loading = ref(false);

  // 註冊驗證選項
  const registerOptions = [
    { label: $t("systemManage.noVerification"), value: 0 },
    { label: $t("systemManage.behavioralVerification"), value: 1 },
    { label: $t("systemManage.graphicalVerification"), value: 2 },
    { label: $t("systemManage.sMSVerification"), value: 3 },
    { label: $t("systemManage.emailVerification"), value: 6 }
  ];

  // 登入驗證選項
  const loginOptions = [
    { label: $t("systemManage.noVerification"), value: 0 },
    { label: $t("systemManage.behavioralVerification"), value: 1 },
    { label: $t("systemManage.graphicalVerification"), value: 2 },
    { label: $t("systemManage.intelligentBehaviorVerification"), value: 4 },
    { label: $t("systemManage.smartGraphicsVerification"), value: 5 }
  ];

  const showYesNoOptions = [
    { label: $t("systemManage.show"), value: true },
    { label: $t("systemManage.noShow"), value: false }
  ];
  const requiredOptions = [
    { label: $t("systemManage.required"), value: true },
    { label: $t("systemManage.optional"), value: false }
  ];
  const reconfirmOptions = [
    { label: $t("systemManage.enable"), value: true },
    { label: $t("systemManage.disable"), value: false }
  ];
  const forceUpdateOptions = [
    { label: $t("systemManage.noLimit"), value: 0 },
    { label: $t("systemManage.threeMonths"), value: 1 },
    { label: $t("systemManage.halfYear"), value: 2 },
    { label: $t("systemManage.oneYear"), value: 3 },
    { label: $t("systemManage.twoYears"), value: 4 }
  ];

  function assign(target: LoginSwitchForm, source: LoginSwitchForm) {
    Object.assign(target, source);
  }

  async function loadPC() {
    const { success, data } = await getLoginPCConfig();
    if (success) assign(pcForm, transformConfig(data));
  }
  async function loadH5() {
    const { success, data } = await getLoginH5Config();
    if (success) assign(h5Form, transformConfig(data));
  }

  async function handlePCSubmit() {
    const { success } = await updateLoginPCConfig(unTransformConfig(pcForm));
    if (success) {
      await loadPC();
      message($t("systemManage.updateSuccess"), { type: "success" });
    }
  }
  async function handleH5Submit() {
    const { success } = await updateLoginH5Config(unTransformConfig(h5Form));
    if (success) {
      await loadH5();
      message($t("systemManage.updateSuccess"), { type: "success" });
    }
  }

  // 操作紀錄對話框
  function openOperationRecord() {
    addDialog({
      title: $t("systemManage.handleRecord"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(operationRecord)
    });
  }

  onMounted(() => {
    loadPC();
    loadH5();
  });

  return {
    pcForm,
    h5Form,
    loading,
    registerOptions,
    loginOptions,
    showYesNoOptions,
    requiredOptions,
    reconfirmOptions,
    forceUpdateOptions,
    handlePCSubmit,
    handleH5Submit,
    openOperationRecord,
    hasAuth
  };
}

// 操作紀錄表格 hook（供 operationRecord.vue 使用）
export function useOperationLog() {
  const searchForm = reactive({
    startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  });
  const dataList = ref<any[]>([]);
  const loading = ref(false);

  const columns: TableColumnList = [
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

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getOperationLog({
        startTime: searchForm.startTime,
        endTime: searchForm.endTime
      });
      if (success) {
        dataList.value = data?.list ?? [];
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return { searchForm, dataList, loading, columns, onSearch };
}
