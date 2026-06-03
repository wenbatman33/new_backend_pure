import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getSiteFunctionSettings, putSiteFunctionSettings } from "@/api/agency";
import type { SiteFunctionForm } from "./types";

export function useSiteFunction() {
  const loading = ref(false);
  // 預設值，避免首次渲染前 undefined
  const formData = reactive<SiteFunctionForm>({
    phone_edit: false,
    phone_active: false,
    child_account: false,
    subagency_benefits: false,
    modify_password_mode: 1,
    modify_withdraw_password_mode: 1,
    create_new_member: false,
    create_new_member_black_list: ""
  });

  // 讀取設定（後端 1/2 → 布林）
  async function reload() {
    loading.value = true;
    try {
      const { success, data } = await getSiteFunctionSettings();
      if (success && data) {
        formData.phone_edit = data.phone_edit === 1;
        formData.phone_active = data.phone_active === 1;
        formData.child_account = data.child_account === 1;
        formData.subagency_benefits = data.subagency_benefits === 1;
        formData.create_new_member = data.create_new_member === 1;
        formData.create_new_member_black_list =
          data.create_new_member_black_list ?? "";
        formData.modify_password_mode = data.modify_password_mode;
        formData.modify_withdraw_password_mode =
          data.modify_withdraw_password_mode;
      }
    } finally {
      loading.value = false;
    }
  }

  // 送出設定（布林 → 後端 1/2）
  async function handleSubmit() {
    loading.value = true;
    const payload = {
      phone_edit: formData.phone_edit ? 1 : 2,
      phone_active: formData.phone_active ? 1 : 2,
      child_account: formData.child_account ? 1 : 2,
      subagency_benefits: formData.subagency_benefits ? 1 : 2,
      modify_password_mode: formData.modify_password_mode,
      modify_withdraw_password_mode: formData.modify_withdraw_password_mode,
      create_new_member: formData.create_new_member ? 1 : 2,
      create_new_member_black_list: formData.create_new_member_black_list
    };
    try {
      const { success } = await putSiteFunctionSettings(payload);
      if (success) {
        message($t("agency.updateSuccess"), { type: "success" });
        await reload();
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(reload);

  return {
    loading,
    formData,
    reload,
    handleSubmit
  };
}
