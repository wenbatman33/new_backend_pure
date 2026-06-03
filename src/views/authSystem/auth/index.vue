<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuth } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AuthSystemAuth" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  roleList,
  onSearch,
  resetForm,
  openDialog,
  openRoleDialog,
  handleDelete,
  getFunctionHide,
  deleteFunctionHide,
  postFunctionRoleHide,
  deleteFunctionRoleHide
} = useAuth();

/* ===== 隱藏權限管理彈窗（對應舊 FunctionHideModal） ===== */
const hideVisible = ref(false);
const hideLoading = ref(false);
const hideList = ref<any[]>([]);
const selectedRows = ref<any[]>([]);
const selectedRole = ref<number>(0);

const hideColumns: TableColumnList = [
  { type: "selection", width: 55 },
  { label: "ID", prop: "fnID", width: 150 },
  { label: $t("authSystem.fnName"), prop: "fnName", width: 200 },
  { label: $t("authSystem.fnKey"), prop: "fnKey", width: 200 },
  { label: $t("authSystem.exceptRole"), prop: "exceptRoleLabel", minWidth: 220 },
  { label: $t("authSystem.operation"), fixed: "right", width: 160, slot: "hideOperation" }
];

const roleOptions = reactive<{ label: string; value: number }[]>([]);

async function loadHideList() {
  hideLoading.value = true;
  try {
    const { data } = await getFunctionHide();
    const list = data?.list ?? data ?? [];
    hideList.value = list.map((item: any) => {
      const labels = (item.exceptRole ?? [])
        .map((rid: number) => {
          const match = roleOptions.find(o => o.value == rid);
          return match ? match.label : null;
        })
        .filter((l: any) => l !== null);
      return { ...item, exceptRoleLabel: labels.join(" , ") };
    });
  } finally {
    hideLoading.value = false;
  }
}

function openHideDialog() {
  roleOptions.length = 0;
  roleList.value.forEach((item: any) => {
    roleOptions.push({ label: item.roleName, value: item.roleID });
  });
  selectedRole.value = 0;
  hideVisible.value = true;
  loadHideList();
}

function onSelectionChange(rows: any[]) {
  selectedRows.value = rows;
}

function funcRoleHideParam() {
  return {
    funcID: selectedRows.value.map(r => r.fnID).join(),
    roleID: String(selectedRole.value)
  };
}

async function handleAddRoleHide() {
  const { success } = await postFunctionRoleHide(funcRoleHideParam());
  if (success) loadHideList();
}

async function handleDeleteRoleHide() {
  const { success } = await deleteFunctionRoleHide(funcRoleHideParam());
  if (success) loadHideList();
}

async function handleDeleteHide(row: any) {
  const { success } = await deleteFunctionHide({ funcID: row.fnID });
  if (success) loadHideList();
}

function closeHideDialog() {
  hideVisible.value = false;
  hideList.value = [];
  onSearch();
}
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
      <el-form-item label="ID" prop="fnID">
        <el-input
          v-model="searchForm.fnID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.fnName')" prop="fnName">
        <el-input
          v-model="searchForm.fnName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.fnKey')" prop="fnKey">
        <el-input
          v-model="searchForm.fnKey"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("authSystem.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("authSystem.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="$t('authSystem.menuAuth')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_auth_show')"
          type="primary"
          @click="openHideDialog"
        >
          {{ $t("authSystem.hidePermissions") }}
        </el-button>
        <el-button type="primary" :icon="AddFill" @click="openDialog(false)">
          {{ $t("authSystem.addPermissions") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="fnID"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #roleList="{ row }">
            <el-button link type="warning" @click="openRoleDialog(row)">
              {{ $t("authSystem.checkGroup") }}
            </el-button>
          </template>
          <template #operation="{ row, size: sz }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="sz"
              :icon="EditPen"
              @click="openDialog(true, row)"
            >
              {{ $t("authSystem.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('authSystem.deleteCheck')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="sz"
                  :icon="Delete"
                >
                  {{ $t("authSystem.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 隱藏權限管理彈窗 -->
    <el-dialog
      v-model="hideVisible"
      :title="$t('authSystem.hidePermissions')"
      width="1000px"
      draggable
      @closed="closeHideDialog"
    >
      <div class="flex items-center mb-4">
        <span class="mr-2">{{ $t("authSystem.addAndDeleteExceptionGroups") }}：</span>
        <el-select
          v-model="selectedRole"
          filterable
          class="flex-1 mr-4"
          :placeholder="$t('authSystem.chooseText')"
        >
          <el-option :label="$t('authSystem.chooseText')" :value="0" disabled />
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="handleDeleteRoleHide">
          {{ $t("authSystem.delete") }}
        </el-button>
        <el-button type="primary" @click="handleAddRoleHide">
          {{ $t("authSystem.add") }}
        </el-button>
      </div>
      <pure-table
        align-whole="center"
        row-key="fnID"
        :loading="hideLoading"
        :data="hideList"
        :columns="hideColumns"
        :max-height="400"
        @selection-change="onSelectionChange"
      >
        <template #hideOperation="{ row }">
          <el-popconfirm
            :title="$t('authSystem.deleteCheck')"
            @confirm="handleDeleteHide(row)"
          >
            <template #reference>
              <el-button link type="danger" :icon="Delete">
                {{ $t("authSystem.deleteHidePermissions") }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
