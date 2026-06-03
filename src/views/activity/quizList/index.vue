<script setup lang="ts">
import { ref } from "vue";
import { useQuizList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityQuizList" });

const formRef = ref();
const {
  searchForm,
  scheduleOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} = useQuizList();
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
      <el-form-item :label="$t('activity.quizMemberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.quizMemberAccountPlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.quizAwayScore')" prop="awayQuiz">
        <el-input
          v-model="searchForm.awayQuiz"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.quizAwayScorePlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.quizHomeScore')" prop="homeQuiz">
        <el-input
          v-model="searchForm.homeQuiz"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.quizHomeScorePlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.quizMatchSelect')" prop="worldCupScheduleId">
        <el-select
          v-model="searchForm.worldCupScheduleId"
          clearable
          filterable
          class="!w-[280px]"
          :placeholder="$t('activity.quizMatchSelect')"
        >
          <el-option
            v-for="item in scheduleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="$t('activity.menuQuizList')" :columns="columns" @refresh="onSearch">
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        />
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
