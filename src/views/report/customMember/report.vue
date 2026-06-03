<script setup lang="ts">
import { ref, computed } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { findByValue } from "@/utils/options";
import { exportExcel } from "@/utils/report";
import { getCustomMemberReport } from "@/api/report";
import {
  fieldMetaMap,
  compareOptions,
  statusOptions,
  certOptions,
  nameCertOptions,
  allFields
} from "./utils/data";
import type { ReportProps } from "./utils/types";

const props = withDefaults(defineProps<ReportProps>(), {
  record: () => ({}) as any,
  vipSettingList: () => []
});

const loading = ref(false);
const showSearch = ref(false);
const dataList = ref<any[]>([]);

const detail = computed(() => props.record || {});
const requestData = computed(() => detail.value.requestData || {});
const responseData = computed(() => detail.value.responseData || {});

// 條件設定顯示用：列出有值的條件欄位
const conditionFields = computed(() =>
  allFields.filter(f => {
    const meta = fieldMetaMap[f];
    if (meta.type === "date") {
      return (
        requestData.value[f + "Start"] !== undefined ||
        requestData.value[f + "End"] !== undefined
      );
    }
    return requestData.value[f] !== undefined;
  })
);

function conditionText(f: string): string {
  const meta = fieldMetaMap[f];
  const label = $t("report." + meta.labelKey);
  const rd = requestData.value;
  if (meta.type === "date") {
    return `${label} ${rd[f + "Start"] || ""} ~ ${rd[f + "End"] || ""}`;
  }
  if (meta.type === "number") {
    const sign = findByValue(compareOptions, rd[f + "Sign"]);
    return `${label} ${sign ?? ""} ${rd[f] ?? ""}`;
  }
  if (meta.type === "select") {
    if (meta.field === "vipLevel") {
      const vals = Array.isArray(rd[f]) ? rd[f] : [rd[f]];
      const names = vals
        .map(v => props.vipSettingList.find(i => i.value === v)?.label ?? v)
        .join(", ");
      return `${label}= ${names}`;
    }
    return `${label}= ${findByValue(meta.options || [], rd[f]) ?? rd[f]}`;
  }
  return `${label}= ${rd[f] ?? ""}`;
}

// 報表欄位（固定 + 動態）
const certMap = (text: any) =>
  text ? findByValue(certOptions, String(text)) : "";

const reportColumns = computed<TableColumnList>(() => {
  const cols: TableColumnList = [
    { label: $t("report.memberID"), prop: "id", width: 100 },
    { label: $t("report.memberAccount"), prop: "account", width: 160 }
  ];
  // responseData 中為 1 的欄位才顯示
  allFields.forEach(f => {
    if (responseData.value[f] !== 1) return;
    const meta = fieldMetaMap[f];
    const col: any = { label: $t("report." + meta.labelKey), prop: f };
    if (f === "memberStatus") {
      col.cellRenderer = ({ row }) =>
        row[f] ? findByValue(statusOptions, String(row[f])) : "";
    } else if (f === "nameCert") {
      col.cellRenderer = ({ row }) =>
        row[f] ? findByValue(nameCertOptions, String(row[f])) : "";
    } else if (
      ["phoneCert", "memberBankCard", "memberUsdt", "memberEcny", "eWallet"].includes(
        f
      )
    ) {
      col.cellRenderer = ({ row }) => certMap(row[f]);
    } else if (f === "vipLevel") {
      col.cellRenderer = ({ row }) =>
        findByValue(props.vipSettingList, row[f]) ?? row[f];
    }
    cols.push(col);
  });
  return cols;
});

async function handleSearch() {
  loading.value = true;
  try {
    const { data } = await getCustomMemberReport({ id: detail.value.id });
    dataList.value = data?.list ?? [];
    showSearch.value = true;
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  exportExcel("/backend/report/custom/export", { id: detail.value.id });
}
</script>

<template>
  <div class="report-view">
    <el-descriptions :column="1" border>
      <el-descriptions-item :label="$t('report.title')">
        {{ detail.title }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('report.description')">
        {{ detail.description }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('report.dateRange')">
        <template v-if="detail.start && detail.end">
          {{ detail.start }} ~ {{ detail.end }}
        </template>
        <template v-else>{{ $t("report.noLimitTime") }}</template>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('report.conditionSetting')">
        <div class="flex flex-wrap gap-2">
          <el-tag
            v-for="f in conditionFields"
            :key="f"
            type="primary"
            effect="plain"
          >
            {{ conditionText(f) }}
          </el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <div class="flex justify-end mt-4">
      <el-button type="primary" :loading="loading" @click="handleSearch">
        {{ $t("report.search") }}
      </el-button>
    </div>

    <div v-show="showSearch" class="mt-4">
      <div class="mb-2 flex justify-end">
        <el-button
          v-if="hasAuth('__btn_custom_report_export')"
          type="primary"
          :loading="loading"
          @click="handleExport"
        >
          {{ $t("report.handleExport") }}
        </el-button>
      </div>
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :loading="loading"
        :data="dataList"
        :columns="reportColumns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </div>
  </div>
</template>
