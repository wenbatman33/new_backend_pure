<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { sourceType } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ID: 0,
    name: "",
    nameEn: "",
    source: "",
    depositLower: "",
    depositUpper: "",
    remark: "",
    isUpdate: false
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

/** 內建系統組別（ID 1~4）名稱與英文名稱不可編輯 */
const nameDisabled = computed(() =>
  [1, 2, 3, 4].includes(Number(newFormInline.value.ID))
);
/** 編輯模式下來源不可變更 */
const sourceDisabled = computed(() => newFormInline.value.isUpdate);

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
    label-width="170px"
  >
    <el-form-item :label="$t('payment.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :disabled="nameDisabled"
        :placeholder="$t('payment.pleaseInput') + $t('payment.name')"
      />
    </el-form-item>

    <el-form-item label="GroupName(EN)" prop="nameEn">
      <el-input
        v-model="newFormInline.nameEn"
        clearable
        :disabled="nameDisabled"
        :placeholder="$t('payment.pleaseInput') + 'GroupName'"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.source')" prop="source">
      <el-select
        v-model="newFormInline.source"
        class="w-full"
        :disabled="sourceDisabled"
        :placeholder="$t('payment.source')"
      >
        <el-option
          v-for="item in sourceType"
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
        :placeholder="$t('payment.pleaseInput') + $t('payment.depositLower')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.depositUpper')" prop="depositUpper">
      <el-input
        v-model="newFormInline.depositUpper"
        clearable
        :placeholder="$t('payment.pleaseInput') + $t('payment.depositUpper')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.remark')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        clearable
        :placeholder="$t('payment.pleaseInput') + $t('payment.remark')"
      />
    </el-form-item>
  </el-form>
</template>
