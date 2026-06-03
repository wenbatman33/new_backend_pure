<script setup lang="ts">
import { ref } from "vue";
import { useMatchNews } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import View from "~icons/ep/view";
import Hide from "~icons/ep/hide";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityMatchNews" });

const formRef = ref();
const {
  searchForm,
  leagueOptions,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleUpdateStatus,
  handleDelete,
  loadLeagueOptions
} = useMatchNews();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('activity.matchNewsLeague')" prop="league">
        <el-select
          v-model="searchForm.league"
          clearable
          class="!w-[180px]"
          :placeholder="$t('activity.matchNewsPleaseChoiceLeague')"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="showInactive">
        <el-checkbox
          v-model="searchForm.showInactive"
          @change="loadLeagueOptions"
        >
          {{ $t("activity.matchNewsShowInactiveLeague") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('activity.matchNewsStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[140px]"
        >
          <el-option :label="$t('activity.all')" value="" />
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuMatchNews')"
      :columns="columns"
      @refresh="onSearch"
    >
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
              v-if="hasAuth('__btn_matchnews_active') && row.status === 1"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Hide"
              @click="handleUpdateStatus(row)"
            >
              {{ $t("activity.matchNewsHide") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_matchnews_active') && row.status === 2"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="handleUpdateStatus(row)"
            >
              {{ $t("activity.matchNewsShow") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_matchnews_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("activity.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('activity.matchNewsConfirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_matchnews_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("activity.delete") }}
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
