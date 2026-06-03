<script setup lang="ts">
import { usePayoutAgency } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import Close from "~icons/ep/close";
import Refresh from "~icons/ep/refresh";
import Edit from "~icons/ep/edit";

defineOptions({ name: "WithdrawalPayoutAgency" });

const {
  loading,
  orderSn,
  splitAmount,
  withdrawalData,
  payoutList,
  bankcardList,
  payChannelList,
  usdtList,
  payTypes,
  descColumns,
  withdrawalAmount,
  payoutAmount,
  toLocaleString,
  handleSplit,
  handleCreate,
  handleUpdateSplitAmount,
  handleDelete,
  handleUpdateAmount,
  handleUpdateColumn,
  handleUpdatePayType,
  handleUpdatePayID,
  handleCheckPay,
  handleCallback,
  handleEdit
} = usePayoutAgency();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <!-- 標題列 -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-base font-medium">
          {{ $t("withdrawal.payoutMenuAgency") }} / {{ orderSn }}
        </div>
        <div>
          {{ $t("withdrawal.payoutStatusLabel") }}：{{
            withdrawalData?.statusStr ?? "-"
          }}
        </div>
      </div>

      <!-- 提款主資料描述 -->
      <el-descriptions :column="2" border class="mb-4">
        <el-descriptions-item
          v-for="(item, idx) in descColumns"
          :key="idx"
          :label="item.label"
        >
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 出款資訊 / 拆單 -->
      <div class="flex items-center mb-4">
        <span class="mr-4">
          {{ $t("withdrawal.payoutEstWithdrawal") }}
          {{ toLocaleString(withdrawalAmount) }}，
          {{ $t("withdrawal.payoutTotal") }} {{ toLocaleString(payoutAmount) }}
        </span>
      </div>

      <div
        v-if="payoutList.length === 0"
        class="flex items-center gap-3 p-4 mb-4 bg-bg_color"
      >
        <span>{{ $t("withdrawal.payoutSplitMax") }}</span>
        <el-input
          :model-value="splitAmount"
          type="number"
          class="!w-[160px]"
          @update:model-value="handleUpdateSplitAmount"
        />
        <span>{{ $t("withdrawal.payoutSplitUnit") }}</span>
        <el-button type="primary" @click="handleSplit">
          {{ $t("withdrawal.payoutSplitBtn") }}
        </el-button>
      </div>

      <!-- 工具列 -->
      <div class="mb-3">
        <el-button
          v-if="withdrawalData.status !== 5"
          type="primary"
          @click="handleCreate"
        >
          {{ $t("withdrawal.payoutAddRow") }}
        </el-button>
      </div>

      <!-- 出款表格 -->
      <el-table :data="payoutList" border size="small" stripe>
        <!-- 刪除 -->
        <el-table-column width="60">
          <template #default="{ $index, row }">
            <el-icon
              v-if="!row?.status?.key"
              class="cursor-pointer"
              @click="handleDelete($index)"
            >
              <Close />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('withdrawal.payoutColSendId')"
          prop="send_id"
        />

        <!-- 金額 -->
        <el-table-column :label="$t('withdrawal.payoutColAmount')">
          <template #default="{ $index, row }">
            <el-input
              v-if="!row?.status?.key"
              :model-value="row.amount"
              type="number"
              size="small"
              @update:model-value="(v: string) => handleUpdateAmount($index, v)"
            />
            <span v-else>{{ toLocaleString(row.amount) }}</span>
          </template>
        </el-table-column>

        <!-- 出款方式 -->
        <el-table-column :label="$t('withdrawal.payoutColPayType')">
          <template #default="{ $index, row }">
            <el-select
              v-if="!row?.status?.key"
              :model-value="row?.payType?.key"
              size="small"
              :placeholder="$t('withdrawal.payoutSelectType')"
              @update:model-value="(v: number) => handleUpdatePayType($index, v)"
            >
              <el-option
                v-for="item in payTypes"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <span v-else-if="row?.payType?.value !== undefined">{{
              row.payType.value
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 出款帳號 -->
        <el-table-column :label="$t('withdrawal.payoutColPayId')">
          <template #default="{ $index, row }">
            <!-- 銀行卡 -->
            <el-select
              v-if="!row?.status?.key && row?.payType?.key === 1"
              :model-value="row?.payID?.key"
              size="small"
              :placeholder="$t('withdrawal.payoutSelectBank')"
              @update:model-value="(v: number) => handleUpdatePayID($index, v)"
            >
              <el-option
                v-for="item in bankcardList"
                :key="item.ID"
                :label="item.cardNo"
                :value="item.ID"
              />
            </el-select>
            <!-- 三方 -->
            <el-select
              v-else-if="!row?.status?.key && row?.payType?.key === 2"
              :model-value="row?.payID?.key"
              size="small"
              :placeholder="$t('withdrawal.payoutSelectChannel')"
              @update:model-value="(v: number) => handleUpdatePayID($index, v)"
            >
              <el-option
                v-for="item in payChannelList"
                :key="item.id"
                :label="`${item.name} ${item.sn}`"
                :value="item.id"
              />
            </el-select>
            <!-- USDT -->
            <el-select
              v-else-if="!row?.status?.key && row?.payType?.key === 3"
              :model-value="row?.payID?.key"
              size="small"
              :placeholder="$t('withdrawal.payoutSelectUsdt')"
              @update:model-value="(v: number) => handleUpdatePayID($index, v)"
            >
              <el-option
                v-for="item in usdtList"
                :key="item.id"
                :label="`${item.name} - ${item.address}`"
                :value="item.id"
              />
            </el-select>
            <span v-else-if="row?.payID?.value !== undefined">{{
              row.payID.value
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 手續費 -->
        <el-table-column :label="$t('withdrawal.payoutColFee')">
          <template #default="{ $index, row }">
            <el-input
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.fee"
              type="number"
              size="small"
              @update:model-value="(v: string) => handleUpdateColumn($index, v, 'fee')"
            />
            <span v-else>{{ toLocaleString(row.fee) }}</span>
          </template>
        </el-table-column>

        <!-- 美金 -->
        <el-table-column :label="$t('withdrawal.payoutColOtherAmount')">
          <template #default="{ $index, row }">
            <el-input
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.otherAmount"
              type="number"
              size="small"
              @update:model-value="(v: string) => handleUpdateColumn($index, v, 'otherAmount')"
            />
            <span v-else>{{
              row?.payType?.key === 3 ? toLocaleString(row.otherAmount) : "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 匯率 -->
        <el-table-column :label="$t('withdrawal.payoutColExchangeRate')">
          <template #default="{ $index, row }">
            <el-input
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.exchangeRate"
              type="number"
              size="small"
              @update:model-value="(v: string) => handleUpdateColumn($index, v, 'exchangeRate')"
            />
            <span v-else>{{
              row?.payType?.key === 3 ? toLocaleString(row.exchangeRate) : "-"
            }}</span>
          </template>
        </el-table-column>

        <!-- 狀態 -->
        <el-table-column :label="$t('withdrawal.payoutColStatus')" width="160">
          <template #default="{ $index, row }">
            <div
              v-if="row?.status?.key === 1"
              class="flex items-center justify-center"
            >
              <span style="color: #fcc687">{{
                $t("withdrawal.payoutPaying")
              }}</span>
              <el-icon
                class="ml-2 cursor-pointer"
                @click="handleCallback(row)"
              >
                <Refresh />
              </el-icon>
              <el-icon
                v-if="hasAuth('__btn_withdrawal_paying_edit')"
                class="ml-2 cursor-pointer"
                @click="handleEdit(row)"
              >
                <Edit />
              </el-icon>
            </div>
            <span v-else-if="row?.status?.key === 2" style="color: #f00">{{
              $t("withdrawal.payoutFailed")
            }}</span>
            <span v-else-if="row?.status?.key === 3" style="color: #5cb85c">{{
              $t("withdrawal.payoutSucceeded")
            }}</span>
            <span v-else-if="row?.status?.key === 0">{{
              $t("withdrawal.payoutUnknown")
            }}</span>
            <el-button
              v-else
              type="primary"
              size="small"
              @click="handleCheckPay(row)"
              >{{ $t("withdrawal.payoutPay") }}</el-button
            >
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('withdrawal.payoutColUpdatedAt')"
          prop="updatedAt"
        />
        <el-table-column
          :label="$t('withdrawal.payoutColThirdSn')"
          prop="thirdSn"
        />
        <el-table-column
          :label="$t('withdrawal.payoutColEditor')"
          prop="editorName"
        />
      </el-table>
    </el-card>
  </div>
</template>
