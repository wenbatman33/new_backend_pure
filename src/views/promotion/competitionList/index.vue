<script setup lang="ts">
import { ref } from "vue";
import { useCompetitionList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import Key from "~icons/ep/key";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PromotionCompetitionList" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  openKeywordDialog,
  handleDelete
} = useCompetitionList();
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
      <el-form-item :label="$t('promotion.keywordInput')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          clearable
          class="!w-[180px]"
          :placeholder="$t('promotion.pleaseEnterKeyWords')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.leagueName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[180px]"
          :placeholder="$t('promotion.pleaseEnterLeagueName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
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
          {{ $t("promotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("promotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('promotion.menuCompetitionList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_promo_competition_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("promotion.addNewLeague") }}
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
              v-if="hasAuth('__btn_promo_competition_keyword')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Key"
              @click="openKeywordDialog(row)"
            >
              {{ $t("promotion.editKeywords") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promo_competition_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("promotion.editLeague") }}
            </el-button>
            <el-popconfirm
              :title="$t('promotion.confirmDeleteEvent')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_promo_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("promotion.deleteEvent") }}
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
