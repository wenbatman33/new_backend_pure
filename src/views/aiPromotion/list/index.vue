<script setup lang="ts">
import { ref } from "vue";
import { usePromotionList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "AiPromotionList" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  onlineOptions,
  freedomOptions,
  walletTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleStatus
} = usePromotionList();
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
      <el-form-item :label="$t('aiPromotion.id')" prop="ID">
        <el-input
          v-model="searchForm.ID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.name')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.internalName')" prop="internalName">
        <el-input
          v-model="searchForm.internalName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.online')" prop="online">
        <el-select v-model="searchForm.online" clearable class="!w-[160px]">
          <el-option
            v-for="item in onlineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.code')" prop="eventCode">
        <el-input
          v-model="searchForm.eventCode"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.freedom')" prop="freedom">
        <el-select v-model="searchForm.freedom" clearable class="!w-[160px]">
          <el-option
            v-for="item in freedomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.walletType2')" prop="walletType">
        <el-select v-model="searchForm.walletType" clearable class="!w-[160px]">
          <el-option
            v-for="item in walletTypeOptions"
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
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('aiPromotion.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("aiPromotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("aiPromotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('aiPromotion.menuList')"
      :columns="columns"
      @refresh="onSearch"
    >
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_promotion_list_active')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleStatus(row)"
            >
              {{ row.status === 1 ? $t("aiPromotion.disable") : $t("aiPromotion.enable") }}
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
