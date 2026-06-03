<script setup lang="ts">
import { ref } from "vue";
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "RoleManagement" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  loading,
  columns,
  dataList,
  onSearch,
  resetForm,
  openDialog,
  openAuthDialog,
  openAccountDialog,
  openHideGroupDialog,
  openAmountLimitDialog,
  openBulkDialog
} = useRole();
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
      <el-form-item :label="$t('authSystem.groupName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.remark')" prop="note">
        <el-input
          v-model="searchForm.note"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('authSystem.status')"
        >
          <el-option
            v-for="item in statusOptions"
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
          {{ $t("authSystem.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("authSystem.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('authSystem.menuRole')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_auth_batch_managerment')"
          type="primary"
          @click="openBulkDialog"
        >
          {{ $t("authSystem.bulkEdit") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_role_show')"
          type="primary"
          @click="openHideGroupDialog"
        >
          {{ $t("authSystem.hideGroup") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_modify_group_amount_limit')"
          type="primary"
          @click="openAmountLimitDialog"
        >
          {{ $t("authSystem.amountLimit") }}
        </el-button>
        <el-button
          v-if="hasAuth('btn_role_add')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("authSystem.addGroup") }}
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #authList="{ row }">
            <el-button link type="warning" @click="openAuthDialog(row, 'authList')">
              {{ $t("authSystem.authList") }}
            </el-button>
          </template>
          <template #menuList="{ row }">
            <el-button link type="success" @click="openAuthDialog(row, 'menuList')">
              {{ $t("authSystem.menuList") }}
            </el-button>
          </template>
          <template #hasAuths="{ row }">
            <el-button link type="primary" @click="openAccountDialog(row)">
              {{ $t("authSystem.hasAuths") }}
            </el-button>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDialog('edit', row)"
            >
              {{ $t("authSystem.edit") }}
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
