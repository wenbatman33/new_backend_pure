<script setup lang="ts">
import { useEmailVendor } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Check from "~icons/ep/check";

defineOptions({ name: "SystemManageEmail" });

const { loading, columns, dataList, pagination, onSearch, openDialog, handleActive } =
  useEmailVendor();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('systemManage.menuEmail')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_email_edit') && row.status !== 1"
              class="reset-margin"
              link
              type="success"
              :size="size"
              :icon="Check"
              @click="handleActive(row)"
            >
              {{ $t("systemManage.enable") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_email_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
