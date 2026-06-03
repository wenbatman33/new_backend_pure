<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { RoleFormProps } from "./utils/types";

const props = withDefaults(defineProps<RoleFormProps>(), {
  formInline: () => ({
    roleID: undefined,
    roleName: "",
    note: "",
    status: 1,
    financeWithdrawalBeep: false,
    riskWithdrawalBeep: false
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
    <el-form-item
      v-if="newFormInline.roleID"
      :label="$t('authSystem.roleID')"
      prop="roleID"
    >
      <el-input v-model="newFormInline.roleID" disabled />
    </el-form-item>

    <el-form-item :label="$t('authSystem.groupName')" prop="roleName">
      <el-input
        v-model="newFormInline.roleName"
        clearable
        :placeholder="$t('authSystem.groupName')"
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.remark')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        clearable
        :placeholder="$t('authSystem.remark')"
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.status')" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio-button :value="1">{{ $t("authSystem.enable") }}</el-radio-button>
        <el-radio-button :value="2">{{ $t("authSystem.disable") }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('authSystem.financeWithdrawalBeep')">
      <el-switch
        v-model="newFormInline.financeWithdrawalBeep"
        :active-text="$t('authSystem.enable')"
        :inactive-text="$t('authSystem.disable')"
        inline-prompt
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.riskWithdrawalBeep')">
      <el-switch
        v-model="newFormInline.riskWithdrawalBeep"
        :active-text="$t('authSystem.enable')"
        :inactive-text="$t('authSystem.disable')"
        inline-prompt
      />
    </el-form-item>
  </el-form>
</template>
