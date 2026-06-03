<script setup lang="ts">
import { ref } from "vue";
import { domainFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { DomainFormProps } from "./utils/types";

const props = withDefaults(defineProps<DomainFormProps>(), {
  formInline: () => ({
    displayName: "",
    domain: "",
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
    :rules="domainFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('operator.name')" prop="displayName">
      <el-input v-model="newFormInline.displayName" clearable />
    </el-form-item>
    <el-form-item :label="$t('operator.domain')" prop="domain">
      <el-input v-model="newFormInline.domain" clearable />
    </el-form-item>
    <el-form-item :label="$t('operator.remark')" prop="note">
      <el-input v-model="newFormInline.note" clearable />
    </el-form-item>
  </el-form>
</template>
