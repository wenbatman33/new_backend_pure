<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getAgencyDetailUsdtList,
  addAgencyDetailUsdt,
  deleteAgencyDetailUsdt,
  setDefaultAgencyDetailUsdt
} from "@/api/agency";

const props = defineProps<{
  agencyID: number;
  agencyAccount: string;
}>();

const dataList = ref<any[]>([]);
const loading = ref(false);
const cardNum = ref("");

async function loadList() {
  loading.value = true;
  try {
    const { data } = await getAgencyDetailUsdtList({ agencyID: props.agencyID });
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

async function handleAdd() {
  if (!cardNum.value) return;
  const { success } = await addAgencyDetailUsdt({
    agencyID: props.agencyID,
    address: cardNum.value
  });
  if (success) {
    cardNum.value = "";
    loadList();
  }
}

async function handleDelete(row: any) {
  const { success } = await deleteAgencyDetailUsdt({ id: row.id });
  if (success) loadList();
}

async function handleDefault(row: any) {
  const { success } = await setDefaultAgencyDetailUsdt({ id: row.id });
  if (success) loadList();
}

onMounted(loadList);
</script>

<template>
  <div>
    <div class="usdt-title">
      <p>ID: {{ agencyID }}</p>
      <p>{{ $t("agency.detailData5") }} {{ agencyAccount }}</p>
      <div class="flex gap-2 items-center">
        <el-input
          v-model="cardNum"
          style="width: 220px"
          :placeholder="$t('agency.usdtModal2')"
        />
        <el-button :disabled="cardNum.length === 0" type="primary" @click="handleAdd">
          {{ $t("agency.usdtModal3") }}
        </el-button>
      </div>
    </div>

    <el-table :data="dataList" v-loading="loading" border max-height="300">
      <el-table-column :label="$t('agency.usdtModal6')" min-width="180">
        <template #default="{ row }">
          {{ row.isDefault === 1 ? `${row.address}${$t("agency.usdtModal7")}` : row.address }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('agency.usdtModal8')" prop="createdAt" min-width="160" />
      <el-table-column :label="$t('agency.usdtModal9')" prop="updatedAt" min-width="160" />
      <el-table-column :label="$t('agency.bankCardModal17')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.isDefault === 2"
            link
            type="primary"
            @click="handleDefault(row)"
          >
            {{ $t("agency.usdtModal4") }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">
            {{ $t("agency.usdtModal5") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.usdt-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
  p {
    width: 30%;
    margin-bottom: 8px;
  }
  & > div {
    width: 100%;
  }
}
</style>
