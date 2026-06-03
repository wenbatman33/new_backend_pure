<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    info: "",
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
    label-width="140px"
  >
    <el-form-item :label="$t('activity.quizGameInfo')">
      <span>{{ newFormInline.info }}</span>
    </el-form-item>

    <el-form-item :label="$t('activity.quizStartTime')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        class="!w-[260px]"
        :placeholder="$t('activity.quizStartTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.quizEndTime')" prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        class="!w-[260px]"
        :placeholder="$t('activity.quizEndTime')"
      />
    </el-form-item>
  </el-form>
</template>
