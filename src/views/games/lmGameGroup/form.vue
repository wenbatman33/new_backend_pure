<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { openWayFullOptions, statusOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

defineOptions({ name: "LmGameGroupForm" });

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}) as any,
  gameTypeListOption: () => [],
  gameListOption: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
    label-width="140px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('games.lmGameGroupManufacturerID')">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.lmGameGroupAffiliatedAgents')">
          <el-input v-model="newFormInline.gameAgencyName" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('games.lmGameGroupWalletType')">
          <el-input v-model="newFormInline.walletTypeText" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.lmGameGroupGameOpeningMethodPC')">
          <el-select v-model="newFormInline.openWayPc" class="w-full">
            <el-option
              v-for="item in openWayFullOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('games.lmGameGroupGameOpeningMethodH5')">
          <el-select v-model="newFormInline.openWayH5" class="w-full">
            <el-option
              v-for="item in openWayFullOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.lmGameGroupManufacturerDefaultName')"
          prop="name"
        >
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          :label="$t('games.lmGameGroupWebsiteDisplayName')"
          prop="displayName"
        >
          <el-input v-model="newFormInline.displayName" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('games.lmGameGroupManufacturerGameType')">
          <el-radio-group v-model="newFormInline.gameTypeID">
            <el-radio
              v-for="item in gameTypeListOption"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col v-if="newFormInline.status === 3" :span="12">
        <el-form-item :label="$t('games.lmGameGroupMaintenanceEndTime')">
          <el-date-picker
            v-model="newFormInline.maintainTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="w-full"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          :label="$t('games.lmGameGroupWebsiteSorting')"
          prop="sort"
        >
          <el-input-number
            v-model="newFormInline.sort"
            :controls="false"
            class="w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.lmGameGroupPlatformFee')">
          <el-input v-model="newFormInline.platformFeeRatio" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.lmGameGroupGameListIDTurnover')">
          <el-select
            v-model="newFormInline.gameListIDTurnover"
            filterable
            clearable
            class="w-full"
          >
            <el-option
              v-for="item in gameListOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          :label="$t('games.lmGameGroupStatus')"
          prop="status"
        >
          <el-select v-model="newFormInline.status" class="w-full">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.lmGameGroupOpenGameListID')">
          <el-input v-model="newFormInline.gameListID" clearable />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
