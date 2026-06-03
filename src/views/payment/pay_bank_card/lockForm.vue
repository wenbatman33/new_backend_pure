<script setup lang="ts">
import { ref } from "vue";
import { lockFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { LockFormProps } from "./utils/types";

const props = withDefaults(defineProps<LockFormProps>(), {
  formInline: () => ({
    amount: undefined,
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
    :rules="lockFormRules"
    label-width="80px"
  >
    <el-form-item :label="$t('payment.amount2')" prop="amount">
      <el-input-number
        v-model="newFormInline.amount"
        class="w-full"
        :placeholder="$t('payment.pleaseInput') + $t('payment.amount2')"
      />
    </el-form-item>
    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="6" />
    </el-form-item>
  </el-form>
</template>
