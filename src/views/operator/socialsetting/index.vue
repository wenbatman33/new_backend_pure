<script setup lang="ts">
import { useSocialSetting } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Upload from "~icons/ep/upload";

defineOptions({ name: "OperatorSocialsetting" });

const {
  loading,
  memberList,
  agentList,
  memberColumns,
  agentColumns,
  openDialog,
  handleDelete,
  handlePublish
} = useSocialSetting();
</script>

<template>
  <div class="main">
    <p class="mb-2 text-sm text-[var(--el-text-color-secondary)]">
      {{ $t("operator.socialDesc") }}
    </p>

    <!-- 會員用 -->
    <PureTableBar :title="$t('operator.member')" :columns="memberColumns">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_menu_socialsetting_add')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('member')"
        >
          {{ $t("operator.add") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="memberList"
          :columns="dynamicColumns"
          :max-height="320"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_menu_socialsetting_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('member', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('operator.confirm')"
              @confirm="handleDelete('member', row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_menu_socialsetting_delete')"
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

    <!-- 合營用 -->
    <PureTableBar
      :title="$t('operator.merchant')"
      :columns="agentColumns"
      class="mt-4"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_menu_socialsetting_add')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('agent')"
        >
          {{ $t("operator.add") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="agentList"
          :columns="dynamicColumns"
          :max-height="320"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_menu_socialsetting_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('agent', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('operator.confirm')"
              @confirm="handleDelete('agent', row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_menu_socialsetting_delete')"
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

    <!-- 發佈 -->
    <div class="flex justify-end w-full mt-4">
      <el-button
        v-if="hasAuth('__btn_frontend_socialsetting_deploy')"
        type="primary"
        :icon="Upload"
        @click="handlePublish"
      >
        {{ $t("operator.publish") }}
      </el-button>
    </div>
  </div>
</template>
