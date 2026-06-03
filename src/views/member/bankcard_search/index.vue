<script setup lang="tsx">
import { ref } from "vue";
import { useBankCardSearch } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberBankcardSearch" });

const formRef = ref();
const {
  searchForm,
  typeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openMemberDetail
} = useBankCardSearch();
</script>

<template>
  <div class="main">
    <!-- 搜尋區（bankNo 與 type 為必填） -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('member.bankCardUtAdress')" prop="bankNo">
        <el-input
          v-model="searchForm.bankNo"
          clearable
          class="!w-[220px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.type')" prop="type">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
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
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuBankcardSearch')"
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
          <template #memberAccount="{ row }">
            <span
              class="cursor-pointer"
              style="color: #ff647c"
              @click="openMemberDetail(row.memberId)"
            >
              {{ row.memberAccount }}
            </span>
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
