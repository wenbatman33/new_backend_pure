<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { tradeFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { TradeFormProps } from "./utils/types";

const props = withDefaults(defineProps<TradeFormProps>(), {
  formInline: () => ({
    cardNo: "",
    bankcardLogType: "",
    subjectID: "",
    tradeTime: "",
    amount: undefined,
    fee: undefined,
    description: ""
  }),
  logTypeOptions: () => [],
  subjectsByType: () => ({})
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 依收支類型動態顯示科目
const subjectOptions = computed(
  () => props.subjectsByType[newFormInline.value.bankcardLogType] ?? []
);

watch(
  () => newFormInline.value.bankcardLogType,
  () => {
    newFormInline.value.subjectID = "";
  }
);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="tradeFormRules"
    label-width="120px"
  >
    <el-form-item :label="$t('payment.cardNo')">
      <span>{{ newFormInline.cardNo }}</span>
    </el-form-item>

    <el-form-item :label="$t('payment.subjectID')" prop="subjectID">
      <div class="flex gap-[8px]">
        <el-select
          v-model="newFormInline.bankcardLogType"
          class="!w-[150px]"
          :placeholder="$t('payment.pleaseChoose')"
        >
          <el-option
            v-for="item in logTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="newFormInline.subjectID"
          class="!w-[150px]"
          :placeholder="$t('payment.pleaseChoose')"
        >
          <el-option
            v-for="item in subjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-form-item>

    <el-form-item :label="$t('payment.tradeTime')" prop="tradeTime">
      <el-date-picker
        v-model="newFormInline.tradeTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="w-full"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.amount')" prop="amount">
      <el-input-number v-model="newFormInline.amount" class="w-full" />
    </el-form-item>

    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <el-input-number v-model="newFormInline.fee" class="w-full" />
    </el-form-item>

    <el-form-item :label="$t('payment.description')" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
  </el-form>
</template>
