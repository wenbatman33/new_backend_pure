<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    payChannelNameID: "",
    sn: "",
    method: 0,
    supplyAp: false,
    apLowerLimit: 0,
    apUpperLimit: 0,
    apDayLimit: 0,
    depositLimit: "",
    note: "",
    status: 1
  }),
  nameList: () => []
});

const methodOptions = [
  { label: "T0", value: 0 },
  { label: "T1", value: 1 },
  { label: "D0", value: 2 },
  { label: "D1", value: 3 }
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
    label-width="120px"
  >
    <el-form-item :label="$t('payment.merchantStatus')">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('payment.merchant2')" prop="payChannelNameID">
      <el-select
        v-model="newFormInline.payChannelNameID"
        filterable
        clearable
        class="w-full"
      >
        <el-option
          v-for="item in nameList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('payment.merchant')" prop="sn">
      <el-input v-model="newFormInline.sn" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.buyMethod')">
      <el-select v-model="newFormInline.method" class="w-full">
        <el-option
          v-for="item in methodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('payment.depositLimit')">
      <el-input v-model="newFormInline.depositLimit" type="number" clearable />
    </el-form-item>

    <el-form-item :label="$t('payment.supplyAp')">
      <el-switch v-model="newFormInline.supplyAp" />
    </el-form-item>

    <template v-if="newFormInline.supplyAp">
      <el-form-item :label="$t('payment.apLowerLimit')">
        <el-input v-model="newFormInline.apLowerLimit" type="number" />
      </el-form-item>
      <el-form-item :label="$t('payment.apUpperLimit')">
        <el-input v-model="newFormInline.apUpperLimit" type="number" />
      </el-form-item>
      <el-form-item :label="$t('payment.apDayLimit')">
        <el-input v-model="newFormInline.apDayLimit" type="number" />
      </el-form-item>
    </template>

    <el-form-item :label="$t('payment.remark')">
      <el-input v-model="newFormInline.note" type="textarea" :rows="3" />
    </el-form-item>
  </el-form>
</template>
