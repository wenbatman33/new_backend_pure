<script setup lang="ts">
import { ref } from "vue";
import { useAccount } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AuthSystemAccount" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  roleOptions,
  deptOptions,
  loading,
  columns,
  dataList,
  pagination,
  selectedRows,
  onSearch,
  resetForm,
  handleSelectionChange,
  openDialog,
  openPasswordDialog,
  openVpnIPDialog,
  handleOtp
} = useAccount();
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
      <el-form-item :label="$t('authSystem.columnHead1')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.columnHead2')" prop="status">
        <el-radio-group v-model="searchForm.status">
          <el-radio-button
            v-for="item in statusOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('authSystem.columnHead3')" prop="roles">
        <el-select
          v-model="searchForm.roles"
          clearable
          filterable
          class="!w-[160px]"
          :placeholder="$t('authSystem.chooseGroup')"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('authSystem.columnHead4')" prop="deptID">
        <el-select
          v-model="searchForm.deptID"
          clearable
          class="!w-[160px]"
          :placeholder="$t('authSystem.choseDept')"
        >
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('authSystem.columnHead5')" prop="title">
        <el-input
          v-model="searchForm.title"
          clearable
          class="!w-[160px]"
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
          {{ $t("authSystem.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("authSystem.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('authSystem.menuAccount')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          :disabled="selectedRows.length <= 0"
          type="primary"
          @click="openVpnIPDialog('remove')"
        >
          {{ $t("authSystem.tableToolBar2") }}
        </el-button>
        <el-button
          :disabled="selectedRows.length <= 0"
          type="primary"
          @click="openVpnIPDialog('add')"
        >
          {{ $t("authSystem.tableToolBar3") }}
        </el-button>
        <el-button type="primary" :icon="AddFill" @click="openDialog(false)">
          {{ $t("authSystem.tableToolBar") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="adminID"
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDialog(true, row)"
            >
              {{ $t("authSystem.columnAction1") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openPasswordDialog(row)"
            >
              {{ $t("authSystem.columnAction2") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_reset_otp')"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              @click="handleOtp(row)"
            >
              {{ $t("authSystem.columnAction3") }}
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
