<script setup lang="ts">
import { ref } from "vue";
import { useLmGameGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Tickets from "~icons/ep/tickets";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "GamesLmGameGroup" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  gameAgencyOptions,
  gameTypeListOption,
  statusOptions,
  walletOptions,
  onSearch,
  resetForm,
  openDialog,
  openRecordDialog
} = useLmGameGroup();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item
        :label="$t('games.lmGameGroupManufacturerDefaultName')"
        prop="name"
      >
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('games.lmGameGroupPlzEnterOriginalName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('games.lmGameGroupWebsiteDisplayName')"
        prop="displayName"
      >
        <el-input
          v-model="searchForm.displayName"
          clearable
          class="!w-[160px]"
          :placeholder="$t('games.lmGameGroupPlzEnterWebsiteDisplayName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('games.lmGameGroupAffiliatedAgents')"
        prop="gameAgencyID"
      >
        <el-select
          v-model="searchForm.gameAgencyID"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in gameAgencyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('games.lmGameGroupWalletType')"
        prop="walletType"
      >
        <el-select v-model="searchForm.walletType" class="!w-[160px]">
          <el-option :label="$t('games.lmGameGroupAll')" :value="0" />
          <el-option
            v-for="item in walletOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.lmGameGroupGameTypes')" prop="gameTypeID">
        <el-select
          v-model="searchForm.gameTypeID"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in gameTypeListOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.lmGameGroupStatus')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
          <el-option :label="$t('games.lmGameGroupAll')" :value="0" />
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
          {{ $t("games.lmGameGroupSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("games.lmGameGroupReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="$t('games.menuLmGameGroup')"
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
              v-if="hasAuth('__btn_game_lm_group_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("games.lmGameGroupEdit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_game_lm_group_record')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Tickets"
              @click="openRecordDialog(row)"
            >
              {{ $t("games.lmGameGroupHandleRecord") }}
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
