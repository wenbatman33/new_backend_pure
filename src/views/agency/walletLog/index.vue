<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { useWalletLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyWalletLog" });

const formRef = ref();
const {
  searchForm,
  depoWithTypeOptions,
  adjUseTypeOptions,
  exactlyMatchingOptions,
  loading,
  columns,
  dataList,
  pagination,
  summaryMethod,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleExport
} = useWalletLog();

// el-date-picker 值与 searchForm 字串字段同步
function onDateChange(val: [string, string] | null) {
  if (val && val.length === 2) {
    searchForm.startTime = dayjs(val[0]).format("YYYY-MM-DD HH:mm:ss");
    searchForm.endTime = dayjs(val[1]).format("YYYY-MM-DD HH:mm:ss");
  } else {
    searchForm.startTime = "";
    searchForm.endTime = "";
  }
}
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
      <el-form-item :label="$t('agency.walletLogColID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.walletLogColAccount')" prop="agencyAccount">
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
            v-for="item in exactlyMatchingOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agency.walletLogColDate')" prop="startTime">
        <el-date-picker
          :model-value="[searchForm.startTime, searchForm.endTime]"
          type="datetimerange"
          :range-separator="'~'"
          :start-placeholder="$t('agency.walletLogChangeTimeStart')"
          :end-placeholder="$t('agency.walletLogChangeTimeEnd')"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[380px]"
          @update:model-value="onDateChange"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.walletLogColType')" prop="depoWithType">
        <el-select v-model="searchForm.depoWithType" class="!w-[140px]">
          <el-option
            v-for="item in depoWithTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.walletLogColUse')" prop="adjUseType">
        <el-select v-model="searchForm.adjUseType" class="!w-[160px]">
          <el-option
            v-for="item in adjUseTypeOptions"
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
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuWalletLog')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_ag_money_record_export')"
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
          show-summary
          :summary-method="summaryMethod"
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
