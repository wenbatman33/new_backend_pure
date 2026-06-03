<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getPromotionApproveList,
  approvePromotionMember
} from "@/api/promotion";
import type { ApproveItem } from "./utils/types";

const props = defineProps<{
  promotionID: number;
  batchID: number;
}>();

const searchForm = reactive({
  memberAccount: ""
});
const dataList = ref<ApproveItem[]>([]);
const loading = ref(true);

const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const columns: TableColumnList = [
  { label: "ID", prop: "ID", width: 70 },
  { label: $t("promotion.memberAccount"), prop: "memberAccount", width: 160 },
  { label: $t("promotion.batchBonus"), prop: "bonus", width: 120 },
  {
    label: $t("promotion.promotionCondRange"),
    prop: "promotionCondRange",
    slot: "condRange"
  },
  { label: $t("promotion.createdAt"), prop: "createdAt", width: 180 },
  { label: $t("promotion.updatedAt"), prop: "updatedAt", width: 180 },
  { label: $t("promotion.updatedUser"), prop: "updatedUser", width: 120 },
  { label: $t("promotion.action"), fixed: "right", width: 160, slot: "operation" }
];

async function onSearch() {
  loading.value = true;
  try {
    const { data } = await getPromotionApproveList({
      promotionID: props.promotionID,
      batchID: props.batchID,
      memberAccount: searchForm.memberAccount,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    dataList.value = data?.list ?? [];
    pagination.total = data?.total ?? 0;
  } finally {
    loading.value = false;
  }
}

// type 3 派發(通過) / 7 拒絕
async function handleApprove(row: ApproveItem, type: number) {
  const { success } = await approvePromotionMember({
    ID: row.ID,
    status: type
  });
  if (success) {
    message($t("promotion.actionSuccess"), { type: "success" });
    onSearch();
  }
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="mb-2">
      <el-form-item :label="$t('promotion.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[200px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          {{ $t("promotion.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <pure-table
      align-whole="center"
      showOverflowTooltip
      table-layout="auto"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    >
      <template #condRange="{ row }">
        <div
          v-for="(li, idx) in row.promotionCondRange"
          :key="idx"
          class="text-left"
        >
          <div>
            {{ $t("promotion.rule") }}{{ li.rangeMin }} ~
            {{ li.rangeMax || $t("promotion.noLimit") }}
          </div>
          <div>{{ $t("promotion.real") }}{{ li.amount }}</div>
        </div>
      </template>
      <template #operation="{ row }">
        <el-button
          v-if="hasAuth('__btn_promotion_batch_pass_reject')"
          link
          type="primary"
          @click="handleApprove(row, 3)"
        >
          {{ $t("promotion.pass") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_promotion_batch_pass_reject')"
          link
          type="danger"
          @click="handleApprove(row, 7)"
        >
          {{ $t("promotion.fail") }}
        </el-button>
      </template>
    </pure-table>
  </div>
</template>
