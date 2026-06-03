<script setup lang="ts">
import { ref } from "vue";
import { useNews } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import View from "~icons/ep/view";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityNews" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  categoryOptions,
  statusOptions,
  trueOrFalseOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleOpen,
  handleDelete
} = useNews();
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
      <el-form-item :label="$t('activity.title')" prop="title">
        <el-input
          v-model="searchForm.title"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.titlePlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.category')" prop="category">
        <el-select v-model="searchForm.category" class="!w-[140px]">
          <el-option :label="$t('activity.all')" :value="0" />
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.releaseDate')" prop="time">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('activity.releaseDate')"
          :end-placeholder="$t('activity.expirationDate')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.hot')" prop="hot">
        <el-select v-model="searchForm.hot" clearable class="!w-[120px]">
          <el-option
            v-for="item in trueOrFalseOptions"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.top')" prop="top">
        <el-select v-model="searchForm.top" clearable class="!w-[120px]">
          <el-option
            v-for="item in trueOrFalseOptions"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.betSetting')" prop="betSetting">
        <el-select v-model="searchForm.betSetting" clearable class="!w-[120px]">
          <el-option
            v-for="item in trueOrFalseOptions"
            :key="String(item.value)"
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
      :title="$t('activity.menuNews')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_news_edit')"
          type="primary"
          :icon="AddFill"
          @click="handleOpen('create')"
        >
          {{ $t("activity.add") }}
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="handleOpen('review', row)"
            >
              {{ $t("activity.check") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_news_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleOpen('edit', row)"
            >
              {{ $t("activity.edit") }}
            </el-button>
            <el-popconfirm
              v-if="hasAuth('__btn_news_edit')"
              :title="$t('activity.deleteMessage')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
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
