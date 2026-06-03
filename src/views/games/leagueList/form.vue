<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { getImagPath } from "@/utils/imgUrl";
import { uploadLeagueLogo } from "@/api/games";
import type { FormProps } from "./utils/types";
import UploadIcon from "~icons/ep/upload";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    leagueID: 0,
    leagueName: "",
    sportName: "",
    logoImage: ""
  })
});

const imagePath = getImagPath();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 預覽圖片（上傳前用本地 base64，上傳後用伺服器 url）
const previewUrl = ref(
  props.formInline.logoImage ? imagePath + props.formInline.logoImage : ""
);
const uploading = ref(false);

// el-upload 自訂上傳：先本地預覽，再上傳取得 url 寫回表單
async function customUpload(options: { file: File }) {
  const file = options.file;
  // 本地預覽
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = e => (previewUrl.value = (e.target?.result as string) || "");
  // 上傳
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append("type", "league");
    formData.append("file", file);
    const { success, data } = await uploadLeagueLogo(formData);
    if (success && data?.url) {
      newFormInline.value.logoImage = data.url;
      previewUrl.value = imagePath + data.url;
      // 觸發校驗
      ruleFormRef.value?.validateField?.("logoImage");
    } else {
      message($t("games.uploadFail"), { type: "error" });
    }
  } finally {
    uploading.value = false;
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item :label="$t('games.leagueID')">
      <span>{{ newFormInline.leagueID }}</span>
    </el-form-item>

    <el-form-item :label="$t('games.leagueName')">
      <span>{{ newFormInline.leagueName }}</span>
    </el-form-item>

    <el-form-item :label="$t('games.type')">
      <span>{{ newFormInline.sportName || "--" }}</span>
    </el-form-item>

    <el-form-item :label="`logo${$t('games.image')}`" prop="logoImage">
      <div class="flex flex-col">
        <el-upload
          accept="image/*"
          :show-file-list="false"
          :http-request="customUpload"
        >
          <el-button
            type="primary"
            :icon="UploadIcon"
            :loading="uploading"
          >
            {{ $t("games.upload") }}
          </el-button>
        </el-upload>
        <div
          v-if="previewUrl"
          class="thumb mt-3"
          :style="{ backgroundImage: `url(${previewUrl})` }"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.thumb {
  width: 120px;
  height: 120px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
