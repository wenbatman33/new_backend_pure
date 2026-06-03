<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<{ formInline?: any; rejectOptions?: any }>(), {
  formInline: () => ({
    orderSn: "",
    memberAccount: "",
    memberID: "",
    riskCheckName: "",
    mode: "pass",
    status: 3,
    rejectID: "",
    note: ""
  }),
  rejectOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref<FormProps["formInline"]>(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <div class="risk-info">
    <p>{{ $t("withdrawal.withdrawNumber") }}：{{ newFormInline.orderSn }}</p>
    <p>{{ $t("withdrawal.memberAC") }}：{{ newFormInline.memberAccount }}</p>
    <p>{{ $t("withdrawal.riskCheckCurrentStatus") }}：{{ newFormInline.riskCheckName }}</p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="newFormInline.mode === 'reject' ? formRules : { note: [] }"
    label-width="120px"
  >
    <el-form-item
      v-if="newFormInline.mode === 'reject'"
      :label="$t('withdrawal.riskCheckRejectReason')"
      prop="rejectID"
    >
      <el-select
        v-model="newFormInline.rejectID"
        clearable
        class="w-full"
        :placeholder="$t('withdrawal.riskCheckRejectReason')"
      >
        <el-option
          v-for="item in rejectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('withdrawal.riskCheckNote')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        :placeholder="$t('withdrawal.riskCheckNote')"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped>
.risk-info {
  padding-left: 40px;
  margin-bottom: 12px;
}
</style>
