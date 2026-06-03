<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getRoleRoleHide,
  postRoleExcept,
  deleteRoleExcept,
  deleteRoleHide
} from "@/api/authSystem";

const props = defineProps<{
  /** 全部角色清單，作為例外群組下拉選項 */
  roleList: { roleID: number; roleName: string }[];
}>();

interface HideRow {
  roleID: number;
  roleName: string;
  exceptRoles: string;
}

const role = ref(0);
const dataList = ref<HideRow[]>([]);
const loading = ref(false);
const multipleSelection = ref<HideRow[]>([]);

const permissionOptions = ref<{ label: string; value: number }[]>([]);

async function loadTable() {
  loading.value = true;
  try {
    const { data } = await getRoleRoleHide();
    dataList.value = (data ?? []).map((item: any) => ({
      ...item,
      exceptRoles: (item.exceptRoles ?? [])
        .map((g: any) => g.roleName)
        .join()
    }));
  } finally {
    loading.value = false;
  }
}

function handleSelectionChange(rows: HideRow[]) {
  multipleSelection.value = rows;
}

function getSelectedRoleIDs() {
  return multipleSelection.value.map(r => r.roleID).toString();
}

async function handlePostRoleExcept() {
  if (role.value === 0) {
    message($t("authSystem.plzChoiceExceptionGroup"), { type: "error" });
    return;
  }
  await postRoleExcept({
    exceptRoleID: role.value,
    roleID: getSelectedRoleIDs()
  });
  loadTable();
}

async function handleDeleteRoleExcept() {
  if (role.value === 0) {
    message($t("authSystem.plzChoiceExceptionGroup"), { type: "error" });
    return;
  }
  await deleteRoleExcept({
    exceptRoleID: role.value,
    roleID: getSelectedRoleIDs()
  });
  loadTable();
}

async function handleDelete(row: HideRow) {
  await deleteRoleHide({ roleID: row.roleID });
  loadTable();
}

onMounted(() => {
  permissionOptions.value = (props.roleList ?? []).map(item => ({
    label: item.roleName,
    value: item.roleID
  }));
  loadTable();
});
</script>

<template>
  <div>
    <div class="flex items-center mb-4">
      <span class="mr-2">{{ $t("authSystem.addAndDeleteExceptionGroups") }}：</span>
      <el-select
        v-model="role"
        filterable
        class="!w-[220px] mr-4"
        :placeholder="$t('authSystem.chooseText')"
      >
        <el-option
          v-for="item in permissionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="handleDeleteRoleExcept">
        {{ $t("authSystem.delete") }}
      </el-button>
      <el-button type="primary" @click="handlePostRoleExcept">
        {{ $t("authSystem.add") }}
      </el-button>
    </div>

    <el-table
      :data="dataList"
      v-loading="loading"
      border
      max-height="400"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="roleID" label="ID" width="80" />
      <el-table-column prop="roleName" :label="$t('authSystem.groupName')" />
      <el-table-column prop="exceptRoles" :label="$t('authSystem.exceptionGroup')" />
      <el-table-column :label="$t('authSystem.operate')" width="120">
        <template #default="{ row }">
          <el-popconfirm
            :title="$t('authSystem.deleteHideGroup')"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger">
                {{ $t("authSystem.deleteHideGroup") }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
