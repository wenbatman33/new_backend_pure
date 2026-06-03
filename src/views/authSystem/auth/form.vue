<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    fnID: undefined,
    fnName: "",
    displayFnName: "",
    fnKey: "",
    parentID: undefined,
    parentOptions: [],
    showCN: true,
    showEN: true,
    isUpdate: false
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
    label-width="130px"
  >
    <el-form-item
      v-if="newFormInline.isUpdate"
      label="ID"
      prop="fnID"
    >
      <el-input v-model="newFormInline.fnID" disabled />
    </el-form-item>

    <el-form-item
      v-if="newFormInline.showCN"
      :label="$t('authSystem.fnNameCN')"
      prop="fnName"
    >
      <el-input v-model="newFormInline.fnName" clearable />
    </el-form-item>

    <el-form-item
      v-if="newFormInline.showEN"
      :label="$t('authSystem.fnNameEN')"
      prop="displayFnName"
    >
      <el-input v-model="newFormInline.displayFnName" clearable />
    </el-form-item>

    <el-form-item :label="$t('authSystem.fnKey')" prop="fnKey">
      <el-input
        v-model="newFormInline.fnKey"
        clearable
        :placeholder="$t('authSystem.titleHelpMessage')"
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.parentID')" prop="parentID">
      <el-select
        v-model="newFormInline.parentID"
        clearable
        filterable
        class="w-full"
        :placeholder="$t('authSystem.chooseText')"
      >
        <el-option
          v-for="item in newFormInline.parentOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
