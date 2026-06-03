<script setup lang="ts">
import { ref, computed } from "vue";
import { useWalletLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "MemberWalletLog" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  typeOptions,
  inOutOptions,
  onSearch,
  resetForm,
  handleExport
} = useWalletLog();

// type 下拉僅顯示 useTypeID <= 1000
const typeSelectOptions = computed(() =>
  typeOptions.value.filter(item => item.useTypeID <= 1000)
);
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
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.walletLogInOut')" prop="inOut">
        <el-select
          v-model="searchForm.inOut"
          clearable
          class="!w-[140px]"
          :placeholder="$t('member.all')"
        >
          <el-option
            v-for="item in inOutOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.walletLogTypeSearch')" prop="type">
        <el-select
          v-model="searchForm.type"
          multiple
          collapse-tags
          collapse-tags-tooltip
          filterable
          clearable
          class="!w-[220px]"
          :placeholder="$t('member.all')"
        >
          <el-option
            v-for="item in typeSelectOptions"
            :key="item.useTypeID"
            :label="item.useTypeName"
            :value="item.useTypeID"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.time')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('member.walletLogStartTime')"
        />
      </el-form-item>
      <el-form-item label="~" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('member.walletLogEndTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('member.walletLogFilter')" prop="filter">
        <el-input
          v-model="searchForm.filter"
          clearable
          class="!w-[180px]"
          :placeholder="$t('member.walletLogFilterPlaceholder')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.walletLogIgnore')" prop="ignore">
        <el-input
          v-model="searchForm.ignore"
          clearable
          class="!w-[180px]"
          :placeholder="$t('member.walletLogIgnorePlaceholder')"
          @keyup.enter="onSearch"
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
      :title="$t('member.menuWalletLog')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_walletlog_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("member.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
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
