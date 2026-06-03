<script setup lang="ts">
import { ref } from "vue";
import { pageFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { PageFormProps } from "./utils/types";

const props = withDefaults(defineProps<PageFormProps>(), {
  formInline: () => ({
    name: "",
    status: 0,
    code: ""
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
    :rules="pageFormRules"
    label-width="100px"
  >
    <el-form-item :label="$t('operator.title')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('operator.inputText')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.showOrHidden')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="0"
        :active-text="$t('operator.show')"
        :inactive-text="$t('operator.noShow')"
      />
    </el-form-item>

    <el-form-item label="code" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        :placeholder="$t('operator.inputText')"
      />
    </el-form-item>
  </el-form>
</template>
