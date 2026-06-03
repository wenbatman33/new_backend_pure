<script setup lang="ts">
import { useDomainManage } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";

defineOptions({ name: "SystemManageDomainManage" });

const {
  loading,
  columns,
  dataList,
  onSearch,
  openGroupDialog,
  openDomainDialog,
  handleDelete,
  openReplaceDialog,
  handleManualUpdate,
  handleOperationRecord
} = useDomainManage();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('systemManage.menuDomainManage')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_system_management_record')"
          type="primary"
          @click="handleOperationRecord"
        >
          {{ $t("systemManage.operationRecord") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_system_management_edit_onlydomain')"
          type="primary"
          @click="openReplaceDialog"
        >
          {{ $t("systemManage.quickReplaceDomain") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_system_management_renew_json')"
          type="primary"
          @click="handleManualUpdate"
        >
          {{ $t("systemManage.manualUpdate") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_system_management_add_domain_group')"
          @click="openGroupDialog()"
        >
          {{ $t("systemManage.addDomainGroup") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_system_management_add_domain')"
          type="primary"
          :icon="AddFill"
          @click="openDomainDialog()"
        >
          {{ $t("systemManage.addDomain") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          default-expand-all
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
            <!-- 僅編輯 domain（限制模式） -->
            <el-button
              v-if="row.groupID && hasAuth('__btn_system_management_edit_onlydomain')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDomainDialog(row, true)"
            >
              {{ $t("systemManage.editDomainOnly") }}
            </el-button>
            <!-- 完整編輯：子域名走 domain 對話框，群組走 group 對話框 -->
            <el-button
              v-if="
                (row.groupID && hasAuth('__btn_system_management_edit_domain')) ||
                (!row.groupID && hasAuth('__btn_system_management_edit_domain'))
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="row.groupID ? openDomainDialog(row, false) : openGroupDialog(row)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_system_management_del_demain')"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              {{ $t("systemManage.delete") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
