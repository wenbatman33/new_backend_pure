<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    amount: "",
    type: 1,
    useExists: true,
    existsID: undefined,
    withdrawalName: "",
    bankcard: ""
  })
});

// 提款方式選項
const typeOptions = [
  { label: $t("agency.withdrawalDataBankCard"), value: 1 },
  { label: "USDT-ERC", value: 2 },
  { label: "USDT-TRC", value: 3 },
  { label: $t("agency.withdrawalDataOther"), value: 4 }
];

// TODO: 既有提款帳號下拉資料原本來自 @/utils/dropdown（未移植），先給空陣列佔位
const existAccountOptions = ref<{ label: string; value: number }[]>([]);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function onTypeChange() {
  newFormInline.value.existsID = undefined;
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
    label-width="120px"
  >
    <el-form-item :label="$t('agency.withdrawalData1')" prop="amount">
      <el-input v-model="newFormInline.amount" clearable class="!w-[240px]" />
    </el-form-item>

    <el-form-item :label="$t('agency.withdrawal13')" prop="type">
      <el-radio-group v-model="newFormInline.type" @change="onTypeChange">
        <el-radio
          v-for="item in typeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="newFormInline.useExists"
      :label="$t('agency.withdrawalData7')"
      prop="existsID"
    >
      <el-select
        v-model="newFormInline.existsID"
        clearable
        class="!w-[240px]"
        :placeholder="$t('agency.withdrawalData8')"
      >
        <el-option
          v-for="item in existAccountOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <template v-else>
      <el-form-item
        v-if="newFormInline.type === 1"
        :label="$t('agency.withdrawalData9')"
        prop="withdrawalName"
      >
        <el-input
          v-model="newFormInline.withdrawalName"
          clearable
          class="!w-[240px]"
          :placeholder="$t('agency.withdrawalData10')"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.withdrawalData11')" prop="bankcard">
        <el-input
          v-model="newFormInline.bankcard"
          clearable
          class="!w-[240px]"
          :placeholder="$t('agency.withdrawalData12')"
        />
      </el-form-item>
    </template>
  </el-form>
</template>
