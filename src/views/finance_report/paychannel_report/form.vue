<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
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
    label-width="60px"
  >
    <el-form-item :label="$t('finance_report.remark')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="10"
        clearable
        :placeholder="$t('finance_report.plzEnterRemark')"
      />
    </el-form-item>
  </el-form>
</template>
