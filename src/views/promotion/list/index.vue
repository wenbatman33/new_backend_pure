<script setup lang="ts">
import { ref } from "vue";
import { usePromotionList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PromotionList" });

const formRef = ref();
const {
  searchForm,
  dropdown,
  onlineOptions,
  walletTypeOptions,
  freedomOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleStatus,
  handleDelete,
  openWindow,
  notImplemented
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
      <el-form-item :label="$t('promotion.id')" prop="ID">
        <el-input
          v-model="searchForm.ID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.name')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.internalName')" prop="internalName">
        <el-input
          v-model="searchForm.internalName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.condType')" prop="promotionCondType">
        <el-select
          v-model="searchForm.promotionCondType"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in dropdown.promotionCondType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in dropdown.status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.activityCycle')" prop="activity">
        <el-select v-model="searchForm.activity" clearable class="!w-[160px]">
          <el-option
            v-for="item in dropdown.activity"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.online')" prop="online">
        <el-select v-model="searchForm.online" clearable class="!w-[160px]">
          <el-option
            v-for="item in onlineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.walletType2')" prop="walletType">
        <el-select v-model="searchForm.walletType" clearable class="!w-[160px]">
          <el-option
            v-for="item in walletTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.freedom')" prop="freedom">
        <el-select v-model="searchForm.freedom" clearable class="!w-[160px]">
          <el-option
            v-for="item in freedomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.code')" prop="eventCode">
        <el-input
          v-model="searchForm.eventCode"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.startTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[180px]"
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
      :title="$t('promotion.menuList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <template v-if="hasAuth('__btn_promotion_list_create')">
          <el-button type="primary" :icon="AddFill" @click="notImplemented">
            {{ $t("promotion.fastPromotion") }}
          </el-button>
          <el-button type="primary" :icon="AddFill" @click="notImplemented">
            {{ $t("promotion.newPromotionTemplate") }}
          </el-button>
          <el-button type="primary" :icon="AddFill" @click="notImplemented">
            {{ $t("promotion.newPromotion") }}
          </el-button>
        </template>
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
              v-if="hasAuth('__btn_promotion_list_active')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleStatus(row)"
            >
              {{
                row.status === 1 ? $t("promotion.disable") : $t("promotion.enable")
              }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_list_batch')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openWindow(`/promotion/batch?promotionID=${row.ID}`)"
            >
              {{ $t("promotion.batch") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_list_apply')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openWindow(`/promotion/apply?promotionID=${row.ID}`)"
            >
              {{ $t("promotion.applyList") }}
            </el-button>
            <el-popconfirm
              v-if="hasAuth('__btn_promotion_list_delete')"
              :title="$t('promotion.confirmDel')"
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
                  {{ $t("promotion.delete") }}
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
