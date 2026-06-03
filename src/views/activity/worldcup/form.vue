<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  statusType,
  matchType,
  matchGroupType,
  resultType
} from "./utils/hook";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    eventTime: "",
    isRed: 2,
    status: 1,
    awayTeam: 0,
    awayScore: "",
    awayResult: "",
    awayDiffer: "",
    awayPoint: "",
    homeTeam: 0,
    homeScore: "",
    homeResult: "",
    homeDiffer: "",
    homePoint: "",
    matchType: 1,
    matchGroup: 1,
    eventId: ""
  }),
  teamData: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 隊伍下拉（含「無」選項）
const teamOptions = [{ label: $t("activity.none"), value: 0 }, ...props.teamData];

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
    label-width="100px"
  >
    <el-row :gutter="16">
      <el-col :span="16">
        <el-form-item :label="$t('activity.eventTime')" prop="eventTime">
          <el-date-picker
            v-model="newFormInline.eventTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="!w-full"
            :placeholder="$t('activity.eventTime')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('activity.grabRedEnvelope')" prop="isRed">
          <el-switch
            v-model="newFormInline.isRed"
            :active-value="1"
            :inactive-value="2"
            active-text="Y"
            inactive-text="X"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('activity.status')" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio v-for="item in statusType" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 客隊 -->
    <el-form-item :label="$t('activity.awayTeam')" prop="awayTeam">
      <div class="flex flex-row gap-x-2 w-full">
        <el-select v-model="newFormInline.awayTeam" class="!w-[160px]">
          <el-option
            v-for="item in teamOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.awayScore"
          type="number"
          :placeholder="$t('activity.score')"
        />
        <el-select
          v-model="newFormInline.awayResult"
          :placeholder="$t('activity.result')"
          class="!w-[120px]"
        >
          <el-option
            v-for="item in resultType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.awayDiffer"
          type="number"
          :placeholder="$t('activity.goalDiff')"
        />
        <el-input
          v-model="newFormInline.awayPoint"
          type="number"
          :placeholder="$t('activity.points')"
        />
      </div>
    </el-form-item>

    <!-- 主隊 -->
    <el-form-item :label="$t('activity.homeTeam')" prop="homeTeam">
      <div class="flex flex-row gap-x-2 w-full">
        <el-select v-model="newFormInline.homeTeam" class="!w-[160px]">
          <el-option
            v-for="item in teamOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.homeScore"
          type="number"
          :placeholder="$t('activity.score')"
        />
        <el-select
          v-model="newFormInline.homeResult"
          :placeholder="$t('activity.result')"
          class="!w-[120px]"
        >
          <el-option
            v-for="item in resultType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.homeDiffer"
          type="number"
          :placeholder="$t('activity.goalDiff')"
        />
        <el-input
          v-model="newFormInline.homePoint"
          type="number"
          :placeholder="$t('activity.points')"
        />
      </div>
    </el-form-item>

    <el-form-item :label="$t('activity.matchType')" prop="matchType">
      <el-radio-group v-model="newFormInline.matchType">
        <el-radio v-for="item in matchType" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('activity.matchGroup')" prop="matchGroup">
      <el-radio-group v-model="newFormInline.matchGroup">
        <el-radio
          v-for="item in matchGroupType"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="eventId" prop="eventId">
      <el-input
        v-model="newFormInline.eventId"
        clearable
        class="!w-[240px]"
        placeholder="eventId"
      />
    </el-form-item>
  </el-form>
</template>
