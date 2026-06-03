<script setup lang="tsx">
import { ref } from "vue";
import { useLuckwalletLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";

defineOptions({ name: "MemberLuckwalletLog" });

const formRef = ref();
const {
  walletId,
  show,
  searchForm,
  inOutOptions,
  typeOptions,
  walletInfo,
  walletInfoFields,
  columns,
  dataList,
  loading,
  pagination,
  getWalletListInfo,
  onSearch,
  toggleShow,
  handleSizeChange,
  handleCurrentChange
} = useLuckwalletLog();
</script>

<template>
  <div class="main">
    <!-- 錢包 ID 查詢列 -->
    <div class="flex items-center bg-bg_color p-[12px] mb-[12px]">
      <div class="mr-6">
        <span style="color: #ff647c">* </span>{{ $t("member.walletId") }}
      </div>
      <div class="flex gap-x-[12px] items-center">
        <el-input
          v-model="walletId"
          type="number"
          size="small"
          class="!w-[180px]"
          :placeholder="$t('member.plzInputWalletId')"
          @keyup.enter="getWalletListInfo(walletId)"
        />
        <el-button type="primary" @click="getWalletListInfo(walletId)">
          {{ $t("member.search") }}
        </el-button>
        <el-button type="primary" @click="toggleShow">
          {{ show ? $t("member.putAway") : $t("member.expand") }}
        </el-button>
      </div>
    </div>

    <!-- 搜尋區（可展開/收合） -->
    <el-form
      v-show="show"
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('member.breakEven')" prop="inOut">
        <el-select v-model="searchForm.inOut" class="!w-[160px]">
          <el-option
            v-for="item in inOutOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.sendTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          class="!w-[150px]"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="$t('member.relatedOrderNumber')" prop="refId">
        <el-input
          v-model="searchForm.refId"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.walletLogType')" prop="type">
        <el-select
          v-model="searchForm.type"
          multiple
          clearable
          collapse-tags
          class="!w-[200px]"
          :placeholder="$t('member.all')"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.shield')" prop="ignore">
        <el-input
          v-model="searchForm.ignore"
          clearable
          class="!w-[160px]"
          :placeholder="$t('member.enterShieldTextReminder')"
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
          {{ $t("member.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 錢包資訊展示 -->
    <el-descriptions
      v-if="show && walletInfo.createdAt"
      :column="4"
      border
      class="mb-[12px] mt-[12px]"
    >
      <el-descriptions-item
        v-for="(field, idx) in walletInfoFields"
        :key="idx"
        :label="field.label"
      >
        <component :is="() => field.render(walletInfo)" />
      </el-descriptions-item>
    </el-descriptions>

    <!-- 錢包紀錄表格 -->
    <PureTableBar
      :title="$t('member.menuLuckwalletLog')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
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
