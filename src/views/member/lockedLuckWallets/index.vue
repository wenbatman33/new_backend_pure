<script setup lang="ts">
import { ref } from "vue";
import { useLockedLuckWallets } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberLockedLuckWallets" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleUnlock,
  handleLockPadding,
  handleView
} = useLockedLuckWallets();
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
      <el-form-item :label="$t('member.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.memberID')" prop="memberID">
        <el-input
          v-model="searchForm.memberID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.createTime')" prop="createStartTime">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('member.createTime')"
          :end-placeholder="$t('member.createTime')"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
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
      :title="$t('member.menuLockedLuckWallets')"
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
        >
          <template #memberAccount="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">
              {{ row.memberAccount }}
            </el-link>
          </template>
          <template #operation="{ row }">
            <template v-if="row.status === 1 && hasAuth('btn_luckmoney_edit')">
              <el-popconfirm
                :title="$t('member.lockedWalletsUnlockRepayTip')"
                @confirm="handleUnlock(row.lockID, true)"
              >
                <template #reference>
                  <el-button class="reset-margin" link type="primary" :size="size">
                    {{ $t("member.lockedWalletsUnlockRepay") }}
                  </el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                :title="$t('member.lockedWalletsUnlockNoRepayTip')"
                @confirm="handleUnlock(row.lockID, false)"
              >
                <template #reference>
                  <el-button class="reset-margin" link type="primary" :size="size">
                    {{ $t("member.lockedWalletsUnlockNoRepay") }}
                  </el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm
                :title="$t('member.lockedWalletsLockPaddingTip')"
                @confirm="handleLockPadding(row.lockID)"
              >
                <template #reference>
                  <el-button class="reset-margin" link type="warning" :size="size">
                    {{ $t("member.lockedWalletsLockPadding") }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
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
