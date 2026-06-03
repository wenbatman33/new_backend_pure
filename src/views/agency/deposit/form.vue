<script setup lang="ts">
import { ref, computed } from "vue";
import { createFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { postAgencyDepositFee } from "@/api/agency";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    memberAccount: "",
    balanceDate: "",
    amount: "",
    thirdID: "",
    payChannelServiceID: "",
    payChannelServiceIDIsEnable: 1,
    fee: "",
    currency: 1,
    otherAmount: "",
    notePrefix: "",
    noteSuffix: ""
  }),
  serviceOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const computingFee = ref(false);

// 幣別選項
const currencyOptions = [
  { label: $t("agency.localCurrency"), value: 1 },
  { label: "USDT-ERC", value: 2 },
  { label: "USDT-TRC", value: 3 },
  { label: $t("agency.digitalCNY"), value: 4 }
];

// 備註前綴選項
const notePrefixOptions = [
  { label: $t("agency.wrongDepositAmount"), value: "存款金额错误Amount Revise" },
  { label: $t("agency.depositLineError"), value: "存款线路错误Gateway Revise" },
  { label: $t("agency.customerService"), value: "客户服务Customer Service" },
  { label: $t("agency.other"), value: "其他Others" }
];

// 依啟用狀態篩選的線路下拉
const filteredServices = computed(() =>
  (props.serviceOptions || []).filter(
    s => s.status === newFormInline.value.payChannelServiceIDIsEnable
  )
);

// 是否顯示其他幣別金額
const showOtherAmount = computed(
  () =>
    newFormInline.value.currency === 2 || newFormInline.value.currency === 3
);

async function handleComputeFee() {
  if (!newFormInline.value.amount) {
    message($t("agency.createModal3"), { type: "error" });
    return;
  }
  if (!newFormInline.value.payChannelServiceID) {
    message($t("agency.createModal4"), { type: "error" });
    return;
  }
  computingFee.value = true;
  try {
    const { success, data } = await postAgencyDepositFee({
      payChannelServiceID: newFormInline.value.payChannelServiceID,
      amount: newFormInline.value.amount
    });
    if (success) newFormInline.value.fee = String(data?.fee ?? "");
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
    label-width="180px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('agency.agencyAccount')" prop="memberAccount">
          <el-input v-model="newFormInline.memberAccount" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.debitTime')" prop="balanceDate">
          <el-date-picker
            v-model="newFormInline.balanceDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.depositAmount')" prop="amount">
          <el-input v-model="newFormInline.amount" type="number" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.thirdPartyID')" prop="thirdID">
          <el-input v-model="newFormInline.thirdID" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item :label="$t('agency.lineName')" prop="payChannelServiceID">
          <el-select v-model="newFormInline.payChannelServiceID" clearable class="!w-full">
            <el-option
              v-for="item in filteredServices"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="payChannelServiceIDIsEnable">
          <el-radio-group v-model="newFormInline.payChannelServiceIDIsEnable">
            <el-radio :value="1">{{ $t("agency.enable") }}</el-radio>
            <el-radio :value="2">{{ $t("agency.disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.fee')" prop="fee">
          <div class="flex w-full items-center">
            <el-input v-model="newFormInline.fee" type="number" class="flex-grow" />
            <el-button
              type="primary"
              class="ml-2"
              :loading="computingFee"
              @click="handleComputeFee"
            >
              {{ $t("agency.createModal2") }}
            </el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('agency.currency')" prop="currency">
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
      <el-col v-if="showOtherAmount" :span="24">
        <el-form-item :label="$t('agency.amountInOtherCurrencies')" prop="otherAmount">
          <el-input v-model="newFormInline.otherAmount" type="number" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('agency.description')" prop="notePrefix">
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
        <el-form-item :label="$t('agency.description')" prop="noteSuffix">
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
