<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { formRules } from "./utils/rule";
import { matchType, matchGroup, resultType } from "./utils/enums";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    eventTime: "",
    league: 2,
    awayTeam: 0,
    homeTeam: 0,
    redPacket: 0,
    remark: ""
  }),
  teamOptions: () => [],
  leagueOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 队伍下拉为父层传入，包成 ref 以便联赛切换时更新
const teams = ref(props.teamOptions);

// 队伍选项含「无」
const teamSelectOptions = () => [
  { label: $t("activity.matchNone"), value: 0 },
  ...teams.value
];

function handleLeagueChange(val: number | string) {
  newFormInline.value.awayTeam = 0;
  newFormInline.value.homeTeam = 0;
  // 通知父层重新取队伍，回填到 teams
  Promise.resolve(props.onLeagueChange?.(val)).then(() => {
    // onLeagueChange 内部已更新父层 teamOptions，重新指向最新值
  });
}

// 抢红包时间快捷：同赛事时间
function setSameAsEventTime() {
  newFormInline.value.redPacketStartTime = newFormInline.value.eventTime;
}
// 抢红包结束 = 赛事时间 + 100 分钟
function setEventTimePlus100() {
  if (!newFormInline.value.eventTime) return;
  newFormInline.value.redPacketEndTime = dayjs(newFormInline.value.eventTime)
    .add(100, "minute")
    .format("YYYY-MM-DD HH:mm:ss");
}

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
    <el-row :gutter="12">
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchEventTime')" prop="eventTime">
          <el-date-picker
            v-model="newFormInline.eventTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchLeague')" prop="league">
          <el-select
            v-model="newFormInline.league"
            class="!w-[200px]"
            :placeholder="$t('activity.matchPleaseChoiceLeague')"
            @change="handleLeagueChange"
          >
            <el-option
              v-for="item in leagueOptions.filter(o => o.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 客队 -->
    <el-form-item :label="$t('activity.matchAwayTeam')" prop="awayTeam">
      <div class="flex gap-x-2 w-full">
        <el-select v-model="newFormInline.awayTeam" class="flex-1">
          <el-option
            v-for="item in teamSelectOptions()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.awayScore"
          type="number"
          class="flex-1"
          :placeholder="$t('activity.matchScore')"
        />
        <el-select
          v-model="newFormInline.awayResult"
          class="flex-1"
          clearable
          :placeholder="$t('activity.matchResult')"
        >
          <el-option
            v-for="item in resultType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-form-item>

    <!-- 主队 -->
    <el-form-item :label="$t('activity.matchHomeTeam')" prop="homeTeam">
      <div class="flex gap-x-2 w-full">
        <el-select v-model="newFormInline.homeTeam" class="flex-1">
          <el-option
            v-for="item in teamSelectOptions()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="newFormInline.homeScore"
          type="number"
          class="flex-1"
          :placeholder="$t('activity.matchScore')"
        />
        <el-select
          v-model="newFormInline.homeResult"
          class="flex-1"
          clearable
          :placeholder="$t('activity.matchResult')"
        >
          <el-option
            v-for="item in resultType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-form-item>

    <el-form-item :label="$t('activity.matchEventProgress')" prop="matchType">
      <el-radio-group v-model="newFormInline.matchType">
        <el-radio v-for="item in matchType" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('activity.matchGroupLabel')" prop="matchGroup">
      <el-radio-group v-model="newFormInline.matchGroup">
        <el-radio v-for="item in matchGroup" :key="item.value" :value="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('activity.matchRedPacketActivity')" prop="redPacket">
      <el-switch
        v-model="newFormInline.redPacket"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>

    <template v-if="newFormInline.redPacket === 1">
      <el-form-item :label="$t('activity.matchRedPacketStartTime')" prop="redPacketStartTime">
        <div class="flex items-center gap-x-2 w-full">
          <el-date-picker
            v-model="newFormInline.redPacketStartTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="flex-1"
          />
          <el-button type="primary" size="small" @click="setSameAsEventTime">
            {{ $t("activity.matchSameAsEventTime") }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('activity.matchRedPacketEndTime')" prop="redPacketEndTime">
        <div class="flex items-center gap-x-2 w-full">
          <el-date-picker
            v-model="newFormInline.redPacketEndTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD HH:mm"
            class="flex-1"
          />
          <el-button type="primary" size="small" @click="setEventTimePlus100">
            {{ $t("activity.matchEventTimePlus100") }}
          </el-button>
        </div>
      </el-form-item>
    </template>

    <el-form-item label="eventId" prop="eventId">
      <el-input
        v-model="newFormInline.eventId"
        class="!w-[300px]"
        :placeholder="$t('activity.matchPleaseInputEventId')"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.matchRemark')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        :placeholder="$t('activity.matchPleaseInputRemark')"
      />
    </el-form-item>
  </el-form>
</template>
