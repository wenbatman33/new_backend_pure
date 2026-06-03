<script setup lang="ts">
import { ref } from "vue";
import { usePromotionEventList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Money from "~icons/ep/coin";
import Tickets from "~icons/ep/tickets";
import Delete from "~icons/ep/delete";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PromotionEventList" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  openScoreDialog,
  openIdDialog,
  handleDelete
} = usePromotionEventList();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('promotion.vendorEventID')" prop="eventID">
        <el-input
          v-model="searchForm.eventID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.activityCode')" prop="promoEventID">
        <el-input
          v-model="searchForm.promoEventID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.eventNumber')" prop="promoGameID">
        <el-input
          v-model="searchForm.promoGameID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.eventStartTime')" prop="eventStartTime">
        <el-date-picker
          v-model="searchForm.eventStartTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
          :placeholder="$t('promotion.eventStartTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.eventEndTime')" prop="eventEndTime">
        <el-date-picker
          v-model="searchForm.eventEndTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
          :placeholder="$t('promotion.eventEndTime')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("promotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("promotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :title="$t('promotion.menuEventList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_promotion_public_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog(false)"
        >
          {{ $t("promotion.addNewEvent") }}
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
              v-if="hasAuth('__btn_promotion_event_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog(true, row)"
            >
              {{ $t("promotion.editEvent") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_event_score')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Money"
              @click="openScoreDialog(row)"
            >
              {{ $t("promotion.editTotalScore") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="Tickets"
              @click="openIdDialog(row)"
            >
              {{ $t("promotion.manageEventID") }}
            </el-button>
            <el-popconfirm
              :title="$t('promotion.confirmDeleteEvent')"
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
                  {{ $t("promotion.deleteEvent") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
