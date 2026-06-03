<script setup lang="ts">
import { ref } from "vue";
import { auditFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import detailView from "./detail.vue";
import type { AuditFormProps } from "./utils/types";

defineOptions({ name: "AgencyApplicationAuditForm" });

const props = withDefaults(defineProps<AuditFormProps>(), {
  formInline: () => ({
    calculative: true,
    remark: "",
    agencyAccount: "",
    isFirstLayerAgency: 1,
    rankGroupID: "",
    offerPercent: 0,
    businessType: 1,
    netProfitBase: 1,
    totalBonus: true,
    totalCharge: true,
    platformCharge: true,
    billingCycle: "1"
  }),
  rankGroupOptions: () => []
});

const calculativeOptions = [
  { label: $t("agency.agencyApplicationAuditModal6"), value: true },
  { label: $t("agency.agencyApplicationAuditModal7"), value: false }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <!-- 申請人明細（唯讀） -->
  <detail-view :detail="props.detail" />

  <el-divider />

  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="auditFormRules"
    label-width="160px"
  >
    <el-form-item :label="$t('agency.agencyApplicationAuditModal5')" prop="calculative">
      <el-select v-model="newFormInline.calculative" class="!w-[220px]">
        <el-option
          v-for="item in calculativeOptions"
          :key="String(item.value)"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('agency.agencyAccount')" prop="agencyAccount">
      <el-input
        v-model="newFormInline.agencyAccount"
        clearable
        class="!w-[220px]"
        :placeholder="$t('agency.inputText')"
      />
    </el-form-item>

    <el-form-item :label="$t('agency.becomeOneAgent')" prop="isFirstLayerAgency">
      <el-radio-group v-model="newFormInline.isFirstLayerAgency">
        <el-radio :value="1">{{ $t("agency.yes") }}</el-radio>
        <el-radio :value="2">{{ $t("agency.no") }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 全反水(businessType=1) 顯示等級群組 -->
    <el-form-item
      v-if="newFormInline.businessType === 1"
      :label="$t('agency.agencyApplicationAuditModal8')"
      prop="rankGroupID"
    >
      <el-select v-model="newFormInline.rankGroupID" clearable class="!w-[220px]">
        <el-option
          v-for="item in props.rankGroupOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 淨利(businessType=2) 顯示優惠比例 -->
    <el-form-item
      v-if="newFormInline.businessType === 2"
      :label="$t('agency.proportional')"
      prop="offerPercent"
    >
      <el-input-number
        v-model="newFormInline.offerPercent"
        :min="0"
        :step="1"
      />
      <span class="ml-1">%</span>
    </el-form-item>

    <el-form-item :label="$t('agency.netProfitBasis')" prop="netProfitBase">
      <el-select v-model="newFormInline.netProfitBase" class="!w-[220px]">
        <el-option :label="$t('agency.netProfitBase1')" :value="1" />
        <el-option :label="$t('agency.netProfitBase2')" :value="2" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('agency.commissionSettlementCycle')" prop="billingCycle">
      <el-select v-model="newFormInline.billingCycle" class="!w-[220px]">
        <el-option :label="$t('agency.agencyMainTable11')" value="1" />
        <el-option :label="$t('agency.agencyMainTable12')" value="2" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('agency.whetherToDeductMembershipBonuses')">
      <el-checkbox v-model="newFormInline.totalBonus" />
    </el-form-item>
    <el-form-item :label="$t('agency.whetherToDeductDepositAndWithdrawalFees')">
      <el-checkbox v-model="newFormInline.totalCharge" />
    </el-form-item>
    <el-form-item :label="$t('agency.whetherToDeductPlatformFees')">
      <el-checkbox v-model="newFormInline.platformCharge" />
    </el-form-item>

    <el-form-item :label="$t('agency.agencyApplicationDetailModal6')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        clearable
        :placeholder="$t('agency.childApplicationForm1')"
      />
    </el-form-item>
  </el-form>
</template>
