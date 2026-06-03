<script setup lang="ts">
import { usePayout } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import Refresh from "~icons/ep/refresh";
import Edit from "~icons/ep/edit";
import Close from "~icons/ep/close";

defineOptions({ name: "WithdrawalPayout" });

const {
  loading,
  state,
  orderSn,
  payTypes,
  columns,
  historyColumns,
  historyList,
  withdrawalAmount,
  payoutAmount,
  toLocaleString,
  getPayTypeValue,
  getBankcardValue,
  getPayChannelValue,
  getUSDTValue,
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
} = usePayout();
</script>

<template>
  <div class="main">
    <!-- 標題列 -->
    <el-card shadow="never" class="mb-2">
      <div class="flex items-center justify-between">
        <span class="text-base font-medium">
          {{ $t("withdrawal.payoutTitle") }} / {{ orderSn }}
        </span>
        <span>
          {{ $t("withdrawal.payoutStatusLabel") }}
          {{ state.withdrawalData?.status?.value }}
        </span>
      </div>
    </el-card>

    <!-- 提款資訊 + 歷史紀錄 -->
    <div class="flex flex-col gap-2 mb-2 lg:flex-row">
      <el-card shadow="never" class="flex-1">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('withdrawal.payoutWithdrawNumber')">
            {{ state.withdrawalData?.id }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutApplyTime')">
            {{ state.withdrawalData?.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutWithdrawalAmount')">
            {{ toLocaleString(state.withdrawalData?.amount) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutStatus')">
            {{ state.withdrawalData?.status?.value }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutMemberAccount')">
            {{ state.withdrawalData?.member?.value ?? state.payoutData?.account }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutAccName')">
            {{ state.payoutData?.withdrawalName }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutBankAccount')">
            {{ state.payoutData?.bankcard }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('withdrawal.payoutBankName')">
            {{ state.payoutData?.bankName }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card
        shadow="never"
        class="lg:w-[480px]"
        :body-style="{ padding: '0' }"
      >
        <pure-table
          align-whole="center"
          :max-height="220"
          :data="historyList"
          :columns="historyColumns"
        />
      </el-card>
    </div>

    <!-- 拆分區（無出款單時顯示） -->
    <el-card shadow="never" class="mb-2">
      <div class="flex flex-wrap items-center gap-3">
        <span>
          {{ $t("withdrawal.payoutEstWithdrawal") }} {{ withdrawalAmount }}，{{
            $t("withdrawal.payoutTotal")
          }}
          {{ payoutAmount }}
        </span>
        <template v-if="state.payoutList.length === 0">
          <span>{{ $t("withdrawal.payoutSplitLabelStart") }}</span>
          <el-input-number
            :model-value="state.splitAmount"
            :min="0"
            :controls="false"
            class="!w-[140px]"
            @update:model-value="handleUpdateSplitAmount"
          />
          <span>{{ $t("withdrawal.payoutSplitLabelEnd") }}</span>
          <el-button type="primary" @click="handleSplit">
            {{ $t("withdrawal.payoutSplitBtn") }}
          </el-button>
        </template>
      </div>
    </el-card>

    <!-- 出款單表格 -->
    <PureTableBar
      :title="$t('withdrawal.payoutTableTitle')"
      :columns="columns"
    >
      <template #buttons>
        <el-button
          v-if="state.withdrawalData.status !== 5"
          type="primary"
          @click="handleCreate"
        >
          {{ $t("withdrawal.payoutCreateBtn") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="state.payoutList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <!-- 刪除 -->
          <template #delete="{ $index, row }">
            <el-icon
              v-if="!row?.status?.key"
              class="cursor-pointer"
              @click="handleDelete($index)"
            >
              <Close />
            </el-icon>
          </template>

          <!-- 金額 -->
          <template #amount="{ $index, row }">
            <el-input-number
              v-if="!row?.status?.key"
              :model-value="row.amount"
              :min="0"
              :controls="false"
              class="!w-[110px]"
              @update:model-value="val => handleUpdateAmount($index, val)"
            />
            <span v-else>{{ toLocaleString(row.amount) }}</span>
          </template>

          <!-- 出款方式 -->
          <template #payType="{ $index, row }">
            <el-select
              v-if="!row?.status?.key"
              :model-value="row?.payType?.key"
              :placeholder="$t('withdrawal.payoutSelectPayType')"
              class="!w-[120px]"
              @update:model-value="val => handleUpdatePayType($index, val)"
            >
              <el-option
                v-for="item in payTypes"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <span v-else-if="row?.payType?.value !== undefined">
              {{ row.payType.value }}
            </span>
            <span v-else>-</span>
          </template>

          <!-- 商戶卡/通道/USDT -->
          <template #payID="{ $index, row }">
            <el-select
              v-if="!row?.status?.key && row?.payType?.key === 1"
              :model-value="row?.payID?.key"
              :placeholder="$t('withdrawal.payoutSelectBank')"
              class="!w-[150px]"
              @update:model-value="val => handleUpdatePayID($index, val)"
            >
              <el-option
                v-for="item in state.bankcardList"
                :key="item.ID"
                :label="item.cardNo"
                :value="item.ID"
              />
            </el-select>
            <el-select
              v-else-if="!row?.status?.key && row?.payType?.key === 2"
              :model-value="row?.payID?.key"
              :placeholder="$t('withdrawal.payoutSelectChannel')"
              class="!w-[150px]"
              @update:model-value="val => handleUpdatePayID($index, val)"
            >
              <el-option
                v-for="item in state.payChannelList"
                :key="item.id"
                :label="`${item.name} ${item.sn}`"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-else-if="!row?.status?.key && row?.payType?.key === 3"
              :model-value="row?.payID?.key"
              :placeholder="$t('withdrawal.payoutSelectUsdt')"
              class="!w-[150px]"
              @update:model-value="val => handleUpdatePayID($index, val)"
            >
              <el-option
                v-for="item in state.usdtList"
                :key="item.id"
                :label="`${item.name} - ${item.address}`"
                :value="item.id"
              />
            </el-select>
            <span v-else-if="row?.payID?.value !== undefined">
              {{ row.payID.value }}
            </span>
            <span v-else>-</span>
          </template>

          <!-- 手續費 -->
          <template #fee="{ $index, row }">
            <el-input-number
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.fee"
              :min="0"
              :controls="false"
              class="!w-[100px]"
              @update:model-value="val => handleUpdateColumn($index, val, 'fee')"
            />
            <span v-else>{{ toLocaleString(row.fee) }}</span>
          </template>

          <!-- USD -->
          <template #otherAmount="{ $index, row }">
            <el-input-number
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.otherAmount"
              :min="0"
              :controls="false"
              class="!w-[100px]"
              @update:model-value="val => handleUpdateColumn($index, val, 'otherAmount')"
            />
            <span v-else>
              {{ row?.payType?.key === 3 ? toLocaleString(row.otherAmount) : "-" }}
            </span>
          </template>

          <!-- 匯率 -->
          <template #exchangeRate="{ $index, row }">
            <el-input-number
              v-if="row?.payType?.key === 3 && !row?.status"
              :model-value="row.exchangeRate"
              :min="0"
              :controls="false"
              class="!w-[100px]"
              @update:model-value="val => handleUpdateColumn($index, val, 'exchangeRate')"
            />
            <span v-else>
              {{
                row?.payType?.key === 3 || row?.payType?.key === 2
                  ? toLocaleString(row.exchangeRate)
                  : "-"
              }}
            </span>
          </template>

          <!-- 狀態 -->
          <template #status="{ row }">
            <div
              v-if="row?.status?.key === 1"
              class="flex items-center justify-center"
            >
              <span style="color: #fcc687">
                {{ $t("withdrawal.payoutPaying") }}
              </span>
              <el-icon class="ml-2 cursor-pointer" @click="handleCallback(row)">
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
            <span v-else-if="row?.status?.key === 2" style="color: #f00">
              {{ $t("withdrawal.payoutStatusFail") }}
            </span>
            <span v-else-if="row?.status?.key === 3" style="color: #5cb85c">
              {{ $t("withdrawal.payoutStatusSuccess") }}
            </span>
            <span v-else-if="row?.status?.key === 0">
              {{ $t("withdrawal.payoutStatusUnknown") }}
            </span>
            <el-button v-else type="primary" @click="handleCheckPay(row)">
              {{ $t("withdrawal.payoutPayBtn") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
