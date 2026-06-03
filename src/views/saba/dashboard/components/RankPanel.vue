<script setup lang="ts">
import { ref, reactive, watch, onMounted, type Ref, computed } from "vue";
import dayjs from "dayjs";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { http } from "@/utils/http";
import {
  getSortOptions,
  buildBarOption,
  getSabaLanguage
} from "../utils/hook";
import type { RankRow } from "../utils/types";

/**
 * 通用排名面板：日期區間 + (圖表/列表切換) + 排序下拉 + 橫向長條圖 + 表格
 * 透過 props 指定要打的後端 endpoint、表格欄位、圖表 Y 軸欄位
 */
const props = defineProps<{
  // 後端排名 endpoint（沿用舊 endpoint 字串）
  url: string;
  // 表格欄位
  columns: TableColumnList;
  // 圖表 Y 軸標籤欄位（SportName / LeagueName / TeamName ...）
  labelProp: keyof RankRow;
  // 是否帶 sort_by（佔比類面板可不顯示排序下拉）
  withSort?: boolean;
  // 圖表左側留白
  chartLeftPad?: number;
}>();

const sortOptions = getSortOptions();
const loading = ref(false);
const showType = ref(1); // 1 圖表 2 列表
const sortBy = ref(1);
const dataList = ref<RankRow[]>([]);
const language = getSabaLanguage();

const dateRange = ref<[Date, Date]>([
  dayjs().add(-14, "day").startOf("day").toDate(),
  dayjs().endOf("day").toDate()
]);

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);

const chartHeight = computed(
  () => (dataList.value.length > 0 ? dataList.value.length * 32 + 120 : 200) + "px"
);

async function fetchData() {
  if (!dateRange.value?.length) return;
  loading.value = true;
  try {
    const params: Record<string, any> = {
      start_date: dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
      language
    };
    if (props.withSort !== false) params.sort_by = sortBy.value;
    const { success, data } = await http.request<{
      success: boolean;
      data: { Data: RankRow[] };
    }>("get", props.url, { params });
    if (success) {
      dataList.value = data?.Data ?? [];
      renderChart();
    }
  } finally {
    loading.value = false;
  }
}

function renderChart() {
  if (showType.value !== 1) return;
  setOptions(
    buildBarOption(
      dataList.value,
      props.labelProp,
      props.withSort !== false ? sortBy.value : 1,
      props.chartLeftPad ?? 120
    ) as any
  );
  resize();
}

watch(showType, () => {
  if (showType.value === 1) renderChart();
});

defineExpose({ reload: fetchData });

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <!-- 條件列 -->
    <el-form :inline="true" class="mb-2">
      <el-form-item>
        <el-radio-group v-model="showType" :disabled="loading">
          <el-radio-button :value="1">{{ $t("saba.showType1") }}</el-radio-button>
          <el-radio-button :value="2">{{ $t("saba.showType2") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('saba.dateRange')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :disabled="loading"
          range-separator="~"
          :start-placeholder="$t('saba.startDate')"
          :end-placeholder="$t('saba.endDate')"
        />
      </el-form-item>
      <el-form-item v-if="withSort !== false" :label="$t('saba.sortBy')">
        <el-select
          v-model="sortBy"
          class="!w-[150px]"
          :disabled="loading"
          @change="fetchData"
        >
          <el-option
            v-for="opt in sortOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="fetchData">
          {{ $t("saba.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 圖表 -->
    <div v-show="showType === 1" v-loading="loading">
      <div ref="chartRef" :style="{ width: '100%', height: chartHeight }" />
    </div>

    <!-- 列表 -->
    <div v-show="showType === 2">
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :loading="loading"
        :data="dataList"
        :columns="columns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </div>
  </div>
</template>
