<script setup lang="ts">
import { ref, computed } from "vue";
import { getAdjustTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AdjustmentLogItem, ReviewFormProps } from "./utils/types";

const props = withDefaults(defineProps<ReviewFormProps>(), {
  detail: () => ({}),
  isReviewed: false
});

const typeOptions = getAdjustTypeOptions();

// detail.list 為審核明細，直接綁定供編輯（審核時可改 status/remark）
const detail = ref(props.detail);
if (!detail.value.list) detail.value.list = [];
// 未審核時預設全部通過、清空原因
if (!props.isReviewed) {
  detail.value.list.forEach(item => {
    item.status = 1;
    item.remark = "";
  });
}

const typeLabel = computed(
  () =>
    typeOptions.find(item => item.value === Number(detail.value.type))?.label ??
    ""
);

// 操作紀錄
const logList = computed<AdjustmentLogItem[]>(() => {
  const log: AdjustmentLogItem[] = [
    {
      operator: detail.value.applyAdminAccount,
      updatedAt: detail.value.applyDate,
      action: $t("agency.createApplicationForm")
    }
  ];
  if (detail.value.reviewAdminAccount) {
    log.push({
      operator: detail.value.reviewAdminAccount,
      updatedAt: detail.value.reviewDate,
      action: $t("agency.review")
    });
  }
  return log;
});

// 已審核時狀態文字
function statusText(status: number) {
  if (status === 1) return $t("agency.agree");
  if (status === 3) return $t("agency.pending");
  return $t("agency.notAgree");
}

function getRef() {
  return null;
}

defineExpose({ getRef });
</script>

<template>
  <div>
    <!-- 詳情 -->
    <el-descriptions :column="2" border class="mb-4">
      <el-descriptions-item :label="$t('agency.name')">
        {{ detail.subject }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.transactionType')">
        {{ typeLabel }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.turnoverLimit')">
        {{ detail.turnoverTimes }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.remark')">
        {{ detail.desc }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 操作紀錄 -->
    <div class="my-3 font-bold">{{ $t("agency.operationRecord") }}</div>
    <el-table :data="logList" border max-height="160">
      <el-table-column :label="$t('agency.operator')" prop="operator" />
      <el-table-column :label="$t('agency.updatedTime')" prop="updatedAt" />
      <el-table-column :label="$t('agency.action')" prop="action" />
    </el-table>

    <!-- 申請列表 -->
    <div class="my-3 font-bold">{{ $t("agency.applicationList") }}</div>
    <el-table :data="detail.list" border max-height="330">
      <el-table-column :label="$t('agency.index')" prop="id" width="90" />
      <el-table-column
        :label="$t('agency.agencyAccount')"
        prop="agencyAccount"
        width="150"
      />
      <el-table-column
        :label="$t('agency.agencyIDS')"
        prop="agencyID"
        width="100"
      />
      <el-table-column :label="$t('agency.auditResults')" width="120">
        <template #default="{ row }">
          <el-switch
            v-if="!isReviewed"
            :model-value="row.status === 1"
            :active-text="$t('agency.agree')"
            :inactive-text="$t('agency.notAgree')"
            @update:model-value="(v: boolean) => (row.status = v ? 1 : 2)"
          />
          <span v-else>{{ statusText(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('agency.amount')" prop="amount" width="150" />
      <el-table-column :label="$t('agency.reason')" min-width="200">
        <template #default="{ row }">
          <el-input v-if="!isReviewed" v-model="row.remark" />
          <span v-else>{{ row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
