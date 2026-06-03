<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { createFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { postDepositFee } from "@/api/cashflow";
import { message } from "@/utils/message";
import { currency } from "@/utils/country";
import type { CreateFormProps } from "./utils/types";

const props = withDefaults(defineProps<CreateFormProps>(), {
  formInline: () => ({
    memberAccount: "",
    balanceDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    amount: "",
    thirdID: "",
    payChannelServiceID: "",
    fee: "",
    currency: 1,
    otherAmount: "",
    notePrefix: "",
    noteSuffix: ""
  }),
  serviceOptions: () => []
});

const currencyOptions = [
  { label: currency(), value: 1 },
  { label: "USDT-ERC", value: 2 },
  { label: "USDT-TRC", value: 3 },
  { label: $t("cashflow.openEcnyModal"), value: 4 }
];

const notePrefixOptions = [
  { label: $t("cashflow.wrongDepositAmount"), value: $t("cashflow.wrongDepositAmount") },
  { label: $t("cashflow.depositLineError"), value: $t("cashflow.depositLineError") },
  { label: $t("cashflow.other"), value: $t("cashflow.other") }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const computingFee = ref(false);

// 計算手續費
async function handleComputeFee() {
  if (!newFormInline.value.amount) {
    message($t("cashflow.createModal3"), { type: "error" });
    return;
  }
  if (!newFormInline.value.payChannelServiceID) {
    message($t("cashflow.createModal4"), { type: "error" });
    return;
  }
  computingFee.value = true;
  try {
    const { success, data } = await postDepositFee({
      payChannelServiceID: newFormInline.value.payChannelServiceID,
      amount: Number(newFormInline.value.amount)
    });
    if (success) {
      newFormInline.value.fee = data?.fee ?? 0;
    }
  } finally {
    computingFee.value = false;
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="createFormRules"
    label-width="160px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.memberAC')" prop="memberAccount">
          <el-input v-model="newFormInline.memberAccount" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.balanceDate')" prop="balanceDate">
          <el-date-picker
            v-model="newFormInline.balanceDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="(d: Date) => d.getTime() > Date.now()"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.tableAmount')" prop="amount">
          <el-input v-model="newFormInline.amount" type="number" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.thirdPartyID')" prop="thirdID">
          <el-input v-model="newFormInline.thirdID" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.gateway')" prop="payChannelServiceID">
          <el-select
            v-model="newFormInline.payChannelServiceID"
            filterable
            clearable
            class="!w-full"
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('cashflow.fee')" prop="fee">
          <div class="flex w-full items-center">
            <el-input
              v-model="newFormInline.fee"
              type="number"
              class="flex-grow"
            />
            <el-button
              type="primary"
              class="ml-2"
              :loading="computingFee"
              @click="handleComputeFee"
            >
              {{ $t("cashflow.createModal2") }}
            </el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('cashflow.currency')" prop="currency">
          <el-radio-group v-model="newFormInline.currency">
            <el-radio
              v-for="item in currencyOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col
        v-if="newFormInline.currency === 2 || newFormInline.currency === 3"
        :span="24"
      >
        <el-form-item :label="$t('cashflow.amountInOtherCurrencies')" prop="otherAmount">
          <el-input v-model="newFormInline.otherAmount" type="number" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('cashflow.depositReason')" prop="notePrefix">
          <el-radio-group v-model="newFormInline.notePrefix">
            <el-radio
              v-for="item in notePrefixOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('cashflow.description')" prop="noteSuffix">
          <el-input
            v-model="newFormInline.noteSuffix"
            type="textarea"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
