<script setup lang="ts">
import { ref } from "vue";
import { freezeRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FreezeFormProps } from "./utils/types";

// 冻结 / 解冻 表单
const props = withDefaults(defineProps<FreezeFormProps>(), {
  mode: "lock",
  formInline: () => ({
    id: 0,
    amount: "",
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
    :rules="freezeRules"
    label-width="80px"
  >
    <el-form-item :label="$t('payment.payUFreezeAmount')" prop="amount">
      <el-input v-model="newFormInline.amount" type="number" clearable />
    </el-form-item>
    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="6"
        :placeholder="$t('payment.pleaseInput')"
      />
    </el-form-item>
  </el-form>
</template>
