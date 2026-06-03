<script setup lang="tsx">
import { h, ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  getAgencyNewRegDetail,
  getAgencyNewRegFirstDeposit,
  getAgencyNewRegActive
} from "@/api/agency";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyNewRegDetail" });

const props = defineProps<{
  type: number;
  record: Record<string, any>;
  postParams: Record<string, any>;
}>();

const loading = ref(true);
const dataList = ref<any[]>([]);
const lastSearch = ref<Record<string, any>>({});

const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: $t("agency.newRegStatusNormal"), color: "#01A39D" },
  2: { label: $t("agency.newRegStatusFrozen"), color: "#F0453A" },
  3: { label: $t("agency.newRegStatusLocked"), color: "#F0453A" }
};

const moneyRender = (prop: string) => ({ row }) =>
  h("span", null, commaDecimalFormat(row[prop]));

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 90, sortable: true },
  { label: $t("agency.detailAccount"), prop: "account", width: 120 },
  { label: $t("agency.detailName"), prop: "name", width: 100 },
  { label: $t("agency.detailPhone"), prop: "phone", width: 120 },
  {
    label: $t("agency.detailCurrentStatus"),
    prop: "current_status",
    width: 110,
    cellRenderer: ({ row }) =>
      row.current_status === true
        ? h("span", { style: "color:#01A39D" }, $t("agency.detailOnline"))
        : h("span", { style: "color:#F0453A" }, $t("agency.detailOffline"))
  },
  {
    label: $t("agency.detailDepositLimit"),
    prop: "deposit_limit",
    width: 110,
    cellRenderer: ({ row }) =>
      h(
        "span",
        null,
        Number(row.deposit_limit) === 1
          ? $t("agency.enable")
          : $t("agency.disable")
      )
  },
  {
    label: $t("agency.detailWithdrawLimit"),
    prop: "withdraw_limit",
    width: 110,
    cellRenderer: ({ row }) =>
      h(
        "span",
        null,
        Number(row.withdraw_limit) === 1
          ? $t("agency.enable")
          : $t("agency.disable")
      )
  },
  {
    label: $t("agency.detailRechargeCount"),
    prop: "recharge_count",
    width: 110,
    sortable: true,
    cellRenderer: moneyRender("recharge_count")
  },
  {
    label: $t("agency.detailRechargeAmount"),
    prop: "recharge_amount",
    width: 120,
    sortable: true,
    cellRenderer: moneyRender("recharge_amount")
  },
  {
    label: $t("agency.detailWithdrawAmount"),
    prop: "withdraw_amount",
    width: 120,
    cellRenderer: moneyRender("withdraw_amount")
  },
  { label: $t("agency.detailPromotionTimes"), prop: "promotion_times" },
  {
    label: $t("agency.detailStatus"),
    prop: "status",
    width: 110,
    cellRenderer: ({ row }) => {
      const s = statusMap[Number(row.status)];
      return s ? h("span", { style: `color:${s.color}` }, s.label) : h("span");
    }
  },
  {
    label: $t("agency.detailSameDevice"),
    prop: "use_same_device_id",
    width: 160,
    cellRenderer: ({ row }) => {
      const v = Number(row.use_same_device_id);
      const txt =
        v === 1
          ? $t("agency.detailSameDeviceYes")
          : v === 2
            ? $t("agency.detailSameDeviceNo")
            : "";
      return h("span", null, txt);
    }
  },
  { label: $t("agency.detailCreatedAt"), prop: "created_at", width: 170, sortable: true },
  { label: $t("agency.detailLastLoginAt"), prop: "last_login_at", width: 170 },
  {
    label: $t("agency.detailRegisterIp"),
    prop: "register_ip",
    width: 170,
    cellRenderer: ({ row }) =>
      h("span", null, `${row.register_ip}(${row.register_area ?? ""})`)
  },
  {
    label: $t("agency.detailLastLoginIp"),
    prop: "last_login_ip",
    width: 170,
    cellRenderer: ({ row }) =>
      h("span", null, `${row.last_login_ip}(${row.last_login_area ?? ""})`)
  },
  { label: $t("agency.detailAgencyId"), prop: "agency_id", width: 110 },
  { label: $t("agency.detailPaymentGroups"), prop: "payment_groups", width: 120 },
  { label: $t("agency.detailBankcardGroups"), prop: "bankcard_groups", width: 120 }
];

async function loadData() {
  loading.value = true;
  const params: Record<string, any> = {
    agencyID: props.record.agencyID,
    startTime: props.postParams.startTime,
    endTime: props.postParams.endTime,
    giveOffer: props.postParams.giveOffer
  };
  lastSearch.value = params;
  const fn =
    props.type === 2
      ? getAgencyNewRegFirstDeposit
      : props.type === 3
        ? getAgencyNewRegActive
        : getAgencyNewRegDetail;
  try {
    const { data } = await fn(params);
    dataList.value = (data?.list ?? []) as any[];
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  const params = { ...lastSearch.value };
  if (props.type === 1) {
    exportExcel(
      "/backend/report/agencyNewRegMember/newRegListExport",
      params,
      "newReg.csv"
    );
  } else if (props.type === 2) {
    exportExcel(
      "/backend/report/agencyNewRegMember/newRegFirstDepositListExport",
      params,
      "newRegFirstDeposit.csv"
    );
  }
}

onMounted(loadData);
</script>

<template>
  <PureTableBar
    :title="`${$t('agency.detailDataTitle')}${record.agencyID}`"
    :columns="columns"
  >
    <template #buttons>
      <el-button v-if="type !== 3" type="primary" :icon="Download" @click="handleExport">
        {{ $t("agency.exportExcel") }}
      </el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :loading="loading"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </template>
  </PureTableBar>
</template>
