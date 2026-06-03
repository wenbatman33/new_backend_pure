<!--
 * @desc 起訖時間選擇器（pure-admin / Element Plus 原生版）
 *       對外保持與舊 Vben 版相同介面：v-model:start / v-model:end，輸出字串。
 *
 * @prop {String}  start          - 開始日期/時間值（字串）。
 * @prop {String}  end            - 結束日期/時間值（字串）。
 * @prop {Boolean} showTimePicker - 是否含時間（true=日期時間, false=純日期）。預設 true。
 * @prop {Boolean} disabled       - 是否禁用。預設 false。
 * @prop {Boolean} isClickNow     - 變更時是否取整到分鐘（沿用舊行為）。預設 false。
 * @prop {Boolean} allowClear     - 是否可清除。預設 true。
 * @prop {Boolean} showSeconds    - 顯示秒。預設 false。
 *
 * @example
 *   <StartEnd v-model:start="startDate" v-model:end="endDate" :show-time-picker="true" />
-->

<template>
  <div class="flex flex-row items-center">
    <el-date-picker
      v-model="StartTime"
      :type="dateType"
      :format="displayFormat"
      value-format="YYYY-MM-DD HH:mm:ss"
      :disabled="props.disabled"
      :clearable="props.allowClear"
      :placeholder="$t('common.startTime')"
      @update:model-value="val => setTimeField('start', val)"
    />
    <span class="flex-shrink-0 px-2">～</span>
    <el-date-picker
      v-model="EndTime"
      :type="dateType"
      :format="displayFormat"
      value-format="YYYY-MM-DD HH:mm:ss"
      :disabled="props.disabled"
      :clearable="props.allowClear"
      :placeholder="$t('common.endTime')"
      @update:model-value="val => setTimeField('end', val)"
    />
  </div>
</template>

<script lang="ts" setup>
// vue
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "StartEnd" });

const props = defineProps({
  start: String,
  end: String,
  showTimePicker: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isClickNow: {
    type: Boolean,
    default: false
  },
  allowClear: {
    type: Boolean,
    default: true
  },
  showSeconds: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:start", "update:end"]);

const StartTime = ref<string | null>(null);
const EndTime = ref<string | null>(null);

// el-date-picker 類型：含時間→datetime，純日期→date
const dateType = computed(() => (props.showTimePicker ? "datetime" : "date"));

// 顯示格式
const displayFormat = computed(() => {
  if (!props.showTimePicker) return "YYYY/MM/DD";
  return props.showSeconds ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD HH:mm";
});

// 輸出格式：純日期僅輸出日期，否則輸出日期時間
const outputFormat = computed(() =>
  props.showTimePicker ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
);

// 設定欄位值並對外 emit（沿用舊版起訖補齊邏輯）
const setTimeField = (field: "start" | "end", value: string | null) => {
  if (!value) {
    // 清空
    if (field === "start") {
      StartTime.value = null;
      emit("update:start", null);
    } else {
      EndTime.value = null;
      emit("update:end", null);
    }
    return;
  }

  let d = dayjs(value);
  if (!props.showTimePicker) {
    // 純日期：start 取當日起點、end 取當日終點
    d = field === "start" ? d.startOf("day") : d.endOf("day");
  } else if (props.isClickNow) {
    // 沿用舊行為：取整到分鐘
    d = d.startOf("minute");
  }

  const out = d.format(outputFormat.value);
  if (field === "start") {
    StartTime.value = value;
    emit("update:start", out);
  } else {
    EndTime.value = value;
    emit("update:end", out);
  }
};

watch(
  () => props.start,
  () => {
    StartTime.value = props.start ?? null;
  },
  { immediate: true }
);
watch(
  () => props.end,
  () => {
    EndTime.value = props.end ?? null;
  },
  { immediate: true }
);
</script>
