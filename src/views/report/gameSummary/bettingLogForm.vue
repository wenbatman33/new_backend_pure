<script setup lang="ts">
import { ref } from "vue";
import { bettingLogRules } from "./utils/rule";
import { timeColumnOptions, statusFilterOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { BettingLogFormProps } from "./utils/types";

const props = withDefaults(defineProps<BettingLogFormProps>(), {
  formInline: () => ({
    gameGroupID: "",
    timeColumn: "",
    statusFilter: ""
  }),
  gameGroupList: () => []
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
    :rules="bettingLogRules"
    label-width="110px"
  >
    <el-form-item :label="$t('report.gameVendor')" prop="gameGroupID">
      <el-select
        v-model="newFormInline.gameGroupID"
        clearable
        filterable
        class="w-full"
      >
        <el-option
          v-for="item in gameGroupList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('report.bettingLogColumn')" prop="timeColumn">
      <el-select v-model="newFormInline.timeColumn" clearable class="w-full">
        <el-option
          v-for="item in timeColumnOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('report.recordStatus')" prop="statusFilter">
      <el-select v-model="newFormInline.statusFilter" clearable class="w-full">
        <el-option
          v-for="item in statusFilterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
