<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ip: "",
    reason: ""
  }),
  isEdit: false
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
    label-width="80px"
  >
    <el-form-item label="IP" prop="ip">
      <el-input
        v-model="newFormInline.ip"
        clearable
        :disabled="isEdit"
        :placeholder="$t('risk_control.ipPlaceholder')"
      />
    </el-form-item>

    <el-form-item :label="$t('risk_control.reason')" prop="reason">
      <el-input
        v-model="newFormInline.reason"
        type="textarea"
        :rows="3"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
