<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import commissionTable from "./commissionTable.vue";

defineOptions({ name: "AgencyCommission" });

const page = ref<1 | 2 | 3>(1);
</script>

<template>
  <div class="main">
    <div class="page-btn bg-bg_color pt-3 pl-4">
      <el-radio-group v-model="page">
        <el-radio-button :value="1">
          {{ $t("agency.commissionTab1") }}
        </el-radio-button>
        <el-radio-button :value="2">
          {{ $t("agency.commissionTab2") }}
        </el-radio-button>
        <el-radio-button :value="3">
          {{ $t("agency.commissionTab3") }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <!-- 用 key 強制不同 tab 重新掛載，避免狀態殘留 -->
    <commissionTable :key="page" :tab="page" />
  </div>
</template>

<style scoped lang="scss">
.page-btn {
  padding-bottom: 0;
}
</style>
