import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { apiServerUrlWithoutFile } from "@/utils/imgUrl";
import {
  getRegionRestrictionConfig,
  putRegionRestrictionConfig,
  deployRegionRestrictionConfig,
  uploadRegionRestrictionLogo
} from "@/api/operator";
import type { RegionRestrictionConfig } from "./types";

export function useRegionRestrictedPage() {
  const formRef = ref();
  const loading = ref(false);
  /** Logo 預覽用（base64 或伺服器路徑） */
  const logoFile = ref("");

  const form = reactive<RegionRestrictionConfig>({
    title: "",
    logo: "",
    url: "",
    buttonContent: "",
    content: ""
  });

  /** 讀取設定 */
  async function getConfig() {
    loading.value = true;
    try {
      const { success, data } = await getRegionRestrictionConfig();
      if (success && data) {
        form.title = data.title ?? "";
        form.logo = data.logo ?? "";
        form.url = data.url ?? "";
        form.buttonContent = data.buttonContent ?? "";
        form.content = data.content ?? "";
        logoFile.value = data.logo ? apiServerUrlWithoutFile(data.logo) : "";
      }
    } finally {
      loading.value = false;
    }
  }

  /** Logo 上傳：el-upload 自訂 http-request */
  async function handleUploadLogo(option: any) {
    // 先本地預覽
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onload = e => (logoFile.value = (e.target?.result as string) || "");

    const formData = new FormData();
    formData.append("type", "banner");
    formData.append("file", option.file);
    try {
      const { success, data } = await uploadRegionRestrictionLogo(formData);
      if (success && data) {
        form.logo = data.url;
        logoFile.value = apiServerUrlWithoutFile(data.url);
        message($t("operator.uploadSuccess"), { type: "success" });
      }
    } catch (_) {
      message($t("operator.uploadError"), { type: "error" });
    }
  }

  /** 儲存設定 */
  function handleSubmit() {
    if (!formRef.value) return;
    formRef.value.validate(async (valid: boolean) => {
      if (!valid) return;
      const { success } = await putRegionRestrictionConfig({ ...form });
      if (success) {
        message($t("operator.uploadSuccess"), { type: "success" });
      }
    });
  }

  /** 更新發布 */
  async function handleRelease() {
    const { success } = await deployRegionRestrictionConfig();
    if (success) {
      message($t("operator.postedSuccessfully"), { type: "success" });
    }
  }

  onMounted(() => {
    getConfig();
  });

  return {
    formRef,
    loading,
    form,
    logoFile,
    getConfig,
    handleUploadLogo,
    handleSubmit,
    handleRelease
  };
}
