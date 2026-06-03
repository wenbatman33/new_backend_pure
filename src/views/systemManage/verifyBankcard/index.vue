<script setup lang="ts">
import { useVerifyBankcard } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";
import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "SystemManageVerifyBankcard" });

const {
  loading,
  checkNameList,
  belongList,
  phoneList,
  checkNameColumns,
  belongColumns,
  phoneColumns,
  onSearch,
  openDialog
} = useVerifyBankcard();
</script>

<template>
  <div class="main">
    <!-- 銀行卡二元素 -->
    <PureTableBar
      :title="$t('systemManage.bankcardTwoElement')"
      :columns="checkNameColumns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="checkNameList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation1="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row, 1)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 銀行卡歸屬地 -->
    <PureTableBar
      :title="$t('systemManage.bankcardBelong')"
      :columns="belongColumns"
      @refresh="onSearch"
      class="mt-4"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="belongList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation2="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row, 2)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 手機二元素 -->
    <PureTableBar
      :title="$t('systemManage.phoneTwoElement')"
      :columns="phoneColumns"
      @refresh="onSearch"
      class="mt-4"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="phoneList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation3="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(row, 3)"
            >
              {{ $t("systemManage.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
