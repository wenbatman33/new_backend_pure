<script setup lang="ts">
import { useFakeMember } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "FaketoolsMember" });

const {
  loading,
  columns,
  dataList,
  createForm,
  searchForm,
  resetPassword,
  bulkVipLevel,
  bulkRegisDate,
  submitCreateMember,
  onSearch,
  handleSave,
  handleResetPassword,
  handleSetVip,
  handleSetDate,
  handleBulkSave,
  handleSelectionChange
} = useFakeMember();
</script>

<template>
  <div class="main">
    <!-- 新增會員 -->
    <el-card class="mb-3" shadow="never">
      <template #header>
        <span class="font-medium">{{ $t("faketools.createMember") }}</span>
      </template>
      <el-form :inline="true" :model="createForm">
        <el-form-item :label="$t('faketools.accountPrefix')">
          <el-input v-model="createForm.accountPrefix" class="!w-[160px]" />
        </el-form-item>
        <el-form-item :label="$t('faketools.startNumber')">
          <el-input v-model="createForm.startNumber" class="!w-[120px]" />
        </el-form-item>
        <el-form-item :label="$t('faketools.endNumber')">
          <el-input v-model="createForm.endNumber" class="!w-[120px]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitCreateMember">
            {{ $t("faketools.createAccount") }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-alert type="warning" :closable="false" show-icon>
        <div>{{ $t("faketools.createTip1") }}</div>
        <div>{{ $t("faketools.createTip2") }}</div>
        <div>{{ $t("faketools.createTip3") }}</div>
      </el-alert>
    </el-card>

    <!-- 修改會員基本資料 -->
    <el-card shadow="never">
      <template #header>
        <span class="font-medium">{{ $t("faketools.editMember") }}</span>
      </template>

      <!-- 搜尋會員 -->
      <el-form :inline="true" :model="searchForm">
        <el-form-item :label="$t('faketools.memberAccount')">
          <el-input
            v-model="searchForm.account"
            type="textarea"
            :rows="3"
            class="!w-[600px]"
            :placeholder="$t('faketools.accountTextareaTip')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">
            {{ $t("faketools.getMemberData") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 批次操作列 -->
      <el-form :inline="true" class="mt-2">
        <el-form-item>
          <el-input
            v-model="resetPassword"
            class="!w-[160px]"
            :placeholder="$t('faketools.newPassword')"
          />
          <el-button class="ml-2" type="primary" plain @click="handleResetPassword">
            {{ $t("faketools.bulkResetPassword") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="bulkVipLevel"
            class="!w-[120px]"
            :placeholder="$t('faketools.vipLevel')"
          />
          <el-button class="ml-2" type="primary" plain @click="handleSetVip">
            {{ $t("faketools.confirmVip") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="bulkRegisDate"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            class="!w-[160px]"
          />
          <el-button class="ml-2" type="primary" plain @click="handleSetDate">
            {{ $t("faketools.confirmRegisterTime") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleBulkSave">
            {{ $t("faketools.bulkSave") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <PureTableBar :title="$t('faketools.menuMember')" :columns="columns" @refresh="onSearch">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            row-key="id"
            align-whole="center"
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
              <el-button link type="primary" :size="size" @click="handleSave(row)">
                {{ $t("faketools.save") }}
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </el-card>
  </div>
</template>
