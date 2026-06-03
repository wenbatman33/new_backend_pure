<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { ChildApplicationDetail } from "./utils/types";

defineProps<{ detail: ChildApplicationDetail }>();

// 审核状态对应文案
const statusMap: Record<number, string> = {
  1: $t("agency.statusPending"),
  2: $t("agency.statusApproved"),
  3: $t("agency.statusRejected")
};
const statusColorMap: Record<number, string> = {
  1: "warning",
  2: "success",
  3: "danger"
};
</script>

<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item :label="$t('agency.agencyAccount')">
      {{ detail.agencyAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyName')">
      {{ detail.agencyName }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.applyTime')">
      {{ detail.applyTime }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.childAgencyAccount')">
      {{ detail.childAgencyAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.childAgencyName')">
      {{ detail.childAgencyName }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.reviewTime')">
      {{ detail.reviewTime }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.auditStatus')">
      <el-tag :type="(statusColorMap[detail.auditStatus] as any) ?? 'info'">
        {{ statusMap[detail.auditStatus] ?? detail.auditStatus }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyRemark')" :span="2">
      {{ detail.agencyRemark }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.adminRemark')" :span="2">
      {{ detail.remark }}
    </el-descriptions-item>
  </el-descriptions>
</template>
