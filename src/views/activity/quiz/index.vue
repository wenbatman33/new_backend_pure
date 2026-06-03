<script setup lang="ts">
import { ref } from "vue";
import { useQuiz } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import View from "~icons/ep/view";
import Hide from "~icons/ep/hide";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityQuiz" });

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
  handleUpdateStatus
} = useQuiz();
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
      <el-form-item :label="$t('activity.isShow')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.all')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.quizStartTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
          :placeholder="$t('activity.quizStartTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.quizEndTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
          :placeholder="$t('activity.quizEndTime')"
        />
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
    <PureTableBar :title="$t('activity.menuQuiz')" :columns="columns" @refresh="onSearch">
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
              @click="handleUpdateStatus(row, 0)"
            >
              {{ $t("activity.hide") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_quiz_active') && Number(row.status) === 0"
              class="reset-margin"
              link
              type="success"
              :size="size"
              :icon="View"
              @click="handleUpdateStatus(row, 1)"
            >
              {{ $t("activity.show") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_quiz_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("activity.edit") }}
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
