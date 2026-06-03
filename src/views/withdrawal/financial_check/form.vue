<script setup lang="ts">
import { ref } from "vue";
import { rejectRules, submitRiskRules, passRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { ActionFormProps } from "./utils/types";

const props = withDefaults(defineProps<ActionFormProps>(), {
  mode: "pass",
  formInline: () => ({
    transactionID: "",
    amount: "",
    transactionTime: "",
    status: "",
    rejectID: "",
    rejectReason: "",
    note: ""
  }),
  rejectOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const rules =
  props.mode === "reject"
    ? rejectRules
    : props.mode === "submitRisk"
      ? submitRiskRules
      : passRules;

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item :label="$t('withdrawal.withdrawNumber')">
      <span>{{ newFormInline.transactionID }}</span>
    </el-form-item>
    <el-form-item :label="$t('withdrawal.withdrawalAmount')">
      <span>{{ newFormInline.amount }}</span>
    </el-form-item>
    <el-form-item :label="$t('withdrawal.withdrawApplyTime')">
      <span>{{ newFormInline.transactionTime }}</span>
    </el-form-item>
    <el-form-item v-if="mode === 'pass'" :label="$t('withdrawal.status')">
      <span>{{ newFormInline.status }}</span>
    </el-form-item>

    <el-form-item
      v-if="mode === 'reject'"
      :label="$t('withdrawal.rejectReason')"
      prop="rejectID"
    >
      <el-select
        v-model="newFormInline.rejectID"
        clearable
        class="!w-[260px]"
        :placeholder="$t('withdrawal.rejectReason')"
      >
        <el-option
          v-for="item in rejectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('withdrawal.note')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        clearable
      />
    </el-form-item>

    <el-form-item
      v-if="mode === 'reject'"
      :label="$t('withdrawal.frontDisplayIllustrate')"
    >
      <el-input
        v-model="newFormInline.rejectReason"
        type="textarea"
        :rows="3"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
