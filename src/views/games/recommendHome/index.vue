<script setup lang="ts">
import { useRecommendHome } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "GamesRecommendHome" });

const {
  loading,
  columns,
  tableDataList,
  getTableTitle,
  onSearch,
  openDialog
} = useRecommendHome();
</script>

<template>
  <div class="main">
    <h2 class="mb-4 text-2xl font-medium">
      {{ $t("games.menuRecommendHome") }}
    </h2>

    <template
      v-for="table in tableDataList"
      :key="`${table.gameTypeID}_${table.isTag}`"
    >
      <PureTableBar
        :title="getTableTitle(table)"
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="table.list"
            :columns="dynamicColumns"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
          >
            <template #operation="{ row }">
              <el-button
                v-if="hasAuth('__btn_home_recommend_edit')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="EditPen"
                @click="openDialog(row, table)"
              >
                {{ $t("games.edit") }}
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </template>
  </div>
</template>
