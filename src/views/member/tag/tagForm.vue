<script setup lang="ts">
import { ref, computed } from "vue";
import { tagFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { TagFormProps } from "./utils/types";

const props = withDefaults(defineProps<TagFormProps>(), {
  formInline: () => ({
    id: undefined,
    createdAt: "",
    updatedAt: "",
    name: "",
    tagGroupID: undefined,
    onlyBySystem: false,
    loginForbidden: false,
    loginReason: false,
    withdrawalForbidden: false,
    withdrawReason: false,
    depositForbidden: false,
    riskNotifyAlways: false,
    riskNotifyOnce: false,
    riskCondition: false,
    financialNotifyAlways: false,
    loginNotify: false,
    withdrawalColor: false,
    withdrawalSpecialNoColor: false,
    loginWhiteList: false
  }),
  isUpdate: false,
  groupOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// tag id 38 異常 IP 關聯、39 異常 Device ID 關聯，不可勾選登入白名單
const loginWhiteListDisabled = computed(
  () => newFormInline.value.id === 38 || newFormInline.value.id === 39
);

// 勾選項清單：label i18n key 對應欄位名
const checkItems: { field: keyof typeof newFormInline.value; label: string; tip?: string }[] = [
  { field: "onlyBySystem", label: "member.memberTagCannotBeMarked" },
  { field: "loginForbidden", label: "member.loginProhibited" },
  { field: "loginReason", label: "member.memberTagCannotLoginShowReason" },
  { field: "withdrawalForbidden", label: "member.withdrawalsProhibited" },
  { field: "withdrawReason", label: "member.memberTagCannotWithdrawalShowReason" },
  { field: "depositForbidden", label: "member.noDepositsAllowed" },
  {
    field: "riskNotifyAlways",
    label: "member.memberTagRiskControlNoticeRepeat",
    tip: "member.memberTagRiskControlNoticeRepeatAnnotation"
  },
  {
    field: "riskNotifyOnce",
    label: "member.memberTagRiskControlNoticeNoRepeat",
    tip: "member.memberTagRiskControlNoticeNoRepeatAnnotation"
  },
  {
    field: "riskCondition",
    label: "member.memberTagRisk",
    tip: "member.memberTagRiskAnnotation"
  },
  { field: "financialNotifyAlways", label: "member.memberTagWithdrawalNoticeRepeat" },
  { field: "loginNotify", label: "member.loginNotification" },
  { field: "withdrawalColor", label: "member.withdrawalColor" },
  { field: "withdrawalSpecialNoColor", label: "member.withdrawalSpecialNoColor" }
];

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="tagFormRules"
    label-width="180px"
  >
    <el-form-item v-if="isUpdate" :label="$t('member.tagId')" prop="id">
      <el-input v-model="newFormInline.id" disabled />
    </el-form-item>
    <el-form-item v-if="isUpdate" :label="$t('member.createTime')" prop="createdAt">
      <el-input v-model="newFormInline.createdAt" disabled />
    </el-form-item>
    <el-form-item v-if="isUpdate" :label="$t('member.editTime')" prop="updatedAt">
      <el-input v-model="newFormInline.updatedAt" disabled />
    </el-form-item>
    <el-form-item :label="$t('member.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>
    <el-form-item :label="$t('member.tagGroup')" prop="tagGroupID">
      <el-select
        v-model="newFormInline.tagGroupID"
        clearable
        class="w-full"
      >
        <el-option
          v-for="item in groupOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      v-for="item in checkItems"
      :key="item.field"
      :prop="item.field"
    >
      <template #label>
        <span>{{ $t(item.label) }}</span>
        <el-tooltip v-if="item.tip" :content="$t(item.tip)" placement="top">
          <span class="ml-1 cursor-help text-[var(--el-color-info)]">(?)</span>
        </el-tooltip>
      </template>
      <el-checkbox
        v-model="newFormInline[item.field] as boolean"
        :disabled="item.field === 'loginWhiteList' && loginWhiteListDisabled"
      />
    </el-form-item>

    <!-- 登入白名單（id 38/39 不可勾選） -->
    <el-form-item :label="$t('member.loginWhiteList')" prop="loginWhiteList">
      <el-checkbox
        v-model="newFormInline.loginWhiteList"
        :disabled="loginWhiteListDisabled"
      />
    </el-form-item>
  </el-form>
</template>
