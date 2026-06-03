<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    note: "",
    currency: 1,
    nums: 0,
    status: 2,
    maintain: 1,
    filterSetting: [],
    icon: "",
    isRecommend: false,
    needRealName: false,
    tooltip: "",
    hasDoc: false,
    docTitle: "",
    docURL: "",
    quickAmount: ""
  })
});

// 幣別選項
const currencyOptions = [
  { label: $t("payment.currencyFiat"), value: 1 },
  { label: "USDT-ERC", value: 2 },
  { label: "USDT-TRC", value: 3 },
  { label: $t("payment.numberRMB"), value: 4 }
];

// 過濾設置選項（對應後台 paymentWay 1/2/3）
const filterOptions = [
  { label: $t("payment.paymentWay1"), value: 1 },
  { label: $t("payment.paymentWay2"), value: 2 },
  { label: $t("payment.paymentWay3"), value: 3 }
];

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
    :rules="formRules"
    label-width="140px"
  >
    <el-form-item :label="$t('payment.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('payment.namePlaceHolder')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.remark')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="2" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.currency')" prop="currency">
      <el-radio-group v-model="newFormInline.currency">
        <el-radio
          v-for="item in currencyOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('payment.filter')" prop="filterSetting">
      <el-checkbox-group v-model="newFormInline.filterSetting">
        <el-checkbox
          v-for="item in filterOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('payment.routeNum')" prop="nums">
      <el-input-number v-model="newFormInline.nums" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('payment.quickAmount')" prop="quickAmount">
      <el-input
        v-model="newFormInline.quickAmount"
        clearable
        :placeholder="$t('payment.quickAmountPhd')"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.frontShow')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.maintain')" prop="maintain">
      <el-switch
        v-model="newFormInline.maintain"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.isRecommend')" prop="isRecommend">
      <el-switch v-model="newFormInline.isRecommend" />
    </el-form-item>

    <el-form-item :label="$t('payment.needRealName')" prop="needRealName">
      <el-switch v-model="newFormInline.needRealName" />
    </el-form-item>

    <el-form-item :label="$t('payment.promote')" prop="tooltip">
      <el-input v-model="newFormInline.tooltip" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.hasDoc')" prop="hasDoc">
      <el-switch v-model="newFormInline.hasDoc" />
    </el-form-item>

    <template v-if="newFormInline.hasDoc">
      <el-form-item :label="$t('payment.docTitle')" prop="docTitle">
        <el-input v-model="newFormInline.docTitle" clearable />
      </el-form-item>
      <el-form-item :label="$t('payment.docURL')" prop="docURL">
        <el-input v-model="newFormInline.docURL" clearable />
      </el-form-item>
    </template>

    <!-- TODO: icon / 廣告圖上傳（UploadFile）與開啟方式（DeepLinkType）依賴未移植元件，後續補上 -->
  </el-form>
</template>
