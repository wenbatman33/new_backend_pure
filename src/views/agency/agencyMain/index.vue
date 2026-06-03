<script setup lang="ts">
import { ref } from "vue";
import { useAgencyMain } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyAgencyMain" });

const formRef = ref();
const {
  searchForm,
  dataList,
  parentAgencyData,
  rankGroupOptions,
  businessTypeOptions,
  loading,
  columns,
  pagination,
  onSearch,
  resetForm,
  setAgencyAccount,
  openDetail,
  handleExport
} = useAgencyMain();
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
      <el-form-item :label="$t('agency.agencyMainForm1')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyMainForm2')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm3')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyMainForm4')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item prop="exactlyMatching">
        <el-radio-group v-model="searchForm.exactlyMatching">
          <el-radio :value="1">{{ $t("agency.agencyMainForm5") }}</el-radio>
          <el-radio :value="2">{{ $t("agency.agencyMainForm6") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportTable4')" prop="rankGroupID">
        <el-select
          v-model="searchForm.rankGroupID"
          clearable
          class="!w-[160px]"
        >
          <el-option :label="$t('agency.agencyMainForm9')" value="" />
          <el-option
            v-for="item in rankGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMain16')" prop="isCredit">
        <el-select v-model="searchForm.isCredit" class="!w-[160px]">
          <el-option :label="$t('agency.agencyMainForm9')" :value="0" />
          <el-option :label="$t('agency.addAgencyModal13')" :value="1" />
          <el-option :label="$t('agency.addAgencyModal14')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm10')" prop="giveOffer">
        <el-select v-model="searchForm.giveOffer" class="!w-[160px]">
          <el-option :label="$t('agency.agencyMainForm9')" :value="0" />
          <el-option :label="$t('agency.addAgencyModal13')" :value="1" />
          <el-option :label="$t('agency.addAgencyModal14')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm7')">
        <el-date-picker
          v-model="searchForm.reviewStartTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY/MM/DD HH:mm"
          class="!w-[180px]"
          :placeholder="$t('agency.agencyMainForm7')"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.reviewEndTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY/MM/DD HH:mm"
          class="!w-[180px]"
          :placeholder="$t('agency.agencyMainForm7')"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm11')" prop="activeStatus">
        <el-select v-model="searchForm.activeStatus" class="!w-[160px]">
          <el-option :label="$t('agency.agencyMainForm9')" :value="0" />
          <el-option :label="$t('agency.childAgencyReportTable28')" :value="1" />
          <el-option :label="$t('agency.childAgencyReportTable29')" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm12')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
          <el-option :label="$t('agency.agencyMainForm9')" :value="0" />
          <el-option :label="$t('agency.agencyMainForm13')" :value="1" />
          <el-option :label="$t('agency.agencyMainForm14')" :value="2" />
          <el-option :label="$t('agency.agencyMainForm15')" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('agency.agencyMainForm18')"
        prop="parentAgencyAccount"
      >
        <el-input
          v-model="searchForm.parentAgencyAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.agencyMainForm18')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainForm19')" prop="businessType">
        <el-select v-model="searchForm.businessType" class="!w-[160px]">
          <el-option :label="$t('agency.agencyMainForm20')" :value="0" />
          <el-option
            v-for="item in businessTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="ignoreZeroWallet">
        <el-checkbox v-model="searchForm.ignoreZeroWallet">
          {{ $t("agency.agencyMainForm16") }}
        </el-checkbox>
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
      :title="$t('agency.menuAgencyMain')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_ag_list_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.handleExport") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <!-- 上層代理麵包屑 -->
        <div
          v-if="parentAgencyData.length > 0"
          class="mb-2 flex flex-wrap items-center gap-1"
        >
          <template v-for="(item, idx) in parentAgencyData" :key="item.parentAgencyID">
            <el-link
              type="primary"
              @click="setAgencyAccount(item.parentAgencyAccount)"
            >
              {{ item.parentAgencyAccount }}
            </el-link>
            <span v-if="idx + 1 < parentAgencyData.length" class="mx-1">&gt;</span>
          </template>
        </div>
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDetail(row.id)"
            >
              {{ $t("agency.agencyMain2") }}
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
