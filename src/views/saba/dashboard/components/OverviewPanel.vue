<script setup lang="ts">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { http } from "@/utils/http";
import { columnSets, getSabaLanguage } from "../utils/hook";
import type { RankRow } from "../utils/types";

// tab1_1：站台每日概況（無圖表，僅日期 + 表格）
const loading = ref(false);
const dataList = ref<RankRow[]>([]);
const columns = columnSets.overview();
const language = getSabaLanguage();

const dateRange = ref<[Date, Date]>([
  dayjs().add(-14, "day").startOf("day").toDate(),
  dayjs().endOf("day").toDate()
]);

async function fetchData() {
  if (!dateRange.value?.length) return;
  loading.value = true;
  try {
    const params = {
      start_date: dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
      end_date: dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
      sort_by: 3,
      language
    };
    const { success, data } = await http.request<{
      success: boolean;
      data: { Data: RankRow[] };
    }>("get", "/game/bo/saba/overviewbysite", { params });
    if (success) dataList.value = data?.Data ?? [];
  } finally {
    loading.value = false;
  }
}

defineExpose({ reload: fetchData });

onMounted(() => fetchData());
</script>

<template>
  <div>
    <el-form :inline="true" class="mb-2">
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
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="fetchData">
          {{ $t("saba.search") }}
        </el-button>
      </el-form-item>
    </el-form>

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
</template>
