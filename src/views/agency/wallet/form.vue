<script setup lang="ts">
import { ref, reactive } from "vue";
import { formRules } from "./utils/rule";
import { adjustTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormItemProps } from "./utils/types";

const props = withDefaults(
  defineProps<{
    formInline?: FormItemProps;
    agencyDetail?: Record<string, any>;
    searchAgency?: (cond: {
      agencyID: string;
      agencyAccount: string;
    }) => Promise<void>;
  }>(),
  {
    formInline: () => ({
      type: "",
      refMemberAccount: "",
      amount: 0,
      turnoverLimit: 0,
      remark: ""
    }),
    agencyDetail: () => ({})
  }
);

// 代理查詢條件
const queryForm = reactive({ agencyID: "", agencyAccount: "" });
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

async function doSearch() {
  await props.searchAgency?.(queryForm);
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <div>
    <!-- 代理查詢列 -->
    <el-form :inline="true" :model="queryForm" class="mb-2">
      <el-form-item :label="$t('agency.phDailyReportTable1')">
        <el-input
          v-model="queryForm.agencyID"
          clearable
          class="!w-[140px]"
          :placeholder="$t('agency.agencyMainForm2')"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportTable2')">
        <el-input
          v-model="queryForm.agencyAccount"
          clearable
          class="!w-[140px]"
          :placeholder="$t('agency.agencyMainForm4')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearch">
          {{ $t("agency.walletAdjustModal2") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 代理明細 -->
    <el-descriptions
      v-if="agencyDetail.id"
      :title="$t('agency.walletAdjustModal1')"
      border
      :column="3"
      class="mb-3"
    >
      <el-descriptions-item :label="$t('agency.phDailyReportTable1')">
        {{ agencyDetail.id }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.phDailyReportTable2')">
        {{ agencyDetail.account }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.agencyMainTable2')">
        {{ agencyDetail.name }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.commissionTable3')">
        {{ agencyDetail.agencyWallet }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.walletData5')">
        {{ agencyDetail.reivewAgencyTime }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 調整表單 -->
    <el-form
      v-if="agencyDetail.id"
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item :label="$t('agency.walletLogTable5')" prop="type">
        <el-select
          v-model="newFormInline.type"
          class="!w-[220px]"
          :placeholder="$t('agency.walletLogTable5')"
        >
          <el-option
            v-for="item in adjustTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="newFormInline.type === 3"
        :label="$t('agency.agencyApplicationForm4')"
        prop="refMemberAccount"
      >
        <el-input
          v-model="newFormInline.refMemberAccount"
          clearable
          class="!w-[220px]"
        />
      </el-form-item>

      <el-form-item :label="$t('agency.walletLogTable19')" prop="amount">
        <el-input-number
          v-model="newFormInline.amount"
          :min="0"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item :label="$t('agency.walletData7')" prop="turnoverLimit">
        <el-input-number
          v-model="newFormInline.turnoverLimit"
          :min="0"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item :label="$t('agency.agencyMainTable9')" prop="remark">
        <el-input
          v-model="newFormInline.remark"
          type="textarea"
          :rows="3"
          clearable
        />
      </el-form-item>
    </el-form>
  </div>
</template>
