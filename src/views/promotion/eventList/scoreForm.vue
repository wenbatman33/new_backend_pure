<script setup lang="ts">
import { ref } from "vue";
import { scoreFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { ScoreFormProps } from "./utils/types";

const props = withDefaults(defineProps<ScoreFormProps>(), {
  formInline: () => ({
    promoEventID: "",
    promoGameID: "",
    score: 0
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
    :rules="scoreFormRules"
    label-width="110px"
  >
    <el-form-item :label="$t('promotion.activityCode')" prop="promoEventID">
      <el-input v-model="newFormInline.promoEventID" disabled />
    </el-form-item>
    <el-form-item :label="$t('promotion.eventNumber')" prop="promoGameID">
      <el-input v-model="newFormInline.promoGameID" disabled />
    </el-form-item>
    <el-form-item :label="$t('promotion.totalScore')" prop="score">
      <el-input-number v-model="newFormInline.score" :min="0" class="!w-full" />
    </el-form-item>
  </el-form>
</template>
