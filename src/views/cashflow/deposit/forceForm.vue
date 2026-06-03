<script setup lang="ts">
import { ref } from "vue";
import { forceFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { ForceFormProps } from "./utils/types";

const props = withDefaults(defineProps<ForceFormProps>(), {
  formInline: () => ({ note: "", thirdID: "" }),
  needThirdID: false
});

// 依是否需要三方單號決定校驗規則
const rules = props.needThirdID
  ? forceFormRules
  : { note: forceFormRules.note };

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
    :rules="rules"
    label-width="100px"
  >
    <el-form-item :label="$t('cashflow.agencyMainTable9')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        :placeholder="$t('cashflow.depositForceFail2')"
      />
    </el-form-item>
    <el-form-item
      v-if="needThirdID"
      :label="$t('cashflow.depositForceFail4')"
      prop="thirdID"
    >
      <el-input
        v-model="newFormInline.thirdID"
        :placeholder="$t('cashflow.depositForceFail5')"
      />
    </el-form-item>
  </el-form>
</template>
