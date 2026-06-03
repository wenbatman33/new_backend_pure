<script setup lang="ts">
import { ref, onMounted } from "vue";
import { exportExcel } from "@/utils/report";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { getPageLogViewDetail } from "@/api/report";
import type { BannerClickDetailRow, DetailProps } from "./utils/types";

const props = withDefaults(defineProps<DetailProps>(), {
  date: ""
});

const loading = ref(true);
const dataList = ref<BannerClickDetailRow[]>([]);
const summary = ref<Record<string, any>>({});

const columns: TableColumnList = [
  { label: $t("report.adId"), prop: "bannerID" },
  { label: $t("report.adName"), prop: "bannerTitle" },
  { label: $t("report.clickTotal"), prop: "clickTotal" },
  { label: $t("report.clickGuest"), prop: "clickGuest" },
  { label: $t("report.clickMember"), prop: "clickMember" },
  { label: $t("report.countMember"), prop: "countMember" }
];

// pure-table 合計列：第一欄顯示「合計」，其餘對應 summary 欄位
function getSummaries({ columns: cols }) {
  return cols.map((col, idx) => {
    if (idx === 0) return $t("report.total");
    return summary.value?.[col.property] ?? "";
  });
}

async function loadData() {
  loading.value = true;
  try {
    const { data } = await getPageLogViewDetail({
      startDate: props.date,
      endDate: props.date
    });
    dataList.value = data?.list ?? [];
    summary.value = data?.summary ?? {};
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  exportExcel("/backend/report/page/log/view/export", {
    startDate: props.date,
    endDate: props.date
  });
}

onMounted(loadData);
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <span class="font-bold">{{ $t("report.date") }}: {{ props.date }}</span>
      <el-button
        v-if="hasAuth('__btn_banner_report_export')"
        type="primary"
        @click="handleExport"
      >
        {{ $t("report.exportExcel") }}
      </el-button>
    </div>
    <pure-table
      align-whole="center"
      border
      show-summary
      :summary-method="getSummaries"
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
