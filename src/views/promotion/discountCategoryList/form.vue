<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    promotionTypeID: "",
    locale: "",
    typeName: "",
    sort: 0
  }),
  status: "add"
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
    label-width="100px"
  >
    <el-form-item :label="$t('promotion.categoryId')" prop="promotionTypeID">
      <el-input
        v-model="newFormInline.promotionTypeID"
        clearable
        :disabled="status === 'edit'"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.locale')" prop="locale">
      <el-input v-model="newFormInline.locale" clearable />
    </el-form-item>

    <el-form-item :label="$t('promotion.typeName')" prop="typeName">
      <el-input v-model="newFormInline.typeName" clearable />
    </el-form-item>

    <el-form-item :label="$t('promotion.sort')" prop="sort">
      <el-input-number
        v-model="newFormInline.sort"
        :min="0"
        controls-position="right"
      />
    </el-form-item>
  </el-form>
</template>
