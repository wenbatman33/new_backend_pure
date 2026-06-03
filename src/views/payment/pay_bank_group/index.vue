<script setup lang="ts">
import { ref } from "vue";
import { usePayBankGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PaymentPayBankGroup" });

const formRef = ref();
const {
  searchForm,
  sourceOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  openAccountDialog,
  handleCheckRoute,
  handleSizeChange,
  handleCurrentChange
} = usePayBankGroup();
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
      <el-form-item :label="$t('payment.name2')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[180px]"
          :placeholder="$t('payment.pleaseInputName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('payment.source')" prop="source">
        <el-select
          v-model="searchForm.source"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.source')"
        >
          <el-option
            v-for="item in sourceOptions"
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
          {{ $t("payment.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("payment.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('payment.menuPayBankGroup')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_pay_group_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("payment.addBankGroup") }}
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_pay_group_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("payment.edit") }}
            </el-button>
            <el-button
              v-if="
                Number(row.source) === 1 &&
                hasAuth('__btn_pay_group_add_members')
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openAccountDialog(row, 'member')"
            >
              {{ $t("payment.addMember") }}
            </el-button>
            <el-button
              v-if="
                Number(row.source) === 2 &&
                hasAuth('__btn_pay_group_add_members')
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openAccountDialog(row, 'agency')"
            >
              {{ $t("payment.addAgency") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_pay_group_view')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleCheckRoute(row)"
            >
              {{ $t("payment.checkRoute") }}
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
