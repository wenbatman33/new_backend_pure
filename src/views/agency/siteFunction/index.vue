<script setup lang="ts">
import { useSiteFunction } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "AgencySiteFunction" });

const { loading, formData, handleSubmit } = useSiteFunction();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <!-- profile -->
      <el-divider content-position="left">profile</el-divider>

      <!-- phone_active -->
      <div class="item-row">
        <span class="label">{{ $t("agency.siteFunctionProfile1") }}</span>
        <el-switch
          v-model="formData.phone_active"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="text-gray">{{ $t("agency.siteFunctionProfile2") }}</div>

      <!-- modify_password_mode -->
      <div class="item-row mt-5">
        <span class="label">{{ $t("agency.siteFunctionProfile3") }}</span>
        <el-radio-group v-model="formData.modify_password_mode">
          <el-radio-button :value="1">
            {{ $t("agency.siteFunctionProfile4") }}
          </el-radio-button>
          <el-radio-button :value="2">
            {{ $t("agency.siteFunctionProfile5") }}
          </el-radio-button>
          <el-radio-button :value="3">
            {{ $t("agency.siteFunctionProfile6") }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="text-gray">{{ $t("agency.siteFunctionProfile7") }}</div>

      <!-- modify_withdraw_password_mode -->
      <div class="item-row mt-5">
        <span class="label">{{ $t("agency.siteFunctionProfile11") }}</span>
        <el-radio-group v-model="formData.modify_withdraw_password_mode">
          <el-radio-button :value="1">
            {{ $t("agency.siteFunctionProfile4") }}
          </el-radio-button>
          <el-radio-button :value="2">
            {{ $t("agency.siteFunctionProfile5") }}
          </el-radio-button>
          <el-radio-button :value="3">
            {{ $t("agency.siteFunctionProfile6") }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="text-gray">
        <p>{{ $t("agency.siteFunctionProfile12") }}</p>
        <p>{{ $t("agency.siteFunctionProfile13") }}</p>
      </div>

      <!-- phone_edit -->
      <div class="item-row mt-5">
        <span class="label">{{ $t("agency.siteFunctionProfile8") }}</span>
        <el-switch
          v-model="formData.phone_edit"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="text-gray">
        {{ $t("agency.siteFunctionProfile9")
        }}<span class="text-red">{{
          $t("agency.siteFunctionProfile10")
        }}</span>
      </div>

      <!-- enable add agency member -->
      <div class="item-row mt-5">
        <span class="label">{{ $t("agency.siteFunctionProfile14") }}</span>
        <el-switch
          v-model="formData.create_new_member"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>
      <div class="text-gray">{{ $t("agency.siteFunctionProfile15") }}</div>

      <!-- restrict add agency member line -->
      <div class="item-row mt-5">
        <span class="label">{{ $t("agency.siteFunctionProfile16") }}</span>
        <el-input
          v-model="formData.create_new_member_black_list"
          class="!w-[200px]"
        />
      </div>
      <div class="text-gray">{{ $t("agency.siteFunctionProfile17") }}</div>

      <!-- function 區塊：需權限 -->
      <div v-if="hasAuth('__btn_agency_siteFunction_function')">
        <el-divider content-position="left">function</el-divider>

        <!-- child_account -->
        <div class="item-row">
          <span class="label">{{ $t("agency.siteFunction1") }}</span>
          <el-switch
            v-model="formData.child_account"
            active-text="ON"
            inactive-text="OFF"
          />
        </div>
        <div class="text-gray">{{ $t("agency.siteFunction2") }}</div>

        <!-- subagency_benefits -->
        <div class="item-row mt-5">
          <span class="label">{{ $t("agency.siteFunction3") }}</span>
          <el-switch
            v-model="formData.subagency_benefits"
            active-text="ON"
            inactive-text="OFF"
          />
        </div>
        <div class="text-gray">{{ $t("agency.siteFunction4") }}</div>
      </div>

      <!-- 送出 -->
      <div v-if="hasAuth('__btn_ag_function_column')" class="mt-20">
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t("agency.detailIndex24") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.item-row {
  display: flex;
  align-items: center;
}

.label {
  margin-right: 20px;
}

.mt-5 {
  margin-top: 20px;
}

.mt-20 {
  margin-top: 80px;
}

.text-gray {
  margin-top: 8px;
  color: #999;
}

.text-red {
  color: red;
}
</style>
