<script setup lang="ts">
import { ref } from "vue";
import { useGameList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Document from "~icons/ep/document";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Edit from "~icons/ep/edit";

defineOptions({ name: "GamesGame" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  gameTypeOptions,
  gameGroupOptions,
  statusOptions,
  trialPlayOptions,
  isSlotOptions,
  yesNoOptions,
  onSearch,
  resetForm,
  onGameTypeChange,
  openDialog,
  openBatchDialog,
  openRecordDialog,
  handleSelectionChange
} = useGameList();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('games.type')" prop="gameTypeID">
        <el-select
          v-model="searchForm.gameTypeID"
          clearable
          class="!w-[150px]"
          @change="onGameTypeChange"
        >
          <el-option
            v-for="item in gameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.group')" prop="gameGroupID">
        <el-select
          v-model="searchForm.gameGroupID"
          filterable
          clearable
          class="!w-[220px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.name')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.displayName')" prop="displayName">
        <el-input
          v-model="searchForm.displayName"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[120px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.trialPlay')" prop="trialPlay">
        <el-select v-model="searchForm.trialPlay" class="!w-[120px]">
          <el-option
            v-for="item in trialPlayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.isSlot')" prop="isSlot">
        <el-select v-model="searchForm.isSlot" class="!w-[120px]">
          <el-option
            v-for="item in isSlotOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.recommendedSort')" prop="isRecommended">
        <el-select v-model="searchForm.isRecommended" class="!w-[120px]">
          <el-option
            v-for="item in yesNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.isNewGame')" prop="isNewGame">
        <el-select v-model="searchForm.isNewGame" class="!w-[120px]">
          <el-option
            v-for="item in yesNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[100px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.gameCodeH5')" prop="gameCodeH5">
        <el-input
          v-model="searchForm.gameCodeH5"
          clearable
          class="!w-[120px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.gameCodePc')" prop="gameCodePC">
        <el-input
          v-model="searchForm.gameCodePC"
          clearable
          class="!w-[120px]"
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
          {{ $t("games.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("games.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="$t('games.menuGame')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_game_list_edit')"
          type="primary"
          :icon="Edit"
          @click="openBatchDialog"
        >
          {{ $t("games.editGameStatus") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_game_list_new')"
          type="primary"
          :icon="AddFill"
          @click="openDialog(true)"
        >
          {{ $t("games.newGame") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="id"
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
              v-if="hasAuth('__btn_game_list_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(false, row)"
            >
              {{ $t("games.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_game_record')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Document"
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
