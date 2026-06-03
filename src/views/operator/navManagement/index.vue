<script setup lang="ts">
import { ref } from "vue";
import { useNavManagement } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "OperatorNavManagement" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  lobbyTypeOptions,
  statusOptions,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleStatus,
  handleSortChange
} = useNavManagement();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('operator.type')" prop="lobbyType">
        <el-select
          v-model="searchForm.lobbyType"
          clearable
          class="!w-[180px]"
          :placeholder="$t('operator.type')"
        >
          <el-option
            v-for="item in lobbyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operator.showOrHidden')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[180px]"
          :placeholder="$t('operator.showOrHidden')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="String(item.value)"
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
          {{ $t("operator.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("operator.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="$t('operator.menuNavManagement')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__bnt_navi_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog($t('operator.add'))"
        >
          {{ $t("operator.add") }}
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
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleStatus(row)"
            >
              {{ row.status === 0 || row.status === false
                ? $t("operator.show")
                : $t("operator.noShow") }}
            </el-button>
            <el-button
              v-if="hasAuth('__bnt_navi_edit') && row.id !== 1"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog($t('operator.edit'), row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              v-if="row.id !== 1"
              :title="$t('operator.naviConfirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("operator.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
          <template #sort="{ row }">
            <el-input-number
              v-model="row.sort"
              :min="0"
              size="small"
              controls-position="right"
              class="!w-[110px]"
              @change="(val: number) => handleSortChange(row, val)"
            />
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
