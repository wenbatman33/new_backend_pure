<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getAgencyDetailGameDropdown,
  getAgencyDetailPlatformfeeratioSearch
} from "@/api/agency";

const props = defineProps<{
  userId: number;
}>();

const gameDropdownList = ref<any[]>([]);
const apiData = ref<any[]>([]);
const gameManufacturers = ref<any>(0);
const gameRates = ref(0);

async function getTableData() {
  if (!gameManufacturers.value) {
    apiData.value = [];
    return;
  }
  const { data } = await getAgencyDetailPlatformfeeratioSearch({
    gameGroupID: gameManufacturers.value
  });
  apiData.value = data ? [data] : [];
}

// 暴露給 hook 取值
function getRef() {
  return {
    agencyID: props.userId,
    gameGroupID: gameManufacturers.value,
    // 後端要小數
    platformFeeRatio: (gameRates.value / 100).toFixed(2)
  };
}

defineExpose({ getRef });

onMounted(async () => {
  const { data } = await getAgencyDetailGameDropdown();
  const list = (data?.gameGroup ?? []).map((item: any) => ({
    label: item.displayName,
    value: item.id
  }));
  gameDropdownList.value = [
    { value: 0, label: $t("common.pleaseChoose"), disabled: true },
    ...list
  ];
});
</script>

<template>
  <div>
    <div class="mb-6">
      <el-select
        v-model="gameManufacturers"
        style="width: 250px"
        :placeholder="$t('common.pleaseChoose')"
        @change="getTableData"
      >
        <el-option
          v-for="item in gameDropdownList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
    </div>

    <el-table :data="apiData" border size="small">
      <el-table-column :label="$t('agency.displayName')" prop="gameGroup" width="120" />
      <el-table-column :label="$t('agency.gameType')" prop="gameType" />
      <el-table-column :label="$t('agency.defaultPlatformRate')" prop="platformFeeRatio" />
      <el-table-column :label="$t('agency.platformFeeCalculationBasis')" prop="bettingFrom" />
    </el-table>

    <div class="mt-6 text-lg font-bold">
      <div class="mb-3">{{ $t("agency.customGamePlatformRates") }}:</div>
      <el-input-number v-model="gameRates" :min="0" /> %
    </div>
  </div>
</template>
