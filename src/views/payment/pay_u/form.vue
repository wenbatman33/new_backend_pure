<script setup lang="ts">
import { ref } from "vue";
import { ucardRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { UcardFormProps } from "./utils/types";

// 新增 / 编辑 U 帐户表单
const props = withDefaults(defineProps<UcardFormProps>(), {
  formInline: () => ({
    name: "",
    type: 2,
    useType: 0,
    address: "",
    originalAmount: "",
    isUpdate: false
  })
});

const walletTypeOptions = [
  { label: "ERC", value: 2 },
  { label: "TRC", value: 3 }
];

const useTypeOptions = [
  { label: $t("payment.payUUseType1"), value: 0 },
  { label: $t("payment.payUType1"), value: 1 },
  { label: $t("payment.payUType2"), value: 2 },
  { label: $t("payment.payUType3"), value: 3 },
  { label: $t("payment.payUType4"), value: 4 }
];

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
    :rules="ucardRules"
    label-width="130px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('payment.payUName')" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            :placeholder="$t('payment.pleaseInput')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('payment.payUWalletType')" prop="type">
          <el-radio-group v-model="newFormInline.type">
            <el-radio
              v-for="item in walletTypeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('payment.payUUseType')" prop="useType">
      <el-radio-group v-model="newFormInline.useType">
        <el-radio
          v-for="item in useTypeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('payment.payUAddress')" prop="address">
      <el-input
        v-model="newFormInline.address"
        clearable
        :placeholder="$t('payment.pleaseInput')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.payUOriginalAmount')" prop="originalAmount">
      <el-input
        v-model="newFormInline.originalAmount"
        clearable
        :disabled="newFormInline.isUpdate"
        :placeholder="$t('payment.payUOriginalAmount2')"
      />
      <span class="ml-2 text-[var(--el-color-danger)] text-xs">
        {{ $t("payment.payUOriginalAmount3") }}
      </span>
    </el-form-item>
  </el-form>
</template>
