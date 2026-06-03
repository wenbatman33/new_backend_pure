<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getAgencyDetailEcnyList,
  addAgencyDetailEcny,
  disableAgencyDetailEcny
} from "@/api/agency";

const props = defineProps<{
  agencyID: number;
  agencyAccount: string;
}>();

const dataList = ref<any[]>([]);
const loading = ref(false);
const ecnyName = ref("");
const ecnyAddress = ref("");

async function loadList() {
  loading.value = true;
  try {
    const { data } = await getAgencyDetailEcnyList({ agencyID: props.agencyID });
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

async function handleAdd() {
  const { success } = await addAgencyDetailEcny({
    agencyID: props.agencyID,
    name: ecnyName.value,
    address: ecnyAddress.value
  });
  if (success) {
    ecnyName.value = "";
    ecnyAddress.value = "";
    loadList();
  }
}

async function handleDisable(row: any) {
  const { success } = await disableAgencyDetailEcny({ id: row.id });
  if (success) loadList();
}

// 停用行樣式
function rowStyle({ row }: { row: any }) {
  return row.status === 2
    ? { color: "#848383", textDecoration: "line-through" }
    : {};
}

onMounted(loadList);
</script>

<template>
  <div>
    <div class="ecny-title">
      <p>ID: {{ agencyID }}</p>
      <p>{{ $t("agency.detailData5") }} {{ agencyAccount }}</p>
      <div class="flex gap-2 items-center flex-wrap">
        <el-input
          v-model="ecnyName"
          style="width: 240px"
          :placeholder="$t('agency.ecnyModal4')"
        >
          <template #prepend>{{ $t("agency.ecnyModal3") }}</template>
        </el-input>
        <el-input
          v-model="ecnyAddress"
          style="width: 220px"
          :placeholder="$t('agency.ecnyModal6')"
        >
          <template #prepend>{{ $t("agency.ecnyModal5") }}</template>
        </el-input>
        <el-button type="primary" @click="handleAdd">
          {{ $t("agency.ecnyModal7") }}
        </el-button>
      </div>
    </div>

    <el-table
      :data="dataList"
      v-loading="loading"
      border
      max-height="300"
      :row-style="rowStyle"
    >
      <el-table-column :label="$t('agency.ecnyModal5')" prop="address" />
      <el-table-column :label="$t('agency.agencyMain7')" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 1"
            link
            type="danger"
            @click="handleDisable(row)"
          >
            {{ $t("agency.bankCardModal10") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.ecny-title {
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
