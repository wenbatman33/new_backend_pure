<script setup lang="ts">
import { useVipReturnGameGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";
import Check from "~icons/ep/check";

defineOptions({ name: "VipReturnGameGroup" });

const { loading, columns, dataList, onSearch, handleSubmit, openDialog } =
  useVipReturnGameGroup();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('vip.menuVipReturnGameGroup')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="AddFill" @click="openDialog">
          {{ $t("vip.add") }}
        </el-button>
        <el-button :icon="Refresh" @click="onSearch">
          {{ $t("vip.reset") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_vipsetting_edit')"
          type="primary"
          :icon="Check"
          @click="handleSubmit"
        >
          {{ $t("vip.saveAll") }}
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>
