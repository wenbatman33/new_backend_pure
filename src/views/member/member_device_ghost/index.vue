<script setup lang="ts">
import { ref } from "vue";
import { useMemberDeviceGhost } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberDeviceGhost" });

const formRef = ref();
const {
  searchForm,
  loading,
  deviceList,
  activeNames,
  memberColumns,
  onSearch,
  resetForm,
  remarkMulti,
  openRepeatDialog,
  openCheckDialog,
  onSelectionChange
} = useMemberDeviceGhost();

// 區間天數僅允許數字
function onIntervalInput(val: string) {
  searchForm.interval = val.replace(/[^0-9]/g, "");
}
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] pb-[6px] overflow-auto relative"
    >
      <el-row :gutter="12">
        <el-col :span="20">
          <div class="flex flex-wrap items-start gap-x-4 gap-y-2">
            <el-form-item :label="$t('member.memberName2')" prop="memberName">
              <el-input
                v-model="searchForm.memberName"
                clearable
                class="!w-[160px]"
                @keyup.enter="onSearch"
              />
            </el-form-item>

            <el-form-item prop="isAccurate">
              <el-radio-group v-model="searchForm.isAccurate">
                <el-radio :value="true">{{ $t("member.accurate") }}</el-radio>
                <el-radio :value="false">{{ $t("member.fuzzy") }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('member.deviceID')" prop="deviceID">
              <el-input
                v-model="searchForm.deviceID"
                clearable
                class="!w-[160px]"
                @keyup.enter="onSearch"
              />
            </el-form-item>

            <el-form-item :label="$t('member.intervalDays')" prop="interval">
              <el-input
                v-model="searchForm.interval"
                clearable
                class="!w-[120px]"
                @input="onIntervalInput"
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
              <el-button :icon="Refresh" @click="resetForm">
                {{ $t("member.reset") }}
              </el-button>
              <el-button type="primary" @click="openRepeatDialog">
                {{ $t("member.recentSuspiciousDevices") }}
              </el-button>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button
            v-if="hasAuth('__btn_risk_tag_multiple')"
            type="primary"
            @click="remarkMulti"
          >
            {{ $t("member.markAllAsMultipleAccounts") }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 設備分組區 -->
    <div
      v-loading="loading"
      class="device-wrap bg-bg_color mt-2 p-3 rounded"
    >
      <el-empty
        v-if="!deviceList.length"
        :description="$t('member.noData')"
      />
      <el-collapse v-else v-model="activeNames">
        <el-collapse-item
          v-for="device in deviceList"
          :key="device.deviceID"
          :name="device.deviceID"
        >
          <template #title>
            <span class="font-bold">
              {{ $t("member.deviceID") }}: {{ device.deviceID }}
            </span>
          </template>

          <div class="mb-2 text-sm leading-6">
            <span class="mr-6">
              {{ $t("member.deviceLastLoginAccount") }}:
              {{ device.lastLoginAccount }}
            </span>
            <span>
              {{ $t("member.deviceIdLastLoginAt") }}:
              {{ device.deviceIdLastLoginAt }}
            </span>
          </div>

          <pure-table
            border
            row-key="id"
            align-whole="center"
            table-layout="auto"
            :data="device.list"
            :columns="memberColumns"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="rows => onSelectionChange(device.deviceID, rows)"
          >
            <template #operation="{ row }">
              <el-button
                v-if="hasAuth('__btn_RC_deposit')"
                link
                :type="row.depositLimit === 1 ? 'success' : 'danger'"
                @click="openCheckDialog(row, 'depositLimit')"
              >
                {{ $t("member.depositAWord") }}
              </el-button>
              <el-button
                v-if="hasAuth('__btn_RC_withdraw')"
                link
                :type="row.withdrawLimit === 1 ? 'success' : 'danger'"
                @click="openCheckDialog(row, 'withdrawLimit')"
              >
                {{ $t("member.withdraw") }}
              </el-button>
              <el-button
                v-if="hasAuth('__btn_RC_login')"
                link
                :type="row.status === 1 ? 'success' : 'danger'"
                @click="openCheckDialog(row, 'status')"
              >
                {{ $t("member.loginAWord") }}
              </el-button>
              <el-button
                v-if="hasAuth('__btn_RC_game')"
                link
                :type="row.gameLogin === 1 ? 'success' : 'danger'"
                @click="openCheckDialog(row, 'gameLogin')"
              >
                {{ $t("member.gameAWord") }}
              </el-button>
            </template>
          </pure-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
