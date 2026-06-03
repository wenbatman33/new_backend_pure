<script setup lang="ts">
import { ref } from "vue";
import { moneyRules } from "./utils/rule";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getPayUChannelSearch } from "@/api/payment";
import type { MoneyFormProps } from "./utils/types";

// 商户下发 / 充值商户号 表单
const props = withDefaults(defineProps<MoneyFormProps>(), {
  mode: "in",
  formInline: () => ({
    id: 0,
    targetSN: "",
    targetID: undefined,
    payChannelName: undefined,
    amount: "",
    exchangeRate: "",
    exchangeAmount: "",
    fee: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

// 取得商户资讯
async function handleGetTargetInfo() {
  const sn = newFormInline.value.targetSN;
  if (!sn) {
    message($t("payment.payUMoneyInputMerchant"), { type: "error" });
    return;
  }
  const { data } = await getPayUChannelSearch({ keyword: sn });
  if (data && data.type === 2) {
    newFormInline.value.targetID = data.id;
    newFormInline.value.payChannelName = data.name;
  } else {
    message($t("payment.payUMoneyMerchantNotExist"), { type: "error" });
    newFormInline.value.targetID = undefined;
    newFormInline.value.payChannelName = undefined;
  }
}

function onTargetSNInput() {
  newFormInline.value.targetID = undefined;
  newFormInline.value.payChannelName = undefined;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="moneyRules"
    label-width="120px"
  >
    <el-form-item
      :label="mode === 'in' ? $t('payment.payUMerchant') : $t('payment.payUTargetSN')"
      prop="targetSN"
    >
      <div class="flex items-center gap-3 w-full">
        <el-input
          v-model="newFormInline.targetSN"
          clearable
          @input="onTargetSNInput"
        />
        <el-button type="primary" @click="handleGetTargetInfo">
          {{ $t("payment.payUMoneyGetInfo") }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item
      v-if="newFormInline.payChannelName !== undefined"
      :label="$t('payment.payUMerchant2')"
    >
      <span>{{ newFormInline.payChannelName }}</span>
    </el-form-item>

    <el-form-item
      :label="mode === 'in' ? $t('payment.payUAmount') : $t('payment.payUAmount2')"
      prop="amount"
    >
      <el-input v-model="newFormInline.amount" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.payUExchangeRate')" prop="exchangeRate">
      <el-input v-model="newFormInline.exchangeRate" type="number" clearable />
      <span class="ml-2 text-[var(--el-text-color-secondary)] text-xs">
        {{ $t("payment.payUExchangeRate2") }}
      </span>
    </el-form-item>

    <el-form-item :label="$t('payment.payUExchangeAmount')" prop="exchangeAmount">
      <el-input v-model="newFormInline.exchangeAmount" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <el-input v-model="newFormInline.fee" type="number" clearable />
      <span class="ml-2 text-[var(--el-text-color-secondary)] text-xs">
        {{ $t("payment.payUFeeMsg") }}
      </span>
    </el-form-item>
  </el-form>
</template>
