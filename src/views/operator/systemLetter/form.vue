<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { countryCheck, checkWhichCountry } from "@/utils/country";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    startTime: "",
    endTime: "",
    title: "",
    titlePh: "",
    content: "",
    contentPh: ""
  })
});

// 非 CN 站點才顯示當地語系欄位
const showPh = !countryCheck("CN");
const countrySuffix = checkWhichCountry();

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
    label-width="100px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('operator.sendTime')" prop="startTime">
          <el-date-picker
            v-model="newFormInline.startTime"
            type="datetime"
            class="!w-full"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            :placeholder="$t('operator.startTime')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('operator.endTime')" prop="endTime">
          <el-date-picker
            v-model="newFormInline.endTime"
            type="datetime"
            class="!w-full"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            :placeholder="$t('operator.endTime')"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('operator.title')" prop="title">
      <el-input
        v-model="newFormInline.title"
        clearable
        :placeholder="$t('operator.plzInputTitle')"
      />
    </el-form-item>

    <el-form-item
      v-if="showPh"
      :label="`${$t('operator.title')}${countrySuffix}`"
      prop="titlePh"
    >
      <el-input
        v-model="newFormInline.titlePh"
        clearable
        :placeholder="`${$t('operator.plzInputTitle')}(${countrySuffix})`"
      />
    </el-form-item>

    <!-- TODO: 舊碼使用 Tinymce 富文本編輯器（含表格/圖片上傳），pure 尚未移植，暫以 textarea 佔位，待 RichEditor 元件移植後替換 -->
    <el-form-item :label="$t('operator.content')" prop="content">
      <el-input
        v-model="newFormInline.content"
        type="textarea"
        :rows="6"
        :placeholder="$t('operator.content')"
      />
    </el-form-item>

    <el-form-item
      v-if="showPh"
      :label="`${$t('operator.content')}${countrySuffix}`"
      prop="contentPh"
    >
      <el-input
        v-model="newFormInline.contentPh"
        type="textarea"
        :rows="6"
        :placeholder="`${$t('operator.content')}(${countrySuffix})`"
      />
    </el-form-item>
  </el-form>
</template>
