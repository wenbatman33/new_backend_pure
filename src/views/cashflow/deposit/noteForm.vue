<script setup lang="ts">
import { ref } from "vue";
import { noteFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { NoteFormProps } from "./utils/types";

const props = withDefaults(defineProps<NoteFormProps>(), {
  formInline: () => ({ note: "" })
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
    :rules="noteFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('cashflow.description')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="6" />
    </el-form-item>
  </el-form>
</template>
