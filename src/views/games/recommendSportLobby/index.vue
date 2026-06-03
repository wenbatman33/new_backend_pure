<script setup lang="ts">
import { useRecommendSportLobby } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "GamesRecommendSportLobby" });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleDelete
} = useRecommendSportLobby();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('games.menuRecommendSportLobby')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_sport_lobby_recommend_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("games.add") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_sport_lobby_recommend_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("games.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('games.confirmDeleteRecommend')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_sport_lobby_recommend_edit')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("games.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
