<script setup lang="ts">
import { ref } from "vue";
import { useSignIn } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Switch from "~icons/ep/switch";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "IndependentEventSignIn" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleEdit,
  handleStatus
} = useSignIn();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('independentEvent.name')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.code')" prop="code">
        <el-input
          v-model="searchForm.code"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('independentEvent.internalName')"
        prop="internalName"
      >
        <el-input
          v-model="searchForm.internalName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('independentEvent.status')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('independentEvent.startTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('independentEvent.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("independentEvent.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("independentEvent.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('independentEvent.menuSignIn')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_promotion_sign_edit')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("independentEvent.add") }}
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
              v-if="hasAuth('__btn_promotion_sign_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="handleEdit(row)"
            >
              {{ $t("independentEvent.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('independentEvent.confirmStatus')"
              @confirm="handleStatus(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_promotion_sign_edit')"
                  class="reset-margin"
                  link
                  type="warning"
                  :size="size"
                  :icon="Switch"
                >
                  {{
                    row.status === 1
                      ? $t("independentEvent.disable")
                      : $t("independentEvent.enable")
                  }}
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
