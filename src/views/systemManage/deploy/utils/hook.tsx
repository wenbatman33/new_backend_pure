import { h, ref, reactive } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  checkIsVD,
  checkIsNewServer,
  getVDSerial
} from "@/utils/country";
import {
  deploy,
  deployVD,
  deployVD88Luck18V2,
  deployVD88Agency,
  deployVDNuxt,
  deployVD88Nuxt,
  deployVDLuck18v2,
  deployTRNuxt,
  postJenkinsDeployvdbo,
  postJenkinsDeployvd88bo,
  getDeployLogs
} from "@/api/systemManage";
import operateLog from "../operateLog.vue";
import type { PlatformItem, DeployLogItem } from "./types";

export function useDeploy() {
  const vdSerial = getVDSerial();

  // 包網（前台站台）
  const vdPlatform = reactive<PlatformItem[]>([
    {
      id: "frontEndNuxt",
      name: vdSerial,
      displayName: $t("systemManage.deployFrontEndNuxt"),
      color: "#259d93"
    },
    {
      id: "backEnd",
      name: vdSerial,
      displayName: $t("systemManage.deployBackEnd"),
      color: "#6ca7d9"
    },
    {
      id: "VD801",
      name: vdSerial,
      displayName: $t("systemManage.deployBackend"),
      color: "#2596be"
    },
    {
      id: "agency",
      name: vdSerial,
      displayName: $t("systemManage.deployAgency"),
      color: "#6ca7d9"
    }
  ]);

  // 91 站台
  const platform91 = reactive<PlatformItem[]>([
    {
      id: "frontEndNuxt",
      name: vdSerial,
      displayName: $t("systemManage.deployFrontStation"),
      color: "#259d93"
    }
  ]);

  // v2 前台站台
  const v2platform = reactive<PlatformItem[]>([
    {
      id: 4,
      name: "PRO-agency",
      displayName: $t("systemManage.deployAgency"),
      color: "#7c8b07"
    }
  ]);

  // 是否顯示 91 區塊
  const show91 = checkIsVD() && getVDSerial() !== "";

  function confirmPublish(platform: PlatformItem, onOk: () => Promise<void>) {
    ElMessageBox.confirm(
      $t("systemManage.deployConfirmContent", { name: platform.displayName }),
      $t("systemManage.deployConfirmTitle"),
      {
        type: "warning",
        confirmButtonText: $t("systemManage.confirm"),
        cancelButtonText: $t("systemManage.cancel")
      }
    )
      .then(async () => {
        await onOk();
        message($t("systemManage.deploySuccess"), { type: "success" });
      })
      .catch(() => {});
  }

  // 91 站台發布
  function showConfirm91(platform: PlatformItem) {
    confirmPublish(platform, async () => {
      if (platform.id === "frontEndNuxt") await deployTRNuxt();
      else await postJenkinsDeployvd88bo();
    });
  }

  // 包網站台發布
  function showConfirmVD(platform: PlatformItem) {
    confirmPublish(platform, async () => {
      // 後端
      if (platform.id === "VD801") {
        if (checkIsNewServer() && checkIsVD()) await deployVD88Luck18V2();
        else await deployVDLuck18v2({ name: platform.name });
        return;
      }
      // 前台
      if (checkIsNewServer() && checkIsVD()) {
        if (platform.id === "frontEndNuxt") await deployVD88Nuxt();
        else if (platform.id === "agency") await deployVD88Agency();
        else if (platform.id === "backEnd") await postJenkinsDeployvd88bo();
      } else {
        if (platform.id === "frontEndNuxt")
          await deployVDNuxt({ name: platform.name });
        else if (platform.id === "agency") await deployVD({ name: platform.name });
        else if (platform.id === "backEnd")
          await postJenkinsDeployvdbo({ name: platform.name });
      }
    });
  }

  // v2 站台發布
  function showConfirm(platform: PlatformItem) {
    confirmPublish(platform, async () => {
      await deploy({ name: platform.name });
    });
  }

  // 操作記錄對話框
  function openOperateLog() {
    addDialog({
      title: $t("systemManage.deployOperateLog"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(operateLog)
    });
  }

  return {
    vdPlatform,
    platform91,
    v2platform,
    show91,
    showConfirm91,
    showConfirmVD,
    showConfirm,
    openOperateLog
  };
}

// 操作記錄表格邏輯
export function useOperateLog() {
  const searchForm = reactive({
    startDate: dayjs().subtract(14, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD")
  });
  const dataList = ref<DeployLogItem[]>([]);
  const loading = ref(false);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("systemManage.deployLogTime"), prop: "time", width: 180 },
    { label: $t("systemManage.deployLogAccount"), prop: "account", width: 180 },
    { label: $t("systemManage.deployLogPlatform"), prop: "platform" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getDeployLogs({
        startDate: searchForm.startDate,
        endDate: searchForm.endDate
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  return {
    searchForm,
    dataList,
    loading,
    columns,
    pagination,
    onSearch,
    resetForm
  };
}
