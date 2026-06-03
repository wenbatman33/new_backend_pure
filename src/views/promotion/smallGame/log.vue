<script setup lang="ts">
import { ref, onMounted, h } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getSmallGamePromotionLog } from "@/api/promotion";

const props = defineProps<{
  promotionLaunchedID: number;
  name?: string;
}>();

const loading = ref(true);
const logList = ref<any[]>([]);

const columns: TableColumnList = [
  { label: $t("promotion.time"), prop: "updatedAt", width: 160 },
  { label: $t("promotion.updatePpl"), prop: "updatedUser", width: 100 },
  { label: $t("promotion.action"), prop: "action", width: 100 },
  {
    label: $t("promotion.content"),
    prop: "content",
    cellRenderer: ({ row }) => h("span", { innerHTML: row.content })
  }
];

async function fetchLog() {
  loading.value = true;
  try {
    const { data } = await getSmallGamePromotionLog({
      promotionLaunchedID: props.promotionLaunchedID
    });
    logList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchLog);
</script>

<template>
  <div>
    <p class="mb-2">{{ $t("promotion.name") }}: {{ name }}</p>
    <pure-table
      align-whole="center"
      :loading="loading"
      :data="logList"
      :columns="columns"
    />
  </div>
</template>
