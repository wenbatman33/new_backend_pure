<script setup lang="ts">
import { ref } from "vue";
import { useFirstReview } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "RiskControlFirstReview" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSelectionChange,
  handleReview,
  handleBatchReview,
  handleComment,
  handleBatchComment,
  handleTag,
  handleBatchTag,
  handleConfirm
} = useFirstReview();
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
      <el-form-item :label="$t('risk_control.memberID')" prop="memberID">
        <el-input
          v-model="searchForm.memberID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('risk_control.memberAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('risk_control.agent')" prop="agent">
        <el-input
          v-model="searchForm.agent"
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
          {{ $t("risk_control.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("risk_control.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('risk_control.menuFirstReview')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_risk_check_batch_confirm')"
          type="primary"
          @click="handleBatchReview"
        >
          {{ $t("risk_control.bulkConfirm") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_risk_check_batch_comment')"
          type="primary"
          @click="handleBatchComment"
        >
          {{ $t("risk_control.bulkAddRemark") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_risk_check_batch_tag')"
          type="primary"
          @click="handleBatchTag"
        >
          {{ $t("risk_control.bulkAddTags") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="memberID"
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
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_risk_check_confirm')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleConfirm(row)"
            >
              {{ $t("risk_control.okText") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_risk_check_comment')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleComment(row)"
            >
              {{ $t("risk_control.addRemark") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_risk_check_batch_tag')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleTag(row)"
            >
              {{ $t("risk_control.addTag") }}
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
