<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    description: "",
    hidden: false
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
    <el-form-item :label="$t('operator.categoryName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('operator.plzInputCategoryName')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('operator.classificationDescription')"
      prop="description"
    >
      <el-input
        v-model="newFormInline.description"
        clearable
        type="textarea"
        :rows="3"
        :placeholder="$t('operator.plzInputDescription')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.showOrHidden')" prop="hidden">
      <!-- active-value=false 代表顯示，inactive-value=true 代表隱藏，沿用舊邏輯 -->
      <el-switch
        v-model="newFormInline.hidden"
        :active-value="false"
        :inactive-value="true"
        :active-text="$t('operator.show')"
        :inactive-text="$t('operator.hidden')"
        inline-prompt
      />
    </el-form-item>
  </el-form>
</template>
