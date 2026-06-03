<script setup lang="ts">
import { ref } from "vue";
import { usePromotionLaunchedList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PromotionLaunchedList" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  displayOptions,
  activityOptions,
  deviceOptions,
  onSearch,
  resetForm,
  openDialog
} = usePromotionLaunchedList();
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
      <el-form-item :label="$t('promotion.serialNumber')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.listingName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('promotion.plzEnterListingName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.show')" prop="display">
        <el-select
          v-model="searchForm.display"
          clearable
          class="!w-[160px]"
          :placeholder="$t('promotion.pleaseSelectToDisplay')"
        >
          <el-option
            v-for="item in displayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.activeStatus')" prop="activity">
        <el-select
          v-model="searchForm.activity"
          clearable
          class="!w-[160px]"
          :placeholder="$t('promotion.pleaseSelectAStatus')"
        >
          <el-option
            v-for="item in activityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.device')" prop="device">
        <el-select
          v-model="searchForm.device"
          clearable
          class="!w-[160px]"
          :placeholder="$t('promotion.pleaseSelectDevice')"
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.startTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('promotion.startTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('promotion.endTime')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("promotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("promotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('promotion.menuLaunchedList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_promotion_public_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('create')"
        >
          {{ $t("promotion.newPromotionLaunch") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="ID"
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
              v-if="hasAuth('__btn_promotion_public_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("promotion.edit") }}
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
