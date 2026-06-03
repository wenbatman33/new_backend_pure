<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getAgencyDetailBankcardList,
  addAgencyDetailBankcard,
  disableAgencyDetailBankcard,
  enableAgencyDetailBankcard,
  setDefaultAgencyDetailBankcard
} from "@/api/agency";

const props = defineProps<{
  agencyID: number;
  agencyAccount: string;
  allowOtherBankCard: number | string;
  realName: string;
}>();

const dataList = ref<any[]>([]);
const loading = ref(false);
const bankAccount = ref(props.realName || "");
const cardNum = ref("");

const addCardDisabled = computed(() => cardNum.value.length === 0);

async function loadList() {
  loading.value = true;
  try {
    const { data } = await getAgencyDetailBankcardList({
      agencyID: props.agencyID
    });
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

function cardNumCheck() {
  if (/^\d{18,22}$/.test(cardNum.value)) {
    handleAdd();
  } else {
    message($t("agency.bankCardModal18"), { type: "error" });
  }
}

async function handleAdd() {
  const { success } = await addAgencyDetailBankcard({
    agencyID: props.agencyID,
    cardNo: cardNum.value,
    bankAccount: bankAccount.value
  });
  if (success) {
    cardNum.value = "";
    loadList();
  }
}

async function handleDisable(row: any) {
  const { success } = await disableAgencyDetailBankcard({ id: row.id });
  if (success) loadList();
}

async function handleEnable(row: any) {
  const { success } = await enableAgencyDetailBankcard({ id: row.id });
  if (success) loadList();
}

async function handleDefault(row: any) {
  const { success } = await setDefaultAgencyDetailBankcard({ id: row.id });
  if (success) loadList();
}

onMounted(loadList);
</script>

<template>
  <div>
    <div class="bankcard-title">
      <p>ID: {{ agencyID }}</p>
      <p>{{ $t("agency.bankCardModal3") }} {{ agencyAccount }}</p>
      <div class="flex gap-2 flex-wrap items-center">
        <el-input
          v-model="bankAccount"
          :maxlength="22"
          style="width: 200px"
          :placeholder="$t('agency.bankCardModal5')"
          :disabled="allowOtherBankCard === 2"
        >
          <template #prepend>{{ $t("agency.bankCardModal4") }}</template>
        </el-input>
        <el-input
          v-model="cardNum"
          :maxlength="22"
          style="width: 200px"
          :placeholder="$t('agency.bankCardModal7')"
        >
          <template #prepend>{{ $t("agency.bankCardModal6") }}</template>
        </el-input>
        <el-button :disabled="addCardDisabled" type="primary" @click="cardNumCheck">
          {{ $t("agency.bankCardModal8") }}
        </el-button>
      </div>
    </div>

    <el-table :data="dataList" v-loading="loading" border max-height="300">
      <el-table-column :label="$t('agency.bankCardModal12')" min-width="180">
        <template #default="{ row }">
          {{ row.isDefault === 1 ? `${row.cardNo}(${$t("agency.usdtModal7")})` : row.cardNo }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('agency.bankCardModal13')" prop="bankAccount" min-width="100" />
      <el-table-column :label="$t('agency.bankCardModal14')" prop="bankName" min-width="100" />
      <el-table-column :label="$t('agency.bankCardModal15')" prop="createdAt" min-width="160" />
      <el-table-column :label="$t('agency.bankCardModal16')" prop="updatedAt" min-width="160" />
      <el-table-column :label="$t('agency.bankCardModal17')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.isDefault === 2 && row.status === 1"
            link
            type="primary"
            @click="handleDefault(row)"
          >
            {{ $t("agency.bankCardModal9") }}
          </el-button>
          <el-button
            v-if="row.status === 1"
            link
            type="danger"
            @click="handleDisable(row)"
          >
            {{ $t("agency.bankCardModal10") }}
          </el-button>
          <el-button
            v-if="row.status === 2"
            link
            type="success"
            @click="handleEnable(row)"
          >
            {{ $t("agency.bankCardModal11") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.bankcard-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
  p {
    width: 30%;
    margin-bottom: 8px;
  }
  & > div {
    width: 100%;
  }
}
</style>
