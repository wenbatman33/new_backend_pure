<script setup lang="ts">
import { ref, computed } from "vue";
import { pointFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { PointFormProps } from "./utils/types";

const props = withDefaults(defineProps<PointFormProps>(), {
  formInline: () => ({
    name: "",
    eventType: "",
    eventCode: "",
    event: 1,
    url: []
  }),
  urlOptions: () => []
});

const eventTypeOptions = [
  { label: "GTM", value: 1 },
  { label: "GA", value: 2 },
  { label: "FB", value: 3 },
  { label: "Mouseflow", value: 4 },
  { label: "Microsoft Clarity", value: 5 },
  { label: "Other", value: 6 }
];

// 不同分类对应代码栏前缀与组件型态
const codeConfig: Record<number, { prefix: string; textarea: boolean }> = {
  1: { prefix: "GTM-", textarea: false },
  2: { prefix: "G-", textarea: false },
  3: { prefix: "", textarea: false },
  4: { prefix: "", textarea: false },
  5: { prefix: "", textarea: false },
  6: { prefix: "", textarea: true }
};

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 是否已选分类，未选时不显示代码/支持事件栏
const hasEventType = computed(() => !!newFormInline.value.eventType);
const currentCodeConfig = computed(
  () => codeConfig[newFormInline.value.eventType as number] ?? { prefix: "", textarea: false }
);

// 选择分类时：GTM/GA/FB 支持事件=是，其余=否
function handleEventTypeChange(val: number) {
  newFormInline.value.event = val === 1 || val === 2 || val === 3 ? 1 : 2;
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="pointFormRules"
    label-width="120px"
  >
    <el-form-item :label="$t('operator.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('operator.plzEnterName')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.classification')" prop="eventType">
      <el-select
        v-model="newFormInline.eventType"
        clearable
        class="w-full"
        :placeholder="$t('operator.chooseText')"
        @change="handleEventTypeChange"
      >
        <el-option
          v-for="item in eventTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="hasEventType"
      :label="currentCodeConfig.prefix || $t('operator.code')"
      prop="eventCode"
    >
      <el-input
        v-model="newFormInline.eventCode"
        clearable
        :type="currentCodeConfig.textarea ? 'textarea' : 'text'"
        :rows="currentCodeConfig.textarea ? 6 : undefined"
        :placeholder="$t('operator.plzEnterCode')"
      />
    </el-form-item>

    <el-form-item
      v-if="hasEventType"
      :label="$t('operator.supportEvent')"
      prop="event"
    >
      <el-radio-group v-model="newFormInline.event" disabled>
        <el-radio :value="1">{{ $t("operator.yes") }}</el-radio>
        <el-radio :value="2">{{ $t("operator.no") }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('operator.url')" prop="url">
      <el-checkbox-group v-model="newFormInline.url">
        <el-checkbox
          v-for="item in urlOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
