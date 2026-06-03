<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    status: "",
    reason: ""
  })
});

// 狀態選項：1 轉失敗 / 2 轉成功
const statusOptions = [
  { label: $t("withdrawal.payoutEditToFail"), value: 1 },
  { label: $t("withdrawal.payoutEditToSuccess"), value: 2 }
];

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
    <el-form-item :label="$t('withdrawal.payoutStatus')" prop="status">
      <el-select
        v-model="newFormInline.status"
        class="w-full"
        :placeholder="$t('withdrawal.payoutStatus')"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('withdrawal.payoutReason')" prop="reason">
      <el-input
        v-model="newFormInline.reason"
        type="textarea"
        :rows="3"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
