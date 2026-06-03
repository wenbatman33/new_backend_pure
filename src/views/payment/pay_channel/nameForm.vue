<script setup lang="ts">
import { ref } from "vue";
import { nameFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { NameFormProps } from "./utils/types";

const props = withDefaults(defineProps<NameFormProps>(), {
  formInline: () => ({ name: "" })
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
    :rules="nameFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('payment.merchant2')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>
  </el-form>
</template>
