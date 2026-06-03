<script setup lang="ts">
import { ref } from "vue";
import { useVip2 } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "SysVip2" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  tableTitle,
  onSearch,
  resetForm
} = useVip2();
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
      <el-form-item :label="$t('sys.vip2Module')" prop="module">
        <el-input
          v-model="searchForm.module"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('sys.vip2Start')" prop="start">
        <el-input
          v-model="searchForm.start"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('sys.vip2End')" prop="end">
        <el-input
          v-model="searchForm.end"
          clearable
          class="!w-[160px]"
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
          {{ $t("sys.vip2Search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("sys.vip2Reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="tableTitle || $t('sys.menuVip2')"
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #response="{ row }">
            <el-popover placement="bottom-start" trigger="click" :width="320">
              <template #reference>
                <span class="cursor-pointer text-ellipsis">{{
                  row.response
                }}</span>
              </template>
              <p class="break-all">{{ row.response }}</p>
            </el-popover>
          </template>
          <template #url="{ row }">
            <el-popover placement="bottom-start" trigger="click" :width="320">
              <template #reference>
                <span class="cursor-pointer text-ellipsis">{{ row.url }}</span>
              </template>
              <p class="break-all">{{ row.url }}</p>
            </el-popover>
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
