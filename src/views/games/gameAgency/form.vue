<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { fileUploadGame } from "@/api/games";
import { message } from "@/utils/message";
import type { FormProps } from "./utils/types";
import type { UploadRequestOptions } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    gameGroups: "",
    gameLists: "",
    status: 1,
    srcH5: "",
    srcPc: "",
    imageH5: "",
    imagePc: ""
  })
});

const imagPath = getImagPath();

const statusOptions = [
  { label: $t("games.statusOpen"), value: 1 },
  { label: $t("games.statusClose"), value: 2 },
  { label: $t("games.statusMaintenance"), value: 3 },
  { label: $t("games.statusHidden"), value: 4 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 自訂上傳：呼叫後端取得圖檔路徑，並用本地 FileReader 即時預覽
async function doUpload(option: UploadRequestOptions, key: "H5" | "Pc") {
  const reader = new FileReader();
  reader.readAsDataURL(option.file);
  reader.onload = e => {
    const preview = (e.target?.result as string) ?? "";
    if (key === "H5") newFormInline.value.srcH5 = preview;
    else newFormInline.value.srcPc = preview;
  };
  const form = new FormData();
  form.append("type", "game");
  form.append("file", option.file);
  const { success, data } = await fileUploadGame(form);
  if (success) {
    if (key === "H5") newFormInline.value.imageH5 = data?.url ?? "";
    else newFormInline.value.imagePc = data?.url ?? "";
    message($t("games.uploadSuccess"), { type: "success" });
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
    label-width="120px"
  >
    <el-row :gutter="12">
      <el-col :span="12">
        <el-form-item label="ID" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.agentName')" prop="name">
          <el-input v-model="newFormInline.name" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.subsidiaryManufacturers')"
          prop="gameGroups"
        >
          <el-input v-model="newFormInline.gameGroups" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.agentGameType')" prop="gameLists">
          <el-input v-model="newFormInline.gameLists" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('games.status')" prop="status">
          <el-select v-model="newFormInline.status" class="!w-[200px]">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.manufacturerPicturesH5')">
          <div class="flex flex-col gap-2">
            <img
              v-if="newFormInline.srcH5"
              :src="newFormInline.srcH5"
              style="max-height: 200px"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="opt => doUpload(opt, 'H5')"
            >
              <el-button type="primary" size="small">
                {{ $t("games.upload") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.manufacturerPicturesPC')">
          <div class="flex flex-col gap-2">
            <img
              v-if="newFormInline.srcPc"
              :src="newFormInline.srcPc"
              style="max-height: 200px"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="opt => doUpload(opt, 'Pc')"
            >
              <el-button type="primary" size="small">
                {{ $t("games.upload") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
