<script setup lang="ts">
import { ref } from "vue";
import { useGameGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Tickets from "~icons/ep/tickets";
import Setting from "~icons/ep/setting";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "GamesGameGroup" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  agencyOptions,
  gameTypeOptions,
  walletTypeOptions,
  statusOptions,
  onSearch,
  resetForm,
  openEditDialog,
  openConfigDialog,
  openRecordDialog
} = useGameGroup();
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
      <el-form-item :label="$t('games.manufacturerDefaultName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('games.plzEnterOriginalName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.websiteDisplayName')" prop="displayName">
        <el-input
          v-model="searchForm.displayName"
          clearable
          class="!w-[160px]"
          :placeholder="$t('games.plzEnterWebsiteDisplayName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.affiliatedAgents')" prop="gameAgencyID">
        <el-select
          v-model="searchForm.gameAgencyID"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in agencyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.walletType')" prop="walletType">
        <el-select v-model="searchForm.walletType" clearable class="!w-[160px]">
          <el-option
            v-for="item in walletTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.manufacturerGameType')" prop="gameTypeID">
        <el-select v-model="searchForm.gameTypeID" clearable class="!w-[160px]">
          <el-option
            v-for="item in gameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
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
          {{ $t("games.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("games.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('games.menuGameGroup')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_game_group_edit')"
          type="primary"
          :icon="Setting"
          @click="openConfigDialog"
        >
          {{ $t("games.configSportEventRecommend") }}
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
              v-if="hasAuth('__btn_game_group_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openEditDialog(row)"
            >
              {{ $t("games.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_game_group_record')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Tickets"
              @click="openRecordDialog(row)"
            >
              {{ $t("games.handleRecord") }}
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
