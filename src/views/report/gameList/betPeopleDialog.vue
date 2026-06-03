<script setup lang="tsx">
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import { PureTable } from "@pureadmin/table";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { getReportLgGameMemberList } from "@/api/report";
import type { BetPeopleRecord } from "./utils/types";
import Search from "~icons/ep/search";

const props = defineProps<{ record: BetPeopleRecord }>();

const filterGameListId = ref<string | number>(props.record.gameListId || "");
const filterStartDate = ref<string>(
  props.record.start
    ? dayjs(props.record.start).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD")
);
const filterEndDate = ref<string>(
  props.record.end
    ? dayjs(props.record.end).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD")
);

const dataList = ref<any[]>([]);
const loading = ref(true);
const sortState = ref<{ order?: number; orderBy?: string }>({});

// 排序欄位對應後端代碼
const sortMapping: Record<string, number> = {
  betAmount: 1,
  winAmount: 2,
  betCount: 3
};

const columns: TableColumnList = [
  { label: $t("report.gameListMemberAccount"), prop: "memberAccount", width: 200 },
  {
    label: $t("report.gameListMemberBetCount"),
    prop: "betCount",
    width: 150,
    sortable: "custom",
    cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betCount)}</span>
  },
  {
    label: $t("report.gameListMemberBetAmount"),
    prop: "betAmount",
    width: 200,
    align: "right",
    sortable: "custom",
    cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betAmount, 2)}</span>
  },
  {
    label: $t("report.gameListMemberWinAmount"),
    prop: "winAmount",
    width: 200,
    align: "right",
    sortable: "custom",
    cellRenderer: ({ row }) => (
      <span style={Number(row.winAmount) < 0 ? "color:red" : ""}>
        {commaDecimalFormat(row.winAmount, 2)}
      </span>
    )
  }
];

async function loadData() {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      gameListId: filterGameListId.value || props.record.gameListId,
      start: filterStartDate.value,
      end: filterEndDate.value,
      ...sortState.value
    };
    const { data } = await getReportLgGameMemberList(params);
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

function onSortChange({ prop, order }: { prop: string; order: string }) {
  if (prop && sortMapping[prop]) {
    sortState.value = {
      order: sortMapping[prop],
      orderBy: order === "ascending" ? "ASC" : "DESC"
    };
  } else {
    sortState.value = {};
  }
  loadData();
}

function handleSearch() {
  loadData();
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div>
    <!-- 頂部資訊列 -->
    <div class="info-header">
      <span>{{ $t("report.gameListMemberGameType") }}：{{ record.gameTypeName }}</span>
      <span class="ml-6">
        {{ $t("report.gameListMemberGameGroup") }}：{{ record.gameGroupName }}
      </span>
      <span class="ml-6">
        {{ $t("report.gameListMemberGameListName") }}：{{ record.gameListName }}
      </span>
    </div>

    <!-- 篩選列 -->
    <div class="filter-row">
      <span>{{ $t("report.gameListMemberGameListId") }}</span>
      <el-input
        v-model="filterGameListId"
        class="!w-[150px] mx-3"
        clearable
      />
      <span>{{ $t("report.gameListMemberBetTime") }}</span>
      <el-date-picker
        v-model="filterStartDate"
        type="date"
        value-format="YYYY-MM-DD"
        class="mx-2"
      />
      <span>～</span>
      <el-date-picker
        v-model="filterEndDate"
        type="date"
        value-format="YYYY-MM-DD"
        class="mx-2"
      />
      <el-button type="primary" :icon="Search" @click="handleSearch">
        {{ $t("report.search") }}
      </el-button>
    </div>

    <!-- 表格 -->
    <PureTable
      align-whole="center"
      border
      :loading="loading"
      :data="dataList"
      :columns="columns"
      @sort-change="onSortChange"
    />
  </div>
</template>

<style scoped lang="scss">
.info-header {
  padding: 8px 16px;
  margin-bottom: 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  font-size: 14px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  font-size: 14px;
}
</style>
