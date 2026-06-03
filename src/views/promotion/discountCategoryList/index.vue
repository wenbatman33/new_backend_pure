<script setup lang="ts">
import { useDiscountCategoryList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "PromotionDiscountCategoryList" });

const {
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  openDialog,
  handleDelete
} = useDiscountCategoryList();
</script>

<template>
  <div class="main">
    <PureTableBar
      :title="$t('promotion.menuDiscountCategoryList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_promotion_type_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("promotion.addDiscountCategory") }}
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
              v-if="hasAuth('__btn_promotion_type_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog('edit', row)"
            >
              {{ $t("promotion.edit") }}
            </el-button>
            <el-popconfirm
              v-if="row.promotionTypeID !== 0"
              :title="$t('promotion.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("promotion.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
