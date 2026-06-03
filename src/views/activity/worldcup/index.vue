<script setup lang="ts">
import { ref } from "vue";
import { useWorldcup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityWorldcup" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  matchTypeOptions,
  matchGroupOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleEdit,
  handleDelete
} = useWorldcup();
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
      <el-form-item :label="$t('activity.teamName')" prop="team">
        <el-input
          v-model="searchForm.team"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.teamNameTip')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.matchType')" prop="matchType">
        <el-select v-model="searchForm.matchType" class="!w-[140px]">
          <el-option
            v-for="item in matchTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.matchGroup')" prop="matchGroup">
        <el-select v-model="searchForm.matchGroup" class="!w-[140px]">
          <el-option
            v-for="item in matchGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="$t('activity.menuWorldcup')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_2022wroldcup_match_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("activity.addSchedule") }}
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
              v-if="hasAuth('__btn_2022wroldcup_match_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleEdit(row)"
            >
              {{ $t("activity.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('activity.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_2022wroldcup_match_detele')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("activity.delete") }}
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
