<script setup lang="ts">
import { ref } from "vue";
import { groupFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { GroupFormProps } from "./utils/types";

const props = withDefaults(defineProps<GroupFormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    sort: 99,
    setName: ""
  }),
  isUpdate: false
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
    :rules="groupFormRules"
    label-width="150px"
  >
    <el-form-item v-if="props.isUpdate" label="ID" prop="id">
      <el-input v-model="newFormInline.id" disabled />
    </el-form-item>
    <el-form-item :label="$t('systemManage.domainName')" prop="name">
      <el-input v-model="newFormInline.name" :maxlength="20" clearable />
    </el-form-item>
    <el-form-item :label="$t('systemManage.sort')" prop="sort">
      <el-input v-model="newFormInline.sort" clearable />
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.setNameAndDisplayName')"
      prop="setName"
    >
      <el-input v-model="newFormInline.setName" clearable />
    </el-form-item>
  </el-form>
</template>
