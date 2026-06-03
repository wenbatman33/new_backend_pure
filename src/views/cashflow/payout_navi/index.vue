<script setup lang="ts">
import { usePayoutNavi } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "CashflowPayoutNavi" });

const {
  dataList,
  loading,
  columns,
  title,
  subtitle,
  autoReload,
  intervalTime,
  onSearch,
  onAutoReloadChange
} = usePayoutNavi();
</script>

<template>
  <div class="main">
    <!-- 標題列：上次更新時間 / 等待配線出款數 -->
    <div class="flex flex-col items-end text-sm mb-2 pr-2">
      <span>{{ title }}</span>
      <span>{{ subtitle }}</span>
    </div>

    <PureTableBar :title="$t('cashflow.menuPayoutNavi')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <div class="flex items-center gap-2">
          <template v-if="autoReload">
            <el-input-number
              v-model="intervalTime"
              size="small"
              :min="1"
              :controls="false"
              class="!w-[80px]"
            />
            <span>{{ $t("cashflow.payoutNaviSeconds") }}</span>
          </template>
          <span>{{ $t("cashflow.payoutNaviAutoReload") }}</span>
          <el-switch v-model="autoReload" @change="onAutoReloadChange" />
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="payout-navi-table"
          row-key="id"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table .cell) {
  white-space: pre-wrap;
}
</style>
