<script setup lang="ts">
import { ref } from "vue";
import { useLotteryEgg } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "IndependentEventLotteryegg" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  openLog,
  handleStop
} = useLotteryEgg();
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
      <el-form-item :label="$t('independentEvent.lotteryeggSearchTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[180px]"
          :placeholder="$t('independentEvent.lotteryeggStartDate')"
        />
        <span class="px-1">-</span>
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[180px]"
          :placeholder="$t('independentEvent.lotteryeggEndDate')"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.lotteryeggSearchDate')" prop="startDate">
        <el-date-picker
          v-model="searchForm.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
          :placeholder="$t('independentEvent.lotteryeggStartDate')"
        />
        <span class="px-1">-</span>
        <el-date-picker
          v-model="searchForm.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
          :placeholder="$t('independentEvent.lotteryeggEndDate')"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.lotteryeggSearchName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          :placeholder="$t('independentEvent.lotteryeggEnterEventName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.lotteryeggRoundTime')" prop="roundTime">
        <el-input
          v-model="searchForm.roundTime"
          type="number"
          clearable
          class="!w-[120px]"
          :placeholder="$t('independentEvent.lotteryeggEnterDuration')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("independentEvent.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("independentEvent.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('independentEvent.menuLotteryegg')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_lotteryeaster_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('create')"
        >
          {{ $t("independentEvent.lotteryeggCreate") }}
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
            <template v-if="row.status === 2">
              <el-button
                v-if="hasAuth('__btn_lotteryeaster_copy')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('copy', row)"
              >
                {{ $t("independentEvent.lotteryeggCopy") }}
              </el-button>
              <el-button
                v-if="hasAuth('__btn_lotteryeaster_record')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openLog(row)"
              >
                {{ $t("independentEvent.lotteryeggLog") }}
              </el-button>
            </template>
            <template v-else>
              <el-button
                v-if="hasAuth('__btn_lotteryeaster_edit')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('edit', row)"
              >
                {{ $t("independentEvent.lotteryeggEdit") }}
              </el-button>
              <el-button
                v-if="hasAuth('__btn_lotteryeaster_copy')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openDialog('copy', row)"
              >
                {{ $t("independentEvent.lotteryeggCopy") }}
              </el-button>
              <el-popconfirm
                v-if="hasAuth('__btn_lotteryeaster_active')"
                :title="$t('independentEvent.lotteryeggStopConfirm')"
                @confirm="handleStop(row)"
              >
                <template #reference>
                  <el-button class="reset-margin" link type="danger" :size="size">
                    {{ $t("independentEvent.lotteryeggStop") }}
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button
                v-if="hasAuth('__btn_lotteryeaster_record')"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="openLog(row)"
              >
                {{ $t("independentEvent.lotteryeggLog") }}
              </el-button>
            </template>
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
