<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    name: "",
    pcAppID: "",
    pcAppSecret: "",
    h5AppID: "",
    h5AppSecret: "",
    captchaUrl: "",
    boUrl: "",
    secretID: "",
    secretKey: ""
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
    label-width="170px"
    label-position="left"
  >
    <el-form-item :label="$t('systemManage.displayName')">
      <span>{{ newFormInline.name }}</span>
    </el-form-item>
    <el-form-item label="PC App ID" prop="pcAppID">
      <el-input v-model="newFormInline.pcAppID" clearable />
    </el-form-item>
    <el-form-item label="PC App Secret" prop="pcAppSecret">
      <el-input v-model="newFormInline.pcAppSecret" clearable />
    </el-form-item>
    <el-form-item label="H5 App ID" prop="h5AppID">
      <el-input v-model="newFormInline.h5AppID" clearable />
    </el-form-item>
    <el-form-item label="H5 App Secret" prop="h5AppSecret">
      <el-input v-model="newFormInline.h5AppSecret" clearable />
    </el-form-item>
    <el-form-item :label="`${$t('systemManage.dingSiang')} api url`" prop="captchaUrl">
      <el-input v-model="newFormInline.captchaUrl" clearable />
    </el-form-item>
    <el-form-item :label="$t('systemManage.manufacturerBackendURL')" prop="boUrl">
      <el-input v-model="newFormInline.boUrl" clearable />
    </el-form-item>
    <el-form-item :label="`${$t('systemManage.tengSyun')} secret id`" prop="secretID">
      <el-input v-model="newFormInline.secretID" clearable />
    </el-form-item>
    <el-form-item :label="`${$t('systemManage.dingSiang')} secret key`" prop="secretKey">
      <el-input v-model="newFormInline.secretKey" clearable />
    </el-form-item>
  </el-form>
</template>
