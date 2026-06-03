<script setup lang="ts">
import { useRiskCheck } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "WithdrawalRiskCheck" });

const {
  loading,
  orderSn,
  showButton,
  moneyLogSearch,
  promotionDetailData,
  tagsData,
  commentsData,
  walletLogList,
  stakeList,
  useTypeListOption,
  baseInfoColumns,
  walletInfoColumns,
  promotionColumns,
  tagColumns,
  walletLogColumns,
  stakeColumns,
  handleMoneyLogSearch,
  selectAllType,
  cleanType,
  openTimeline,
  openAuditDialog
} = useRiskCheck();
</script>

<template>
  <div v-loading="loading" class="main grid grid-cols-3 gap-4">
    <!-- 左側主區 -->
    <el-card class="col-span-2" shadow="never">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <span class="page-title">
          {{ $t("withdrawal.withdrawReview") }} / {{ orderSn }}
        </span>
        <div v-if="showButton">
          <el-button type="primary" @click="openAuditDialog('reject')">
            {{ $t("withdrawal.reject") }}
          </el-button>
          <el-button type="primary" @click="openAuditDialog('pass')">
            {{ $t("withdrawal.pass") }}
          </el-button>
        </div>
      </div>

      <!-- 基本资料 -->
      <div class="section">
        <span class="section-title">{{ $t("withdrawal.baseInfo") }}</span>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            v-for="item in baseInfoColumns"
            :key="item.label"
            :label="item.label"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 钱包资料 -->
      <div class="section">
        <span class="section-title">{{ $t("withdrawal.walletData") }}</span>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            v-for="item in walletInfoColumns"
            :key="item.label"
            :label="item.label"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 優惠資訊 -->
      <div class="section">
        <span class="section-title">{{ $t("withdrawal.promotionInfo") }}</span>
        <pure-table
          align-whole="center"
          border
          :data="promotionDetailData.list"
          :columns="promotionColumns"
          max-height="240"
        />
      </div>

      <!-- 標籤詳情 -->
      <div class="section">
        <span class="section-title">{{ $t("withdrawal.tagDetail") }}</span>
        <pure-table
          align-whole="center"
          border
          :data="tagsData.list"
          :columns="tagColumns"
          max-height="240"
        />
      </div>

      <!-- 用戶備註 -->
      <div class="section">
        <span class="section-title">{{ $t("withdrawal.userComments") }}</span>
        <el-collapse v-if="commentsData.length">
          <el-collapse-item
            v-for="(comment, index) in commentsData.slice(0, 5)"
            :key="String(comment.id)"
            :name="String(comment.id)"
          >
            <template #title>
              {{ comment.title }}（By：{{ comment.updator || comment.creator }}）
            </template>
            <p>{{ comment.content }}</p>
            <p class="comment-time">{{ comment.updatedAt || comment.createdAt }}</p>
          </el-collapse-item>
        </el-collapse>
        <el-empty v-else :description="$t('withdrawal.noData')" />
      </div>

      <!-- 资金记录 -->
      <div class="section">
        <PureTableBar :title="$t('withdrawal.moneyLog')" :columns="walletLogColumns">
          <template #buttons>
            <div class="flex flex-wrap items-center gap-2">
              <el-date-picker
                v-model="moneyLogSearch.start"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="$t('withdrawal.startTime')"
                class="!w-[180px]"
              />
              <span>～</span>
              <el-date-picker
                v-model="moneyLogSearch.end"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="$t('withdrawal.endTime')"
                class="!w-[180px]"
              />
              <el-checkbox v-model="moneyLogSearch.hiddenGameMoney">
                {{ $t("withdrawal.hideGameMoney") }}
              </el-checkbox>
              <el-select
                v-model="moneyLogSearch.type"
                multiple
                collapse-tags
                clearable
                class="!w-[220px]"
                :placeholder="$t('withdrawal.project')"
              >
                <el-option
                  v-for="item in useTypeListOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button link type="danger" @click="selectAllType">
                {{ $t("withdrawal.selectAll") }}
              </el-button>
              <el-button link type="danger" @click="cleanType">
                {{ $t("withdrawal.clear") }}
              </el-button>
              <el-button type="primary" @click="handleMoneyLogSearch">
                {{ $t("withdrawal.search") }}
              </el-button>
              <el-button type="success" @click="openTimeline">
                {{ $t("withdrawal.timeline") }}
              </el-button>
            </div>
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              align-whole="center"
              showOverflowTooltip
              border
              :size="size"
              :data="walletLogList"
              :columns="dynamicColumns"
              max-height="510"
            />
          </template>
        </PureTableBar>
      </div>
    </el-card>

    <!-- 右側：遊戲流水詳情 -->
    <el-card shadow="never">
      <span class="section-title">{{ $t("withdrawal.gameDetail") }}</span>
      <pure-table
        align-whole="center"
        border
        row-key="name"
        :data="stakeList"
        :columns="stakeColumns"
        :tree-props="{ children: 'list' }"
        default-expand-all
        max-height="600"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  font-size: 16px;
  font-weight: 500;
}
.section {
  margin-top: 16px;
  &-title {
    display: inline-block;
    margin-bottom: 8px;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 36px;
    border-left: 3px solid var(--el-color-primary);
  }
}
.comment-time {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
