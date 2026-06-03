<script setup lang="ts">
import { ref } from "vue";
import { useCloudIpLibrary } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "SystemManageCloudIpLibrary" });

const formRef = ref();
const {
  searchForm,
  categoryOptions,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleRescan,
  handleRescanAll,
  handleSync
} = useCloudIpLibrary();
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
      <el-form-item :label="$t('systemManage.nameKeyword')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[180px]"
          :placeholder="$t('systemManage.enterNameKeyword')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('systemManage.category')" prop="category">
        <el-select
          v-model="searchForm.category"
          clearable
          class="!w-[180px]"
          :placeholder="$t('systemManage.selectCategory')"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systemManage.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[180px]"
          :placeholder="$t('systemManage.selectStatus')"
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
          {{ $t("systemManage.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("systemManage.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('systemManage.menuCloudIpLibrary')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_cloud_ip_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("systemManage.add") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_cloud_ip_rescan')"
          type="primary"
          plain
          @click="handleRescanAll"
        >
          {{ $t("systemManage.rescanAllTag") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_cloud_ip_sync')"
          @click="handleSync"
        >
          {{ $t("systemManage.syncFromSources") }}
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
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_cloud_ip_update')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_cloud_ip_rescan')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleRescan(row)"
            >
              {{ $t("systemManage.rescanTag") }}
            </el-button>
            <el-popconfirm
              :title="$t('systemManage.confirmDeleteRecord')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_cloud_ip_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("systemManage.delete") }}
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
