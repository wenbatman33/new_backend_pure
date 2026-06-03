<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getOperateLog } from "@/api/promotion";

defineOptions({ name: "PromotionApplyOperateLog" });

const props = defineProps<{ logId: number }>();

const loading = ref(true);
const dataList = ref<any[]>([]);

// 操作狀態對應文案（沿用舊碼 1~7）
const statusTextMap: Record<number, string> = {
  1: $t("promotion.apply"),
  2: $t("promotion.verify"),
  3: $t("promotion.send"),
  4: $t("promotion.recive"),
  5: $t("promotion.cancel"),
  6: $t("promotion.giveup"),
  7: $t("promotion.refuse")
};

async function fetchLog() {
  loading.value = true;
  try {
    const { success, data } = await getOperateLog({ ID: props.logId });
    if (success && data) {
      dataList.value = data.list ?? data ?? [];
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchLog);
</script>

<template>
  <el-table v-loading="loading" :data="dataList" border>
    <el-table-column :label="$t('promotion.time')" prop="updatedAt" width="200" />
    <el-table-column :label="$t('promotion.updatePpl')" prop="updatedUser" width="160" />
    <el-table-column :label="$t('promotion.action')" prop="status">
      <template #default="{ row }">
        {{ statusTextMap[row.status] ?? "" }}
      </template>
    </el-table-column>
  </el-table>
</template>
