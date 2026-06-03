<script setup lang="ts">
import { ref } from "vue";
import { useVipList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "VipList" });

const formRef = ref();
const {
  searchForm,
  isVN,
  loading,
  columns,
  dataList,
  pagination,
  giftForm,
  giftFormRef,
  vipLevelOptions,
  gameGroupOptions,
  statusOptions,
  vipStatusOptions,
  typeOptions,
  onSearch,
  resetForm,
  summaryMethod,
  handleAddGift,
  openPreview,
  accountHandleView
} = useVipList();
</script>

<template>
  <div class="main">
    <!-- 生日禮金新增（VN 站不顯示，且需權限） -->
    <el-form
      v-if="hasAuth('__btn_VIP_add_birthgift') && !isVN"
      ref="giftFormRef"
      :inline="true"
      :model="giftForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item
        :label="$t('vip.dateStart')"
        prop="time"
        :rules="[{ required: true, message: $t('vip.dateStart'), trigger: 'change' }]"
      >
        <el-date-picker
          v-model="giftForm.time"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item
        :label="$t('vip.memberAccount')"
        prop="account"
        :rules="[{ required: true, message: $t('vip.memberAccount'), trigger: 'blur' }]"
      >
        <el-input v-model="giftForm.account" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item
        :label="$t('vip.birthdayGiftContent')"
        prop="gift"
        :rules="[{ required: true, message: $t('vip.birthdayGiftContent'), trigger: 'blur' }]"
      >
        <el-input v-model="giftForm.gift" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => handleAddGift()">
          {{ $t("vip.addBirthdayGift") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('vip.distributionDateStart')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('vip.distributionDateEnd')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('vip.collectionDateStart')" prop="takenStartTime">
        <el-date-picker
          v-model="searchForm.takenStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('vip.collectionDateEnd')" prop="takenEndTime">
        <el-date-picker
          v-model="searchForm.takenEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('vip.memberAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('vip.vipLevel')" prop="vipLevel">
        <el-select v-model="searchForm.vipLevel" clearable class="!w-[160px]">
          <el-option
            v-for="item in vipLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vip.collectionStatus')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vip.vipStatus')" prop="vipStatus">
        <el-select v-model="searchForm.vipStatus" clearable class="!w-[160px]">
          <el-option
            v-for="item in vipStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vip.giftType')" prop="type">
        <el-select v-model="searchForm.type" clearable class="!w-[160px]">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('vip.selectManufacturer')" prop="gameGroupID">
        <el-select v-model="searchForm.gameGroupID" clearable class="!w-[160px]">
          <el-option
            v-for="item in gameGroupOptions"
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
          {{ $t("vip.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("vip.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('vip.menuVipList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="openPreview">
          {{ $t("vip.preCheckRebate") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          show-summary
          :summary-method="summaryMethod"
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
          <template #account="{ row }">
            <el-link type="primary" @click="accountHandleView(row)">
              {{ row.account }}
            </el-link>
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
