<script setup lang="ts">
import { ref } from "vue";
import { accountFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AccountFormProps } from "./utils/types";

const props = withDefaults(defineProps<AccountFormProps>(), {
  formInline: () => ({ accounts: "" }),
  mode: "member"
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
    :rules="accountFormRules"
    label-width="120px"
  >
    <el-form-item
      :label="
        props.mode === 'member'
          ? $t('payment.memberAccounts')
          : $t('payment.agencyAccounts')
      "
      prop="accounts"
    >
      <el-input
        v-model="newFormInline.accounts"
        type="textarea"
        :rows="4"
        clearable
        :placeholder="
          props.mode === 'member'
            ? $t('payment.memberAccountsTip')
            : $t('payment.agencyAccountsTip')
        "
      />
    </el-form-item>
  </el-form>
</template>
