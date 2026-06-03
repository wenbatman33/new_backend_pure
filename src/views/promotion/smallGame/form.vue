<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

// TODO: 舊 SmallGameModal 為多步驟巨型表單(多語系文案/條件設定/按鈕設定/上架時間/OTP驗證)，
// 此處先實作基礎欄位，完整步驟待後續補完。
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    internalName: "",
    name: "",
    display: 1
  })
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
    :rules="formRules"
    label-width="120px"
  >
    <el-form-item :label="$t('promotion.internalName')" prop="internalName">
      <el-input
        v-model="newFormInline.internalName"
        clearable
        :placeholder="$t('promotion.plzEnterInternalName')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.listingName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('promotion.plzEnterListingName')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.show')" prop="display">
      <el-radio-group v-model="newFormInline.display">
        <el-radio :value="1">{{ $t("promotion.show") }}</el-radio>
        <el-radio :value="2">{{ $t("promotion.hidden") }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
