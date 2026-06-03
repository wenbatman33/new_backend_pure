<script setup lang="ts">
import { ref } from "vue";
import { memberFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { MemberFormProps } from "./utils/types";

const props = withDefaults(
  defineProps<MemberFormProps & { isAgency?: boolean }>(),
  {
    formInline: () => ({
      payGroupID: 0,
      name: "",
      nameEn: "",
      accounts: ""
    }),
    isAgency: false
  }
);

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
    :rules="memberFormRules"
    label-width="120px"
  >
    <el-form-item :label="$t('payment.name')">
      <span>{{ newFormInline.name }}</span>
    </el-form-item>
    <el-form-item label="GroupName">
      <span>{{ newFormInline.nameEn }}</span>
    </el-form-item>
    <el-form-item :label="$t('payment.source')">
      <span>{{ isAgency ? $t("payment.agency") : $t("payment.member") }}</span>
    </el-form-item>
    <el-form-item :label="$t('payment.memberAccounts')" prop="accounts">
      <el-input
        v-model="newFormInline.accounts"
        type="textarea"
        :rows="4"
        clearable
        :placeholder="$t('payment.memberAccounts2')"
      />
    </el-form-item>
  </el-form>
</template>
