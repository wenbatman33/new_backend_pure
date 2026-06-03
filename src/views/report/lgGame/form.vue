<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    startTime: "",
    endTime: ""
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
    <el-form-item :label="$t('report.startDate')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="!w-[220px]"
        :placeholder="$t('report.startDate')"
      />
    </el-form-item>

    <el-form-item :label="$t('report.endDate')" prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="!w-[220px]"
        :placeholder="$t('report.endDate')"
      />
    </el-form-item>
  </el-form>
</template>
