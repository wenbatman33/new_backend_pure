<script setup lang="ts">
import { computed } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { GameLogItem } from "./utils/types";

const props = defineProps<{ row: GameLogItem }>();

// 格式化原始 JSON 資料
const rawJson = computed(() => {
  if (!props.row?.response) return "";
  try {
    return JSON.stringify(JSON.parse(props.row.response), null, 2);
  } catch {
    return String(props.row.response);
  }
});
</script>

<template>
  <div class="gamelog-detail">
    <el-descriptions :column="2" border>
      <el-descriptions-item :label="$t('games.gameOriginalBettingID')">
        {{ row.betID }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('games.memberAccount')">
        {{ row.memberAccount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('games.group')">
        {{ row.gameGroup }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('games.gameName')">
        {{ row.gameListName }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('games.betAmount')">
        {{ row.totalBetAmount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('games.settlementAmount')">
        {{ row.settlementAmount }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="mt-3">
      <div class="mb-1 font-bold">{{ $t("games.jsonEncodedRawData") }}</div>
      <pre class="raw-box">{{ rawJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
.raw-box {
  max-height: 360px;
  padding: 8px;
  overflow: auto;
  font-size: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}
</style>
