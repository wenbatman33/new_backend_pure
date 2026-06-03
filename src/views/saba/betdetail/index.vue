<script setup lang="ts">
import { ref } from "vue";
import { useSabaBetdetail } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "SabaBetdetail" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  dateTypeOptions,
  ticketStatusOptions,
  liveStatusOptions,
  riskLevelOptions,
  oddsGroupOptions,
  platformOptions,
  productOptions,
  betTypeOptions,
  sportOptions,
  leagueOptions,
  matchOptions,
  loading,
  columns,
  dataList,
  pagination,
  getSummaries,
  onSearch,
  resetForm,
  onProductChange,
  onSportChange,
  onLeagueChange
} = useSabaBetdetail();
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
      <el-form-item :label="$t('saba.dateRange')">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="$t('saba.to')"
          :start-placeholder="$t('saba.startDate')"
          :end-placeholder="$t('saba.endDate')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('saba.queryDateType')" prop="QueryDateType">
        <el-select v-model="searchForm.QueryDateType" class="!w-[130px]">
          <el-option
            v-for="item in dateTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.memberID')" prop="VendorMemberId">
        <el-input
          v-model="searchForm.VendorMemberId"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('saba.txId')" prop="TxId">
        <el-input
          v-model="searchForm.TxId"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('saba.ticketStatusIds')" prop="ticketStatusIds">
        <el-select
          v-model="searchForm.ticketStatusIds"
          multiple
          collapse-tags
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in ticketStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.liveStatusIds')" prop="liveStatusIds">
        <el-select
          v-model="searchForm.liveStatusIds"
          multiple
          collapse-tags
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in liveStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.riskLevelIds')" prop="riskLevelIds">
        <el-select
          v-model="searchForm.riskLevelIds"
          multiple
          collapse-tags
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in riskLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.oddsGroupIds')" prop="oddsGroupIds">
        <el-select
          v-model="searchForm.oddsGroupIds"
          multiple
          collapse-tags
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in oddsGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.platformIds')" prop="platformIds">
        <el-select
          v-model="searchForm.platformIds"
          multiple
          collapse-tags
          clearable
          class="!w-[220px]"
        >
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.productId')" prop="productId">
        <el-select
          v-model="searchForm.productId"
          clearable
          class="!w-[140px]"
          @change="onProductChange"
        >
          <el-option
            v-for="item in productOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.betTypeId')" prop="BetTypeId">
        <el-select v-model="searchForm.BetTypeId" clearable class="!w-[140px]">
          <el-option
            v-for="item in betTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.sportId')" prop="SportId">
        <el-select
          v-model="searchForm.SportId"
          clearable
          class="!w-[140px]"
          @change="onSportChange"
        >
          <el-option
            v-for="item in sportOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.leagueId')" prop="LeagueId">
        <el-select
          v-model="searchForm.LeagueId"
          clearable
          class="!w-[140px]"
          @change="onLeagueChange"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('saba.matchId')" prop="MatchId">
        <el-select v-model="searchForm.MatchId" clearable class="!w-[140px]">
          <el-option
            v-for="item in matchOptions"
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
          {{ $t("saba.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("saba.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('saba.menuBetdetail')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          show-summary
          :summary-method="getSummaries"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
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
