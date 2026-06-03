<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AdjustmentItem, AdjustmentMember } from "./utils/types";

const props = defineProps<{
  detail: AdjustmentItem;
  memberList: AdjustmentMember[];
  isReviewed: boolean;
  typeOptions: { label: string; value: number }[];
  adjustReasonOptions: { label: string; value: number }[];
}>();

const list = ref<AdjustmentMember[]>(props.memberList);

function typeText(v: number) {
  return props.typeOptions.find(e => e.value === Number(v))?.label ?? "";
}
function reasonText(v: number) {
  return props.adjustReasonOptions.find(e => e.value === v)?.label ?? "";
}
function scoreText(v: string) {
  return v === "1" ? $t("member.highScore") : $t("member.lowerScore");
}
function statusText(s: number) {
  switch (Number(s)) {
    case 1:
      return $t("member.adjustmentStatus1");
    case 2:
      return $t("member.adjustmentStatus5");
    case 3:
      return $t("member.notReview");
    case 4:
      return $t("member.noPass");
    default:
      return "";
  }
}

function getMemberList() {
  return list.value;
}

defineExpose({ getMemberList });
</script>

<template>
  <div>
    <!-- 申請單明細 -->
    <el-descriptions :column="2" border size="small">
      <el-descriptions-item :label="$t('member.lmSection7')">
        {{ detail.subject }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.adjustmentReason')">
        {{ reasonText(detail.reason) }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.explain')" :span="2">
        {{ detail.description }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.frontDeskInstructions')" :span="2">
        {{ detail.feDescription }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.scoreUpAndDown')">
        {{ scoreText(detail.adjustmentType) }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.VipSection11')">
        {{ detail.amountTimes }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.currency')">
        {{ detail.currency }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('member.type')">
        {{ typeText(detail.type) }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 申請名單 -->
    <el-table :data="list" border size="small" max-height="330" class="mt-3">
      <el-table-column :label="$t('member.memberName2')" prop="memberAccount" />
      <el-table-column :label="$t('member.amount')" prop="amount" />
      <el-table-column :label="$t('member.aduitResults')" width="180">
        <template #default="{ row }">
          <template v-if="isReviewed">
            <span>{{ statusText(row.status) }}</span>
          </template>
          <el-switch
            v-else
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            :active-text="$t('member.agree')"
            :inactive-text="$t('member.notAgree')"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.reason')">
        <template #default="{ row }">
          <span v-if="isReviewed">{{ row.reason }}</span>
          <el-input v-else v-model="row.reason" clearable />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
