<script setup lang="ts">
import { ref } from "vue";
import { useAgencyApplication } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import View from "~icons/ep/view";
import Check from "~icons/ep/select";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyAgencyapplication" });

const formRef = ref();
const {
  searchForm,
  applyTimeRange,
  reviewTimeRange,
  auditStatusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDetail,
  openAudit,
  handleSizeChange,
  handleCurrentChange
} = useAgencyApplication();
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
      <el-form-item :label="$t('agency.agencyApplicationForm1')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyApplicationForm2')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationTable2')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyApplicationForm3')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationForm4')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyApplicationForm5')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item prop="exactlyMatching">
        <el-radio-group v-model="searchForm.exactlyMatching">
          <el-radio :value="true">{{ $t("agency.agencyApplicationForm6") }}</el-radio>
          <el-radio :value="false">{{ $t("agency.agencyApplicationForm7") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationForm8')" prop="auditStatus">
        <el-select v-model="searchForm.auditStatus" class="!w-[160px]">
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationTable6')">
        <el-date-picker
          v-model="applyTimeRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="~"
          :start-placeholder="$t('agency.applicationTimeBegins')"
          :end-placeholder="$t('agency.applicationTimeEnds')"
          class="!w-[260px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationTable7')">
        <el-date-picker
          v-model="reviewTimeRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="~"
          :start-placeholder="$t('agency.reviewTimeBegins')"
          :end-placeholder="$t('agency.reviewTimeEnds')"
          class="!w-[260px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuAgencyapplication')"
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="row.auditStatus === 1 && hasAuth('__btn_proxy_application_audit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Check"
              @click="openAudit(row)"
            >
              {{ $t("agency.agencyApplication1") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="openDetail(row)"
            >
              {{ $t("agency.agencyApplication2") }}
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
