<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    memberAccounts: "",
    types: [],
    reason: ""
  })
});

const typeOptions = [
  { label: $t("vip.giftMoneyBlacklist"), value: 1 },
  { label: $t("vip.rebateBlacklist"), value: 2 }
];

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
    <el-form-item :label="$t('vip.memberAccount')" prop="memberAccounts">
      <el-input
        v-model="newFormInline.memberAccounts"
        clearable
        type="textarea"
        :rows="2"
        :placeholder="$t('vip.memberAccountsTip')"
      />
    </el-form-item>

    <el-form-item :label="$t('vip.blacklistType')" prop="types">
      <el-checkbox-group v-model="newFormInline.types">
        <el-checkbox
          v-for="item in typeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('vip.blacklistReason')" prop="reason">
      <el-input
        v-model="newFormInline.reason"
        type="textarea"
        :rows="4"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
