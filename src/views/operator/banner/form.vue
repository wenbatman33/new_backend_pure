<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  mode: "Create",
  categoryOptions: () => [],
  deviceOptions: () => [],
  recommendTypeOptions: () => [],
  languageOptions: () => [],
  formInline: () => ({
    bannerCategoryID: "",
    title: "",
    description: "",
    sort: 0,
    language: "",
    hidden: false,
    imageWeb: "",
    imageH5: "",
    logo: "",
    device: [],
    start: "",
    end: "",
    recommendType: [],
    context: "",
    note: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('operator.title')" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            :placeholder="$t('operator.plzInputAdTitle')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('operator.adClassification')" prop="bannerCategoryID">
          <el-select
            v-model="newFormInline.bannerCategoryID"
            filterable
            clearable
            class="w-full"
            :disabled="mode === 'Edit'"
            :placeholder="$t('operator.plzInputAdClassification')"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.bannerCategoryID"
              :label="item.name"
              :value="String(item.bannerCategoryID)"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('operator.adDescription')" prop="description">
          <el-input v-model="newFormInline.description" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('operator.sort')" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('operator.language')" prop="language">
          <el-select v-model="newFormInline.language" class="w-full">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('operator.hiddenYesOrNo')" prop="hidden">
          <el-switch v-model="newFormInline.hidden" />
        </el-form-item>
      </el-col>

      <!-- TODO: UploadFile 元件未移植，圖片/影片暫以路徑字串輸入 -->
      <el-col :span="12">
        <el-form-item :label="$t('operator.webImage')" prop="imageWeb">
          <el-input
            v-model="newFormInline.imageWeb"
            clearable
            :placeholder="$t('operator.imageUploadTodo')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('operator.h5Image')" prop="imageH5">
          <el-input
            v-model="newFormInline.imageH5"
            clearable
            :placeholder="$t('operator.imageUploadTodo')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Logo" prop="logo">
          <el-input
            v-model="newFormInline.logo"
            clearable
            :placeholder="$t('operator.imageUploadTodo')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('operator.listingPlatform')" prop="device">
          <el-checkbox-group v-model="newFormInline.device">
            <el-checkbox
              v-for="item in deviceOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('operator.addedTime')" prop="start">
          <el-date-picker
            v-model="newFormInline.start"
            type="datetime"
            class="w-full"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :placeholder="$t('operator.plzChoiceAddadTime')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('operator.removeTime')" prop="end">
          <el-date-picker
            v-model="newFormInline.end"
            type="datetime"
            class="w-full"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('operator.recommendType')" prop="recommendType">
          <el-checkbox-group v-model="newFormInline.recommendType">
            <el-checkbox
              v-for="item in recommendTypeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('operator.content')" prop="context">
          <el-input v-model="newFormInline.context" type="textarea" :rows="2" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('operator.remark')" prop="note">
          <el-input v-model="newFormInline.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
