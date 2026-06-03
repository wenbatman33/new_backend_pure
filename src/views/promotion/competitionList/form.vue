<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ID: 0,
    name: "",
    status: 1,
    leagueReportCalc: 1
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
    label-width="150px"
  >
    <el-form-item
      v-if="newFormInline.ID"
      :label="$t('promotion.leagueID')"
    >
      <span>{{ newFormInline.ID }}</span>
    </el-form-item>

    <el-form-item :label="$t('promotion.leagueName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('promotion.pleaseEnterLeagueName')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.status')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="2"
        :active-text="$t('promotion.enable')"
        :inactive-text="$t('promotion.disable')"
        inline-prompt
      />
    </el-form-item>

    <el-form-item
      :label="$t('promotion.leagueReportCalc')"
      prop="leagueReportCalc"
    >
      <el-switch
        v-model="newFormInline.leagueReportCalc"
        :active-value="1"
        :inactive-value="2"
        :active-text="$t('promotion.enable')"
        :inactive-text="$t('promotion.disable')"
        inline-prompt
      />
    </el-form-item>
  </el-form>
</template>
