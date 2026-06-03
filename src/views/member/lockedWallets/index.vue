<script setup lang="ts">
import { ref } from "vue";
import { useLockedWallets } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberLockedWallets" });

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
  handleLockPadding
} = useLockedWallets();

// 会员详情：另开分页（沿用旧行为 /memberDetail/detail/:id）
function handleView(row: { memberID: number }) {
  window.open(`/#/memberDetail/detail/${row.memberID}`, "_blank");
}
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('member.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
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
      <el-form-item :label="$t('member.createTime')" prop="createTime">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('member.createTime')"
          :end-placeholder="$t('member.createTime')"
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

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('member.menuLockedWallets')"
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
            <el-link type="primary" @click="handleView(row)">
              {{ row.memberAccount }}
            </el-link>
          </template>
          <template #operation="{ row }">
            <!-- 解锁（退回） -->
            <el-popconfirm
              v-if="row.status === 1 && hasAuth('__btn_member_money_unlock')"
              :title="$t('member.lockedWalletsConfirmUnlock')"
              @confirm="handleUnlock(row.lockID, true)"
            >
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size">
                  {{ $t("member.lockedWalletsUnlock") }}
                </el-button>
              </template>
            </el-popconfirm>
            <!-- 解锁（不退回） -->
            <el-popconfirm
              v-if="
                row.status === 1 &&
                hasAuth('__btn_member_money_unlock_no_return')
              "
              :title="$t('member.lockedWalletsConfirmUnlockNoReturn')"
              @confirm="handleUnlock(row.lockID, false)"
            >
              <template #reference>
                <el-button class="reset-margin" link type="warning" :size="size">
                  {{ $t("member.lockedWalletsUnlockNoReturn") }}
                </el-button>
              </template>
            </el-popconfirm>
            <!-- 锁定挂起 -->
            <el-popconfirm
              v-if="
                row.status === 1 && hasAuth('__btn_member_money_lock_pedding')
              "
              :title="$t('member.lockedWalletsConfirmLockPadding')"
              @confirm="handleLockPadding(row.lockID)"
            >
              <template #reference>
                <el-button class="reset-margin" link type="danger" :size="size">
                  {{ $t("member.lockedWalletsLockPadding") }}
                </el-button>
              </template>
            </el-popconfirm>
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
