<script setup lang="ts">
import { useBurialPointSettings } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Setting from "~icons/ep/setting";

defineOptions({ name: "OperatorBurialPointSettings" });

const {
  loading,
  columns,
  dataList,
  onSearch,
  openDialog,
  openDomainSetting,
  handleDelete
} = useBurialPointSettings();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('operator.menuBurialPointSettings')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_event_tracking_add')"
          type="primary"
          :icon="Setting"
          @click="openDomainSetting"
        >
          {{ $t("operator.domainSetting") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_event_tracking_add')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("operator.addBuriedPoints") }}
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
              v-if="hasAuth('__btn_event_tracking_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('operator.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_event_tracking_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("operator.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
