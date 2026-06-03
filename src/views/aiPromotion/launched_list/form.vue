<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    summary: "",
    type: [],
    content: "",
    device: [],
    orderNo: 0,
    top: 0,
    display: 1,
    startTime: "",
    endTime: "",
    imageWeb: "",
    imageH5: "",
    promotions: []
  }),
  readonly: false,
  promotionOptions: () => []
});

// 裝置選項（沿用舊碼靜態對照）
const deviceOptions = [
  { label: "WebPC", value: 1 },
  { label: "MobileWeb", value: 2 },
  { label: "AndroidPWA", value: 3 },
  { label: "iOSPWA", value: 4 }
];

// 類型選項：舊碼來自後端 launchedType 下拉，dropdown util 未移植，先提供常見佔位選項
// TODO: 接回後端 launchedType 下拉資料
const typeOptions = [
  { label: $t("aiPromotion.typeActivity"), value: 1 },
  { label: $t("aiPromotion.typeNotice"), value: 2 }
];

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
    :disabled="readonly"
    label-width="120px"
  >
    <el-form-item :label="$t('aiPromotion.listingName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('aiPromotion.plzEnterListingName')"
      />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.summary')" prop="summary">
      <el-input v-model="newFormInline.summary" clearable />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.type')" prop="type">
      <el-checkbox-group v-model="newFormInline.type">
        <el-checkbox
          v-for="item in typeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.device')" prop="device">
      <el-checkbox-group v-model="newFormInline.device">
        <el-checkbox
          v-for="item in deviceOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.relatedOffers')" prop="promotions">
      <el-select
        v-model="newFormInline.promotions"
        multiple
        filterable
        clearable
        class="w-full"
        :placeholder="$t('aiPromotion.relatedOffers')"
      >
        <el-option
          v-for="item in promotionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.startTime')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="$t('aiPromotion.plzSelectStartTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.endTime')" prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="$t('aiPromotion.endTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.sort')" prop="orderNo">
      <el-input-number v-model="newFormInline.orderNo" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.pinToTop')" prop="top">
      <el-switch v-model="newFormInline.top" :active-value="1" :inactive-value="0" />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.show')" prop="display">
      <el-switch v-model="newFormInline.display" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item :label="$t('aiPromotion.content')" prop="content">
      <el-input v-model="newFormInline.content" type="textarea" :rows="4" />
    </el-form-item>
  </el-form>
</template>
