<script setup lang="ts">
import { ref } from "vue";
import { tradeRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { TradeFormProps } from "./utils/types";

// 资金异动 表单
const props = withDefaults(defineProps<TradeFormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    subjectID: "",
    tradeTime: "",
    amount: "",
    fee: "",
    description: ""
  })
});

// TODO: 旧版科目下拉来自 getBankCardDropdown（subjects/bankcardLogType），
// 需依赖未移植的 dropdown / store 资料，暂以空陣列佔位，待 dropdown util 移植后补回。
const subjectOptions = ref<Array<{ label: string; value: number }>>([]);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="tradeRules"
    label-width="150px"
  >
    <el-form-item :label="$t('payment.payUUaccount')">
      <span>{{ newFormInline.name }}</span>
    </el-form-item>

    <el-form-item :label="$t('payment.payUSubjectID')" prop="subjectID">
      <el-select
        v-model="newFormInline.subjectID"
        clearable
        class="w-full"
        :placeholder="$t('payment.pleaseChoose')"
      >
        <el-option
          v-for="item in subjectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('payment.payUTradeTime')" prop="tradeTime">
      <el-date-picker
        v-model="newFormInline.tradeTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        class="w-full"
        :placeholder="$t('payment.pleaseChoose')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.payUChangeAmount')" prop="amount">
      <el-input v-model="newFormInline.amount" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.handlingFee')" prop="fee">
      <el-input v-model="newFormInline.fee" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.payUDescription')" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="4"
        :placeholder="$t('payment.pleaseInput')"
      />
    </el-form-item>
  </el-form>
</template>
