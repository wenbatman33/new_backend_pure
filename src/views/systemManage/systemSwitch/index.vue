<script setup lang="ts">
import { useSystemSwitch } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageSystemSwitch" });

const {
  state,
  setSwitch,
  recordVisible,
  recordLoading,
  recordList,
  recordSearch,
  recordColumns,
  searchRecord,
  openRecord
} = useSystemSwitch();
</script>

<template>
  <div class="main">
    <div class="flex mb-3">
      <el-button type="primary" @click="openRecord">
        {{ $t("systemManage.handleRecord") }}
      </el-button>
    </div>

    <el-card shadow="never">
      <!-- 站台設定 -->
      <el-divider content-position="left" class="section-title">
        {{ $t("systemManage.siteSettings") }}
      </el-divider>
      <div class="switch-grid">
        <div v-if="hasAuth('__btn_system_management_register')" class="outLine">
          <h2 class="label">{{ $t("systemManage.register") }}</h2>
          <el-switch
            :model-value="state.register"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'register')"
          />
          <p class="description">{{ $t("systemManage.registerD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_login')" class="outLine">
          <h2 class="label">{{ $t("systemManage.login") }}</h2>
          <el-switch
            :model-value="state.login"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'login')"
          />
          <p class="description">{{ $t("systemManage.loginD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_playgame')" class="outLine">
          <h2 class="label">{{ $t("systemManage.loginGame") }}</h2>
          <el-switch
            :model-value="state.loginGame"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'loginGame')"
          />
          <p class="description">{{ $t("systemManage.loginGameD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_withdraw')" class="outLine">
          <h2 class="label">{{ $t("systemManage.bankCardNeedVerify") }}</h2>
          <el-switch
            :model-value="state.withdrawalBankcardNeedVerify"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'withdrawalBankcardNeedVerify')"
          />
          <p class="description">{{ $t("systemManage.bankCardNeedVerifyD") }}</p>
        </div>

        <div class="outLine">
          <h2 class="label">{{ $t("systemManage.pcMaintain") }}</h2>
          <el-switch
            :model-value="state.pcMaintain"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'pcMaintain')"
          />
          <p class="description">{{ $t("systemManage.pcMaintainD") }}</p>
          <el-input
            v-model="state.pcMaintainMessage"
            type="textarea"
            :rows="2"
            :placeholder="$t('systemManage.pcMaintainMessage')"
          />
        </div>

        <div v-if="hasAuth('__btn_system_management_maintain_H5PWA')" class="outLine">
          <h2 class="label">{{ $t("systemManage.h5Maintain") }}</h2>
          <el-switch
            :model-value="state.h5Maintain"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'h5Maintain')"
          />
          <p class="description">{{ $t("systemManage.h5MaintainD") }}</p>
          <el-input
            v-model="state.h5MaintainMessage"
            type="textarea"
            :rows="2"
            :placeholder="$t('systemManage.h5MaintainMessage')"
          />
        </div>

        <div v-if="hasAuth('__btn_system_management_withdraw')" class="outLine">
          <h2 class="label">{{ $t("systemManage.zombie") }}</h2>
          <el-switch
            :model-value="state.deleteZombieJob"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'deleteZombieJob')"
          />
          <p class="description">{{ $t("systemManage.zombieMessage") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_usdt_switch')" class="outLine">
          <h2 class="label">{{ $t("systemManage.USDTunblocked") }}</h2>
          <el-switch
            :model-value="state.usdtSmoothEnable"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'usdtSmoothEnable')"
          />
          <p class="description">{{ $t("systemManage.USDTunblockedD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_update_game_edit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.autoupdatelggame") }}</h2>
          <el-switch
            :model-value="state.autoupdatelggame"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'autoupdatelggame')"
          />
          <p class="description">{{ $t("systemManage.autoupdatelggame") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_smsverifysmooth')" class="outLine">
          <h2 class="label">{{ $t("systemManage.smsVerifySmooth") }}</h2>
          <el-switch
            :model-value="state.smsVerifySmooth"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'smsVerifySmooth')"
          />
          <p class="description">{{ $t("systemManage.smsVerifySmoothD") }}</p>
          <div class="mt-2">
            <span class="mr-4">{{ $t("systemManage.smsExpireMinutes") }}</span>
            <el-input-number
              v-model="state.smsExpireMinutes"
              :min="0"
              @keyup.enter="setSwitch(state.smsExpireMinutes, 'smsExpireMinutes')"
            />
            <span class="ml-4">{{ $t("systemManage.minutes") }}</span>
          </div>
        </div>
      </div>

      <!-- 存款設定 -->
      <el-divider content-position="left" class="section-title">
        {{ $t("systemManage.depositSettings") }}
      </el-divider>
      <div class="switch-grid">
        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.deposit") }}</h2>
          <el-switch
            :model-value="state.deposit"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'deposit')"
          />
          <p class="description">{{ $t("systemManage.depositD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_bankcard_audit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositNeedBankcardVerify") }}</h2>
          <el-switch
            :model-value="state.depositNeedBankcardVerify"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositNeedBankcardVerify')"
          />
          <p class="description">{{ $t("systemManage.depositNeedBankcardVerifyD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_phone_audit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositNeedMobileVerify") }}</h2>
          <el-switch
            :model-value="state.depositNeedMobileVerify"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositNeedMobileVerify')"
          />
          <p class="description">{{ $t("systemManage.depositNeedMobileVerifyD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositAllowChoosePayChannelService") }}</h2>
          <el-switch
            :model-value="state.depositAllowChoosePayChannelService"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositAllowChoosePayChannelService')"
          />
          <p class="description">{{ $t("systemManage.depositAllowChoosePayChannelServiceD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositShowPromotion") }}</h2>
          <el-switch
            :model-value="state.depositShowPromotion"
            :disabled="state.depositAllowChoosePayChannelService === false"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositShowPromotion')"
          />
          <p class="description">{{ $t("systemManage.depositShowPromotionD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.manualDepositDoubleReview") }}</h2>
          <el-switch
            :model-value="state.manualDepositDoubleReview"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'manualDepositDoubleReview')"
          />
          <p class="description">{{ $t("systemManage.manualDepositDoubleReviewD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositRemind") }}</h2>
          <el-switch
            :model-value="state.depositRemind"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositRemind')"
          />
          <p class="description">{{ $t("systemManage.depositRemindD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_deposit')" class="outLine">
          <h2 class="label">{{ $t("systemManage.depositNeedWithdrawalPasswordSet") }}</h2>
          <el-switch
            :model-value="state.depositNeedWithdrawalPasswordSet"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'depositNeedWithdrawalPasswordSet')"
          />
          <p class="description">{{ $t("systemManage.depositNeedWithdrawalPasswordSetD") }}</p>
        </div>

        <div v-if="hasAuth('__btn_system_management_usdt_switch')" class="outLine">
          <span class="mr-4">{{ $t("systemManage.withdrawalPasswordCheckTimes") }}</span>
          <el-input-number
            v-model="state.withdrawalPasswordCheckTimes"
            @keyup.enter="
              setSwitch(state.withdrawalPasswordCheckTimes, 'withdrawalPasswordCheckTimes')
            "
          />
          <span class="ml-4">{{ $t("systemManage.time") }}</span>
          <p class="description">{{ $t("systemManage.withdrawalPasswordCheckTimesD") }}</p>
        </div>
      </div>

      <!-- 提款設定 -->
      <template v-if="hasAuth('__btn_system_management_withdraw')">
        <el-divider content-position="left" class="section-title">
          {{ $t("systemManage.withdrawalSettings") }}
        </el-divider>
        <div class="switch-grid">
          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawal") }}</h2>
            <el-switch
              :model-value="state.withdrawal"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawal')"
            />
            <p class="description">{{ $t("systemManage.withdrawalD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalNeedMobileVerify") }}</h2>
            <el-switch
              :model-value="state.withdrawalNeedMobileVerify"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalNeedMobileVerify')"
            />
            <p class="description">{{ $t("systemManage.withdrawalNeedMobileVerify") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withNeedBankcardVerify") }}</h2>
            <el-switch
              :model-value="state.withNeedBankcardVerify"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withNeedBankcardVerify')"
            />
            <p class="description">{{ $t("systemManage.withNeedBankcardVerifyD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalNeedWithdrawRealName") }}</h2>
            <el-switch
              :model-value="state.withdrawalNeedWithdrawRealName"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalNeedWithdrawRealName')"
            />
            <p class="description">{{ $t("systemManage.withdrawalNeedWithdrawRealNameD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.payInfoNeedRealName") }}</h2>
            <el-switch
              :model-value="state.canAddOtherBankcard"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'canAddOtherBankcard')"
            />
            <p class="description">{{ $t("systemManage.payInfoNeedRealNameD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalNeedWithdrawPassaword") }}</h2>
            <el-switch
              :model-value="state.withdrawalNeedWithdrawPassaword"
              :disabled="state.usdtSmoothEnable === true"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalNeedWithdrawPassaword')"
            />
            <p class="description">{{ $t("systemManage.withdrawalNeedWithdrawPassawordD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawPassawordSetNeedSMSVerify") }}</h2>
            <el-switch
              :model-value="state.withdrawPassawordSetNeedSMSVerify"
              :disabled="state.usdtSmoothEnable === true"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawPassawordSetNeedSMSVerify')"
            />
            <p class="description">{{ $t("systemManage.withdrawPassawordSetNeedSMSVerifyD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawPassawordForgetNeedSMSVerify") }}</h2>
            <el-switch
              :model-value="state.withdrawPassawordForgetNeedSMSVerify"
              :disabled="state.usdtSmoothEnable === true"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawPassawordForgetNeedSMSVerify')"
            />
            <p class="description">{{ $t("systemManage.withdrawPassawordForgetNeedSMSVerifyD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalRiskVerify") }}</h2>
            <el-switch
              :model-value="state.withdrawalRiskVerify"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalRiskVerify')"
            />
            <p class="description">{{ $t("systemManage.withdrawalRiskVerifyD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.virtualWithdrawalLenient") }}</h2>
            <el-switch
              :model-value="state.virtualWithdrawalLenient"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'virtualWithdrawalLenient')"
            />
            <p class="description">{{ $t("systemManage.virtualWithdrawalLenientD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.payInfoNeedSMSVerify") }}</h2>
            <el-switch
              :model-value="state.payInfoNeedSMSVerify"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'payInfoNeedSMSVerify')"
            />
            <p class="description">{{ $t("systemManage.payInfoNeedSMSVerifyD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalShowPrompt") }}</h2>
            <el-switch
              :model-value="state.withdrawalShowPrompt"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalShowPrompt')"
            />
            <p class="description">{{ $t("systemManage.withdrawalShowPromptD") }}</p>
          </div>

          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.phoneOwnerAndRealNameSame") }}</h2>
            <el-switch
              :model-value="state.phoneOwnerAndRealNameSame"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'phoneOwnerAndRealNameSame')"
            />
            <p class="description">{{ $t("systemManage.phoneOwnerAndRealNameSameD") }}</p>
          </div>
        </div>
      </template>

      <!-- 提款流水檢查設定 -->
      <el-divider content-position="left" class="section-title">
        {{ $t("systemManage.withdrawalFlowCheckSettings") }}
      </el-divider>
      <div class="switch-grid">
        <div class="outLine">
          <h2 class="label">{{ $t("systemManage.withdrawalNeedTurnoverInsufficient") }}</h2>
          <el-switch
            :model-value="state.withdrawalNeedTurnoverInsufficient"
            active-text="ON"
            inactive-text="OFF"
            @change="val => setSwitch(val, 'withdrawalNeedTurnoverInsufficient')"
          />
          <p class="description">{{ $t("systemManage.withdrawalNeedTurnoverInsufficientD") }}</p>
        </div>
      </div>

      <!-- 提款自動審核設定 -->
      <el-divider content-position="left" class="section-title">
        {{ $t("systemManage.withdrawalAutomaticReviewSettings") }}
      </el-divider>
      <template v-if="hasAuth('__btn_system_management_withdraw')">
        <div class="switch-grid">
          <div class="outLine">
            <h2 class="label">{{ $t("systemManage.withdrawalCheckPromotionEnable") }}</h2>
            <el-switch
              :model-value="state.withdrawalCheckPromotionEnable"
              :disabled="state.withdrawalNeedTurnoverInsufficient === false"
              active-text="ON"
              inactive-text="OFF"
              @change="val => setSwitch(val, 'withdrawalCheckPromotionEnable')"
            />
            <p class="description">{{ $t("systemManage.withdrawalCheckPromotionEnableD") }}</p>
          </div>

          <div class="outLine">
            <div class="flex items-center">
              <span class="mr-4">{{ $t("systemManage.withdrawalPassAmount") }}</span>
              <el-input-number
                v-model="state.withdrawalPassAmount"
                @keyup.enter="setSwitch(state.withdrawalPassAmount, 'withdrawalPassAmount')"
              />
            </div>
            <p class="description">{{ $t("systemManage.withdrawalPassAmountD") }}</p>
          </div>
        </div>
      </template>
    </el-card>

    <!-- 操作紀錄對話框 -->
    <el-dialog
      v-model="recordVisible"
      :title="$t('systemManage.handleRecord')"
      width="1200px"
      align-center
      destroy-on-close
    >
      <el-form :inline="true" class="mb-3">
        <el-form-item :label="$t('systemManage.logModal5')">
          <el-date-picker
            v-model="recordSearch.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item :label="$t('systemManage.logModal6')">
          <el-date-picker
            v-model="recordSearch.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="recordLoading" @click="searchRecord">
            {{ $t("systemManage.search") }}
          </el-button>
        </el-form-item>
      </el-form>
      <pure-table
        align-whole="center"
        :loading="recordLoading"
        :data="recordList"
        :columns="recordColumns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  :deep(.el-divider__text) {
    font-size: 20px;
    font-weight: 800;
  }
}

.switch-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 66%;
}

.label {
  display: inline-block;
  margin-right: 1.5rem;
  margin-bottom: 0;
  vertical-align: middle;
}

.description {
  margin-top: 5px;
  margin-bottom: 0;
  color: #999;
}

.outLine {
  padding: 16px;
  border: 1px solid #c0c0c0;
  border-radius: 10px;
}
</style>
