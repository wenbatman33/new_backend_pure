<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getLotteryLog, type LotteryListResult } from "@/api/promotion";

const props = defineProps<{ logId: number }>();

const loading = ref(true);
const dataList = ref<any[]>([]);

const columns: TableColumnList = [
  { label: $t("promotion.lotteryLogTime"), prop: "updatedAt", width: 170 },
  { label: $t("promotion.lotteryLogUser"), prop: "updatedUser", width: 130 },
  { label: $t("promotion.lotteryLogItem"), prop: "item", width: 130 },
  { label: $t("promotion.lotteryLogContent"), prop: "content" }
];

async function loadLog() {
  loading.value = true;
  try {
    const { data } = (await getLotteryLog({ id: props.logId })) as LotteryListResult;
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadLog);
</script>

<template>
  <pure-table
    align-whole="center"
    border
    :loading="loading"
    :data="dataList"
    :columns="columns"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
  />
</template>
