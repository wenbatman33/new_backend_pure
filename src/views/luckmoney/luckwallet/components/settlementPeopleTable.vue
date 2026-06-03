<script setup lang="ts">
import { h, ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getSettlementPeopleList } from "@/api/luckmoney";

defineOptions({ name: "SettlementPeopleTable" });

const props = defineProps<{
  reportDate: string;
  reportType: string;
}>();

const loading = ref(true);
const dataList = ref<any[]>([]);

const columns: TableColumnList = [
  {
    label: $t("luckmoney.memberAccount"),
    prop: "memberAccount",
    width: 160,
    cellRenderer: ({ row }) =>
      h(
        "a",
        {
          href: "/memberDetail/detail/" + row.memberID,
          target: "_blank",
          style: "color: var(--el-color-primary)"
        },
        row.memberAccount
      )
  },
  { label: $t("luckmoney.transferAmount"), prop: "amount", width: 160 },
  { label: $t("luckmoney.participateInTheOffer"), prop: "name" }
];

async function fetchData() {
  loading.value = true;
  try {
    const { data } = await getSettlementPeopleList({
      reportDate: props.reportDate,
      reportType: props.reportType
    });
    // 摊平 memberTransferOutList，避免重复 prop
    const newList: any[] = [];
    (data?.list ?? []).forEach((item: any) => {
      const { memberAccount, memberID } = item;
      (item.memberTransferOutList ?? []).forEach((sub: any) => {
        newList.push({
          memberAccount,
          memberID,
          name: sub.name,
          amount: sub.amount
        });
      });
    });
    dataList.value = newList;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <pure-table
    align-whole="center"
    border
    :loading="loading"
    :data="dataList"
    :columns="columns"
    max-height="400"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
  />
</template>
