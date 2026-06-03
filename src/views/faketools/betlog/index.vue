<script setup lang="ts">
import { ref } from "vue";
import { useBetlog } from "./utils/hook";
import { createRules, searchRules } from "./utils/rule";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";

defineOptions({ name: "FaketoolsBetlog" });

const createFormRef = ref();
const searchFormRef = ref();

const {
  loading,
  dataList,
  gameMode,
  modeOptions,
  apiGameGroup,
  gameListIDs,
  reportRange,
  createForm,
  searchForm,
  columns,
  handleChangeMode,
  selectAll,
  handleSearchReportGame,
  handleCreate,
  handleSearch,
  handleSelectionChange,
  handleDelete
} = useBetlog();
</script>

<template>
  <div class="main">
    <div class="px-8 py-4 bg-bg_color">
      <!-- 流水模式 -->
      <div class="flex items-center my-3 gap-x-6">
        <h3>{{ $t("faketools.betlogMode") }}</h3>
        <el-radio-group
          :model-value="gameMode"
          @update:model-value="handleChangeMode"
        >
          <el-radio
            v-for="item in modeOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 更新流水報表 -->
      <div class="flex items-center gap-x-3">
        <el-button type="danger" @click="handleSearchReportGame">
          {{ $t("faketools.updateReport") }}
        </el-button>
        <el-date-picker
          v-model="reportRange.startTime"
          type="date"
          value-format="YYYY-MM-DD"
        />
        <span>~</span>
        <el-date-picker
          v-model="reportRange.endTime"
          type="date"
          value-format="YYYY-MM-DD"
        />
      </div>

      <el-divider />

      <!-- 選擇遊戲 -->
      <div class="flex items-center gap-x-6">
        <h3>{{ $t("faketools.selectGame") }}</h3>
        <div class="flex gap-x-3 text-[var(--el-color-danger)]">
          <span
            class="cursor-pointer hover:underline"
            @click="selectAll(true, -1)"
            >{{ $t("faketools.selectAll") }}</span
          >
          <span>|</span>
          <span
            class="cursor-pointer hover:underline"
            @click="selectAll(false, -1)"
            >{{ $t("faketools.unselectAll") }}</span
          >
        </div>
      </div>
      <div class="px-4 mt-2">
        <div
          v-for="(game, index) in apiGameGroup"
          :key="game.Id"
          class="flex items-center my-1 gap-x-4"
        >
          <p class="font-semibold min-w-[60px]">{{ game.name }}</p>
          <el-checkbox-group v-model="gameListIDs[index]">
            <el-checkbox
              v-for="item in game.gameGroupList"
              v-show="item.gameListId"
              :key="item.gameListId"
              :value="item.gameListId"
            >
              {{ item.displayName }} ({{ item.gameListId }})
            </el-checkbox>
          </el-checkbox-group>
          <div class="flex gap-x-3 text-[var(--el-color-danger)] shrink-0">
            <span
              class="cursor-pointer hover:underline"
              @click="selectAll(true, index)"
              >{{ $t("faketools.selectAll") }}</span
            >
            <span>|</span>
            <span
              class="cursor-pointer hover:underline"
              @click="selectAll(false, index)"
              >{{ $t("faketools.unselectAll") }}</span
            >
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 新增流水 -->
      <h3 class="mb-3">{{ $t("faketools.createBetlog") }}</h3>
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="120px"
        class="p-4 rounded bg-[var(--el-fill-color-light)]"
      >
        <el-form-item
          v-if="gameMode === 1"
          :label="$t('faketools.inputType')"
          prop="type"
        >
          <el-radio-group v-model="createForm.type">
            <el-radio :value="1">{{ $t("faketools.memberAccount") }}</el-radio>
            <el-radio :value="2">{{ $t("faketools.inputId") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="gameMode === 1 ? $t('faketools.accountOrId') : $t('faketools.walletId')"
          prop="members"
        >
          <el-input
            v-model="createForm.members"
            type="textarea"
            :rows="3"
            class="!w-[500px]"
            :placeholder="$t('faketools.inputAccountOrId')"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.date')" prop="betAt">
          <el-date-picker
            v-model="createForm.betAt"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('faketools.selectBetDate')"
          />
          <el-time-picker
            v-model="createForm.betTime"
            class="!ml-2"
            format="HH:mm"
            value-format="HH:mm"
            :placeholder="$t('faketools.selectBetTime')"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.turnover')" prop="turnover">
          <el-input
            v-model="createForm.turnover"
            class="!w-[200px]"
            :placeholder="$t('faketools.inputTurnover')"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.winAmount')" prop="winAmount">
          <el-input
            v-model="createForm.winAmount"
            class="!w-[200px]"
            :placeholder="$t('faketools.inputWinAmount')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate(createFormRef)">
            {{ $t("faketools.createBetlog") }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <!-- 查詢流水 -->
      <h3 class="mb-3">{{ $t("faketools.searchBetlog") }}</h3>
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        :rules="searchRules"
        label-width="120px"
        class="p-4 rounded bg-[var(--el-fill-color-light)]"
      >
        <el-form-item :label="$t('faketools.inputType')" prop="type">
          <el-radio-group v-model="searchForm.type">
            <el-radio :value="1">{{ $t("faketools.memberAccount") }}</el-radio>
            <el-radio :value="2">{{ $t("faketools.inputId") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('faketools.accountOrId')" prop="members">
          <el-input
            v-model="searchForm.members"
            type="textarea"
            :rows="3"
            class="!w-[500px]"
            :placeholder="$t('faketools.inputAccountOrId')"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.date')" prop="qStartTime">
          <el-date-picker
            v-model="searchForm.qStartTime"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('faketools.selectStartDate')"
          />
          <el-time-picker
            v-model="searchForm.qStartTime2"
            class="!ml-2"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.endDate')" prop="qEndTime">
          <el-date-picker
            v-model="searchForm.qEndTime"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('faketools.selectEndDate')"
          />
          <el-time-picker
            v-model="searchForm.qEndTime2"
            class="!ml-2"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSearch(searchFormRef)"
          >
            {{ $t("faketools.searchBetlog") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 流水列表 -->
      <PureTableBar
        :title="$t('faketools.betlogList')"
        :columns="columns"
        @refresh="handleSearch()"
      >
        <template #buttons>
          <el-button
            v-if="hasAuth('__btn_faketools_betlog_delete')"
            type="danger"
            :icon="Delete"
            @click="handleDelete(undefined, true)"
          >
            {{ $t("faketools.batchDelete") }}
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
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
          >
            <template #operation="{ row }">
              <el-popconfirm
                :title="$t('faketools.confirmDeleteThis')"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    v-if="hasAuth('__btn_faketools_betlog_delete')"
                    class="reset-margin"
                    link
                    type="danger"
                    :size="size"
                    :icon="Delete"
                  >
                    {{ $t("faketools.delete") }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
