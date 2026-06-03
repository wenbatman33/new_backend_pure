<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "",
    startTime: "",
    endTime: "",
    category: 1,
    status: 1,
    hot: false,
    top: false,
    betSetting: false,
    eventId: 0,
    image: "",
    context: "",
    isView: false
  })
});

const categoryOptions = [
  { label: $t("activity.category1"), value: 1 },
  { label: $t("activity.category2"), value: 2 }
];
const statusOptions = [
  { label: $t("activity.hidden"), value: 0 },
  { label: $t("activity.show"), value: 1 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const disabled = props.formInline.isView;

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
    label-width="130px"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item :label="$t('activity.title')" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            :disabled="disabled"
            :placeholder="$t('activity.titlePlaceholder')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('activity.releaseDate')" prop="startTime">
          <el-date-picker
            v-model="newFormInline.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
            :disabled="disabled"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('activity.expirationDate')" prop="endTime">
          <el-date-picker
            v-model="newFormInline.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
            :disabled="disabled"
          />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('activity.category')" prop="category">
          <el-select v-model="newFormInline.category" :disabled="disabled">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('activity.status')" prop="status">
          <el-select v-model="newFormInline.status" :disabled="disabled">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('activity.hot')" prop="hot">
          <el-switch v-model="newFormInline.hot" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('activity.top')" prop="top">
          <el-switch v-model="newFormInline.top" :disabled="disabled" />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('activity.betSetting')" prop="betSetting">
          <el-switch v-model="newFormInline.betSetting" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col v-if="newFormInline.betSetting" :span="10">
        <el-form-item :label="$t('activity.betSettingEventId')" prop="eventId">
          <el-input
            v-model="newFormInline.eventId"
            :disabled="disabled"
            :placeholder="$t('activity.betSettingEventIdMessage')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <!-- TODO: 舊碼為圖片上傳元件（Upload + fileUpload api），upload api 尚未移植，先改為手填圖片網址 + 預覽 -->
        <el-form-item :label="$t('activity.image')" prop="image">
          <el-input
            v-model="newFormInline.image"
            clearable
            :disabled="disabled"
            placeholder="https://..."
          />
        </el-form-item>
        <div v-if="newFormInline.image" class="mb-3 ml-[130px]">
          <el-image
            :src="newFormInline.image"
            fit="contain"
            style="width: 150px"
          />
        </div>
      </el-col>

      <el-col :span="24">
        <!-- TODO: 舊碼為 Tinymce 富文本編輯器，pure 專案尚無 Tinymce 元件，先改為多行文字框存 HTML 字串 -->
        <el-form-item :label="$t('activity.context')" prop="context">
          <el-input
            v-model="newFormInline.context"
            type="textarea"
            :rows="8"
            :disabled="disabled"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
