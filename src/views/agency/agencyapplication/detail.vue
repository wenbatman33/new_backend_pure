<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { AgencyApplicationItem } from "./utils/types";

defineOptions({ name: "AgencyApplicationDetail" });

const props = defineProps<{ detail: AgencyApplicationItem }>();

const statusMap: Record<number, string> = {
  1: $t("agency.agencyApplication3"),
  2: $t("agency.agencyApplication4"),
  3: $t("agency.agencyApplication5")
};
const statusTagType: Record<number, "warning" | "success" | "danger"> = {
  1: "warning",
  2: "success",
  3: "danger"
};
</script>

<template>
  <el-descriptions :column="3" border>
    <el-descriptions-item label="ID">{{ props.detail.id }}</el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable1')">
      {{ props.detail.memberID }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable2')">
      {{ props.detail.agencyAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable3')">
      {{ props.detail.name }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationDetailModal3')">
      {{ props.detail.phone }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.addAgencyModal19')">
      {{ props.detail.qqAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable5')">
      {{ props.detail.email }}
    </el-descriptions-item>
    <el-descriptions-item label="Telegram">
      {{ props.detail.telegram }}
    </el-descriptions-item>
    <el-descriptions-item label="Whatsapp">
      {{ props.detail.whatsapp }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.addAgencyModal18')">
      {{ props.detail.wechatAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable6')">
      {{ props.detail.createdAt }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationTable7')">
      {{ props.detail.reviewTime }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationDetailModal4')">
      {{ props.detail.adminUserID ?? props.detail.adminAccount }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationDetailModal5')">
      <el-tag :type="statusTagType[props.detail.auditStatus] ?? 'info'">
        {{ statusMap[props.detail.auditStatus] ?? props.detail.auditStatus }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationDetailModal6')" :span="2">
      {{ props.detail.remark }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('agency.agencyApplicationDetailModal7')" :span="3">
      {{ props.detail.promoteDescription }}
    </el-descriptions-item>
  </el-descriptions>
</template>
