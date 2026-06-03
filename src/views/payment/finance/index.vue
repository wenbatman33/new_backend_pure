<script setup lang="ts">
import { ref } from "vue";
import { useFinance } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Setting from "~icons/ep/setting";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PaymentFinance" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  maintainOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleToggleStatus,
  handleToggleMaintain,
  handleSetDefault,
  handleDelete,
  openAmountConfig
} = useFinance();
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
      <el-form-item :label="$t('payment.showStatus')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.maintainStatus')" prop="maintain">
        <el-select v-model="searchForm.maintain" class="!w-[160px]">
          <el-option
            v-for="item in maintainOptions"
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
      :title="$t('payment.menuFinance')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_finance_deposit_amount_setting')"
          type="primary"
          :icon="Setting"
          @click="openAmountConfig"
        >
          {{ $t("payment.rechargeSetting") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_finance_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("payment.addItem") }}
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
              v-if="hasAuth('__btn_finance_active')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 2 ? $t("payment.open") : $t("payment.closeText") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_finance_maintain')"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              @click="handleToggleMaintain(row)"
            >
              {{
                row.maintain === 2
                  ? $t("payment.openMaintain")
                  : $t("payment.closeMaintain")
              }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_finance_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("payment.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__col_finance_default') && !row.isDefault"
              class="reset-margin"
              link
              type="success"
              :size="size"
              @click="handleSetDefault(row)"
            >
              {{ $t("payment.setDefault") }}
            </el-button>
            <el-popconfirm
              :title="$t('payment.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_finance_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("payment.delete") }}
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
