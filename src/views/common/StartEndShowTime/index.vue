<!--
 * 起訖時間元件（pure-admin / Element Plus 原生改寫）
 *
 * @desc 用於選擇開始和結束日期/時間，含快捷時間捷徑下拉。
 * @prop {string} start - 開始日期/時間值（格式 YYYY-MM-DD HH:mm:ss）
 * @prop {string} end   - 結束日期/時間值
 * @prop {boolean} disabled  - 是否禁用，預設 false
 * @prop {boolean} allowClear - 是否可清除，預設 true
 * @emit update:start - 開始時間變更（對應 v-model:start）
 * @emit update:end   - 結束時間變更（對應 v-model:end）
 *
 * @example
 *   <StartEndShowTime v-model:start="startDate" v-model:end="endDate" />
-->
<template>
  <div class="flex flex-row items-center gap-2">
    <el-select
      v-model="quickTimeRange"
      :placeholder="$t('common.quickTimeShortcut')"
      style="width: 110px"
      :disabled="props.disabled"
      clearable
      size="small"
      @change="handleQuickTimeChange"
    >
      <el-option
        v-for="opt in quickTimeOptions"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>

    <el-date-picker
      v-model="StartTime"
      type="datetime"
      :format="DISPLAY_FORMAT"
      :value-format="VALUE_FORMAT"
      :placeholder="$t('common.startTime')"
      :disabled="props.disabled"
      :clearable="props.allowClear"
      @update:model-value="setTimeField('start', $event)"
    />

    <span class="flex-shrink-0 px-4">～</span>

    <el-date-picker
      v-model="EndTime"
      type="datetime"
      :format="DISPLAY_FORMAT"
      :value-format="VALUE_FORMAT"
      :placeholder="$t('common.endTime')"
      :disabled="props.disabled"
      :clearable="props.allowClear"
      @update:model-value="setTimeField('end', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick } from "vue";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { transformI18n as $t } from "@/plugins/i18n";

dayjs.extend(weekOfYear);

defineOptions({ name: "StartEndShowTime" });

const props = defineProps({
  start: String,
  end: String,
  disabled: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true }
});

const emit = defineEmits(["update:start", "update:end"]);

const VALUE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DISPLAY_FORMAT = "YYYY-MM-DD HH:mm:ss";

const StartTime = ref<string | null>(null);
const EndTime = ref<string | null>(null);
const preStartTime = ref<string | null>(null);
const preEndTime = ref<string | null>(null);
const quickTimeRange = ref<string | undefined>(undefined);

// 快捷時間選項
const quickTimeOptions = computed(() => [
  { label: $t("common.today"), value: "today" },
  { label: $t("common.yesterday"), value: "yesterday" },
  { label: $t("common.dayBeforeYesterday"), value: "dayBeforeYesterday" },
  { label: $t("common.thisWeek"), value: "thisWeek" },
  { label: $t("common.lastWeek"), value: "lastWeek" },
  { label: $t("common.thisMonth"), value: "thisMonth" },
  { label: $t("common.lastMonth"), value: "lastMonth" }
]);

// 處理快捷時間選擇
const handleQuickTimeChange = (value: string) => {
  if (!value) return;

  let start: dayjs.Dayjs;
  let end: dayjs.Dayjs;

  switch (value) {
    case "today":
      start = dayjs().startOf("day");
      end = dayjs().endOf("day");
      break;
    case "yesterday":
      start = dayjs().subtract(1, "day").startOf("day");
      end = dayjs().subtract(1, "day").endOf("day");
      break;
    case "dayBeforeYesterday":
      start = dayjs().subtract(2, "day").startOf("day");
      end = dayjs().subtract(2, "day").endOf("day");
      break;
    case "thisWeek":
      start = dayjs().startOf("week");
      end = dayjs().endOf("week");
      break;
    case "lastWeek":
      start = dayjs().subtract(1, "week").startOf("week");
      end = dayjs().subtract(1, "week").endOf("week");
      break;
    case "thisMonth":
      start = dayjs().startOf("month");
      end = dayjs().endOf("month");
      break;
    case "lastMonth":
      start = dayjs().subtract(1, "month").startOf("month");
      end = dayjs().subtract(1, "month").endOf("month");
      break;
    default:
      return;
  }

  setTime("start", start.format(VALUE_FORMAT));
  setTime("end", end.format(VALUE_FORMAT));

  // 重置下拉，回到原狀
  nextTick(() => {
    quickTimeRange.value = undefined;
  });
};

const setTime = (field: "start" | "end", time: string | null) => {
  if (field === "start") {
    preStartTime.value = StartTime.value = time;
    emit("update:start", time);
  } else {
    preEndTime.value = EndTime.value = time;
    emit("update:end", time);
  }
};

const setTimeField = (field: "start" | "end", value: string | null) => {
  if (value === null || value === "") {
    // 清空時全清空
    setTime(field, null);
    return;
  }
  // 變更日期：首次選擇時補上當日起/迄時間，否則保留所選時間
  if (field === "start") {
    setTime(
      field,
      preStartTime.value === null || preStartTime.value === ""
        ? dayjs(value).startOf("day").format(VALUE_FORMAT)
        : dayjs(value).format(VALUE_FORMAT)
    );
  } else {
    setTime(
      field,
      preEndTime.value === null || preEndTime.value === ""
        ? dayjs(value).endOf("day").format(VALUE_FORMAT)
        : dayjs(value).format(VALUE_FORMAT)
    );
  }
};

watch(
  () => props.start,
  () => {
    preStartTime.value = StartTime.value = props.start || null;
  },
  { immediate: true }
);
watch(
  () => props.end,
  () => {
    preEndTime.value = EndTime.value = props.end || null;
  },
  { immediate: true }
);
</script>
