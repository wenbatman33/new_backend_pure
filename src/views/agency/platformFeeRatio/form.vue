<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    gameAgencyName: "",
    walletType: "",
    name: "",
    displayName: "",
    platformFeeRatio: "",
    gameTypeName: "",
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

/** 限制平台費率：0~1、最多兩位小數 */
function handleFeeInput(val: string) {
  let value = val ?? "";
  if (value === "") {
    newFormInline.value.platformFeeRatio = "";
    return;
  }
  // 僅允許數字與小數點
  value = value.replace(/[^0-9.]/g, "");
  const parts = value.split(".");
  // 最多一個小數點
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }
  // 整數位 >1 視為超出（費率為 0~1）
  if (Number(value) > 1) {
    value = "1";
  }
  // 小數最多兩位
  const seg = value.split(".");
  if (seg.length > 1 && seg[1].length > 2) {
    value = seg[0] + "." + seg[1].slice(0, 2);
  }
  newFormInline.value.platformFeeRatio = value;
}

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
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form-item :label="$t('agency.manufacturerID')" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('agency.affiliatedAgents')"
          prop="gameAgencyName"
        >
          <el-input v-model="newFormInline.gameAgencyName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('agency.walletType')" prop="walletType">
          <el-input v-model="newFormInline.walletType" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          :label="$t('agency.manufacturerDefaultName')"
          prop="name"
        >
          <el-input v-model="newFormInline.name" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('agency.websiteDisplayName')"
          prop="displayName"
        >
          <el-input v-model="newFormInline.displayName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('agency.manufacturerGameType')"
          prop="gameTypeName"
        >
          <el-input v-model="newFormInline.gameTypeName" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          :label="$t('agency.platformFee')"
          prop="platformFeeRatio"
        >
          <el-input
            :model-value="newFormInline.platformFeeRatio"
            :placeholder="$t('agency.platformFeeHelpMessage')"
            @update:model-value="handleFeeInput"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
