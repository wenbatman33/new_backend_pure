<script setup lang="ts">
import { ref } from "vue";
import { useLaunchedList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AiPromotionLaunchedList" });

const formRef = ref();
const {
  searchForm,
  displayOptions,
  deviceOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  onSortChange,
  handleEdit
} = useLaunchedList();
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
      <el-form-item :label="$t('aiPromotion.serialNumber')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.listingName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('aiPromotion.plzEnterListingName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.show')" prop="display">
        <el-select
          v-model="searchForm.display"
          clearable
          class="!w-[160px]"
          :placeholder="$t('aiPromotion.pleaseSelectToDisplay')"
        >
          <el-option
            v-for="item in displayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.device')" prop="device">
        <el-select
          v-model="searchForm.device"
          clearable
          class="!w-[160px]"
          :placeholder="$t('aiPromotion.pleaseSelectDevice')"
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.startTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          class="!w-[200px]"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('aiPromotion.startTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          class="!w-[200px]"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('aiPromotion.endTime')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("aiPromotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("aiPromotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('aiPromotion.menuLaunchedList')"
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
          @sort-change="onSortChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_promotion_public_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleEdit(row)"
            >
              {{ $t("aiPromotion.edit") }}
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
