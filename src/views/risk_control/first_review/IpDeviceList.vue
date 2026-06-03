<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { GetIPList, GetDeviceList } from "@/api/risk_control";
import type { IpDeviceItem } from "./utils/types";

defineOptions({ name: "RiskIpDeviceList" });

const props = defineProps<{
  // ip：依 IP 查名單；device：依裝置查名單
  mode: "ip" | "device";
  keyword: string;
}>();

const loading = ref(true);
const dataList = ref<IpDeviceItem[]>([]);

const columns: TableColumnList = [
  { label: "ID", prop: "memberID", width: 80 },
  { label: $t("risk_control.memberAccount"), prop: "account", width: 150 },
  { label: $t("risk_control.agent"), prop: "agent", width: 150 },
  { label: $t("risk_control.createdAt"), prop: "registerDate", width: 180 },
  { label: $t("risk_control.loginTime"), prop: "loginDate", width: 180 },
  { label: $t("risk_control.registerIp"), prop: "registerIp", width: 130 },
  {
    label: $t("risk_control.registerDevice"),
    prop: "registerDevice",
    width: 130
  },
  { label: $t("risk_control.loginIp"), prop: "loginIp", width: 130 },
  { label: $t("risk_control.loginDevice"), prop: "loginDevice", width: 130 }
];

async function load() {
  loading.value = true;
  try {
    const params =
      props.mode === "ip"
        ? { ip: props.keyword }
        : { device: props.keyword };
    const fn = props.mode === "ip" ? GetIPList : GetDeviceList;
    const { data } = await fn(params);
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <pure-table
    align-whole="center"
    showOverflowTooltip
    table-layout="auto"
    :loading="loading"
    :data="dataList"
    :columns="columns"
    max-height="500"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
  />
</template>
