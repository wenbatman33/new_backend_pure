<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  mode: "create",
  formInline: () => ({
    status: 1,
    name: "",
    cycleType: 2,
    startTime: "",
    endTime: "",
    finalEndTime: "",
    rankAmount: null,
    type: 1,
    gameItem: [],
    tag: [],
    eventCode: "",
    displayStartTime: "",
    displayEndTime: "",
    bonusShow: 1,
    typeShow: 1,
    imgUrl: "",
    announcement: ""
  })
});

const cycleTypeOptions = [
  { label: $t("promotion.day"), value: 2 },
  { label: $t("promotion.week"), value: 3 },
  { label: $t("promotion.customize"), value: 1 }
];

const typeOptions = [
  { label: $t("promotion.betAmount"), value: 1 },
  { label: $t("promotion.turnover"), value: 2 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 編輯模式下部分欄位禁止修改
const editDisabled = props.mode === "edit";

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
    label-width="150px"
  >
    <el-form-item :label="$t('promotion.switch')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.rankingName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :disabled="editDisabled"
        class="!w-[360px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.rankingType')" prop="cycleType">
      <el-radio-group v-model="newFormInline.cycleType" :disabled="editDisabled">
        <el-radio
          v-for="item in cycleTypeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('promotion.cycleStartTime')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm"
        format="YYYY/MM/DD HH:mm"
        :disabled="editDisabled"
        class="!w-[240px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.endTime')" prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm"
        format="YYYY/MM/DD HH:mm"
        :disabled="editDisabled"
        class="!w-[240px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.queryEndTime')" prop="finalEndTime">
      <el-date-picker
        v-model="newFormInline.finalEndTime"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm"
        format="YYYY/MM/DD HH:mm"
        class="!w-[240px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.places')" prop="rankAmount">
      <el-input-number
        v-model="newFormInline.rankAmount"
        :min="0"
        :disabled="editDisabled"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.item')" prop="type">
      <el-radio-group v-model="newFormInline.type" :disabled="editDisabled">
        <el-radio
          v-for="item in typeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- TODO: 限制廠商 GameGroupByGameType（Cascader+tags）尚未移植，以純文字暫代 -->
    <el-form-item
      v-if="newFormInline.type === 2"
      :label="$t('promotion.restrictedVendor')"
    >
      <span class="text-[#909399]">{{ $t("promotion.notMigratedTip") }}</span>
    </el-form-item>

    <!-- TODO: 排除會員標籤 AddTagSelect 尚未移植，以純文字暫代 -->
    <el-form-item :label="$t('promotion.excludeMemberTag')">
      <span class="text-[#909399]">{{ $t("promotion.notMigratedTip") }}</span>
    </el-form-item>

    <el-form-item :label="$t('promotion.activityParameters')" prop="eventCode">
      <el-input v-model="newFormInline.eventCode" clearable class="!w-[360px]" />
    </el-form-item>

    <el-form-item :label="$t('promotion.rankingStartTime')" prop="displayStartTime">
      <el-date-picker
        v-model="newFormInline.displayStartTime"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm"
        format="YYYY/MM/DD HH:mm"
        class="!w-[240px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.rankingEndTime')" prop="displayEndTime">
      <el-date-picker
        v-model="newFormInline.displayEndTime"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm"
        format="YYYY/MM/DD HH:mm"
        class="!w-[240px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.frontDeskBonus')" prop="bonusShow">
      <el-switch
        v-model="newFormInline.bonusShow"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.turnover')" prop="typeShow">
      <el-switch
        v-model="newFormInline.typeShow"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <!-- TODO: 圖片上傳 UploadFile 尚未移植，暫以 URL 輸入框暫代 -->
    <el-form-item :label="$t('promotion.uploadImage')">
      <el-input
        v-model="newFormInline.imgUrl"
        clearable
        :placeholder="$t('promotion.imgUrlTip')"
        class="!w-[360px]"
      />
    </el-form-item>

    <!-- TODO: 公告 Tinymce 富文本尚未移植，暫以多行文字框暫代 -->
    <el-form-item :label="$t('promotion.announcement')">
      <el-input
        v-model="newFormInline.announcement"
        type="textarea"
        :rows="4"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
