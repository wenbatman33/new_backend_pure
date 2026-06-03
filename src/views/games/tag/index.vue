<script setup lang="ts">
import { useGamesTag } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "GamesTag" });

const {
  gameTypeOptions,
  gameTypeID,
  gameTypeName,
  loading,
  columns,
  dataList,
  pagination,
  handleTypeChange,
  onSearch,
  openDialog,
  handleDelete
} = useGamesTag();
</script>

<template>
  <div class="main">
    <!-- 遊戲類型選擇區 -->
    <el-form
      :inline="true"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('games.type')">
        <el-select
          v-model="gameTypeID"
          clearable
          class="!w-[180px]"
          :placeholder="$t('games.plzSelectType')"
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in gameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 表格區（選擇類型後才顯示） -->
    <PureTableBar
      v-if="gameTypeName"
      :title="gameTypeName"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_game_tag_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("games.addTag") }}
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
              v-if="hasAuth('__btn_game_tag_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("games.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('games.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_game_tag_edit')"
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

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
