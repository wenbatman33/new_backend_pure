<script setup lang="ts">
import { useVipReturn } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Refresh from "~icons/ep/refresh";
import Check from "~icons/ep/check";

defineOptions({ name: "VipReturn" });

const { loading, columns, dataList, getData, handleSubmit } = useVipReturn();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('vip.menuVipReturn')"
      :columns="columns"
      @refresh="getData"
    >
      <template #buttons>
        <span class="mr-4 text-[var(--el-text-color-secondary)] text-[13px]">
          {{ $t("vip.returnNote") }}
        </span>
        <el-button :icon="Refresh" @click="getData">
          {{ $t("vip.reset") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_vipsetting_edit')"
          type="primary"
          :icon="Check"
          @click="handleSubmit"
        >
          {{ $t("vip.saveTextALL") }}
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
          :pagination="false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>
