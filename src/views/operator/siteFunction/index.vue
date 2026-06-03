<script setup lang="ts">
import { useSiteFunction } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "OperatorSiteFunction" });

const { loading, formData, handleSubmit } = useSiteFunction();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <!-- profile -->
      <el-divider content-position="left">profile</el-divider>

      <!-- phone_edit -->
      <div class="row">
        <span class="label">{{
          $t("operator.cellphoneUnverifiedReviseIncomingLine")
        }}</span>
        <el-switch
          v-model="formData.phone_edit"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="note">
        {{ $t("operator.cellphoneUnverifiedReviseIncomingLine")
        }}<span class="text-red">{{
          $t("operator.recommendationCloseAvoidReviseCellphone")
        }}</span>
      </div>

      <!-- modify_password_mode -->
      <div class="row mt-7">
        <span class="label">{{ $t("operator.revisePasswordMethod") }}</span>
        <el-radio-group v-model="formData.modify_password_mode">
          <el-radio-button :value="1">{{
            $t("operator.smsAndOldPassword")
          }}</el-radio-button>
          <el-radio-button :value="2">{{
            $t("operator.oldPassword")
          }}</el-radio-button>
          <el-radio-button :value="3">{{ $t("operator.sms") }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="note mt-5">{{ $t("operator.smsAndOldPasswordNotice") }}</div>
      <div class="note">{{ $t("operator.oldPasswordNotice") }}</div>
      <div class="note">
        {{ $t("operator.smsNotice")
        }}<span class="text-red">{{
          $t("operator.needSettingIfNoCellphoneConnectionService")
        }}</span>
      </div>

      <!-- email -->
      <div class="mt-7">{{ $t("operator.emailVerificationTitle") }}</div>
      <div class="flex items-center mt-3">
        <span class="label">{{ $t("operator.showInPersonal") }}</span>
        <el-switch
          v-model="formData.email_show"
          active-text="ON"
          inactive-text="OFF"
        />
        <span class="label ml-5"
          ><span class="px-3">|</span
          >{{ $t("operator.emailVerification") }}</span
        >
        <el-switch
          v-model="formData.email_verfiy"
          active-text="ON"
          inactive-text="OFF"
        />
        <span class="label ml-5"
          ><span class="px-3">|</span
          >{{ $t("operator.forgetPassword") }}</span
        >
        <el-switch
          v-model="formData.email_get_password"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="note mt-3">{{ $t("operator.emailSettings") }}</div>

      <!-- function -->
      <el-divider content-position="left">function</el-divider>

      <!-- luckmoney_active -->
      <div class="row">
        <span class="label">{{ $t("operator.bonusWalletEnabled") }}</span>
        <el-switch
          v-model="formData.luckmoney_active"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="note">
        {{ $t("operator.transactionRecordsIncludeBonusWallet") }}
      </div>

      <!-- chatroom_entrance -->
      <div class="row mt-5">
        <span class="label">{{ $t("operator.chatroomEntrance") }}</span>
        <el-switch
          v-model="formData.chatroom_entrance"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="note">{{ $t("operator.chatroomEntranceNote") }}</div>

      <!-- lobbyxinliQuickBetWidget -->
      <div class="mt-5">
        <div class="row">
          <span class="label">{{
            $t("operator.lobbyXinliQuickBetWidgetEnabled")
          }}</span>
          <el-switch
            v-model="formData.lobbyxinliQuickBetWidget"
            active-text="ON"
            inactive-text="OFF"
          />
        </div>
        <div class="note">{{ $t("operator.lobbyXinliQuickBetWidgetNote") }}</div>
      </div>

      <!-- lobbySabaQuickBetWidget -->
      <div class="mt-5">
        <div class="row">
          <span class="label">{{
            $t("operator.lobbySabaQuickBetWidgetEnabled")
          }}</span>
          <el-switch
            v-model="formData.lobbySabaQuickBetWidget"
            active-text="ON"
            inactive-text="OFF"
          />
        </div>
        <div class="note">{{ $t("operator.lobbySabaQuickBetWidgetNote") }}</div>
      </div>

      <!-- sabaWidgetID -->
      <div class="flex justify-start mt-5">
        <div>
          <div>{{ $t("operator.sabaWidgetIdLabel") }}</div>
          <div class="note">{{ $t("operator.sabaWidgetIdNote") }}</div>
        </div>
        <div class="ml-20">
          <el-input
            v-model="formData.sabaWidgetID"
            style="width: 500px"
            :placeholder="$t('operator.sabaWidgetIdPlaceholder')"
          >
            <template #prepend>ID</template>
          </el-input>
        </div>
      </div>

      <!-- eventLeague -->
      <div class="flex justify-start mt-5">
        <div>
          <div class="row">
            <span class="label">{{
              $t("operator.homepageEventLeagueEnabled")
            }}</span>
            <el-switch
              v-model="formData.eventLeague"
              active-text="ON"
              inactive-text="OFF"
            />
          </div>
          <div class="note">{{ $t("operator.homepageEventLeagueNote") }}</div>
        </div>
        <div class="ml-20">
          <el-input
            v-model="formData.eventLeagueID"
            style="width: 500px"
            :placeholder="$t('operator.eventLeagueIdPlaceholder')"
          >
            <template #prepend>leagueId</template>
          </el-input>
        </div>
      </div>

      <!-- preMatchBroadcast -->
      <div class="flex justify-start mt-5">
        <div>
          <div class="row">
            <span class="label">{{
              $t("operator.preMatchBroadcastEnabled")
            }}</span>
            <el-switch
              v-model="formData.websocketMatchScheduleStatus"
              active-text="ON"
              inactive-text="OFF"
            />
          </div>
          <div class="note">{{ $t("operator.preMatchBroadcastNote") }}</div>
        </div>
        <div class="ml-20">
          <el-input
            v-model="formData.websocketMatchScheduleLeague"
            style="width: 500px"
            :placeholder="$t('operator.preMatchBroadcastLeagueIdPlaceholder')"
          >
            <template #prepend>leagueId</template>
          </el-input>
          <div class="mt-2">{{ $t("operator.preMatchBroadcastBeforeMinutes") }}</div>
          <el-input-number
            v-model="formData.websocketMatchSchedulePreEventTime"
            style="width: 500px"
            :min="1"
            :precision="0"
            :controls="false"
            :placeholder="$t('operator.preMatchBroadcastMinutesPlaceholder')"
          />
        </div>
      </div>

      <!-- home_lottery -->
      <div class="flex justify-start mt-5">
        <div>
          <div class="row">
            <span class="label">{{
              $t("operator.homepageLotteryButtonEnabled")
            }}</span>
            <el-switch
              v-model="formData.home_lottery"
              active-text="ON"
              inactive-text="OFF"
            />
          </div>
          <div class="note">{{ $t("operator.homepageLotteryButtonAction") }}</div>
        </div>
        <div class="ml-20">
          <el-input
            v-model="formData.home_lottery_title"
            style="width: 500px"
            :placeholder="$t('operator.plzInputTitle')"
          >
            <template #prepend>{{ $t("operator.title") }}</template>
          </el-input>
          <el-input
            v-model="formData.home_lottery_link"
            class="mt-2"
            style="width: 500px"
            :placeholder="$t('operator.plzInputLink')"
          >
            <template #prepend>{{ $t("operator.url") }}</template>
          </el-input>
        </div>
      </div>

      <!-- welfare -->
      <div class="flex justify-start mt-5">
        <div>
          <div class="row">
            <span class="label">{{ $t("operator.welfare1") }}</span>
            <el-switch
              v-model="formData.welfare"
              active-text="ON"
              inactive-text="OFF"
            />
          </div>
          <div class="note">{{ $t("operator.welfare2") }}</div>
        </div>
      </div>

      <!-- area -->
      <el-divider content-position="left">area</el-divider>

      <!-- specific_1 -->
      <div class="flex justify-start">
        <div>
          <div class="row">
            <span class="label">{{
              $t("operator.personalPageDisplayTopicPage")
            }}</span>
            <el-switch
              v-model="formData.specific_1"
              active-text="ON"
              inactive-text="OFF"
            />
          </div>
          <div class="note">{{ $t("operator.clickIntoSponsorPage") }}</div>
        </div>
        <div class="ml-20">
          <el-input
            v-model="formData.specific_title"
            style="width: 500px"
            :placeholder="$t('operator.plzInputTitle')"
          >
            <template #prepend>{{ $t("operator.title") }}</template>
          </el-input>
          <el-input
            v-model="formData.specific_link"
            class="mt-2"
            style="width: 500px"
            :placeholder="$t('operator.plzInputLink')"
          >
            <template #prepend>{{ $t("operator.url") }}</template>
          </el-input>
        </div>
      </div>

      <!-- save -->
      <div class="mt-20" v-if="hasAuth('__btn_site_function_column')">
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t("operator.saveSetting") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.row {
  display: flex;
  align-items: center;
}

.label {
  margin-right: 20px;
}

.note {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}

.text-red {
  color: var(--el-color-danger);
}
</style>
