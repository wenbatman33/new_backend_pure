<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getRoles,
  getPaymentRole,
  putPaymentRole,
  delPaymentRole
} from "@/api/authSystem";

interface PaymentRow {
  roleID: number;
  roleName: string;
  manualDepositAmount: number | string;
  manualDepositAmountStatus: number;
}

const dataList = ref<PaymentRow[]>([]);
const loading = ref(false);
const roleArray = ref<{ value: number; label: string }[]>([]);

const form = reactive({
  roleID: "" as number | string,
  manualDepositAmount: ""
});
const formRef = ref();

async function loadTable() {
  loading.value = true;
  try {
    const { data } = await getPaymentRole({});
    dataList.value = data?.list ?? data ?? [];
  } finally {
    loading.value = false;
  }
}

async function handleAdd() {
  if (!form.roleID || !form.manualDepositAmount) {
    message($t("authSystem.amount"), { type: "error" });
    return;
  }
  await putPaymentRole({
    roleID: form.roleID,
    manualDepositAmount: form.manualDepositAmount,
    manualDepositAmountStatus: 1
  });
  loadTable();
}

async function handleSwitch(row: PaymentRow, val: number) {
  await putPaymentRole({
    roleID: row.roleID,
    manualDepositAmount: row.manualDepositAmount,
    manualDepositAmountStatus: val
  });
  loadTable();
}

async function handleDelete(row: PaymentRow) {
  await delPaymentRole({ id: row.roleID });
  loadTable();
}

onMounted(async () => {
  const { data } = await getRoles({});
  roleArray.value = (data?.list ?? []).map((item: any) => ({
    value: item.roleID,
    label: item.roleName
  }));
  loadTable();
});
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :inline="true" class="mb-4">
      <el-form-item :label="$t('authSystem.group')">
        <el-select
          v-model="form.roleID"
          filterable
          class="!w-[180px]"
          :placeholder="$t('authSystem.group')"
        >
          <el-option
            v-for="item in roleArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('authSystem.amount')">
        <el-input v-model="form.manualDepositAmount" class="!w-[160px]" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">
          {{ $t("authSystem.add") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" v-loading="loading" border>
      <el-table-column prop="roleName" :label="$t('authSystem.groupName')" />
      <el-table-column
        prop="manualDepositAmount"
        :label="$t('authSystem.amountLimit')"
      />
      <el-table-column :label="$t('authSystem.status')" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.manualDepositAmountStatus === 1"
            @update:model-value="
              (v: boolean) => handleSwitch(row, v ? 1 : 2)
            "
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('authSystem.operate')" width="120">
        <template #default="{ row }">
          <el-popconfirm
            :title="$t('authSystem.delete')"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger">
                {{ $t("authSystem.delete") }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
