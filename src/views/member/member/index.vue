<script setup lang="ts">
import { ref } from "vue";
import { useMember } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberMember" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  vipOptions,
  statusOptions,
  limitOptions,
  onSearch,
  resetForm,
  handleView,
  handleResetSMS,
  handleBatchTodo
} = useMember();
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
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.account')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.memberName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.phone')" prop="phone">
        <el-input
          v-model="searchForm.phone"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.vipLevel')" prop="vip_level">
        <el-select
          v-model="searchForm.vip_level"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in vipOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.depositLimit')" prop="deposit_limit">
        <el-select
          v-model="searchForm.deposit_limit"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in limitOptions"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.withdrawLimit')" prop="withdraw_limit">
        <el-select
          v-model="searchForm.withdraw_limit"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in limitOptions"
            :key="String(item.value)"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.createdAtStart')" prop="created_at_start">
        <el-date-picker
          v-model="searchForm.created_at_start"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('member.createdAtEnd')" prop="created_at_end">
        <el-date-picker
          v-model="searchForm.created_at_end"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('member.registerArea')" prop="registerArea">
        <el-input
          v-model="searchForm.registerArea"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.registerIp')" prop="registerIp">
        <el-input
          v-model="searchForm.registerIp"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.topAgencyID')" prop="topAgencyID">
        <el-input
          v-model="searchForm.topAgencyID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('member.recommenderAccount')"
        prop="recommenderAccount"
      >
        <el-input
          v-model="searchForm.recommenderAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.loginDeviceID')" prop="loginDeviceID">
        <el-input
          v-model="searchForm.loginDeviceID"
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
          {{ $t("member.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuMember')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_new_member')"
          type="primary"
          @click="handleBatchTodo"
        >
          {{ $t("member.addMember") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_add_comment')"
          @click="handleBatchTodo"
        >
          {{ $t("member.remark") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_login_setting')"
          @click="handleBatchTodo"
        >
          {{ $t("member.handleLogin") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_dw_setting')"
          @click="handleBatchTodo"
        >
          {{ $t("member.handleMoney") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_tag_setting')"
          @click="handleBatchTodo"
        >
          {{ $t("member.handleTag") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_edit_bankgrounp')"
          @click="handleBatchTodo"
        >
          {{ $t("member.handlePayGroup") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_list_export')"
          type="primary"
          @click="handleBatchTodo"
        >
          {{ $t("member.handleExport") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #account="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">
              {{ row.account }}
            </el-link>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleView(row)"
            >
              {{ $t("member.memberDetail") }}
            </el-button>
            <el-popconfirm
              :title="$t('member.confirmResetSMS')"
              @confirm="handleResetSMS(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="warning"
                  :size="size"
                >
                  {{ $t("member.resetSMS") }}
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
