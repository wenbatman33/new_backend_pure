<script setup lang="ts">
import { ref } from "vue";
import { useInboxList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "OperatorInboxList" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  typeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleRecycle
} = useInboxList();
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
      <el-form-item :label="$t('operator.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[180px]"
          :placeholder="$t('operator.plzInputMemberAccount')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('operator.timeInterval')" prop="dateRange">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          range-separator="~"
          :start-placeholder="$t('operator.startTime')"
          :end-placeholder="$t('operator.endTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('operator.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operator.type')" prop="type">
        <el-select v-model="searchForm.type" class="!w-[140px]">
          <el-option
            v-for="item in typeOptions"
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
          {{ $t("operator.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("operator.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('operator.menuInboxList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_inbox_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('Create')"
        >
          {{ $t("operator.addSiteMessage") }}
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
              v-if="hasAuth('__btn_inbox_view')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDialog('Edit', row)"
            >
              {{ $t("operator.check") }}
            </el-button>
            <el-popconfirm
              v-if="row.status !== 5"
              :title="$t('operator.confirmRecycle')"
              @confirm="handleRecycle(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_inbox_revoke')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                >
                  {{ $t("operator.recycle") }}
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
