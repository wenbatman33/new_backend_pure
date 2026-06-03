<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    name: "",
    internalName: "",
    status: 1,
    startTime: "",
    endTime: ""
  })
});

const statusOptions = [
  { label: $t("independentEvent.enable"), value: 1 },
  { label: $t("independentEvent.disable"), value: 2 }
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
    <el-form-item :label="$t('independentEvent.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('independentEvent.nameTip')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('independentEvent.internalName')"
      prop="internalName"
    >
      <el-input
        v-model="newFormInline.internalName"
        clearable
        :placeholder="$t('independentEvent.internalNameTip')"
      />
    </el-form-item>

    <el-form-item :label="$t('independentEvent.status')" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('independentEvent.startTime')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="!w-full"
        :placeholder="$t('independentEvent.startTimeTip')"
      />
    </el-form-item>

    <el-form-item :label="$t('independentEvent.endTime')" prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="!w-full"
        :placeholder="$t('independentEvent.endTimeTip')"
      />
    </el-form-item>

    <!-- TODO: 舊版 Step1~Step5 多步驟精靈（遊戲群組/標籤/投放/條件模板）待依賴移植後補 -->
  </el-form>
</template>
