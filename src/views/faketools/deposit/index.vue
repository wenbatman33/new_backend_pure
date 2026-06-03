<script setup lang="ts">
import { ref } from "vue";
import { useDeposit } from "./utils/hook";
import { createRules } from "./utils/rule";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";

defineOptions({ name: "FaketoolsDeposit" });

const createFormRef = ref();
const searchFormRef = ref();

const {
  loading,
  dataList,
  columns,
  typeOptions,
  currencyOptions,
  channelOptions,
  reportRange,
  createForm,
  searchForm,
  handleReportDeposit,
  handleCreate,
  handleSearch,
  handleDelete,
  handleSelectionChange
} = useDeposit();
</script>

<template>
  <div class="main">
    <div class="bg-bg_color px-8 py-4">
      <!-- 更新存款报表 -->
      <div class="flex items-center">
        <el-button type="primary" @click="handleReportDeposit">
          {{ $t("faketools.updateDepositReport") }}
        </el-button>
        <el-date-picker
          v-model="reportRange"
          class="ml-4"
          type="datetimerange"
          range-separator="~"
          :start-placeholder="$t('faketools.startTime')"
          :end-placeholder="$t('faketools.endTime')"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>

      <el-divider />

      <!-- 新增存款 -->
      <h3 class="mb-3">{{ $t("faketools.createDeposit") }}</h3>
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
        class="w-10/12"
      >
        <el-form-item :label="$t('faketools.depositType')" prop="type">
          <el-radio-group v-model="createForm.type">
            <el-radio
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- TODO: 汇入档案 / 下载范例档 依赖未移植的 @/components/Excel，暂以註解佔位 -->
        <el-form-item :label="$t('faketools.depositMembers')" prop="members">
          <el-input
            v-model="createForm.members"
            type="textarea"
            :rows="3"
            class="!w-[70%]"
            :placeholder="$t('faketools.depositMembersTip')"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.depositDate')" prop="depositAt">
          <el-date-picker
            v-model="createForm.depositAt"
            type="date"
            :placeholder="$t('faketools.selectDepositDate')"
            value-format="YYYY-MM-DD"
          />
          <el-time-picker
            v-model="createForm.depositTime"
            class="ml-4"
            :placeholder="$t('faketools.selectDepositTime')"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.depositAmount')" prop="depositAmount">
          <el-input
            v-model="createForm.depositAmount"
            class="!w-[200px]"
            :placeholder="$t('faketools.inputAmount')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('faketools.depositChannel')"
          prop="payChannelServiceID"
        >
          <el-select
            v-model="createForm.payChannelServiceID"
            class="!w-[300px]"
            :placeholder="$t('faketools.selectDepositChannel')"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('faketools.currency')" prop="currency">
          <el-radio-group v-model="createForm.currency">
            <el-radio
              v-for="item in currencyOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate(createFormRef)">
            {{ $t("faketools.createDepositSubmit") }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <!-- 删除存款 -->
      <h3 class="mb-3">{{ $t("faketools.deleteDeposit") }}</h3>
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        label-width="100px"
        class="w-10/12"
      >
        <el-form-item :label="$t('faketools.depositDate')">
          <el-date-picker
            v-model="searchForm.qStartTime"
            type="date"
            value-format="YYYY-MM-DD"
          />
          <span class="mx-4">~</span>
          <el-date-picker
            v-model="searchForm.qEndTime"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item :label="$t('faketools.depositType')" prop="type">
          <el-radio-group v-model="searchForm.type">
            <el-radio
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('faketools.depositMembers')"
          prop="members"
          :rules="[
            {
              required: true,
              message: $t('faketools.depositMembersTip'),
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="searchForm.members"
            type="textarea"
            :rows="3"
            class="!w-[60%]"
            :placeholder="$t('faketools.depositMembersTip')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(searchFormRef)">
            {{ $t("faketools.searchDeposit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 存款列表 -->
    <PureTableBar
      :title="$t('faketools.depositList')"
      :columns="columns"
      @refresh="handleSearch()"
    >
      <template #buttons>
        <el-button type="danger" :icon="Delete" @click="handleDelete">
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
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss"></style>
