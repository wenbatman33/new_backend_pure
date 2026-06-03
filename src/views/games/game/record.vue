<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getGameLog } from "@/api/games";

const props = defineProps<{ gameId: number | string }>();

const dataList = ref<any[]>([]);
const loading = ref(true);

const columns: TableColumnList = [
  { label: $t("games.time"), prop: "updatedAt", width: 200 },
  { label: $t("games.operator"), prop: "updatedUser", width: 150 },
  { label: $t("games.project"), prop: "action", width: 150 },
  { label: $t("games.content"), prop: "content", slot: "content" }
];

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await getGameLog({ type: 2, ID: props.gameId });
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <pure-table
    align-whole="center"
    :loading="loading"
    :data="dataList"
    :columns="columns"
  >
    <template #content="{ row }">
      <div v-html="row.content" />
    </template>
  </pure-table>
</template>
