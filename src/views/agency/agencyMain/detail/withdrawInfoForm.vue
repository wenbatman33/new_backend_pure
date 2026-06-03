<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import {
  getAgencyDetailWithdrawInfoList,
  toggleAgencyDetailWithdrawInfo,
  addAgencyDetailWithdrawInfo,
  getAgencyDetailWithdrawInfoDropdown
} from "@/api/agency";

const props = defineProps<{
  userId: number;
}>();

const dataList = ref<any[]>([]);
const loading = ref(false);

// 新增提款資料對話框
const addVisible = ref(false);
const detailVisible = ref(false);
const detailData = ref<any>({});

const selectCategory = ref<any[]>([]);
const hasInput = ref(false);
const hasDropdown = ref(false);
const selectDropdown = ref<any[]>([]);

const addForm = reactive({
  serviceCode: undefined as any,
  dropdownKey: undefined as any,
  name: "",
  address: "",
  input: ""
});

const detailTitle = computed(
  () => `${$t("agency.withdrawalMethodName")}：${detailData.value.bankName}${$t("agency.bankCard")}`
);

async function loadList() {
  loading.value = true;
  try {
    const { data } = await getAgencyDetailWithdrawInfoList({
      userID: props.userId,
      source: 2
    });
    // 舊碼直接回傳 list 陣列
    dataList.value = Array.isArray(data) ? data : (data?.list ?? []);
  } finally {
    loading.value = false;
  }
}

async function handleToggle(row: any, checked: boolean) {
  const newStatus = checked ? 1 : 2;
  row.status = newStatus;
  await toggleAgencyDetailWithdrawInfo({
    id: row.id,
    source: 2,
    status: newStatus
  });
}

function openDetail(row: any) {
  detailData.value = row;
  detailVisible.value = true;
}

async function loadDropdown() {
  const { data } = await getAgencyDetailWithdrawInfoDropdown();
  selectCategory.value = (data?.services ?? []).map((item: any) => ({
    label: item.name,
    value: item.serviceCode,
    hasInput: item.hasInput,
    hasDropdown: item.hasDropdown,
    dropdown: item.dropdown
  }));
}

function onCategoryChange(val: any) {
  if (val === undefined || val === null) {
    hasInput.value = false;
    hasDropdown.value = false;
    return;
  }
  const result = selectCategory.value.find(item => item.value === val);
  if (!result) return;
  hasInput.value = result.hasInput;
  hasDropdown.value = result.hasDropdown;
  selectDropdown.value = Object.keys(result.dropdown ?? {}).map(item => ({
    label: item,
    value: item
  }));
}

function openAdd() {
  addForm.serviceCode = undefined;
  addForm.dropdownKey = undefined;
  addForm.name = "";
  addForm.address = "";
  addForm.input = "";
  hasInput.value = false;
  hasDropdown.value = false;
  addVisible.value = true;
}

async function submitAdd() {
  if (!addForm.serviceCode || !addForm.name || !addForm.address) {
    message($t("common.pleaseChoose"), { type: "warning" });
    return;
  }
  const { success } = await addAgencyDetailWithdrawInfo({
    userID: props.userId,
    source: 2,
    ...addForm
  });
  if (success) {
    addVisible.value = false;
    loadList();
  }
}

onMounted(() => {
  loadList();
  loadDropdown();
});
</script>

<template>
  <div>
    <div class="flex justify-end mb-3">
      <el-button
        v-if="hasAuth('__btn_agency_add_withdrawal_info')"
        type="primary"
        @click="openAdd"
      >
        {{ $t("agency.addWithdrawalData") }}
      </el-button>
    </div>

    <el-table :data="dataList" v-loading="loading" border max-height="360">
      <el-table-column :label="$t('agency.withdrawalMethodName')" prop="name" />
      <el-table-column :label="$t('agency.withdrawalMethod')" prop="serviceName" />
      <el-table-column :label="$t('agency.withdrawalAdress')" prop="address" />
      <el-table-column :label="$t('agency.detail')">
        <template #default="{ row }">
          <el-button
            v-if="row.serviceName === '银行卡'"
            link
            type="primary"
            @click="openDetail(row)"
          >
            {{ $t("agency.review") }}
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('agency.bankCardModal11')" width="120">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status === 1"
            @change="(val: boolean) => handleToggle(row, val)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增提款資料 -->
    <el-dialog
      v-model="addVisible"
      :title="$t('agency.addWithdrawalData')"
      width="600px"
      append-to-body
    >
      <el-form label-width="180px" label-position="left">
        <el-form-item :label="$t('agency.withdrawalMethodCategory')" required>
          <el-select
            v-model="addForm.serviceCode"
            clearable
            class="!w-[260px]"
            :placeholder="$t('common.chooseText')"
            @change="onCategoryChange"
          >
            <el-option
              v-for="item in selectCategory"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="hasDropdown" label=" " required>
          <el-select
            v-model="addForm.dropdownKey"
            clearable
            class="!w-[260px]"
            :placeholder="$t('common.chooseText')"
          >
            <el-option
              v-for="item in selectDropdown"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('agency.withdrawalMethodName')" required>
          <el-input v-model="addForm.name" class="!w-[260px]" />
        </el-form-item>
        <el-form-item :label="$t('agency.withdrawalAdressAccount')" required>
          <el-input v-model="addForm.address" class="!w-[260px]" />
        </el-form-item>
        <el-form-item v-if="hasInput" label="IFSC Code" required>
          <el-input v-model="addForm.input" class="!w-[260px]" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitAdd">
          {{ $t("agency.confirmAddWithdrawalData") }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 銀行卡明細 -->
    <el-dialog
      v-model="detailVisible"
      :title="detailTitle"
      width="800px"
      append-to-body
    >
      <el-table
        :data="[
          {
            bankName: detailData.bankName,
            bankCode: detailData.bankCode,
            city: detailData.city,
            branch: detailData.branch
          }
        ]"
        border
      >
        <el-table-column :label="$t('agency.bankName')" prop="bankName" />
        <el-table-column :label="$t('agency.bankCode')" prop="bankCode" />
        <el-table-column :label="$t('agency.accountCity')" prop="city" />
        <el-table-column :label="$t('agency.accountBranch')" prop="branch" />
      </el-table>
    </el-dialog>
  </div>
</template>
