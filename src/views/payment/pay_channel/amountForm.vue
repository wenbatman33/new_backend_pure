<script setup lang="ts">
import { ref } from "vue";
import { amountFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AmountFormProps } from "./utils/types";

const props = withDefaults(defineProps<AmountFormProps>(), {
  formInline: () => ({ amount: "", fee: "", thirdID: "", note: "" })
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
    :rules="amountFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('payment.amount')" prop="amount">
      <el-input v-model="newFormInline.amount" type="number" clearable />
    </el-form-item>
    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <el-input v-model="newFormInline.fee" type="number" clearable />
    </el-form-item>
    <el-form-item :label="$t('payment.thirdID')" prop="thirdID">
      <el-input v-model="newFormInline.thirdID" clearable />
    </el-form-item>
    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="3" />
    </el-form-item>
  </el-form>
</template>
