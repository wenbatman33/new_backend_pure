<script setup lang="tsx">
import { ref } from "vue";
import { useAgencyWallet } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyWallet" });

const formRef = ref();
const {
  searchForm,
  typeOptions,
  statusOptions,
  exactlyOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onSizeChange,
  onCurrentChange,
  resetForm,
  handleExport,
  openReviewDialog
} = useAgencyWallet();
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
      <el-form-item :label="$t('agency.phDailyReportTable1')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportTable2')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item prop="exactlyMatching">
        <el-radio-group v-model="searchForm.exactlyMatching">
          <el-radio
            v-for="item in exactlyOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agency.walletLogTable5')" prop="type">
        <el-select v-model="searchForm.type" class="!w-[140px]">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyApplicationTable9')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.walletTable8')" prop="applyTime">
        <el-date-picker
          v-model="searchForm.applyTime"
          type="datetimerange"
          range-separator="~"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          class="!w-[340px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.walletTable10')" prop="reviewTime">
        <el-date-picker
          v-model="searchForm.reviewTime"
          type="datetimerange"
          range-separator="~"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          class="!w-[340px]"
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
      :title="$t('agency.menuWallet')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_ag_adjuestment_record_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.handleExport") }}
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
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="row.status === 3 && hasAuth('__btn_proxy_manual_audit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openReviewDialog(row, 3)"
            >
              {{ $t("agency.agencyApplication1") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openReviewDialog(row)"
            >
              {{ $t("agency.wallet4") }}
            </el-button>
            <el-button
              v-if="row.status === 4"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              @click="openReviewDialog(row, 4)"
            >
              {{ $t("agency.wallet2") }}
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
