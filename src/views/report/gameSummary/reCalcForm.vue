<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { reCalcRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { deleteTask } from "@/api/report";
import { message } from "@/utils/message";
import type { ReCalcFormProps } from "./utils/types";

const props = withDefaults(defineProps<ReCalcFormProps>(), {
  formInline: () => ({
    module: "",
    startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  }),
  gameGroupList: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

// 清除手动补流水 Task 状态
async function handleClearTask() {
  const { success } = await deleteTask();
  if (success) {
    message($t("report.clearReCalcSuccess"), { type: "success" });
  }
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="reCalcRules"
    label-width="110px"
  >
    <el-form-item :label="$t('report.reCalcVendor')" prop="module">
      <el-select
        v-model="newFormInline.module"
        clearable
        filterable
        class="w-full"
        :placeholder="$t('report.gameVendor')"
      >
        <el-option
          v-for="item in gameGroupList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('report.reCalcRange')" prop="startTime">
      <div class="flex items-center gap-2 w-full">
        <el-date-picker
          v-model="newFormInline.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('report.startTime')"
        />
        <span>{{ $t("report.to") }}</span>
        <el-date-picker
          v-model="newFormInline.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('report.endTime')"
        />
      </div>
    </el-form-item>

    <el-form-item>
      <el-button @click="handleClearTask">
        {{ $t("report.clearReCalcTask") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
