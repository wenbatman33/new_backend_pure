<script setup lang="ts">
import { ref } from "vue";
import { domainFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { DomainFormProps } from "./utils/types";

const props = withDefaults(defineProps<DomainFormProps>(), {
  formInline: () => ({
    id: undefined,
    groupID: "",
    name: "",
    displayName: "",
    domain: "",
    sort: 1,
    note: ""
  }),
  groupList: () => [],
  limited: false
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
    :rules="domainFormRules"
    label-width="150px"
  >
    <el-form-item v-if="newFormInline.id" label="ID" prop="id">
      <el-input v-model="newFormInline.id" disabled />
    </el-form-item>
    <el-form-item :label="$t('systemManage.belongGroup')" prop="groupID">
      <el-select
        v-model="newFormInline.groupID"
        :disabled="props.limited"
        class="w-full"
      >
        <el-option
          v-for="item in props.groupList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('systemManage.domainName')" prop="name">
      <el-input v-model="newFormInline.name" :disabled="props.limited" clearable />
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.setNameAndDisplayName')"
      prop="displayName"
    >
      <el-input
        v-model="newFormInline.displayName"
        :disabled="props.limited"
        clearable
      />
    </el-form-item>
    <el-form-item :label="$t('systemManage.domain')" prop="domain">
      <el-input v-model="newFormInline.domain" clearable />
    </el-form-item>
    <el-form-item :label="$t('systemManage.sort')" prop="sort">
      <el-input v-model="newFormInline.sort" clearable />
    </el-form-item>
    <el-form-item :label="$t('systemManage.note')" prop="note">
      <el-input v-model="newFormInline.note" :maxlength="40" clearable />
    </el-form-item>
  </el-form>
</template>
