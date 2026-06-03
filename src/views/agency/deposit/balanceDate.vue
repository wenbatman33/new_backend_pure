<script setup lang="ts">
import { ref } from "vue";
import { balanceDateFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { BalanceDateFormProps } from "./utils/types";

const props = withDefaults(defineProps<BalanceDateFormProps>(), {
  formInline: () => ({
    id: "",
    memberAccount: "",
    createdAt: "",
    amount: "",
    thirdID: "",
    gatway: "",
    balanceDate: "",
    note: ""
  })
});

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
    :rules="balanceDateFormRules"
    label-width="140px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('agency.agencyAccount')">
          <span>{{ newFormInline.memberAccount }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.transactionTime')">
          <span>{{ newFormInline.createdAt }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.depositAmount')">
          <span>{{ newFormInline.amount }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.thirdPartyID')">
          <span>{{ newFormInline.thirdID }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.gateway')">
          <span>{{ newFormInline.gatway }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.refIds')">
          <span>{{ newFormInline.id }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('agency.adjustContent')" prop="balanceDate">
          <el-date-picker
            v-model="newFormInline.balanceDate"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY/MM/DD"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('agency.description')" prop="note">
          <el-input
            v-model="newFormInline.note"
            type="textarea"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
