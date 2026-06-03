<script setup lang="ts">
import { ref } from "vue";
import { transferFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getPayBankCardList } from "@/api/payment";
import type { TransferFormProps, BankCardRow } from "./utils/types";

const props = withDefaults(defineProps<TransferFormProps>(), {
  formInline: () => ({
    amount: undefined,
    cardNo: "",
    fee: undefined,
    logTime: "",
    note: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 目標卡號自動完成
const suggestions = ref<BankCardRow[]>([]);
const selectedOption = ref<BankCardRow | null>(null);

const typeColorMap: Record<number, string> = {
  1: "primary",
  2: "warning",
  3: "danger",
  4: "success"
};

async function querySearch(queryString: string, cb: (arg: any[]) => void) {
  if (!queryString) {
    cb([]);
    return;
  }
  const { data } = await getPayBankCardList({ cardNo: queryString });
  const list = (data?.list ?? []) as BankCardRow[];
  suggestions.value = list;
  cb(list.map(item => ({ value: String(item.cardNo), raw: item })));
}

function handleSelect(item: any) {
  selectedOption.value = item.raw;
  newFormInline.value.cardNo = String(item.raw.cardNo);
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="transferFormRules"
    label-width="90px"
  >
    <el-form-item :label="$t('payment.amount2')" prop="amount">
      <el-input-number
        v-model="newFormInline.amount"
        class="w-full"
        :placeholder="$t('payment.pleaseInput') + $t('payment.amount2')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.cardNo')" prop="cardNo">
      <el-autocomplete
        v-model="newFormInline.cardNo"
        class="w-full"
        clearable
        :fetch-suggestions="querySearch"
        :placeholder="$t('payment.pleaseInput') + $t('payment.cardNo')"
        @select="handleSelect"
      />
    </el-form-item>

    <div v-if="selectedOption" class="pl-[90px] mb-[12px] text-[13px]">
      <p>
        {{ $t("payment.payBankID") }}: {{ selectedOption.bankName }}
      </p>
      <p>
        <span class="mr-[6px]"
          >{{ $t("payment.accountName") }}: {{ selectedOption.accountName }}</span
        >
        <el-tag
          v-if="selectedOption.type"
          :type="typeColorMap[Number(selectedOption.type)]"
          size="small"
        >
          {{ $t("payment.type" + selectedOption.type) }}
        </el-tag>
      </p>
    </div>

    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <el-input-number
        v-model="newFormInline.fee"
        class="w-full"
        :placeholder="$t('payment.pleaseInput') + $t('payment.handlingFee')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.logTime')" prop="logTime">
      <el-date-picker
        v-model="newFormInline.logTime"
        type="date"
        value-format="YYYY/MM/DD"
        class="w-full"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="5" />
    </el-form-item>
  </el-form>
</template>
