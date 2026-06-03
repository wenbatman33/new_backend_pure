<script setup lang="ts">
import { ref } from "vue";
import { useWebsocket } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "OperatorWebsocket" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  startTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onDateChange,
  resetForm,
  openDialog,
  openEditDialog,
  handleDelete,
  onSizeChange,
  onCurrentChange
} = useWebsocket();
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
      <el-form-item :label="$t('operator.title')" prop="title">
        <el-input
          v-model="searchForm.title"
          clearable
          class="!w-[180px]"
          :placeholder="$t('operator.plzInputTitle')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('operator.broadcast')" prop="startType">
        <el-select v-model="searchForm.startType" class="!w-[160px]">
          <el-option :label="$t('operator.all')" :value="0" />
          <el-option
            v-for="item in startTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operator.sendTime')" prop="date">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          class="!w-[360px]"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('operator.startTime')"
          :end-placeholder="$t('operator.endTime')"
          @change="onDateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("operator.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("operator.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="$t('operator.menuWebsocket')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_broadcast_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("operator.addBroadcast") }}
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
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_broadcast_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openEditDialog(row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('operator.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_broadcast_detel')"
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
