<script setup lang="ts">
import { ref } from "vue";
import { useLoginLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "MemberLoginLog" });

const formRef = ref();
const {
  searchForm,
  loginTimeRange,
  registerTimeRange,
  loginTypeOptions,
  matchingOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleExport,
  handleSizeChange,
  handleCurrentChange,
  handleView
} = useLoginLog();
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
      <el-form-item :label="$t('member.memberAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item prop="exactlyMatching">
        <el-radio-group v-model="searchForm.exactlyMatching">
          <el-radio
            v-for="item in matchingOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('member.loginIP')" prop="loginIP">
        <el-input
          v-model="searchForm.loginIP"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.loginDeviceID')" prop="loginDeviceID">
        <el-input
          v-model="searchForm.loginDeviceID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.loginType')" prop="loginType">
        <el-select
          v-model="searchForm.loginType"
          clearable
          class="!w-[140px]"
        >
          <el-option
            v-for="item in loginTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.loginTime')" prop="loginTimeRange">
        <el-date-picker
          v-model="loginTimeRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="$t('member.to')"
          :start-placeholder="$t('member.startTime')"
          :end-placeholder="$t('member.endTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('member.createdAt')" prop="registerTimeRange">
        <el-date-picker
          v-model="registerTimeRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="$t('member.to')"
          :start-placeholder="$t('member.startTime')"
          :end-placeholder="$t('member.endTime')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("member.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuLoginLog')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__bnt_member_login_log_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("member.export") }}
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #account="{ row }">
            <el-link type="primary" @click="handleView(row)">
              {{ row.account }}
            </el-link>
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
