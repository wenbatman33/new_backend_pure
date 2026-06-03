<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { displayTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    memberType: "1",
    memberAccounts: [],
    startType: "1",
    startTime: "",
    time: 5,
    title: "",
    deeplinkType: 0,
    deeplinkLink: "",
    displayType: 1,
    imageWeb: "",
    imageH5: ""
  })
});

const durationOptions = [5, 10, 15, 20, 30].map(v => ({ label: String(v), value: v }));

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
    label-width="130px"
  >
    <!-- 對象 -->
    <el-form-item :label="$t('operator.object')" prop="memberType">
      <el-radio-group v-model="newFormInline.memberType">
        <el-radio value="1">{{ $t("operator.fullSite") }}</el-radio>
        <el-radio value="2">{{ $t("operator.assign") }}</el-radio>
      </el-radio-group>
      <el-select
        v-if="newFormInline.memberType === '2'"
        v-model="newFormInline.memberAccounts"
        multiple
        filterable
        allow-create
        default-first-option
        class="!w-full mt-2"
        :placeholder="$t('operator.assign')"
      />
    </el-form-item>

    <!-- 廣播時間 -->
    <el-form-item :label="$t('operator.broadcastTime')" prop="startType">
      <el-radio-group v-model="newFormInline.startType">
        <el-radio value="1">{{ $t("operator.immediately") }}</el-radio>
        <el-radio value="2">{{ $t("operator.reserve") }}</el-radio>
      </el-radio-group>
      <el-date-picker
        v-if="newFormInline.startType === '2'"
        v-model="newFormInline.startTime"
        type="datetime"
        class="!w-full mt-2"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm"
      />
    </el-form-item>

    <!-- 廣播持續時間 -->
    <el-form-item :label="$t('operator.broadcastDuration')" prop="time">
      <el-select v-model="newFormInline.time" class="!w-[160px]">
        <el-option
          v-for="item in durationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 標題 -->
    <el-form-item :label="$t('operator.title')" prop="title">
      <el-input
        v-model="newFormInline.title"
        clearable
        :placeholder="$t('operator.plzInputTitle')"
      />
    </el-form-item>

    <!-- 啟動位置 deeplink。TODO: 舊版用 DeepLinkType 元件（未移植），此處簡化為手填型別與連結 -->
    <el-form-item :label="$t('operator.openMethod')" prop="deeplinkType">
      <el-input-number
        v-model="newFormInline.deeplinkType"
        :min="0"
        controls-position="right"
        class="!w-[160px]"
      />
      <el-input
        v-model="newFormInline.deeplinkLink"
        clearable
        class="!w-[300px] ml-2"
        placeholder="deeplinkLink"
      />
    </el-form-item>

    <!-- 顯示方式 -->
    <el-form-item :label="$t('operator.showMethod')" prop="displayType">
      <el-select v-model="newFormInline.displayType" class="!w-[200px]">
        <el-option
          v-for="item in displayTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 圖片。TODO: 舊版用 UploadFile 上傳元件（未移植），此處改為填寫圖片網址 -->
    <el-form-item :label="`${$t('operator.webImage')}(340*66)`" prop="imageWeb">
      <el-input v-model="newFormInline.imageWeb" clearable placeholder="URL" />
    </el-form-item>
    <el-form-item :label="`${$t('operator.h5Image')}(340*66)`" prop="imageH5">
      <el-input v-model="newFormInline.imageH5" clearable placeholder="URL" />
    </el-form-item>
  </el-form>
</template>
