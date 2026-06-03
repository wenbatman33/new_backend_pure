<script setup lang="ts">
import { useWithdrawalTimeline } from "./utils/hook";
import { commaDecimalFormat } from "@/utils/number";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "WithdrawalTimeline" });

const { loading, tableData, formatUseType } = useWithdrawalTimeline();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never" class="timeline-card">
      <template #header>
        <span class="font-medium">{{ $t("withdrawal.timelineTitle") }}</span>
      </template>

      <el-empty
        v-if="!loading && tableData.length === 0"
        :description="$t('withdrawal.timelineNoData')"
      />

      <el-timeline v-else>
        <el-timeline-item
          v-for="(item, index) in tableData"
          :key="index"
          :timestamp="item.right.endTime"
          placement="top"
        >
          <div class="tl-row">
            <!-- 左侧：金额信息 -->
            <div class="left-box">
              <div class="header">
                <span class="title" :style="{ backgroundColor: item.color }">
                  {{ formatUseType(item.useTypeID) }}
                </span>
                <span>{{ item.right.endTime }}</span>
              </div>

              <div class="info-line">
                <span class="label">{{ $t("withdrawal.timelinePrevious") }}</span>
                <span class="content">{{ commaDecimalFormat(item.beforeMoney, 2) }}</span>
              </div>
              <div class="info-line">
                <span class="label">{{ $t("withdrawal.timelineAmount") }}</span>
                <span class="content">{{ commaDecimalFormat(item.adjustMoney, 2) }}</span>
              </div>
              <div class="info-line">
                <span class="label">{{ $t("withdrawal.timelineCurrent") }}</span>
                <span class="content">{{ commaDecimalFormat(item.afterMoney, 2) }}</span>
              </div>
              <div class="info-line">
                <span class="label">{{ $t("withdrawal.timelineMultiple") }}</span>
                <span class="content">{{ commaDecimalFormat(item.turnoverMultiple, 2) }}</span>
              </div>
              <div class="info-line">
                <span class="label label-bold">{{ $t("withdrawal.timelineTurnoverNeed") }}</span>
                <span class="content">{{ commaDecimalFormat(item.turnoverLimit, 2) }}</span>
              </div>
              <div class="info-line">
                <span class="label">{{ $t("withdrawal.timelineDetail") }}</span>
                <span class="content">{{ item.note }}</span>
              </div>
            </div>

            <!-- 右侧：下注明细表 -->
            <div class="right-box">
              <div class="right-time">
                {{ item.right.startTime }} ~ {{ item.right.endTime }}
              </div>
              <el-table :data="item.right.bets" border size="small">
                <el-table-column
                  :label="$t('withdrawal.timelineGameId')"
                  prop="game_list_id"
                  align="center"
                />
                <el-table-column :label="$t('withdrawal.timelineGroup')" align="center">
                  <template #default="{ row }">
                    {{ row.gameGroupDisplayName }}<br />{{ row.gameGroupName }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineType')" align="center">
                  <template #default="{ row }">
                    {{ row.typeName }}<br />{{ row.typeSecondName }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineBetAmount')" align="center">
                  <template #default="{ row }">{{ commaDecimalFormat(row.betAmount, 2) }}</template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineWinAmount')" align="center">
                  <template #default="{ row }">{{ commaDecimalFormat(row.winAmount, 2) }}</template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineWithdrawalTurnover')" align="center">
                  <template #default="{ row }">
                    {{ commaDecimalFormat(row.withdrawalTurnover, 2) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineVipTurnover')" align="center">
                  <template #default="{ row }">{{ commaDecimalFormat(row.vipTurnover, 2) }}</template>
                </el-table-column>
                <el-table-column :label="$t('withdrawal.timelineEventTurnover')" align="center">
                  <template #default="{ row }">
                    {{ commaDecimalFormat(row.eventTurnover, 2) }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.timeline-card {
  margin: 10px;
}

.tl-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.left-box {
  min-width: 420px;
  text-align: left;

  .header {
    padding: 10px;
    margin-bottom: 8px;
    background-color: var(--el-fill-color-light);
    border-radius: 8px;

    .title {
      padding: 4px 8px;
      margin-right: 40px;
      color: #fff;
      border-radius: 8px;
    }
  }

  .info-line {
    display: flex;
    flex-direction: row;
    padding: 2px 0;

    .label {
      width: 180px;
      padding-left: 15px;
    }

    .label-bold {
      font-weight: 800;
    }

    .content {
      flex: 1;
    }
  }
}

.right-box {
  flex: 1;
  min-width: 600px;

  .right-time {
    padding: 4px 0;
    text-align: right;
  }
}
</style>
