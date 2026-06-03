<script setup lang="ts">
import { ref } from "vue";
import { useAnnouncement } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import View from "~icons/ep/view";
import Hide from "~icons/ep/hide";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "OperatorAnnouncement" });

const formRef = ref();
const {
  searchForm,
  hiddenOptions,
  startStatusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleToggleHidden,
  handleDelete
} = useAnnouncement();
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
      <el-form-item :label="$t('operator.hiddenYesOrNo')" prop="hidden">
        <el-select v-model="searchForm.hidden" clearable class="!w-[160px]">
          <el-option
            v-for="item in hiddenOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operator.announcementStatus')" prop="startStatus">
        <el-select v-model="searchForm.startStatus" class="!w-[160px]">
          <el-option
            v-for="item in startStatusOptions"
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
          {{ $t("operator.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("operator.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('operator.menuAnnouncement')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_announcement_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('Create')"
        >
          {{ $t("operator.addAnnouncement") }}
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
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_announcement_visible')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="row.hidden ? View : Hide"
              @click="handleToggleHidden(row)"
            >
              {{ row.hidden ? $t("operator.show") : $t("operator.noShow") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_announcement_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('Edit', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('operator.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_announcement_delete')"
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
