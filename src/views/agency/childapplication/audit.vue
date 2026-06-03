<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { AuditFormProps } from "./utils/types";

const props = defineProps<AuditFormProps>();
const detail = props.formInline.detail;
</script>

<template>
  <div>
    <!-- 申请资讯（唯读） -->
    <el-descriptions :column="3" border>
      <el-descriptions-item :label="$t('agency.agencyAccount')">
        {{ detail.agencyAccount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.agencyName')">
        {{ detail.agencyName }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.applyTime')">
        {{ detail.applyTime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.childAgencyAccount')">
        {{ detail.childAgencyAccount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.childAgencyName')">
        {{ detail.childAgencyName }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.reviewTime')">
        {{ detail.reviewTime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.childAgencyApplyTime')">
        {{ detail.childAgencyApplyTime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('agency.childAgencyReviewTime')">
        {{ detail.childAgencyReviewTime }}
      </el-descriptions-item>
    </el-descriptions>

    <el-form :model="formInline" label-width="120px" class="mt-4">
      <el-form-item :label="$t('agency.agencyRemark')">
        <el-input :value="detail.agencyRemark" type="textarea" :rows="2" disabled />
      </el-form-item>
      <el-form-item :label="$t('agency.adminRemark')" prop="remark">
        <el-input v-model="formInline.remark" type="textarea" :rows="3" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>
