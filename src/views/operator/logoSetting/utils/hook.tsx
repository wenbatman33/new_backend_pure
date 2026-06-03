import { ref, reactive, computed, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { apiServerUrl, changeContentImagePath } from "@/utils/imgUrl";
import { getLogo, putLogo, publishLogo, fileLogoUpload } from "@/api/operator";
import type { LogoData, LogoField } from "./types";

// 上傳大小上限（MB）
const MAX_SIZE_MB = 3;
// 判斷檔案大小是否在限制內
function sizeCheck(size: number, limitMB: number) {
  return size / 1024 / 1024 <= limitMB;
}

export function useLogoSetting() {
  // LOGO 暫存資料
  const logo = reactive<{ data: LogoData }>({
    data: {
      logoWithTextHorizontal: undefined,
      logoWithPureBlack: undefined,
      logoWithLoadingText: undefined,
      logoWithBackground: undefined,
      logoWithTextVertical: undefined
    }
  });

  // 各欄位是否觸發「超過大小」警示，順序對應 fields
  const uploadSizeCheck = reactive<Record<keyof LogoData, boolean>>({
    logoWithTextHorizontal: false,
    logoWithPureBlack: false,
    logoWithLoadingText: false,
    logoWithBackground: false,
    logoWithTextVertical: false
  });

  const loading = ref(false);
  // 0 初始化 1 已編輯尚未發佈 2 已儲存
  const editStatus = ref(0);

  // 五個 LOGO 區塊定義
  const fields = computed<LogoField[]>(() => [
    {
      key: "logoWithTextHorizontal",
      title: $t("operator.logoSettingTitle1"),
      desc: $t("operator.logoSettingDesc1")
    },
    {
      key: "logoWithPureBlack",
      title: $t("operator.logoSettingTitle2"),
      desc: $t("operator.logoSettingDesc2")
    },
    {
      key: "logoWithLoadingText",
      title: $t("operator.logoSettingTitle3"),
      desc: $t("operator.logoSettingDesc3")
    },
    {
      key: "logoWithBackground",
      title: $t("operator.logoSettingTitle4"),
      desc: $t("operator.logoSettingDesc4")
    },
    {
      key: "logoWithTextVertical",
      title: $t("operator.logoSettingTitle5"),
      desc: $t("operator.logoSettingDesc5")
    }
  ]);

  // 大小限制提示文字
  const sizeCheckHelper = computed(() =>
    $t("operator.logoSettingSizeLimit").replace("{size}", String(MAX_SIZE_MB))
  );

  // 取得 LOGO 資料
  async function fetchLogo() {
    loading.value = true;
    try {
      const { success, data } = await getLogo();
      if (success && data) {
        logo.data = { ...logo.data, ...data };
      }
    } finally {
      loading.value = false;
    }
  }

  // el-upload 上傳前攔截：自行上傳、回填路徑、阻止預設上傳
  async function beforeUpload(file: File, key: keyof LogoData) {
    const ok = sizeCheck(file.size, MAX_SIZE_MB);
    uploadSizeCheck[key] = !ok;
    if (!ok) return false;

    editStatus.value = 1;
    const form = new FormData();
    form.append("type", "logo");
    form.append("file", file);
    const { success, data } = await fileLogoUpload(form);
    if (success && data?.url) {
      logo.data[key] = apiServerUrl(data.url);
    }
    return false; // 阻止 el-upload 自動上傳
  }

  // 儲存（暫存到後端）
  async function handleSave() {
    const keys = Object.keys(logo.data) as (keyof LogoData)[];
    const isEmpty = keys.every(k => logo.data[k] == undefined);
    if (isEmpty) {
      ElMessageBox.alert(
        $t("operator.logoSettingNoDataAlert"),
        $t("operator.logoSettingReCheck"),
        { type: "error" }
      );
      return;
    }

    // 將絕對路徑轉回相對存儲路徑
    logo.data.logoWithBackground = changeContentImagePath(
      logo.data.logoWithBackground
    );
    logo.data.logoWithLoadingText = changeContentImagePath(
      logo.data.logoWithLoadingText
    );
    logo.data.logoWithPureBlack = changeContentImagePath(
      logo.data.logoWithPureBlack
    );
    logo.data.logoWithTextHorizontal = changeContentImagePath(
      logo.data.logoWithTextHorizontal
    );

    const { success } = await putLogo(logo.data);
    if (success) {
      message($t("operator.logoSettingUpdateSuccess"), { type: "success" });
      editStatus.value = 2;
    }
  }

  // 取消：重新拉取後端資料還原
  function handleCancel() {
    ElMessageBox.confirm(
      $t("operator.logoSettingSaveAlert"),
      $t("operator.logoSettingNotSaveYet"),
      { type: "warning" }
    )
      .then(async () => {
        editStatus.value = 0;
        await fetchLogo();
      })
      .catch(() => {});
  }

  // 發佈到前台
  async function handlePublish() {
    const { success } = await publishLogo();
    if (success) {
      message($t("operator.logoSettingPublishSuccess"), { type: "success" });
    }
  }

  onMounted(() => {
    fetchLogo();
  });

  return {
    logo,
    loading,
    editStatus,
    fields,
    uploadSizeCheck,
    sizeCheckHelper,
    beforeUpload,
    handleSave,
    handleCancel,
    handlePublish
  };
}
