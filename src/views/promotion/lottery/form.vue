<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { durationOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { getImagPath } from "@/utils/imgUrl";
import { uploadLotteryFile } from "@/api/promotion";
import type { FormProps } from "./utils/types";
import dayjs from "dayjs";

const props = withDefaults(defineProps<FormProps & { readonly?: boolean }>(), {
  readonly: false,
  formInline: () => ({
    name: "",
    eventTime: "",
    time: "",
    amountMax: "",
    peopleMax: "",
    verifyType: [],
    verifyAmount: "",
    verifyAmount2: "",
    leagueID: [],
    withdrawLimit: "",
    bonusList: [{ amount: "", percent: "" }],
    matchScheduleTimesEnabled: false,
    matchScheduleTimes: "",
    matchScheduleId: "",
    websocketDeeplinkLink: "1",
    websocketTitle: "",
    websocketImaage: "",
    mode: "create"
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const disabled = computed(() => props.readonly);
const imagPath = getImagPath();

// 演出方式选项
const showTypeOptions = [
  { label: $t("promotion.lotteryShowOriginal"), value: "1" },
  { label: $t("promotion.lotteryShowVideo"), value: "2" }
];

// TODO: 联赛下拉(旧用 leagueDropdown store / @/utils/dropdown，未移植)，先以空陣列佔位
const leagueOptions = ref<{ label: string; value: string }[]>([]);

// 活动时间 -> el-date-picker(datetime)
const eventTimeProxy = computed({
  get: () => newFormInline.value.eventTime || "",
  set: (val: string) => {
    newFormInline.value.eventTime = val
      ? dayjs(val).format("YYYY-MM-DD HH:mm:ss")
      : "";
  }
});

function addBonus() {
  newFormInline.value.bonusList.push({ amount: "", percent: "" });
}
function removeBonus(index: number) {
  if (newFormInline.value.bonusList.length > 1) {
    newFormInline.value.bonusList.splice(index, 1);
  }
}

// 广播图上传
async function handleUpload(file: File) {
  const form = new FormData();
  form.append("type", "game");
  form.append("file", file);
  const { success, data } = await uploadLotteryFile(form);
  if (success) {
    newFormInline.value.websocketImaage = data?.url ?? "";
    message($t("promotion.uploadSuccess"), { type: "success" });
  }
  return false; // 阻止 el-upload 默认上传
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
    :disabled="disabled"
    label-width="150px"
  >
    <el-form-item :label="$t('promotion.lotteryName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('promotion.lotteryNamePlaceholder')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryEventTime')" prop="eventTime">
      <el-date-picker
        v-model="eventTimeProxy"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        :placeholder="$t('promotion.lotteryEventTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryDuration')" prop="time">
      <el-select
        v-model="newFormInline.time"
        class="!w-[200px]"
        :placeholder="$t('promotion.lotteryDurationPlaceholder')"
      >
        <el-option
          v-for="item in durationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryAmountMax')">
      <el-input-number
        v-model="newFormInline.amountMax as number"
        :controls="false"
        :placeholder="$t('promotion.lotteryNoLimit')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryPeopleMax')">
      <el-input-number
        v-model="newFormInline.peopleMax as number"
        :controls="false"
        :placeholder="$t('promotion.lotteryNoLimit')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryVerifyType')" prop="verifyType">
      <el-checkbox-group v-model="newFormInline.verifyType">
        <div class="flex items-center mb-2">
          <el-checkbox :value="1" :label="$t('promotion.lotteryVerify1')" />
          <el-input
            v-model="newFormInline.verifyAmount"
            type="number"
            class="!w-[150px] ml-2"
          />
          <span class="ml-2 text-xs">{{ $t("promotion.lotteryVerify1Tip") }}</span>
        </div>
        <div class="flex items-center mb-2">
          <el-checkbox :value="2" :label="$t('promotion.lotteryVerify2')" />
          <el-input
            v-model="newFormInline.verifyAmount2"
            type="number"
            class="!w-[150px] ml-2"
          />
          <span class="ml-2 text-xs">{{ $t("promotion.lotteryVerify2Tip") }}</span>
        </div>
        <div class="flex items-center">
          <el-checkbox :value="3" :label="$t('promotion.lotteryVerify3')" />
          <el-select
            v-model="newFormInline.leagueID"
            multiple
            class="!w-[350px] ml-2"
            :placeholder="$t('promotion.lotterySelectLeague')"
          >
            <el-option
              v-for="item in leagueOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="ml-2 text-xs">{{ $t("promotion.lotteryVerify3Tip") }}</span>
        </div>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryWithdrawLimit')">
      <el-input
        v-model="newFormInline.withdrawLimit"
        type="number"
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryBonus')">
      <div
        v-for="(bonus, index) in newFormInline.bonusList"
        :key="index"
        class="flex items-center mb-2"
      >
        <span class="mr-2">{{ $t("promotion.lotteryBonusAmount") }}</span>
        <el-input v-model="bonus.amount" type="number" class="!w-[150px]" />
        <span class="mx-2">{{ $t("promotion.lotteryBonusPercent") }}</span>
        <el-input v-model="bonus.percent" type="number" class="!w-[100px]" />
        <span class="ml-1">%</span>
        <el-button
          v-if="index === newFormInline.bonusList.length - 1 && !disabled"
          class="ml-4"
          type="primary"
          plain
          @click="addBonus"
        >
          {{ $t("promotion.lotteryAddBonus") }}
        </el-button>
        <el-button
          v-if="newFormInline.bonusList.length > 1 && !disabled"
          type="danger"
          plain
          @click="removeBonus(index)"
        >
          {{ $t("promotion.lotteryRemoveBonus") }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryMatchLimit')">
      <el-checkbox
        v-model="newFormInline.matchScheduleTimesEnabled"
        :label="$t('promotion.lotteryMatchLimitTip1')"
      />
      <el-input
        v-model="newFormInline.matchScheduleTimes"
        type="number"
        class="!w-[100px] mx-2"
      />
      <span class="text-xs">{{ $t("promotion.lotteryMatchLimitTip2") }}</span>
    </el-form-item>

    <!-- TODO: 指定赛程选择(旧用 MatchModal + match API + worldCup store)，未移植，先保留 ID 直填 -->
    <el-form-item :label="$t('promotion.lotteryMatchSchedule')">
      <el-input
        v-model="newFormInline.matchScheduleId"
        type="number"
        class="!w-[200px]"
        :placeholder="$t('promotion.lotteryMatchScheduleId')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryShowType')">
      <el-radio-group v-model="newFormInline.websocketDeeplinkLink">
        <el-radio
          v-for="item in showTypeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryBroadcastContent')" prop="websocketTitle">
      <el-input
        v-model="newFormInline.websocketTitle"
        type="textarea"
        :rows="3"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.lotteryBroadcastImage')">
      <el-upload
        :show-file-list="false"
        accept="image/*"
        :before-upload="handleUpload"
        :disabled="disabled"
      >
        <el-button type="primary" :disabled="disabled">
          {{ $t("promotion.uploadButton") }}
        </el-button>
      </el-upload>
      <img
        v-if="newFormInline.websocketImaage"
        :src="`${imagPath}${newFormInline.websocketImaage}`"
        class="ml-4 max-h-[100px]"
      />
    </el-form-item>
  </el-form>
</template>
