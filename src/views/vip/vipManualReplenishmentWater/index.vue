<script setup lang="ts">
import { computed } from "vue";
import { useVipManualReplenishmentWater } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "VipManualReplenishmentWater" });

const {
  stepOneFormData,
  stepTwoFormData,
  searchForm,
  dataList,
  loading,
  buttonLoading,
  selectedIds,
  diffOptions,
  columns,
  handleStep,
  onSearch,
  resetForm,
  handleSelectionChange,
  handlePassOrReject,
  disabledDate
} = useVipManualReplenishmentWater();

// 是否有勾選列
const hasSelection = computed(() => selectedIds.value.length > 0);
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <!-- 步驟一：補額外流水 -->
      <div role="stepOne">
        <div class="step-title">{{ $t("vip.replWaterStepOne") }}</div>
        <div class="step-row">
          <span>{{ $t("vip.memberID") }}</span>
          <el-input
            v-model="stepOneFormData.memberIds"
            :placeholder="$t('vip.inputText')"
            class="!w-[200px] mx-3"
          />
          <span>{{ $t("vip.replWaterFirstParagraph") }}</span>
          <span class="ml-4">{{ $t("vip.billingCycle") }}</span>
          <el-date-picker
            v-model="stepOneFormData.runJobDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :placeholder="$t('vip.selectStart')"
            disabled
            class="mx-3"
          />
          <span>{{ $t("vip.replWaterStepOneSecondParagraph") }}</span>
        </div>
        <div class="step-row">
          <span>{{ $t("vip.replWaterWhetherToCalculateTheDifference") }}</span>
          <el-select
            v-model="stepOneFormData.isDiff"
            class="!w-[100px] mx-3"
          >
            <el-option
              v-for="item in diffOptions"
              :key="String(item.value)"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="mr-6">{{ $t("vip.replWaterThirdParagraph") }}</span>
          <el-popconfirm
            v-if="hasAuth('__btn_vip_manul_rebate')"
            :title="$t('vip.replWaterConfirmTurnover')"
            @confirm="handleStep('one')"
          >
            <template #reference>
              <el-button type="primary" :loading="buttonLoading">
                {{ $t("vip.replWaterExecuteAdditionalTurnover") }}
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>

      <!-- 步驟二：補水 -->
      <div role="stepTwo" class="mt-12">
        <div class="step-title">{{ $t("vip.replWaterStepTwo") }}</div>
        <div class="step-row">
          <span>{{ $t("vip.memberID") }}</span>
          <el-input
            v-model="stepTwoFormData.memberIds"
            :placeholder="$t('vip.inputText')"
            class="!w-[200px] mx-3"
          />
          <span>{{ $t("vip.replWaterFirstParagraph") }}</span>
          <span class="ml-4">{{ $t("vip.billingCycle") }}</span>
          <el-date-picker
            v-model="stepTwoFormData.runJobDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :placeholder="$t('vip.selectStart')"
            :disabled-date="disabledDate"
            class="mx-3"
          />
          <span>{{ $t("vip.replWaterStepTwoSecondParagraph") }}</span>
        </div>
        <div class="step-row">
          <span>{{ $t("vip.replWaterWhetherToCalculateTheDifference") }}</span>
          <el-select
            v-model="stepTwoFormData.isDiff"
            class="!w-[100px] mx-3"
          >
            <el-option
              v-for="item in diffOptions"
              :key="String(item.value)"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="mr-6">{{ $t("vip.replWaterThirdParagraph") }}</span>
          <el-popconfirm
            v-if="hasAuth('__btn_vip_manul_rebate')"
            :title="$t('vip.replWaterConfirmWaterReplenishment')"
            @confirm="handleStep('two')"
          >
            <template #reference>
              <el-button type="primary" :loading="buttonLoading">
                {{ $t("vip.replWaterPerformWaterReplenishment") }}
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>

      <!-- 步驟三：審核 -->
      <div role="stepThree" class="mt-12">
        <div class="step-title">{{ $t("vip.replWaterStepThree") }}</div>
        <div
          class="flex justify-between items-center flex-wrap mt-4 mb-6 gap-2"
        >
          <div class="flex items-center flex-wrap gap-2">
            <span>{{ $t("vip.member") }}</span>
            <el-input
              v-model="searchForm.memberID"
              :placeholder="$t('vip.inputText')"
              clearable
              class="!w-[200px]"
              @keyup.enter="onSearch"
            />
            <span class="ml-2">{{ $t("vip.memberAccount") }}</span>
            <el-input
              v-model="searchForm.memberAccount"
              :placeholder="$t('vip.inputText')"
              clearable
              class="!w-[200px]"
              @keyup.enter="onSearch"
            />
            <el-button :icon="Refresh" @click="resetForm">
              {{ $t("vip.reset") }}
            </el-button>
            <el-button type="primary" :icon="Search" @click="onSearch">
              {{ $t("vip.search") }}
            </el-button>
          </div>
          <div
            v-if="hasAuth('__btn_vip_manul_rebate_review')"
            class="flex flex-wrap gap-2"
          >
            <el-popconfirm
              :title="$t('vip.replWaterConfirmPassWater')"
              @confirm="handlePassOrReject('passAll')"
            >
              <template #reference>
                <el-button type="success" :loading="buttonLoading">
                  {{ $t("vip.replWaterPassAll") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('vip.replWaterConfirmPassWater')"
              @confirm="handlePassOrReject('pass')"
            >
              <template #reference>
                <el-button
                  type="success"
                  :disabled="buttonLoading || !hasSelection"
                >
                  {{ $t("vip.pass") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('vip.replWaterConfirmRejectWater')"
              @confirm="handlePassOrReject('rejectAll')"
            >
              <template #reference>
                <el-button type="danger" :loading="buttonLoading">
                  {{ $t("vip.replWaterRejectAll") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="$t('vip.replWaterConfirmRejectWater')"
              @confirm="handlePassOrReject('reject')"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :disabled="buttonLoading || !hasSelection"
                >
                  {{ $t("vip.refuse") }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>

        <PureTableBar
          :title="$t('vip.replWaterStepThree')"
          :columns="columns"
          @refresh="resetForm"
        >
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              row-key="id"
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
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.step-title {
  font-size: 14px;
  font-weight: 600;
}

.step-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
}
</style>
