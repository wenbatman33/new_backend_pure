<script setup lang="ts">
import { ref } from "vue";
import { useChildApplication } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Check from "~icons/ep/check";
import Close from "~icons/ep/close";

defineOptions({ name: "AgencyChildApplication" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  matchOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSelectionChange,
  handleBatchReview,
  openDetail,
  openAudit
} = useChildApplication();
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
      <el-form-item :label="$t('agency.agencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.pleaseInput')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.childAgencyID')" prop="childAgencyID">
        <el-input
          v-model="searchForm.childAgencyID"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.pleaseInput')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.pleaseInput')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.childAgencyAccount')" prop="childAgencyAccount">
        <el-input
          v-model="searchForm.childAgencyAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.pleaseInput')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item prop="exactlyMatching">
        <el-radio-group v-model="searchForm.exactlyMatching">
          <el-radio v-for="item in matchOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agency.auditStatus')" prop="auditStatus">
        <el-select v-model="searchForm.auditStatus" class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.applyTime')" prop="applyTimeRange">
        <el-date-picker
          v-model="searchForm.applyTimeRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('agency.startTime')"
          :end-placeholder="$t('agency.endTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.reviewTime')" prop="reviewTimeRange">
        <el-date-picker
          v-model="searchForm.reviewTimeRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('agency.startTime')"
          :end-placeholder="$t('agency.endTime')"
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
      :title="$t('agency.menuChildApplication')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_secondary_agent_audit')"
          type="primary"
          :icon="Check"
          @click="handleBatchReview(1)"
        >
          {{ $t("agency.batchPass") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_secondary_agent_audit')"
          type="danger"
          :icon="Close"
          @click="handleBatchReview(2)"
        >
          {{ $t("agency.batchReject") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="
                Number(row.auditStatus) === 1 &&
                hasAuth('__btn_secondary_agent_audit')
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openAudit(row)"
            >
              {{ $t("agency.audit") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDetail(row)"
            >
              {{ $t("agency.detail") }}
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
