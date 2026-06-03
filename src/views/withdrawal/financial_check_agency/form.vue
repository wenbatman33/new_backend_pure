<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    transactionID: "",
    amount: "",
    transactionTime: "",
    rejectID: "",
    note: "",
    isReject: false
  })
});

// TODO: 退回原因下拉舊碼用 @/utils/dropdown rejectOptions()（未移植），暫以空陣列佔位
const rejectOptions: { label: string; value: string | number }[] = [];

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
    label-width="120px"
  >
    <el-form-item :label="$t('withdrawal.fcaWithdrawNumber')">
      <span>{{ newFormInline.transactionID }}</span>
    </el-form-item>
    <el-form-item :label="$t('withdrawal.fcaWithdrawalAmount')">
      <span>{{ newFormInline.amount }}</span>
    </el-form-item>
    <el-form-item :label="$t('withdrawal.fcaWithdrawApplyTime')">
      <span>{{ newFormInline.transactionTime }}</span>
    </el-form-item>

    <el-form-item
      v-if="newFormInline.isReject"
      :label="$t('withdrawal.fcaReason')"
      prop="rejectID"
    >
      <el-select
        v-model="newFormInline.rejectID"
        clearable
        class="w-full"
        :placeholder="$t('withdrawal.fcaReason')"
      >
        <el-option
          v-for="item in rejectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('withdrawal.fcaNote')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
