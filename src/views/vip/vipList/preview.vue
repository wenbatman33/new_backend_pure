<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { http } from "@/utils/http";
import { previewRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getVipRefundTrial } from "@/api/vip";
import dayjs from "dayjs";

defineOptions({ name: "VipListPreview" });

const ruleFormRef = ref();
const loading = ref(false);
const date = ref("");
const resultList = ref<any[]>([]);
const gameTypeList = ref<any[]>([]);

const formInline = reactive({
  account: "",
  peroid: dayjs().format("YYYY-MM-DD")
});

// 不可選未來日期（含明天之後）
const disabledDate = (time: Date) => {
  return dayjs(time).isAfter(dayjs().add(1, "day").endOf("day"));
};

function getGameTypeLabel(id: any) {
  const temp = gameTypeList.value.find(item => item.key === id);
  return temp ? temp.value : id;
}

async function onPreview() {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    try {
      const peroid = String(formInline.peroid).substring(0, 10);
      date.value = peroid;
      const { success, data } = await getVipRefundTrial({
        account: formInline.account,
        peroid
      });
      if (success) {
        resultList.value = data?.list ?? data ?? [];
      }
    } finally {
      loading.value = false;
    }
  });
}

const columns: TableColumnList = [
  {
    label: $t("vip.gameType"),
    prop: "gameType",
    width: 100,
    cellRenderer: ({ row }) => getGameTypeLabel(row.gameType)
  },
  { label: $t("vip.gameName"), prop: "gameGroupName", width: 120 },
  {
    label: $t("vip.totalRebateEffectiveTurnover"),
    prop: "calcValue",
    width: 140
  },
  { label: $t("vip.rebateAmount"), prop: "money", width: 100 }
];

onMounted(async () => {
  try {
    const res: any = await http.request("get", "/backend/game/gamelist/type");
    gameTypeList.value = res?.data?.list ?? res?.list ?? [];
  } catch (e) {
    gameTypeList.value = [];
  }
});
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="formInline"
      :rules="previewRules"
    >
      <el-form-item :label="$t('vip.memberAccount')" prop="account">
        <el-input v-model="formInline.account" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item :label="$t('vip.period')" prop="peroid">
        <el-date-picker
          v-model="formInline.peroid"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onPreview">
          {{ $t("vip.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div v-if="date" class="mb-2">{{ $t("vip.period") }}: {{ date }}</div>

    <pure-table
      align-whole="center"
      :loading="loading"
      :data="resultList"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    />
  </div>
</template>
