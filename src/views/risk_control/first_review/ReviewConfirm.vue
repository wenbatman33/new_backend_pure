<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { CheckItem } from "./utils/types";

defineOptions({ name: "RiskReviewConfirm" });

defineProps<{
  records: CheckItem[];
}>();

const columns: TableColumnList = [
  { label: "ID", prop: "memberID", width: 80 },
  { label: $t("risk_control.memberAccount"), prop: "account", width: 150 },
  { label: $t("risk_control.name"), prop: "name", width: 150 },
  {
    label: $t("risk_control.agent"),
    prop: "agent",
    width: 150,
    cellRenderer: ({ row }) => (row.agent === "0" ? "" : row.agent)
  },
  { label: $t("risk_control.createdAt"), prop: "registerDate", width: 180 }
];
</script>

<template>
  <div>
    <p class="double-check">
      {{ $t("risk_control.reviewTheFollowingMembers") }}?
    </p>
    <pure-table
      row-key="memberID"
      align-whole="center"
      :data="records"
      :columns="columns"
      max-height="200"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.double-check {
  margin-bottom: 12px;
  font-size: 1.5em;
  color: #f0453a;
}
</style>
