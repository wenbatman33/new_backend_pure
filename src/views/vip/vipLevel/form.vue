<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { uploadFile } from "@/api/vip";
import { ElMessage } from "element-plus";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    vipImage: "",
    vipImageUrl: "",
    upgradeBetAmount: 0,
    upgradeRechargeAmount: 0,
    upgradeGift: 0,
    upgradeGiftMultiple: 0,
    birthdayGift: 0,
    birthdayGiftMultiple: 0,
    dailyGift: 0,
    dailyGiftRechargeMultiple: 0,
    dailyGiftBetMultiple: 0,
    dailyGiftMultiple: 0,
    weeklyGift: 0,
    weeklyGiftRechargeMultiple: 0,
    weeklyGiftBetMultiple: 0,
    weeklyGiftMultiple: 0,
    monthlyGift: 0,
    monthlyGiftRechargeMultiple: 0,
    monthlyGiftBetMultiple: 0,
    monthlyGiftMultiple: 0,
    withdrawAmountLimit: 0,
    withdrawTimesLimit: 0,
    singleWithdrawAmountLimit: 0
  })
});

const imagePath = getImagPath();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

/** 圖片大小上限 30KB */
const MAX_IMG_KB = 30;

async function handleUpload(opt: any) {
  if (opt.file.size > MAX_IMG_KB * 1024) {
    ElMessage.error($t("vip.maxSizeMessage"));
    return;
  }
  const fd = new FormData();
  fd.append("type", "banner");
  fd.append("file", opt.file);
  const { success, data } = await uploadFile(fd);
  if (success) {
    newFormInline.value.vipImage = data.url;
    newFormInline.value.vipImageUrl = imagePath + data.url;
  }
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
    label-width="160px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('vip.name')" prop="name">
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('vip.vipImage')" prop="vipImage">
          <div class="flex items-center gap-2">
            <img
              v-if="newFormInline.vipImageUrl"
              :src="newFormInline.vipImageUrl"
              style="width: 40px; height: 40px; object-fit: contain"
            />
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="handleUpload"
            >
              <el-button size="small" type="primary">
                {{ $t("vip.vipImage") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('vip.upgradeBetAmount')" prop="upgradeBetAmount">
          <el-input v-model="newFormInline.upgradeBetAmount" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('vip.upgradeRechargeAmount')"
          prop="upgradeRechargeAmount"
        >
          <el-input v-model="newFormInline.upgradeRechargeAmount" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('vip.upgradeGift')" prop="upgradeGift">
          <el-input v-model="newFormInline.upgradeGift" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="`${$t('vip.upgradeGift')}${$t('vip.multiple')}`"
          prop="upgradeGiftMultiple"
        >
          <el-input v-model="newFormInline.upgradeGiftMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('vip.bdGift')" prop="birthdayGift">
          <el-input v-model="newFormInline.birthdayGift" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="`${$t('vip.bdGift')}${$t('vip.multiple')}`"
          prop="birthdayGiftMultiple"
        >
          <el-input v-model="newFormInline.birthdayGiftMultiple" type="number" />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('vip.dailyGift')" prop="dailyGift">
          <el-input v-model="newFormInline.dailyGift" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedDay')}${$t('vip.rechargeMultiple')}`"
          prop="dailyGiftRechargeMultiple"
        >
          <el-input v-model="newFormInline.dailyGiftRechargeMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedDay')}${$t('vip.turnoverMultiple')}`"
          prop="dailyGiftBetMultiple"
        >
          <el-input v-model="newFormInline.dailyGiftBetMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.dailyGift')}${$t('vip.multiple')}`"
          prop="dailyGiftMultiple"
        >
          <el-input v-model="newFormInline.dailyGiftMultiple" type="number" />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('vip.weeklyGift')" prop="weeklyGift">
          <el-input v-model="newFormInline.weeklyGift" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedWeekly')}${$t('vip.rechargeMultiple')}`"
          prop="weeklyGiftRechargeMultiple"
        >
          <el-input v-model="newFormInline.weeklyGiftRechargeMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedWeekly')}${$t('vip.turnoverMultiple')}`"
          prop="weeklyGiftBetMultiple"
        >
          <el-input v-model="newFormInline.weeklyGiftBetMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.weeklyGift')}${$t('vip.multiple')}`"
          prop="weeklyGiftMultiple"
        >
          <el-input v-model="newFormInline.weeklyGiftMultiple" type="number" />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('vip.monthlyGift')" prop="monthlyGift">
          <el-input v-model="newFormInline.monthlyGift" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedMonthly')}${$t('vip.rechargeMultiple')}`"
          prop="monthlyGiftRechargeMultiple"
        >
          <el-input v-model="newFormInline.monthlyGiftRechargeMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.receivedMonthly')}${$t('vip.turnoverMultiple')}`"
          prop="monthlyGiftBetMultiple"
        >
          <el-input v-model="newFormInline.monthlyGiftBetMultiple" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          :label="`${$t('vip.monthlyGift')}${$t('vip.multiple')}`"
          prop="monthlyGiftMultiple"
        >
          <el-input v-model="newFormInline.monthlyGiftMultiple" type="number" />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          :label="$t('vip.withdrawAmountLimit')"
          prop="withdrawAmountLimit"
        >
          <el-input v-model="newFormInline.withdrawAmountLimit" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('vip.withdrawTimesLimit')"
          prop="withdrawTimesLimit"
        >
          <el-input v-model="newFormInline.withdrawTimesLimit" type="number" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('vip.singleWithdrawAmountLimit')"
          prop="singleWithdrawAmountLimit"
        >
          <el-input v-model="newFormInline.singleWithdrawAmountLimit" type="number" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
