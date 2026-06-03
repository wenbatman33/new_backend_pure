<script setup lang="ts">
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { LoginSwitchForm } from "./utils/types";

// 登入開關設定表單（PC / H5 共用）
defineProps<{
  model: LoginSwitchForm;
  registerOptions: { label: string; value: number }[];
  loginOptions: { label: string; value: number }[];
  showYesNoOptions: { label: string; value: boolean }[];
  requiredOptions: { label: string; value: boolean }[];
  reconfirmOptions: { label: string; value: boolean }[];
  forceUpdateOptions: { label: string; value: number }[];
}>();
</script>

<template>
  <el-form :model="model" :rules="formRules" label-width="170px">
    <el-form-item
      :label="$t('systemManage.registrationRequiresBehavioralVerification')"
      prop="registerVerify"
    >
      <el-radio-group v-model="model.registerVerify">
        <el-radio-button
          v-for="item in registerOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('systemManage.loginRequiresBehavioralVerification')"
      prop="loginVerify"
    >
      <el-radio-group v-model="model.loginVerify">
        <el-radio-button
          v-for="item in loginOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-divider>{{ $t("systemManage.registrationPageFields") }}</el-divider>

    <el-form-item :label="$t('systemManage.mobilePhoneNumberField')" prop="phoneShow">
      <el-radio-group v-model="model.phoneShow">
        <el-radio-button
          v-for="item in showYesNoOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="phoneRequired">
      <el-radio-group v-model="model.phoneRequired">
        <el-radio-button
          v-for="item in requiredOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('systemManage.realNameField')" prop="nameShow">
      <el-radio-group v-model="model.nameShow">
        <el-radio-button
          v-for="item in showYesNoOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="nameRequired">
      <el-radio-group v-model="model.nameRequired">
        <el-radio-button
          v-for="item in requiredOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('systemManage.emailField')" prop="emailShow">
      <el-radio-group v-model="model.emailShow">
        <el-radio-button
          v-for="item in showYesNoOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="emailRequired">
      <el-radio-group v-model="model.emailRequired">
        <el-radio-button
          v-for="item in requiredOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('systemManage.confirmRegistrationInformationAgain')"
      prop="reconfirm"
    >
      <el-radio-group v-model="model.reconfirm">
        <el-radio-button
          v-for="item in reconfirmOptions"
          :key="String(item.value)"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-divider>{{ $t("systemManage.twoStageVerification") }}</el-divider>

    <el-form-item :label="$t('systemManage.twoStageSMSVerification')" prop="loginSms">
      <el-switch v-model="model.loginSms" />
    </el-form-item>
    <el-form-item :label="$t('systemManage.whitelistIPDetection')" prop="ipTwoPhaseEnable">
      <el-switch v-model="model.ipTwoPhaseEnable" />
    </el-form-item>

    <el-divider>{{ $t("systemManage.whiteListSettingAndOperation") }}</el-divider>

    <el-form-item
      :label="$t('systemManage.numberOfWhitelistIPGroups')"
      prop="ipTwoPhaseWhiteListLimit"
    >
      <el-input v-model="model.ipTwoPhaseWhiteListLimit" class="!w-[200px]">
        <template #append>{{ $t("systemManage.numberOfWhitelistIPGroupsSuffix") }}</template>
      </el-input>
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.whitelistDeviceDetection')"
      prop="deviceIDTwoPhaseEnable"
    >
      <el-switch v-model="model.deviceIDTwoPhaseEnable" />
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.numberOfWhitelistDeviceGroups')"
      prop="deviceIDTwoPhaseWhiteListLimit"
    >
      <el-input v-model="model.deviceIDTwoPhaseWhiteListLimit" class="!w-[200px]">
        <template #append>
          {{ $t("systemManage.numberOfWhitelistDeviceGroupsSuffix") }}
        </template>
      </el-input>
    </el-form-item>

    <el-divider>{{ $t("systemManage.setLoginLockConditions") }}</el-divider>

    <el-form-item
      :label="$t('systemManage.numberOfConsecutiveErrorLocks')"
      prop="loginErrorLimit"
    >
      <el-input v-model="model.loginErrorLimit" class="!w-[200px]">
        <template #append>
          {{ $t("systemManage.numberOfConsecutiveErrorLocksSuffix") }}
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('systemManage.lockTime')" prop="loginLockTime">
      <el-input v-model="model.loginLockTime" class="!w-[200px]">
        <template #append>{{ $t("systemManage.lockTimeSuffix") }}</template>
      </el-input>
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.numberOfCustomerServiceLockouts')"
      prop="loginLockLimit"
    >
      <el-input v-model="model.loginLockLimit" class="!w-[200px]">
        <template #append>
          {{ $t("systemManage.numberOfCustomerServiceLockoutsSuffix") }}
        </template>
      </el-input>
    </el-form-item>

    <el-divider>{{ $t("systemManage.smsSendingIntervalAndFrequency") }}</el-divider>

    <el-form-item :label="$t('systemManage.smsSendingInterval')" prop="loginSmsInterval">
      <el-input v-model="model.loginSmsInterval" class="!w-[200px]">
        <template #append>{{ $t("systemManage.smsSendingIntervalSuffix") }}</template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('systemManage.theNumberOfTransmissions')" prop="loginSmsLimit">
      <el-input v-model="model.loginSmsLimit" class="!w-[200px]">
        <template #append>
          {{ $t("systemManage.theNumberOfTransmissionsSuffix") }}
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      :label="$t('systemManage.timeBetweenConsecutiveErrors')"
      prop="loginSmsGapTime"
    >
      <el-input v-model="model.loginSmsGapTime" class="!w-[200px]">
        <template #append>
          {{ $t("systemManage.timeBetweenConsecutiveErrorsSuffix") }}
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('systemManage.smsValidityTime')" prop="smsTimeLimit">
      <el-input v-model="model.smsTimeLimit" class="!w-[200px]">
        <template #append>{{ $t("systemManage.second") }}</template>
      </el-input>
    </el-form-item>

    <el-divider>{{ $t("systemManage.passwordSetting") }}</el-divider>

    <el-form-item
      :label="$t('systemManage.mandatoryPasswordSetting')"
      prop="forceUpdatePassword"
    >
      <el-radio-group v-model="model.forceUpdatePassword">
        <el-radio-button
          v-for="item in forceUpdateOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
