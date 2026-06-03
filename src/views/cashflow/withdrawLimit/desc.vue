<script setup lang="ts">
import { ref } from "vue";
import { descFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { DescFormProps } from "./utils/types";

const props = withDefaults(defineProps<DescFormProps>(), {
  formInline: () => ({
    serviceCode: "",
    docTitle: "",
    docURL: "",
    downloadTitle: "",
    downloadURL: ""
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
    :rules="descFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('cashflow.docTitle')" prop="docTitle">
      <el-input v-model="newFormInline.docTitle" clearable />
    </el-form-item>
    <el-form-item :label="$t('cashflow.docURL')" prop="docURL">
      <el-input v-model="newFormInline.docURL" clearable />
    </el-form-item>
    <el-form-item :label="$t('cashflow.downloadTitle')" prop="downloadTitle">
      <el-input v-model="newFormInline.downloadTitle" clearable />
    </el-form-item>
    <el-form-item :label="$t('cashflow.downloadURL')" prop="downloadURL">
      <el-input v-model="newFormInline.downloadURL" clearable />
    </el-form-item>
  </el-form>
</template>
