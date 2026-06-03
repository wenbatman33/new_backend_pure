<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { getRoles, bulkPutFns, getRawFnList } from "@/api/authSystem";

interface RoleRow {
  roleID: number;
  roleName: string;
}
interface FnOption {
  label: string;
  value: { name: string; id: number };
}

const allRoleFns = ref<FnOption[]>([]);
const selectedFnValue = ref<{ name: string; id: number } | null>(null);
const selectedFns = ref<{ name: string; id: number }[]>([]);
const selectedRoles = ref<RoleRow[]>([]);
const roleList = ref<RoleRow[]>([]);
const loading = ref(false);

async function loadRoles() {
  loading.value = true;
  try {
    const { data } = await getRoles({});
    roleList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

function onFnSelect(val: { name: string; id: number }) {
  if (!val) return;
  if (!selectedFns.value.some(obj => obj.id === val.id)) {
    selectedFns.value.push(val);
  }
  selectedFnValue.value = null;
}

function deleteSelectedFn(id: number) {
  selectedFns.value = selectedFns.value.filter(obj => obj.id !== id);
}

function roleRowClick(record: RoleRow) {
  if (!selectedRoles.value.some(obj => obj.roleID === record.roleID)) {
    selectedRoles.value.push(record);
  }
}

function deleteSelectedRole(roleID: number) {
  selectedRoles.value = selectedRoles.value.filter(obj => obj.roleID !== roleID);
}

async function showConfirm(action: 1 | 2) {
  const roleIDs = selectedRoles.value.map(item => item.roleID);
  const fnIDs = selectedFns.value.map(item => item.id);
  await ElMessageBox.confirm(
    action === 1 ? $t("authSystem.confirmAdd") : $t("authSystem.confirmDel"),
    "",
    { type: "warning" }
  )
    .then(async () => {
      const { success } = await bulkPutFns({ roleIDs, fnIDs, action });
      if (success) {
        message($t("authSystem.editSuccess"), { type: "success" });
        selectedRoles.value = [];
        selectedFns.value = [];
      }
    })
    .catch(() => {});
}

onMounted(async () => {
  loadRoles();
  const { data } = await getRawFnList(1000);
  allRoleFns.value = (data?.list?.all ?? []).map((item: any) => ({
    label: item.fnName + item.fnKey,
    value: { name: item.fnName + item.fnKey, id: item.fnID }
  }));
});

defineExpose({ showConfirm });
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="col-span-1">
      <el-table
        :data="roleList"
        v-loading="loading"
        border
        max-height="500"
        highlight-current-row
        @row-click="roleRowClick"
      >
        <el-table-column
          prop="roleName"
          :label="$t('authSystem.groupName')"
        />
      </el-table>
    </div>

    <div class="col-span-2">
      <el-select
        v-model="selectedFnValue"
        filterable
        value-key="id"
        class="!w-[300px]"
        :placeholder="$t('authSystem.chooseFn')"
        @change="onFnSelect"
      >
        <el-option
          v-for="item in allRoleFns"
          :key="item.value.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <div class="border p-3 my-4 h-[200px] overflow-auto">
        <h4 class="mb-2">{{ $t("authSystem.choosedFns") }}</h4>
        <div
          v-for="item in selectedFns"
          :key="item.id"
          class="flex items-center justify-between mb-2"
        >
          <span class="flex-1">{{ item.name }}</span>
          <el-button type="primary" size="small" @click="deleteSelectedFn(item.id)">
            {{ $t("authSystem.delete") }}
          </el-button>
        </div>
      </div>

      <div class="border p-3 my-4 h-[200px] overflow-auto">
        <h4 class="mb-2">{{ $t("authSystem.choosedGPs") }}</h4>
        <div
          v-for="item in selectedRoles"
          :key="item.roleID"
          class="flex items-center justify-between mb-2"
        >
          <span class="flex-1">{{ item.roleName }}</span>
          <el-button
            type="primary"
            size="small"
            @click="deleteSelectedRole(item.roleID)"
          >
            {{ $t("authSystem.delete") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
