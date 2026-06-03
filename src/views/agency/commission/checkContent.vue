<script setup lang="tsx">
import dayjs from "dayjs";
import { computed } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { CommissionItem } from "./utils/types";

const props = defineProps<{
  rows: CommissionItem[];
  summary: { num: number | string; amount: number | string; amount2?: string };
  tab: 1 | 2 | 3;
  dateStr: string;
}>();

const num = (v: any) => {
  try {
    return Number(v || "0").toLocaleString();
  } catch {
    return v;
  }
};

const title = computed(() => {
  const dateStr = dayjs(props.dateStr).format("YYYY年MM月");
  let tit = $t("agency.commissionCheckFirst");
  if (props.tab === 2 || props.tab === 3) tit = $t("agency.commissionCheckChild");
  return `${dateStr} ${tit}${$t("agency.commissionCheckSummary")}`;
});

const columns = computed<TableColumnList>(() => {
  const cols: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    {
      label: $t("agency.commissionAgencyAccount"),
      prop: "agencyAccount",
      width: 180
    },
    {
      label: $t("agency.commissionWallet"),
      prop: "wallet",
      cellRenderer: ({ row }) => <span>{num(row.wallet)}</span>
    },
    {
      label: $t("agency.commissionMonthTotalCommission"),
      prop: "totalCommission",
      cellRenderer: ({ row }) => <span>{num(row.totalCommission)}</span>
    },
    {
      label: $t("agency.commissionMonthLastTotalCommission"),
      prop: "lastTotalCommission",
      cellRenderer: ({ row }) =>
        Number(row.lastTotalCommission) < 0 ? (
          <span style="color:#F00">{num(row.lastTotalCommission)}</span>
        ) : (
          <span>{num(row.lastTotalCommission)}</span>
        )
    }
  ];
  if (props.tab === 2) {
    cols.push(
      {
        label: $t("agency.commissionChildTotalWinAmount"),
        prop: "childTotalWinAmount",
        cellRenderer: ({ row }) => <span>{num(row.childTotalWinAmount)}</span>
      },
      {
        label: $t("agency.commissionChildCommissionAmount"),
        prop: "childCommissionAmount",
        cellRenderer: ({ row }) => <span>{num(row.childCommissionAmount)}</span>
      },
      {
        label: $t("agency.commissionChildBonusAmount"),
        prop: "childBonusAmount",
        cellRenderer: ({ row }) => <span>{num(row.childBonusAmount)}</span>
      }
    );
  }
  return cols;
});
</script>

<template>
  <div>
    <div class="check-summary">
      <span class="check-title">{{ title }}</span>
      <el-descriptions :column="3" border>
        <el-descriptions-item :label="$t('agency.commissionPassCount')">
          {{ summary.num }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.commissionMonthTotalCommission')">
          {{ summary.amount }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="tab === 2"
          :label="$t('agency.commissionChildBonusAmount')"
        >
          {{ summary.amount2 }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <pure-table
      class="mt-3"
      align-whole="center"
      border
      :data="rows"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.check-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
</style>
