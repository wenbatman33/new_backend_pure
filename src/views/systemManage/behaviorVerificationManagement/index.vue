<script setup lang="ts">
import { useBehaviorVerificationManagement } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "SystemManageBehaviorVerificationManagement" });

const { loading, columns, dataList, onSearch, openDialog } =
  useBehaviorVerificationManagement();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('systemManage.menuBehaviorVerificationManagement')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          stripe
          border
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
              v-if="hasAuth('__menu_captcha_vendor_management')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row.id)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
