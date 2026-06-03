<script setup lang="ts">
import { ref } from "vue";
import { useQuizWorldCup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import View from "~icons/ep/view";
import Hide from "~icons/ep/hide";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityQuizWorldCup" });

const formRef = ref();
const {
  searchForm,
  isLiveOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleUpdateStatus,
  handleOpenEditModal
} = useQuizWorldCup();
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
      <el-form-item :label="$t('activity.quizTeamName')" prop="team">
        <el-input
          v-model="searchForm.team"
          clearable
          class="!w-[180px]"
          :placeholder="$t('activity.quizTeamNameTip')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.quizIsShow')" prop="isLive">
        <el-select v-model="searchForm.isLive" clearable class="!w-[160px]">
          <el-option
            v-for="item in isLiveOptions"
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
          {{ $t("activity.quizSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.quizReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuQuizWorldCup')"
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
              v-if="hasAuth('__btn_quiz_active') && Number(row.status) === 1"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              :icon="Hide"
              @click="handleUpdateStatus(row, 2)"
            >
              {{ $t("activity.quizHide") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_quiz_active') && Number(row.status) === 2"
              class="reset-margin"
              link
              type="success"
              :size="size"
              :icon="View"
              @click="handleUpdateStatus(row, 1)"
            >
              {{ $t("activity.quizShow") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_quiz_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleOpenEditModal(row)"
            >
              {{ $t("activity.quizEdit") }}
            </el-button>
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
