<script setup lang="ts">
import { ref } from "vue";
import { useYuebaoApplication } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "YuebaoApplication" });

const formRef = ref();
const {
  searchForm,
  sendRange,
  createdRange,
  receiveRange,
  statusOptions,
  loading,
  columns,
  dataList,
  total,
  pagination,
  onSearch,
  resetForm,
  handleViewWalletLog
} = useYuebaoApplication();
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('yuebao.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          :placeholder="$t('yuebao.pleaseInputAccount')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('yuebao.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[140px]"
          :placeholder="$t('yuebao.status')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('yuebao.numero')" prop="numero">
        <el-input
          v-model="searchForm.numero"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('yuebao.serialNo')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('yuebao.sendTime')">
        <el-date-picker
          v-model="sendRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('yuebao.startTime')"
          :end-placeholder="$t('yuebao.endTime')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('yuebao.applyTime')">
        <el-date-picker
          v-model="createdRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('yuebao.startTime')"
          :end-placeholder="$t('yuebao.endTime')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('yuebao.receiveTime')">
        <el-date-picker
          v-model="receiveRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('yuebao.startTime')"
          :end-placeholder="$t('yuebao.endTime')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("yuebao.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("yuebao.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('yuebao.menuApplication')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <div class="flex flex-wrap items-center gap-x-4 text-sm">
          <span>{{ $t("yuebao.giveupTotal") }}：{{ commaDecimalFormat(total.giveupTotal) }}</span>
          <span>{{ $t("yuebao.reciveTotal") }}：{{ commaDecimalFormat(total.reciveTotal) }}</span>
          <span>{{ $t("yuebao.sendTotal") }}：{{ commaDecimalFormat(total.sendTotal) }}</span>
          <span>{{ $t("yuebao.totalCount") }}：{{ commaDecimalFormat(total.count) }}</span>
        </div>
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
              v-if="hasAuth('__btn_member_wallet_log')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleViewWalletLog(row)"
            >
              {{ $t("yuebao.viewWalletLog") }}
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
