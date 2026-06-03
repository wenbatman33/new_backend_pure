<script setup lang="ts">
import { ref } from "vue";
import { useReportGameGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportGameGroup" });

const formRef = ref();
const {
  searchForm,
  includesTestOptions,
  title,
  loading,
  columns,
  dataList,
  summaryMethod,
  onSearch,
  resetForm,
  handleExport
} = useReportGameGroup();
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
      <el-form-item :label="$t('report.timeInterval')">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :clearable="false"
          class="!w-[180px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :clearable="false"
          class="!w-[180px]"
        />
      </el-form-item>

      <el-form-item :label="$t('report.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item :label="$t('report.includeTestAccount')" prop="includesTest">
        <el-radio-group v-model="searchForm.includesTest">
          <el-radio-button
            v-for="item in includesTestOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區（樹狀彙總，含合計） -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_game_typegroup_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("report.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          row-key="gameGroupID"
          table-layout="auto"
          border
          show-summary
          default-expand-all
          :summary-method="summaryMethod"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :tree-props="{ children: 'children' }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
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
