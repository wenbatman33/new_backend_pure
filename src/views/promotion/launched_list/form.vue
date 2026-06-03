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
    device: [],
    content: "",
    orderNo: 0,
    top: 2,
    display: 1,
    startTime: "",
    endTime: "",
    imageWeb: "",
    imageH5: "",
    promotions: []
  }),
  typeOptions: () => [],
  deviceOptions: () => [],
  promotionOptions: () => [],
  readonly: false
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
    :disabled="readonly"
    label-width="110px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('promotion.listingName')" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            :placeholder="$t('promotion.plzEnterListingName')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('promotion.sort')" prop="orderNo">
          <el-input-number
            v-model="newFormInline.orderNo"
            :min="0"
            controls-position="right"
            class="!w-full"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('promotion.type')" prop="type">
          <el-select
            v-model="newFormInline.type"
            multiple
            clearable
            class="!w-full"
            :placeholder="$t('promotion.pleaseSelectType')"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('promotion.device')" prop="device">
          <el-select
            v-model="newFormInline.device"
            multiple
            clearable
            class="!w-full"
            :placeholder="$t('promotion.pleaseSelectDevice')"
          >
            <el-option
              v-for="item in deviceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('promotion.startTime')" prop="startTime">
          <el-date-picker
            v-model="newFormInline.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
            :placeholder="$t('promotion.startTime')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('promotion.endTime')" prop="endTime">
          <el-date-picker
            v-model="newFormInline.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
            :placeholder="$t('promotion.endTime')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('promotion.pinToTop')" prop="top">
          <el-radio-group v-model="newFormInline.top">
            <el-radio :value="1">{{ $t("promotion.yes") }}</el-radio>
            <el-radio :value="2">{{ $t("promotion.no") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('promotion.show')" prop="display">
          <el-radio-group v-model="newFormInline.display">
            <el-radio :value="1">{{ $t("promotion.show") }}</el-radio>
            <el-radio :value="2">{{ $t("promotion.hidden") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('promotion.relatedOffers')" prop="promotions">
          <el-select
            v-model="newFormInline.promotions"
            multiple
            filterable
            clearable
            class="!w-full"
            :placeholder="$t('promotion.relatedOffers')"
          >
            <el-option
              v-for="item in promotionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('promotion.summary')" prop="summary">
          <el-input
            v-model="newFormInline.summary"
            type="textarea"
            :rows="2"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('promotion.content')" prop="content">
          <el-input
            v-model="newFormInline.content"
            type="textarea"
            :rows="4"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
