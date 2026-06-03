<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    displayName: "",
    username: "",
    password: "",
    key: "",
    secret: "",
    apiUrl: "",
    backendUrl: "",
    template: "",
    param: "",
    apiParam: {}
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
    <el-form-item
      :label="$t('systemManage.smsVendorDisplayName')"
      prop="displayName"
    >
      <el-input v-model="newFormInline.displayName" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.smsVendorUsername')" prop="username">
      <el-input v-model="newFormInline.username" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.smsVendorPassword')" prop="password">
      <el-input v-model="newFormInline.password" clearable />
    </el-form-item>

    <el-form-item label="key" prop="key">
      <el-input v-model="newFormInline.key" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.smsVendorSecret')" prop="secret">
      <el-input v-model="newFormInline.secret" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.smsVendorApiUrl')" prop="apiUrl">
      <el-input v-model="newFormInline.apiUrl" clearable />
    </el-form-item>

    <el-form-item
      :label="$t('systemManage.smsVendorBackendUrl')"
      prop="backendUrl"
    >
      <el-input v-model="newFormInline.backendUrl" clearable />
    </el-form-item>

    <el-form-item
      :label="$t('systemManage.smsVendorTemplate')"
      prop="template"
    >
      <el-input v-model="newFormInline.template" clearable />
    </el-form-item>

    <el-form-item :label="$t('systemManage.smsVendorParam')" prop="param">
      <el-input v-model="newFormInline.param" clearable />
    </el-form-item>

    <!-- apiParam 為動態鍵值對，逐欄編輯 -->
    <el-form-item
      v-for="(_, key) in newFormInline.apiParam"
      :key="key"
      :label="String(key)"
    >
      <el-input v-model="newFormInline.apiParam[key]" clearable />
    </el-form-item>
  </el-form>
</template>
