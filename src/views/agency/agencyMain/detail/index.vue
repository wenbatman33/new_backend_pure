<script setup lang="ts">
import { useAgencyDetail } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import CopyIcon from "~icons/ep/copy-document";
import Plus from "~icons/ep/circle-plus";
import Minus from "~icons/ep/remove";

defineOptions({ name: "AgencyAgencyMainDetail" });

const {
  formBasic,
  staticRecord,
  accountForm,
  userBankcard,
  userPayment,
  rankGroupOptions,
  netProfitBaseOptions,
  walletLogList,
  walletLogLoading,
  walletLogColumns,
  platformRatesList,
  platformRatesLoading,
  platformRatesColumns,
  commaDecimalFormat,
  editable,
  handleCopy,
  formBasicSubmit,
  agencyVerifyPhone,
  handlePassword,
  editPayGroupAgency,
  formAccountSubmit,
  openCardDialog,
  openUsdtDialog,
  openEcnyDialog,
  openWithdrawDialog,
  openPromotionLinkDialog,
  handlePromotionLinkDelete,
  openAddPlatformRates,
  openEditPlatformRates,
  handlePlatformDelete
} = useAgencyDetail();
</script>

<template>
  <div class="main">
    <!-- 基本資料 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">{{ $t("agency.detailIndex1") }}</span>
          <el-button type="primary" @click="openWithdrawDialog">
            {{ $t("agency.checkWithdrawalInfo") }}
          </el-button>
        </div>
      </template>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">ID：</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.id }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.id)">
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailData5") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.account }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.account)">
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex3") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.memberAccount }}</span>
            <el-icon
              class="cursor-pointer"
              color="#409eff"
              @click="handleCopy(formBasic.memberAccount)"
            >
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex2") }}</h4>
          <div v-if="formBasic.editableName" class="flex gap-2">
            <el-input v-model="formBasic.name" class="!w-[140px]" />
            <el-button
              type="primary"
              @click="formBasicSubmit('name', formBasic.name, 'editableName')"
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span>{{ formBasic.name }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.name)">
              <CopyIcon />
            </el-icon>
            <el-icon
              v-if="hasAuth('__btn_basic_name')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableName')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex6") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.parentAgencyID }}</span>
            <el-icon
              class="cursor-pointer"
              color="#409eff"
              @click="handleCopy(formBasic.parentAgencyID)"
            >
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex7") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.parentAgencyAccount }}</span>
            <el-icon
              class="cursor-pointer"
              color="#409eff"
              @click="handleCopy(formBasic.parentAgencyAccount)"
            >
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex8") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.childAgencyCount }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex9") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.memberCount }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.addAgencyModal16") }}</h4>
          <div v-if="formBasic.editablePhone" class="flex gap-2">
            <el-input v-model="formBasic.phone" class="!w-[140px]" />
            <el-button
              type="primary"
              @click="formBasicSubmit('phone', formBasic.phone, 'editablePhone')"
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span>{{ formBasic.phone }}</span>
            <el-tag v-if="formBasic.phoneCert == 1" type="success" size="small">✓</el-tag>
            <el-button
              v-if="formBasic.phoneCert == 2 && hasAuth('__btn_verify_agphone') && formBasic.phone"
              type="primary"
              size="small"
              @click="agencyVerifyPhone"
            >
              {{ $t("agency.detailIndex58") }}
            </el-button>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.phone)">
              <CopyIcon />
            </el-icon>
            <el-icon
              v-if="hasAuth('__btn_basic_phone')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editablePhone')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex10") }}</h4>
          <div v-if="formBasic.editableEmail" class="flex gap-2">
            <el-input v-model="formBasic.email" class="!w-[140px]" />
            <el-button
              type="primary"
              @click="formBasicSubmit('email', formBasic.email, 'editableEmail')"
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span>{{ formBasic.email }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.email)">
              <CopyIcon />
            </el-icon>
            <el-icon
              v-if="hasAuth('__btn_basic_email')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableEmail')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.addAgencyModal18") }}</h4>
          <div v-if="formBasic.editableWechat" class="flex gap-2">
            <el-input v-model="formBasic.wechat" class="!w-[140px]" />
            <el-button
              type="primary"
              @click="formBasicSubmit('wechat', formBasic.wechat, 'editableWechat')"
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span>{{ formBasic.wechat }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.wechat)">
              <CopyIcon />
            </el-icon>
            <el-icon
              v-if="hasAuth('__btn_basic_WeChat')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableWechat')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.addAgencyModal19") }}</h4>
          <div v-if="formBasic.editableQQ" class="flex gap-2">
            <el-input v-model="formBasic.qq" class="!w-[140px]" />
            <el-button
              type="primary"
              @click="formBasicSubmit('qq', formBasic.qq, 'editableQQ')"
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span>{{ formBasic.qq }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.qq)">
              <CopyIcon />
            </el-icon>
            <el-icon
              v-if="hasAuth('__btn_basic_qq')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableQQ')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex11") }}</h4>
          <div>{{ formBasic.reivewAgencyTime }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex12") }}</h4>
          <div>{{ formBasic.lastLoginTime }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex13") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.applyAgencyIp }}</span>
            <el-icon
              class="cursor-pointer"
              color="#409eff"
              @click="handleCopy(formBasic.applyAgencyIp)"
            >
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex14") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.lastLoginIp }}</span>
            <el-icon
              class="cursor-pointer"
              color="#409eff"
              @click="handleCopy(formBasic.lastLoginIp)"
            >
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex15") }}</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.defaultCard }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="openCardDialog">
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex16") }}</h4>
          <div class="flex items-center gap-2">
            <span class="break-all">{{ formBasic.defaultUSDT }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="openUsdtDialog">
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex17") }}</h4>
          <div class="flex items-center gap-2">
            <span class="break-all">{{ formBasic.defaultEcny }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="openEcnyDialog">
              <EditPen />
            </el-icon>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <div class="flex items-center gap-2">
            <h4 class="font-bold">{{ $t("agency.detailIndex18") }}</h4>
            <el-icon
              v-if="hasAuth('__btn_proxy_list_Promotion_URL')"
              class="cursor-pointer"
              color="#409eff"
              @click="openPromotionLinkDialog('Add')"
            >
              <Plus />
            </el-icon>
          </div>
          <ul class="promotion-list">
            <li v-for="item in formBasic.promotionLinks" :key="item.id">
              <span class="break-all">{{ item.promotionLink }}</span>
              <span class="flex gap-1 ml-2">
                <el-icon
                  class="cursor-pointer"
                  color="#409eff"
                  @click="handleCopy(item.promotionLink)"
                >
                  <CopyIcon />
                </el-icon>
                <el-icon
                  v-if="hasAuth('__btn_proxy_list_Promotion_URL') && item.type !== 1"
                  class="cursor-pointer"
                  color="#409eff"
                  @click="openPromotionLinkDialog('Edit', item)"
                >
                  <EditPen />
                </el-icon>
                <el-icon
                  v-if="hasAuth('__btn_proxy_list_Promotion_URL') && item.type !== 1"
                  class="cursor-pointer"
                  color="#409eff"
                  @click="handlePromotionLinkDelete(item.id)"
                >
                  <Minus />
                </el-icon>
              </span>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex19") }}</h4>
          <div v-if="formBasic.editableAdminRemark" class="flex flex-col gap-2">
            <el-input v-model="formBasic.adminRemark" type="textarea" :rows="4" />
            <el-button
              type="primary"
              @click="
                formBasicSubmit('adminRemark', formBasic.adminRemark, 'editableAdminRemark')
              "
            >
              {{ $t("agency.detailIndex25") }}
            </el-button>
          </div>
          <div v-else class="flex items-start gap-2">
            <div>
              <div class="break-words">{{ formBasic.adminRemark }}</div>
              <div class="mt-1">
                {{ $t("agency.detailIndex20") }}{{ formBasic.updateAdmin }}
              </div>
            </div>
            <el-icon
              v-if="hasAuth('__btn_basic_adminRemark')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableAdminRemark')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <!-- 銀行卡金流組別：GameGroupSelect/ApiSelect 未移植，先用 el-input 佔位 TODO -->
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex21") }}</h4>
          <div v-if="formBasic.editableBankcardGroups" class="flex gap-2">
            <!-- TODO: 三方/銀行卡金流組別下拉（getAgencyDetailPayGroups type=2），暫用 el-input 佔位 -->
            <el-input v-model="formBasic.bankcardGroups" class="!w-[120px]" />
            <el-button type="primary" @click="editPayGroupAgency(1)">
              {{ $t("agency.detailIndex5") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span class="mt-1">{{ userBankcard?.name }}</span>
            <el-icon
              v-if="hasAuth('__btn_agency_paymentgroup_edit')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editableBankcardGroups')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex22") }}</h4>
          <div v-if="formBasic.editablePaymentGroups" class="flex gap-2">
            <!-- TODO: 三方金流組別下拉（getAgencyDetailPayGroups type=1），暫用 el-input 佔位 -->
            <el-input v-model="formBasic.paymentGroups" class="!w-[120px]" />
            <el-button type="primary" @click="editPayGroupAgency(2)">
              {{ $t("agency.detailIndex5") }}
            </el-button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span class="mt-1">{{ userPayment?.name }}</span>
            <el-icon
              v-if="hasAuth('__btn_agency_paymentgroup_edit')"
              class="cursor-pointer"
              color="#409eff"
              @click="editable('editablePaymentGroups')"
            >
              <EditPen />
            </el-icon>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.agencyMode") }}</h4>
          <div>
            {{
              formBasic.businessType == 1
                ? $t("agency.agencyBusinessType1")
                : $t("agency.agencyBusinessType2")
            }}
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">telegram</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.telegram }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.telegram)">
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">whatsapp</h4>
          <div class="flex items-center gap-2">
            <span>{{ formBasic.whatsapp }}</span>
            <el-icon class="cursor-pointer" color="#409eff" @click="handleCopy(formBasic.whatsapp)">
              <CopyIcon />
            </el-icon>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 帳號設定 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <span class="font-bold">{{ $t("agency.detailIndex23") }}</span>
      </template>
      <el-form :model="accountForm" label-width="160px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData12')">
              <div v-if="formBasic.editablePassword" class="flex gap-2">
                <el-input v-model="formBasic.password" class="!w-[140px]" />
                <el-button type="primary" @click="handlePassword(1, formBasic.password)">
                  {{ $t("agency.detailIndex24") }}
                </el-button>
              </div>
              <el-button v-else type="primary" @click="editable('editablePassword')">
                {{ $t("agency.detailIndex25") }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData13')">
              <div v-if="formBasic.editableTransPassword" class="flex gap-2">
                <el-input v-model="formBasic.transPassword" class="!w-[140px]" />
                <el-button type="primary" @click="handlePassword(2, formBasic.transPassword)">
                  {{ $t("agency.detailIndex24") }}
                </el-button>
              </div>
              <el-button v-else type="primary" @click="editable('editableTransPassword')">
                {{ $t("agency.detailIndex25") }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData14')">
              <el-select
                v-model="accountForm.status"
                :disabled="!hasAuth('__btn_agency_state')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData15')" :value="1" />
                <el-option :label="$t('agency.detailData16')" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData17')">
              <el-select
                v-model="accountForm.giveOffer"
                :disabled="!hasAuth('__btn_agency_Commission_calculation')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData18')" :value="1" />
                <el-option :label="$t('agency.detailData19')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData20')">
              <!-- TODO: 佣金等級群組下拉（getAgencyRankSettingOption），暫用空選項 -->
              <el-select
                v-model="accountForm.rankGroupID"
                :disabled="!hasAuth('__btn_agency_Commission_type')"
                class="!w-[160px]"
              >
                <el-option
                  v-for="o in rankGroupOptions"
                  :key="o.value"
                  :label="o.label"
                  :value="o.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData21')">
              <el-select
                v-model="accountForm.allowOtherBankCard"
                :disabled="!hasAuth('__btn_agency_allow_other_bank_card')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData23')" :value="1" />
                <el-option :label="$t('agency.detailData24')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData25')">
              <el-select
                v-model="accountForm.depositLimit"
                :disabled="!hasAuth('__btn_agency_deposit_limit')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData23')" :value="1" />
                <el-option :label="$t('agency.detailData26')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData27')">
              <el-select
                v-model="accountForm.withdrawLimit"
                :disabled="!hasAuth('__btn_agency_withdrawal_limit')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData23')" :value="1" />
                <el-option :label="$t('agency.detailData26')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData31')">
              <el-select v-model="accountForm.transferLimit" class="!w-[160px]">
                <el-option :label="$t('agency.detailData23')" :value="1" />
                <el-option :label="$t('agency.detailData26')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.detailData28')">
              <el-select
                v-model="accountForm.walletManualOperationLimit"
                :disabled="!hasAuth('__btn_agency_uplowlimit')"
                class="!w-[160px]"
              >
                <el-option :label="$t('agency.detailData15')" :value="1" />
                <el-option :label="$t('agency.detailData29')" :value="2" />
                <el-option :label="$t('agency.detailData30')" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="formBasic.businessType == 2">
            <el-col :span="8">
              <el-form-item :label="$t('agency.proportional')">
                <el-input-number v-model="accountForm.offerPercent" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('agency.agentReturnRatio')">
                <el-input-number v-model="accountForm.agencyReturnProportion" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('agency.memberRebateRatio')">
                <el-input-number v-model="accountForm.memberReturnProportion" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item :label="$t('agency.netProfitBasis')">
              <el-select v-model="formBasic.netProfitBase" class="!w-[160px]">
                <el-option
                  v-for="o in netProfitBaseOptions"
                  :key="o.value"
                  :label="o.label"
                  :value="o.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agency.commissionCostItems')">
              <div class="flex flex-col">
                <el-checkbox v-model="formBasic.platformCharge">
                  {{ $t("agency.platformFee") }}
                </el-checkbox>
                <el-checkbox v-model="formBasic.totalCharge">
                  {{ $t("agency.depositAndWithdrawalFees") }}
                </el-checkbox>
                <el-checkbox v-model="formBasic.totalBonus">
                  {{ $t("agency.memberBonus") }}
                </el-checkbox>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-end">
          <el-button type="primary" @click="formAccountSubmit">
            {{ $t("agency.detailIndex26") }}
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 錢包統計 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <span class="font-bold">{{ $t("agency.detailIndex27") }}</span>
      </template>
      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex28") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.money, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex29") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.frozenMoney, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex30") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.rechargeAmount, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex31") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.withdrawAmount, 2) }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="mb-3">
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex32") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.commission, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex33") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.manualRecharge, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex34") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.manualWithdraw, 2) }}</div>
        </el-col>
        <el-col :span="6">
          <h4 class="font-bold">{{ $t("agency.detailIndex35") }}</h4>
          <div>{{ commaDecimalFormat(staticRecord.bonusAmount, 2) }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 錢包異動紀錄 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <span class="font-bold">{{ $t("agency.detailIndex36") }}</span>
      </template>
      <pure-table
        align-whole="center"
        :loading="walletLogLoading"
        :data="walletLogList"
        :columns="walletLogColumns"
        border
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </el-card>

    <!-- 客製平台費率 -->
    <el-card shadow="never">
      <PureTableBar
        :title="$t('agency.customGamePlatformRates')"
        :columns="platformRatesColumns"
        @refresh="() => undefined"
      >
        <template #buttons>
          <el-button
            v-if="hasAuth('__btn_add_customize_platfrom_fee')"
            type="primary"
            @click="openAddPlatformRates"
          >
            {{ $t("agency.add") }}
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            :size="size"
            :loading="platformRatesLoading"
            :data="platformRatesList"
            :columns="dynamicColumns"
            border
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
          >
            <template #platformAction="{ row }">
              <el-button link type="primary" :size="size" @click="openEditPlatformRates(row)">
                {{ $t("agency.edit") }}
              </el-button>
              <el-popconfirm
                :title="$t('common.confirmDelete')"
                @confirm="handlePlatformDelete(row)"
              >
                <template #reference>
                  <el-button link type="danger" :size="size">
                    {{ $t("agency.delete") }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.promotion-list {
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
}
h4 {
  margin: 0 0 4px;
  font-size: 14px;
}
</style>
