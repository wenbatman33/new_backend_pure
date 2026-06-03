<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    nameEn: "",
    source: "",
    depositLower: "",
    depositUpper: "",
    remark: ""
  }),
  isUpdate: false
});

// 來源：1 會員 / 2 代理
const sourceOptions = [
  { label: $t("payment.member"), value: 1 },
  { label: $t("payment.agency"), value: 2 }
];

// 系統內建組別名稱不可修改
const lockedNames = ["刚注册", "剛註冊"];

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
    label-width="160px"
  >
    <el-form-item :label="$t('payment.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :disabled="lockedNames.includes(String(newFormInline.name))"
        :placeholder="$t('payment.pleaseInputName')"
      />
    </el-form-item>

    <el-form-item label="GroupName(EN)" prop="nameEn">
      <el-input
        v-model="newFormInline.nameEn"
        clearable
        :disabled="lockedNames.includes(String(newFormInline.name))"
        :placeholder="$t('payment.pleaseInputNameEn')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.source')" prop="source">
      <el-select
        v-model="newFormInline.source"
        class="w-full"
        :disabled="props.isUpdate"
        :placeholder="$t('payment.pleaseSelectSource')"
      >
        <el-option
          v-for="item in sourceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('payment.depositLower')" prop="depositLower">
      <el-input
        v-model="newFormInline.depositLower"
        clearable
        :placeholder="$t('payment.pleaseInputDepositLower')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.depositUpper')" prop="depositUpper">
      <el-input
        v-model="newFormInline.depositUpper"
        clearable
        :placeholder="$t('payment.pleaseInputDepositUpper')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.remark')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        clearable
        :placeholder="$t('payment.remark')"
      />
    </el-form-item>
  </el-form>
</template>
