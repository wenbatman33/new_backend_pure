<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    domain: "",
    key: "",
    from: "",
    subject: "",
    templet: ""
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
    <el-form-item :label="$t('systemManage.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.domain')" prop="domain">
      <el-input v-model="newFormInline.domain" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.key')" prop="key">
      <el-input v-model="newFormInline.key" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.from')" prop="from">
      <el-input v-model="newFormInline.from" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.subject')" prop="subject">
      <el-input v-model="newFormInline.subject" clearable />
    </el-form-item>

    <!-- TODO: 舊碼此欄位使用 Tinymce 富文本編輯器，pure 專案尚未移植富文本元件，暫以多行 textarea 取代（仍可編輯 HTML 原始碼） -->
    <el-form-item :label="$t('systemManage.templet')" prop="templet">
      <el-input
        v-model="newFormInline.templet"
        type="textarea"
        :rows="8"
        :placeholder="$t('systemManage.templetTip')"
      />
    </el-form-item>
  </el-form>
</template>
