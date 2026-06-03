<script setup lang="ts">
import { ref } from "vue";
import { useRecommendList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "OperatorRecommendList" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  yesNoOptions,
  recommendOptions,
  sportsOptions,
  recommendItemOptions,
  keyWordColumnOptions,
  onSearch,
  resetForm,
  openDialog
} = useRecommendList();
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
      <el-form-item :label="$t('operator.competingTime')" prop="eventRange">
        <el-date-picker
          v-model="searchForm.eventRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="～"
          :start-placeholder="$t('operator.shelfStartTime')"
          :end-placeholder="$t('operator.shelfEndTime')"
        />
        <span class="ml-2 text-[var(--el-color-danger)]">
          {{ $t("operator.defaultThreeDays") }}
        </span>
      </el-form-item>

      <el-form-item :label="$t('operator.addedTime')" prop="recommendRange">
        <el-date-picker
          v-model="searchForm.recommendRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="～"
          clearable
          :start-placeholder="$t('operator.shelfStartTime')"
          :end-placeholder="$t('operator.shelfEndTime')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('operator.whetherToSupportLiveBroadcast')"
        prop="hasStreaming"
      >
        <el-select
          v-model="searchForm.hasStreaming"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in yesNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operator.whetherToRollingBall')" prop="isLive">
        <el-select v-model="searchForm.isLive" clearable class="!w-[120px]">
          <el-option
            v-for="item in yesNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('operator.homepageRecommendation')"
        prop="checkRecommend"
      >
        <el-select
          v-model="searchForm.checkRecommend"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in recommendOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operator.eventType')" prop="sportsName">
        <el-select
          v-model="searchForm.sportsName"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in sportsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('operator.projectRecommendations')"
        prop="recommendItem"
      >
        <el-select
          v-model="searchForm.recommendItem"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in recommendItemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operator.keywords')" prop="keyWord">
        <el-input
          v-model="searchForm.keyWord"
          clearable
          class="!w-[180px]"
          :placeholder="$t('operator.keywordsPlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item prop="keyWordColumn">
        <el-checkbox-group v-model="searchForm.keyWordColumn">
          <el-checkbox
            v-for="item in keyWordColumnOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("operator.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("operator.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('operator.menuRecommendList')"
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
              v-if="hasAuth('__btn_event_promo_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("operator.recommendedReleaseTimeSettings") }}
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
