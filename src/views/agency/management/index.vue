<script setup lang="ts">
import { ref } from "vue";
import { useAgencyManagement } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyManagement" });

const formRef = ref();
const {
  pageType,
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  changePage,
  openDialog
} = useAgencyManagement();
</script>

<template>
  <div class="main">
    <!-- 公告 / 活動 切換 -->
    <div class="bg-bg_color w-[99/100] pl-8 pt-[12px] mb-2">
      <el-radio-group
        :model-value="pageType"
        @update:model-value="changePage"
      >
        <el-radio-button :value="1">
          {{ $t("agency.management1") }}
        </el-radio-button>
        <el-radio-button :value="2">
          {{ $t("agency.management2") }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('agency.managementForm1')" prop="periodBeginning">
        <el-date-picker
          v-model="searchForm.periodBeginning"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.periodEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="pageType === 1 ? $t('agency.management1') : $t('agency.management2')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_agency_management_add')"
          type="primary"
          :icon="AddFill"
          @click="openDialog(false)"
        >
          {{ pageType === 1 ? $t("agency.management3") : $t("agency.management4") }}
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
              v-if="hasAuth('__btn_agency_management_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(true, row)"
            >
              {{ $t("agency.agencyGroup2") }}
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
