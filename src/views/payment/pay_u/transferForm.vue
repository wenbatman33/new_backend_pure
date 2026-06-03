<script setup lang="ts">
import { ref } from "vue";
import { transferRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { TransferFormProps } from "./utils/types";

// U 转帐 表单
const props = withDefaults(defineProps<TransferFormProps>(), {
  formInline: () => ({
    id: 0,
    targetID: undefined,
    amount: "",
    fee: "",
    thirdID: "",
    note: ""
  }),
  targetOptions: () => []
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
    :rules="transferRules"
    label-width="90px"
  >
    <el-form-item :label="$t('payment.payUUaccount')" prop="targetID">
      <el-select
        v-model="newFormInline.targetID"
        filterable
        clearable
        class="w-full"
        :placeholder="$t('payment.pleaseChoose')"
      >
        <el-option
          v-for="item in targetOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('payment.payUAmount4')" prop="amount">
      <el-input v-model="newFormInline.amount" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <div class="flex items-center gap-2 w-full">
        <el-input v-model="newFormInline.fee" type="number" clearable />
        <span class="text-[var(--el-text-color-secondary)] text-xs whitespace-nowrap">
          {{ $t("payment.payUFeeMsg") }}
        </span>
      </div>
    </el-form-item>

    <el-form-item :label="$t('payment.payUThirdID')" prop="thirdID">
      <el-input
        v-model="newFormInline.thirdID"
        type="number"
        clearable
        :placeholder="$t('payment.pleaseInput')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="4"
        :placeholder="$t('payment.pleaseInput')"
      />
    </el-form-item>
  </el-form>
</template>
