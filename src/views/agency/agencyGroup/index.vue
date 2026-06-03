<script setup lang="ts">
import { useAgencyGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "AgencyAgencyGroup" });

const { loading, columns, dataList, onSearch, openDialog } = useAgencyGroup();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('agency.menuAgencyGroup')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_commission_group_new')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('Create')"
        >
          {{ $t("agency.agencyGroupAdd") }}
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
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('btn_rankSetting_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('Edit', row)"
            >
              {{ $t("agency.agencyGroupEdit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
