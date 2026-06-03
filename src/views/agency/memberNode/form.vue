<script setup lang="ts">
import { ref, reactive } from "vue";
import { formRules } from "./utils/rule";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  checkMemberNode,
  checkAgencyNode,
  type MemberCheckData,
  type AgencyCheckData
} from "@/api/agency";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    memberAccount: "",
    agencyID: "",
    remark: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 步驟狀態
const showMemberOK = ref(false);
const showAgencyOK = ref(false);
const memberID = ref<number | string>("");
const toParentAgencyID = ref<number | string>("");

const memberData = reactive<MemberCheckData>({
  id: "",
  name: "",
  phone: "",
  betAmount: "",
  totalAmount: "",
  depositAmount: "",
  parentAgencyID: "",
  parentAgencyName: "",
  parentAgencyAccount: "",
  memberTags: []
});
const agencyData = reactive<AgencyCheckData>({
  id: "",
  name: "",
  account: ""
});

// 查詢會員
async function handleCheckMember() {
  if (!newFormInline.value.memberAccount) {
    message($t("agency.memberAccountRequired"), { type: "warning" });
    return;
  }
  const { success, data } = await checkMemberNode({
    account: newFormInline.value.memberAccount
  });
  if (success && data?.id) {
    Object.assign(memberData, data);
    memberID.value = data.id;
    showMemberOK.value = true;
  } else {
    showMemberOK.value = false;
    message($t("agency.transferFail"), { type: "error" });
  }
}

// 查詢代理
async function handleCheckAgency() {
  if (!newFormInline.value.agencyID) {
    message($t("agency.memberNodeAgencyTip"), { type: "warning" });
    return;
  }
  const { success, data } = await checkAgencyNode({
    account: newFormInline.value.agencyID
  });
  if (success && data?.id) {
    Object.assign(agencyData, data);
    toParentAgencyID.value = data.id;
    showAgencyOK.value = true;
  } else {
    showAgencyOK.value = false;
    message($t("agency.transferFail"), { type: "error" });
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({
  getRef,
  showMemberOK,
  showAgencyOK,
  memberID,
  toParentAgencyID,
  getFormData: () => newFormInline.value
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="120px"
  >
    <!-- 步驟一：查詢會員 -->
    <el-form-item :label="$t('agency.memberAccount')" prop="memberAccount">
      <div class="flex items-center gap-2">
        <el-input
          v-model="newFormInline.memberAccount"
          clearable
          maxlength="12"
          class="!w-[200px]"
          :placeholder="$t('agency.memberAccountRequired')"
        />
        <el-button type="primary" @click="handleCheckMember">
          {{ $t("agency.check") }}
        </el-button>
      </div>
    </el-form-item>

    <!-- 會員資訊 -->
    <template v-if="showMemberOK">
      <el-descriptions :column="3" border size="small" class="mb-3">
        <el-descriptions-item :label="$t('agency.memberID')">
          {{ memberData.id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.memberName')">
          {{ memberData.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.memberPhone')">
          {{ memberData.phone }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.betAmount')">
          {{ memberData.betAmount }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.totalAmount')">
          {{ memberData.totalAmount }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.depositAmount')">
          {{ memberData.depositAmount }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.parentAgencyID')">
          {{ memberData.parentAgencyID }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.parentAgencyName')">
          {{ memberData.parentAgencyName }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('agency.parentAgencyAccount')">
          {{ memberData.parentAgencyAccount }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="mb-3">
        <span class="mr-2">{{ $t("agency.memberTags") }}：</span>
        <el-tag
          v-for="tag in memberData.memberTags"
          :key="tag.id"
          class="mr-1"
          type="info"
        >
          {{ tag.name }}
        </el-tag>
      </div>

      <!-- 步驟二：查詢目標代理 -->
      <el-form-item :label="$t('agency.targetAgency')" prop="agencyID">
        <div class="flex items-center gap-2">
          <el-input
            v-model="newFormInline.agencyID"
            clearable
            class="!w-[200px]"
            :placeholder="$t('agency.memberNodeAgencyTip')"
          />
          <el-button type="primary" @click="handleCheckAgency">
            {{ $t("agency.confirm") }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 代理資訊 -->
      <template v-if="showAgencyOK">
        <el-descriptions :column="3" border size="small" class="mb-3">
          <el-descriptions-item :label="$t('agency.parentAgencyID')">
            {{ agencyData.id }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('agency.parentAgencyName')">
            {{ agencyData.name }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('agency.parentAgencyAccount')">
            {{ agencyData.account }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 步驟三：備註 -->
        <el-form-item :label="$t('agency.remark')" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            type="textarea"
            :rows="3"
            maxlength="40"
            show-word-limit
            clearable
          />
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>
