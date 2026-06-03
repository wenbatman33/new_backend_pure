import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getJackpotSettings, putJackpotSettings } from "@/api/operator";
import type { JackpotSettingProps } from "./types";

export function useJackpot() {
  const loading = ref(false);
  const formRef = ref();

  // 假 Jackpot 設定（單一物件）
  const formData = reactive<JackpotSettingProps>({
    min: "",
    max: "",
    cycle: "",
    min_cycle: "",
    max_cycle: ""
  });

  // 取得設定
  async function getData() {
    loading.value = true;
    try {
      const { success, data } = await getJackpotSettings();
      if (success && data) {
        formData.min = data.min ?? "";
        formData.max = data.max ?? "";
        formData.cycle = data.cycle ?? "";
        formData.min_cycle = data.min_cycle ?? "";
        formData.max_cycle = data.max_cycle ?? "";
      }
    } finally {
      loading.value = false;
    }
  }

  // 儲存設定
  function handleSubmit() {
    const FormRef = formRef.value;
    if (!FormRef) return;
    FormRef.validate(async (valid: boolean) => {
      if (!valid) return;
      loading.value = true;
      try {
        const { success } = await putJackpotSettings({ ...formData });
        if (success) {
          message($t("operator.updateSuccess"), { type: "success" });
          await getData();
        }
      } finally {
        loading.value = false;
      }
    });
  }

  onMounted(() => {
    getData();
  });

  return {
    loading,
    formRef,
    formData,
    getData,
    handleSubmit
  };
}
