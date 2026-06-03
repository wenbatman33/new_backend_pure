<script setup lang="ts">
import { ref } from "vue";
import { gcashFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { GcashFormProps } from "./utils/types";

const props = withDefaults(defineProps<GcashFormProps>(), {
  formInline: () => ({ name: "", phone: "", qrcode: "" })
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
    :rules="gcashFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('payment.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>
    <el-form-item :label="$t('payment.phone')" prop="phone">
      <el-input v-model="newFormInline.phone" clearable />
    </el-form-item>
    <el-form-item label="QRCODE" prop="qrcode">
      <el-input v-model="newFormInline.qrcode" clearable />
    </el-form-item>
  </el-form>
</template>
