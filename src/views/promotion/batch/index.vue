<script setup lang="ts">
import { ref } from "vue";
import { usePromotionBatch } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import List from "~icons/ep/list";
import Check from "~icons/ep/select";

defineOptions({ name: "PromotionBatch" });

const formRef = ref();
const {
  searchForm,
  sendWayOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openApplyList,
  handleVerify
} = usePromotionBatch();
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
      <el-form-item :label="$t('promotion.promotionID')" prop="promotionID">
        <el-input
          v-model="searchForm.promotionID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.promotionName')" prop="promotionName">
        <el-input
          v-model="searchForm.promotionName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.batchID')" prop="batchID">
        <el-input
          v-model="searchForm.batchID"
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
      <el-form-item :label="$t('promotion.sendWay')" prop="send_way">
        <el-select
          v-model="searchForm.send_way"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in sendWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.sendAtStart')" prop="sendAtStart">
        <el-date-picker
          v-model="searchForm.sendAtStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('promotion.sendAtStart')"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.sendAtEnd')" prop="sendAtEnd">
        <el-date-picker
          v-model="searchForm.sendAtEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
          :placeholder="$t('promotion.sendAtEnd')"
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
      :title="$t('promotion.menuBatch')"
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
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_promotion_batch_applylist')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="List"
              @click="openApplyList(row)"
            >
              {{ $t("promotion.batchList") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_batch_verify')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Check"
              @click="handleVerify(row)"
            >
              {{ $t("promotion.verify") }}
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
