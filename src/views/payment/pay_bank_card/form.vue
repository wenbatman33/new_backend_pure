<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    cardNo: "",
    accountName: "",
    bankCode: "",
    province: "",
    city: "",
    branch: "",
    broker: "",
    verifyDate: "",
    limitLower: undefined,
    limitUpper: undefined,
    dayUpper: undefined,
    type: undefined,
    status: 2,
    originalAmount: undefined,
    note: "",
    showWebBankInfo: false,
    bankAccount: "",
    oriLoginPw: "",
    oriUPw: "",
    oriWithdrawalPw: "",
    loginPw: "",
    uPw: "",
    withdrawalPw: "",
    showPersonalInfo: false,
    identity: "",
    gender: undefined,
    phone: ""
  }),
  banks: () => [],
  typeOptions: () => [],
  genderOptions: () => [],
  provinces: () => [],
  readonly: false
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 銀行下拉（value 用 id）
const bankOptions = computed(() =>
  props.banks.map(b => ({ label: b.bankName, value: b.id, key: b.bankCode }))
);

// 省下拉
const provinceOptions = computed(() =>
  props.provinces.map(p => ({ label: p.province, value: p.province_id }))
);

// 依所選省回傳城市
const cityOptions = computed(() => {
  const found = props.provinces.find(
    p => String(p.province_id) === String(newFormInline.value.province)
  );
  return (found?.city ?? []).map(c => ({ label: c.name, value: c.id }));
});

function onProvinceChange() {
  newFormInline.value.city = "";
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
    :rules="formRules"
    :disabled="readonly"
    label-width="120px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('payment.cardNo')" prop="cardNo">
          <el-input
            v-model="newFormInline.cardNo"
            clearable
            :placeholder="$t('payment.pleaseInput') + $t('payment.cardNo')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('payment.accountName')" prop="accountName">
          <el-input
            v-model="newFormInline.accountName"
            clearable
            :placeholder="$t('payment.pleaseInput') + $t('payment.accountName')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('payment.payBankID')" prop="bankCode">
          <el-select
            v-model="newFormInline.bankCode"
            filterable
            clearable
            class="w-full"
            :placeholder="$t('payment.pleaseChoose') + $t('payment.payBankID')"
          >
            <el-option
              v-for="item in bankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item :label="$t('payment.province')" prop="province">
          <el-select
            v-model="newFormInline.province"
            clearable
            class="w-full"
            @change="onProvinceChange"
          >
            <el-option
              v-for="item in provinceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('payment.city')" prop="city">
          <el-select v-model="newFormInline.city" clearable class="w-full">
            <el-option
              v-for="item in cityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('payment.branch')" prop="branch">
          <el-input v-model="newFormInline.branch" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.broker')" prop="broker">
          <el-input v-model="newFormInline.broker" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('payment.verifyDate')" prop="verifyDate">
          <el-date-picker
            v-model="newFormInline.verifyDate"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item :label="$t('payment.limitLower')" prop="limitLower">
          <el-input-number
            v-model="newFormInline.limitLower"
            :min="0"
            class="w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('payment.limitUpper')" prop="limitUpper">
          <el-input-number
            v-model="newFormInline.limitUpper"
            :min="0"
            class="w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('payment.dayUpper')" prop="dayUpper">
          <el-input-number
            v-model="newFormInline.dayUpper"
            :min="0"
            class="w-full"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item :label="$t('payment.type')" prop="type">
          <el-select v-model="newFormInline.type" clearable class="w-full">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('payment.status')" prop="status">
          <el-switch
            v-model="newFormInline.status"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('payment.originalAmount')"
          prop="originalAmount"
        >
          <el-input-number
            v-model="newFormInline.originalAmount"
            :min="0"
            :disabled="formInline.mode !== 'Create'"
            class="w-full"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('payment.remark')" prop="note">
          <el-input v-model="newFormInline.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-col>

      <!-- 網銀資訊區 -->
      <el-col :span="24">
        <el-form-item :label="$t('payment.showWebBankInfo')">
          <el-switch v-model="newFormInline.showWebBankInfo" />
        </el-form-item>
      </el-col>
      <template v-if="newFormInline.showWebBankInfo">
        <el-col :span="12">
          <el-form-item :label="$t('payment.bankAccount')" prop="bankAccount">
            <el-input v-model="newFormInline.bankAccount" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.oriLoginPw')" prop="oriLoginPw">
            <el-input v-model="newFormInline.oriLoginPw" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.oriUPw')" prop="oriUPw">
            <el-input v-model="newFormInline.oriUPw" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('payment.oriWithdrawalPw')"
            prop="oriWithdrawalPw"
          >
            <el-input v-model="newFormInline.oriWithdrawalPw" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.loginPw')" prop="loginPw">
            <el-input v-model="newFormInline.loginPw" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.uPw')" prop="uPw">
            <el-input v-model="newFormInline.uPw" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('payment.withdrawalPw')"
            prop="withdrawalPw"
          >
            <el-input v-model="newFormInline.withdrawalPw" clearable />
          </el-form-item>
        </el-col>
      </template>

      <!-- 個人資訊區 -->
      <el-col :span="24">
        <el-form-item :label="$t('payment.showPersonalInfo')">
          <el-switch v-model="newFormInline.showPersonalInfo" />
        </el-form-item>
      </el-col>
      <template v-if="newFormInline.showPersonalInfo">
        <el-col :span="12">
          <el-form-item :label="$t('payment.identity')" prop="identity">
            <el-input v-model="newFormInline.identity" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.gender')" prop="gender">
            <el-radio-group v-model="newFormInline.gender">
              <el-radio
                v-for="item in genderOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('payment.phone')" prop="phone">
            <el-input v-model="newFormInline.phone" clearable />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
