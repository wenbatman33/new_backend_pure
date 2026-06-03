import { ref, reactive, computed, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { getVDSerial } from "@/utils/country";
import {
  getWebprofile,
  putWebprofile,
  publishWebprofile
} from "@/api/operator";
import type { WebProfileData } from "./types";

export function useWebprofile() {
  const loading = ref(false);
  // 網站基本設定資料
  const profile = reactive<WebProfileData>({
    nuxtPublicName: "",
    nuxtPublicTitle: "",
    nuxtPublicDescription: "",
    nuxtPublicKeywords: ""
  });

  // 當前處於編輯態的欄位集合（name / title / description / keyword）
  const editStatus = ref<string[]>([]);
  // 關鍵字輸入暫存
  const tempKeyword = ref("");

  // 是否有任何欄位處於編輯態
  const isEditing = computed(() => editStatus.value.length > 0);

  // 關鍵字陣列（由逗號分隔字串轉出）
  const keywordList = computed(() =>
    profile.nuxtPublicKeywords
      ? profile.nuxtPublicKeywords.split(",").filter(Boolean)
      : []
  );

  // 載入設定
  async function fetchProfile() {
    loading.value = true;
    try {
      const { success, data } = await getWebprofile();
      if (success && data) {
        profile.nuxtPublicName = data.nuxtPublicName ?? "";
        profile.nuxtPublicTitle = data.nuxtPublicTitle ?? "";
        profile.nuxtPublicDescription = data.nuxtPublicDescription ?? "";
        profile.nuxtPublicKeywords = data.nuxtPublicKeywords ?? "";
      }
    } finally {
      loading.value = false;
    }
  }

  // 切換某欄位的編輯態
  function toggleEdit(field: string) {
    editStatus.value.includes(field)
      ? (editStatus.value = editStatus.value.filter(item => item !== field))
      : editStatus.value.push(field);
  }

  // 新增關鍵字
  function addKeyword() {
    if (!tempKeyword.value) return;
    const list = keywordList.value;
    list.push(tempKeyword.value);
    profile.nuxtPublicKeywords = list.join(",");
    tempKeyword.value = "";
  }

  // 刪除關鍵字
  function removeKeyword(item: string) {
    const list = keywordList.value;
    if (list.length <= 1) return;
    profile.nuxtPublicKeywords = list.filter(k => k !== item).join(",");
  }

  // 儲存（暫存）設定
  async function saveProfile() {
    // 關鍵字若尚未按 enter，自動加入
    if (tempKeyword.value) addKeyword();

    const isEmpty = (Object.keys(profile) as (keyof WebProfileData)[]).every(
      key => !profile[key]
    );
    if (isEmpty) {
      message($t("operator.noDataAlert"), { type: "error" });
      return;
    }

    try {
      const { success } = await putWebprofile({ ...profile });
      if (success) {
        editStatus.value = [];
        message($t("operator.updateSuccess"), { type: "success" });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // 取消編輯並還原資料
  function cancelEdit() {
    ElMessageBox.confirm($t("operator.saveAlert"), $t("operator.notSaveYet"), {
      type: "warning"
    })
      .then(async () => {
        editStatus.value = [];
        await fetchProfile();
      })
      .catch(() => {});
  }

  // 發佈設定
  async function publish() {
    try {
      const { success } = await publishWebprofile({ name: getVDSerial() });
      if (success) {
        message($t("operator.updateSuccess"), { type: "success" });
      }
    } catch (e) {
      console.log(e);
    }
  }

  onMounted(() => {
    fetchProfile();
  });

  return {
    loading,
    profile,
    editStatus,
    tempKeyword,
    isEditing,
    keywordList,
    toggleEdit,
    addKeyword,
    removeKeyword,
    saveProfile,
    cancelEdit,
    publish,
    fetchProfile
  };
}
