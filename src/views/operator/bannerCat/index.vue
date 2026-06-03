<script setup lang="ts">
import { useBannerCat } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import View from "~icons/ep/view";
import Hide from "~icons/ep/hide";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "OperatorBannerCat" });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleToggleHidden
} = useBannerCat();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('operator.menuBannerCat')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_bannercat_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("operator.addAdCategory") }}
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
              v-if="hasAuth('__btn_bannercat_visible')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="row.hidden ? View : Hide"
              @click="handleToggleHidden(row)"
            >
              {{ row.hidden ? $t("operator.show") : $t("operator.noShow") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_bannercat_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
