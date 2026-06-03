<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    homeTeam: "",
    awayTeam: "",
    eventTime: "",
    recommendStartTime: "",
    recommendEndTime: "",
    recommendItem: [1]
  })
});

// 推薦項目：1 賽前投注 / 2 直播賽事
const recommendItemOptions = [
  { label: $t("operator.matchBetting"), value: 1 },
  { label: $t("operator.liveEvents"), value: 2 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 上架時間範圍（el-date-picker datetimerange 用本地暫存陣列）
const recommendRange = ref<[string, string] | null>(
  newFormInline.value.recommendStartTime
    ? [
        newFormInline.value.recommendStartTime,
        newFormInline.value.recommendEndTime
      ]
    : null
);

function onRangeChange(val: [string, string] | null) {
  newFormInline.value.recommendStartTime = val?.[0] ?? "";
  newFormInline.value.recommendEndTime = val?.[1] ?? "";
}

// 點擊「此刻」快捷：開始=現在，結束=比賽時間（沿用舊邏輯）
const shortcuts = [
  {
    text: $t("operator.now"),
    value: () => {
      const start = dayjs().toDate();
      const end = newFormInline.value.eventTime
        ? dayjs(newFormInline.value.eventTime).toDate()
        : dayjs().add(1, "day").toDate();
      return [start, end];
    }
  }
];

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
    <el-form-item :label="$t('operator.competitionTeam')">
      <span>{{ newFormInline.homeTeam }}</span>
      <span class="px-1">-</span>
      <span>{{ newFormInline.awayTeam }}</span>
    </el-form-item>

    <el-form-item :label="$t('operator.matchTime')">
      <span>{{ newFormInline.eventTime }}</span>
    </el-form-item>

    <el-form-item
      :label="$t('operator.recommendedReleaseTimeSettings')"
      prop="recommendStartTime"
    >
      <el-date-picker
        v-model="recommendRange"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        :range-separator="'～'"
        :start-placeholder="$t('operator.shelfStartTime')"
        :end-placeholder="$t('operator.shelfEndTime')"
        :shortcuts="shortcuts"
        @change="onRangeChange"
      />
    </el-form-item>

    <el-form-item
      :label="$t('operator.projectRecommendations')"
      prop="recommendItem"
    >
      <el-checkbox-group v-model="newFormInline.recommendItem">
        <el-checkbox
          v-for="item in recommendItemOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
