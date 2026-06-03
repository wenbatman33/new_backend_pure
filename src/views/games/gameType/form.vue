<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { fileUploadGameType } from "@/api/games";
import { message } from "@/utils/message";
import type { FormProps } from "./utils/types";
import type { UploadRequestOptions } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    secondName: "",
    sort: "",
    refund: "",
    isRecommended: 2,
    isTagRecommended: 2,
    isShow: 1,
    dynamic: 2,
    display: "",
    icon: "",
    iconColor: "",
    iconColor2: "",
    srcIcon: "",
    srcIconColor: "",
    srcIconColor2: ""
  })
});

const imagPath = getImagPath();

const yesNoOptions = [
  { label: $t("games.yes"), value: 1 },
  { label: $t("games.no"), value: 2 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 自訂上傳：呼叫後端取得圖檔路徑，並用本地 FileReader 即時預覽
async function doUpload(
  option: UploadRequestOptions,
  key: "icon" | "iconColor" | "iconColor2"
) {
  const reader = new FileReader();
  reader.readAsDataURL(option.file);
  reader.onload = e => {
    const preview = (e.target?.result as string) ?? "";
    if (key === "icon") newFormInline.value.srcIcon = preview;
    else if (key === "iconColor") newFormInline.value.srcIconColor = preview;
    else newFormInline.value.srcIconColor2 = preview;
  };
  const form = new FormData();
  form.append("type", "game");
  form.append("file", option.file);
  const { success, data } = await fileUploadGameType(form);
  if (success) {
    newFormInline.value[key] = data?.url ?? "";
    message($t("games.uploadSuccess"), { type: "success" });
  }
}

function imgSrc(src?: string, path?: string) {
  // dataURL（本地預覽）直接用，否則拼接圖檔伺服器位置
  if (src) return src;
  return path ? `${imagPath}${path}` : "";
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
        <el-form-item :label="$t('games.name')" prop="name">
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameTypeSecondName')" prop="secondName">
          <el-input v-model="newFormInline.secondName" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.sort')" prop="sort">
          <el-input v-model="newFormInline.sort" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameTypeRefund')" prop="refund">
          <el-input v-model="newFormInline.refund" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('games.gameTypeIsRecommended')"
          prop="isRecommended"
        >
          <el-radio-group v-model="newFormInline.isRecommended">
            <el-radio-button
              v-for="item in yesNoOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.gameTypeIsTagRecommended')"
          prop="isTagRecommended"
        >
          <el-radio-group v-model="newFormInline.isTagRecommended">
            <el-radio-button
              v-for="item in yesNoOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameTypeIsShow')" prop="isShow">
          <el-radio-group v-model="newFormInline.isShow">
            <el-radio-button
              v-for="item in yesNoOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameTypeDynamic')" prop="dynamic">
          <el-radio-group v-model="newFormInline.dynamic">
            <el-radio-button
              v-for="item in yesNoOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.gameTypeIcon')">
          <div class="flex flex-col gap-2">
            <img
              v-if="imgSrc(newFormInline.srcIcon, newFormInline.icon)"
              :src="imgSrc(newFormInline.srcIcon, newFormInline.icon)"
              style="max-height: 100px"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="opt => doUpload(opt, 'icon')"
            >
              <el-button type="primary" size="small">
                {{ $t("games.upload") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.gameTypeIconColor')">
          <div class="flex flex-col gap-2">
            <img
              v-if="imgSrc(newFormInline.srcIconColor, newFormInline.iconColor)"
              :src="imgSrc(newFormInline.srcIconColor, newFormInline.iconColor)"
              style="max-height: 100px"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="opt => doUpload(opt, 'iconColor')"
            >
              <el-button type="primary" size="small">
                {{ $t("games.upload") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.gameTypeIconColor2')">
          <div class="flex flex-col gap-2">
            <img
              v-if="imgSrc(newFormInline.srcIconColor2, newFormInline.iconColor2)"
              :src="imgSrc(newFormInline.srcIconColor2, newFormInline.iconColor2)"
              style="max-height: 100px"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="opt => doUpload(opt, 'iconColor2')"
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
