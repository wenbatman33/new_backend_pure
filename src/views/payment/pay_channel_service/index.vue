<script setup lang="ts">
import { ref } from "vue";
import { usePayChannelService } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PaymentPayChannelService" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  dropdown,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleCreate,
  handleEdit,
  handleToggleStatus,
  handleGroupSetting,
  openBillDetail
} = usePayChannelService();
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
      <el-form-item :label="$t('payment.lineName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.choseRoute')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('payment.routeStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.routeStatusPhd')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.payWay')" prop="serviceCode">
        <el-select
          v-model="searchForm.serviceCode"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.paymentPhd')"
        >
          <el-option
            v-for="item in dropdown.serviceCode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.checkoutWay')" prop="method">
        <el-select
          v-model="searchForm.method"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.checkoutWayPhd')"
        >
          <el-option
            v-for="item in dropdown.method"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.payChannelID')" prop="payChannelID">
        <el-select
          v-model="searchForm.payChannelID"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.payChannelIDPhd')"
        >
          <el-option
            v-for="item in dropdown.payChannel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.bankGroup')" prop="bankGroupID">
        <el-select
          v-model="searchForm.bankGroupID"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in dropdown.bankGroups"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.payGroup')" prop="thirdGroupID">
        <el-select
          v-model="searchForm.thirdGroupID"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in dropdown.thirdGroups"
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
      :title="$t('payment.menuPayChannelService')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_pay_channel_service_create')"
          type="primary"
          :icon="AddFill"
          @click="handleCreate"
        >
          {{ $t("payment.addRoute") }}
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
              v-if="hasAuth('__btn_pay_channel_service_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleEdit(row)"
            >
              {{ $t("payment.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_pay_channel_service_groups')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleGroupSetting(row)"
            >
              {{ $t("payment.groupSetting") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_pay_channel_service_details')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openBillDetail(row)"
            >
              {{ $t("payment.billDetail") }}
            </el-button>
            <el-popconfirm
              :title="$t('payment.confirmToggleStatus')"
              @confirm="handleToggleStatus(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_pay_channel_service_active')"
                  class="reset-margin"
                  link
                  :type="String(row.status) === '1' ? 'danger' : 'success'"
                  :size="size"
                >
                  {{
                    String(row.status) === "1"
                      ? $t("payment.disable")
                      : $t("payment.enable")
                  }}
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
