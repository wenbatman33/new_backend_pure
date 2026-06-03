<script setup lang="ts">
import { useSystemLetter } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";

defineOptions({ name: "OperatorSystemLetter" });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleCancel
} = useSystemLetter();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('operator.menuSystemLetter')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_inboxsetting_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("operator.addSystemSiteMessage") }}
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
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_inboxsetting_edit') && row.deletedAt == null"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              v-if="
                hasAuth('__btn_inbox_revoke') &&
                row.deletedAt == null &&
                row.id !== 1
              "
              :title="$t('operator.confirmRecycle')"
              @confirm="handleCancel(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("operator.recycle") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
