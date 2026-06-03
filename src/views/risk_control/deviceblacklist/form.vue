<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    deviceID: "",
    reason: "",
    mode: "create"
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
    label-width="100px"
  >
    <!-- 編輯模式下裝置 ID 不可修改 -->
    <el-form-item :label="$t('risk_control.deviceID')" prop="deviceID">
      <el-input
        v-model="newFormInline.deviceID"
        clearable
        :disabled="newFormInline.mode === 'update'"
        :placeholder="$t('risk_control.deviceID')"
      />
    </el-form-item>

    <el-form-item :label="$t('risk_control.reason')" prop="reason">
      <el-input
        v-model="newFormInline.reason"
        type="textarea"
        :rows="4"
        clearable
        :placeholder="$t('risk_control.reason')"
      />
    </el-form-item>
  </el-form>
</template>
