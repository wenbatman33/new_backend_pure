<script setup lang="ts">
import { ref } from "vue";
import { groupFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { GroupFormProps } from "./utils/types";

const props = withDefaults(defineProps<GroupFormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    color: "#000000"
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
    label-width="100px"
  >
    <el-form-item v-if="isUpdate" :label="$t('member.tagId')" prop="id">
      <el-input v-model="newFormInline.id" disabled />
    </el-form-item>
    <el-form-item :label="$t('member.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>
    <el-form-item :label="$t('member.representColor')" prop="color">
      <el-color-picker v-model="newFormInline.color" />
    </el-form-item>
  </el-form>
</template>
