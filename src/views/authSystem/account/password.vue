<script setup lang="ts">
import { ref } from "vue";
import { passwordRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { PasswordProps } from "./utils/types";

const props = withDefaults(defineProps<PasswordProps>(), {
  formInline: () => ({
    adminID: undefined,
    account: "",
    newpassword: "",
    password2: ""
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
    :rules="passwordRules"
    label-width="120px"
  >
    <el-form-item label="ID">
      <el-input v-model="newFormInline.adminID" disabled />
    </el-form-item>

    <el-form-item :label="$t('authSystem.newPass')" prop="newpassword">
      <el-input
        v-model="newFormInline.newpassword"
        type="password"
        clearable
        show-password
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.password2')" prop="password2">
      <el-input
        v-model="newFormInline.password2"
        type="password"
        clearable
        show-password
      />
    </el-form-item>
  </el-form>
</template>
