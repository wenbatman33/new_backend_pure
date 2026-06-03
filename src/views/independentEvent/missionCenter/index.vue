<script setup lang="ts">
import { ref } from "vue";
import { useMissionCenter } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "IndependentEventMissionCenter" });

const formRef = ref();
const {
  searchForm,
  typeOptions,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleStatus,
  handleCopy,
  handleLog
} = useMissionCenter();
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
      <el-form-item :label="$t('independentEvent.id')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.taskName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.type')" prop="type">
        <el-select
          v-model="searchForm.type"
          clearable
          class="!w-[160px]"
          :placeholder="$t('independentEvent.type')"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('independentEvent.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('independentEvent.status')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('independentEvent.internalName')"
        prop="internalName"
      >
        <el-input
          v-model="searchForm.internalName"
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
          {{ $t("independentEvent.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("independentEvent.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('independentEvent.menuMissionCenter')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_mandate_new')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('Create')"
        >
          {{ $t("independentEvent.addNewTask") }}
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
            <el-switch
              v-if="hasAuth('__btn_mandate_edit')"
              :model-value="row.status === 1"
              :active-text="$t('independentEvent.enable')"
              :inactive-text="$t('independentEvent.disable')"
              inline-prompt
              @change="handleStatus(row)"
            />
            <el-button
              v-if="hasAuth('__btn_mandate_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('Edit', row)"
            >
              {{ $t("independentEvent.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_mandate_log')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleLog"
            >
              {{ $t("independentEvent.modifyRecord") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_mandate_new')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleCopy(row)"
            >
              {{ $t("independentEvent.copy") }}
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
