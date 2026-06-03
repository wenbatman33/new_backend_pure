<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { hoursOption } from "@/utils/options";
import { getGameGroupByGameType } from "@/api/independentEvent";
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormProps } from "./utils/types";

const props = withDefaults(
  defineProps<FormProps & { disabled?: boolean }>(),
  {
    formInline: () => ({
      id: undefined,
      name: "",
      promotionCode: "",
      startDate: "",
      endDate: "",
      startTime: "",
      roundTime: "",
      roundTotal: "",
      eventTurnover: "",
      game: [],
      withdrawLimit: "",
      memberMax: "",
      bonus: [{ amount: "", num: "" }],
      bonusLessNum: "",
      bonusLessAmount: ""
    }),
    disabled: false
  }
);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 時間（時）選項：00:00 ~ 23:00
const hourOptions = hoursOption().map(item => ({
  value: item.value,
  label: `${item.label}:00`
}));

// 日期區間（v-model 為 [start, end]）
const dateRange = ref<[string, string]>([
  newFormInline.value.startDate || "",
  newFormInline.value.endDate || ""
]);
function onDateChange(val: [string, string] | null) {
  newFormInline.value.startDate = val?.[0] ?? "";
  newFormInline.value.endDate = val?.[1] ?? "";
}

// 適用遊戲 cascader 選項
const gameOptions = ref<any[]>([]);
// 已選遊戲（以 gameTypeID-gameGroupID 字串表示）
const selectedGames = ref<string[]>(
  (newFormInline.value.game ?? []).map(
    g => `${g.gameTypeID}-${g.gameGroupID}`
  )
);
const cascaderValue = ref<(number | string)[]>([]);

function syncGameToForm() {
  newFormInline.value.game = selectedGames.value.map(item => {
    const [gameTypeID, gameGroupID] = item.split("-");
    return { gameTypeID, gameGroupID };
  });
}
function onCascaderChange(val: (number | string)[]) {
  if (!val || val.length < 2) return;
  const key = `${val[0]}-${val[1]}`;
  if (!selectedGames.value.includes(key)) {
    selectedGames.value.push(key);
    syncGameToForm();
  }
  cascaderValue.value = [];
}
function removeGame(key: string) {
  selectedGames.value = selectedGames.value.filter(item => item !== key);
  syncGameToForm();
}
function gameLabel(key: string) {
  const [typeId, groupId] = key.split("-");
  const type = gameOptions.value.find(o => String(o.value) === typeId);
  const group = type?.children?.find((c: any) => String(c.value) === groupId);
  return `${type?.label ?? typeId}/${group?.label ?? groupId}`;
}

// 加碼獎勵動態清單
function addBonus() {
  newFormInline.value.bonus.push({ amount: "", num: "" });
}
function deleteBonus(index: number) {
  newFormInline.value.bonus.splice(index, 1);
  if (newFormInline.value.bonus.length === 0) {
    newFormInline.value.bonus = [{ amount: "", num: "" }];
  }
}

onMounted(async () => {
  const { data } = await getGameGroupByGameType();
  gameOptions.value = (data?.list ?? []).map((item: any) => ({
    value: item.id,
    label: item.name,
    children: (item.gameGroupList ?? [])
      .filter((sub: any) => [1, 3, 4].includes(sub.status))
      .map((sub: any) => ({
        value: sub.id,
        label: sub.name || sub.displayName
      }))
  }));
});

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
    label-width="140px"
  >
    <el-row :gutter="12">
      <el-col :span="16">
        <el-form-item :label="$t('independentEvent.lotteryeggName')" prop="name">
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('independentEvent.lotteryeggPromotionCode')"
          prop="promotionCode"
        >
          <el-input v-model="newFormInline.promotionCode" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('independentEvent.lotteryeggDateRange')">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="YYYY-MM-DD"
        :start-placeholder="$t('independentEvent.lotteryeggStartDate')"
        :end-placeholder="$t('independentEvent.lotteryeggEndDate')"
        @change="onDateChange"
      />
    </el-form-item>

    <el-row :gutter="12">
      <el-col :span="8">
        <el-form-item
          :label="$t('independentEvent.lotteryeggStartTime')"
          prop="startTime"
        >
          <el-select v-model="newFormInline.startTime" filterable class="!w-full">
            <el-option
              v-for="item in hourOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('independentEvent.lotteryeggRoundTimeLabel')">
      <div class="flex items-center gap-2">
        <el-input
          v-model="newFormInline.roundTime"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggPlaceholder')"
          class="!w-[160px]"
        />
        <span>{{ $t("independentEvent.lotteryeggRoundTime1") }}</span>
        <el-input
          v-model="newFormInline.roundTotal"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggRoundTime3')"
          class="!w-[160px]"
        />
        <span>{{ $t("independentEvent.lotteryeggRoundTime2") }}</span>
      </div>
    </el-form-item>

    <el-form-item
      :label="$t('independentEvent.lotteryeggEventTurnover')"
      prop="eventTurnover"
    >
      <div class="flex items-center gap-2">
        <span>{{ $t("independentEvent.lotteryeggEventTurnover1") }}</span>
        <el-input
          v-model="newFormInline.eventTurnover"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggEventTurnover3')"
          class="!w-[160px]"
        />
        <span>{{ $t("independentEvent.lotteryeggEventTurnover2") }}</span>
      </div>
    </el-form-item>

    <el-form-item :label="$t('independentEvent.lotteryeggGame')">
      <div class="w-full">
        <el-cascader
          v-model="cascaderValue"
          :options="gameOptions"
          :placeholder="$t('independentEvent.pleaseChoose')"
          class="!w-[260px]"
          @change="onCascaderChange"
        />
        <div class="flex flex-wrap gap-2 mt-2">
          <el-tag
            v-for="key in selectedGames"
            :key="key"
            :closable="!disabled"
            @close="removeGame(key)"
          >
            {{ gameLabel(key) }}
          </el-tag>
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="$t('independentEvent.lotteryeggWithdrawLimit')">
      <div class="w-full">
        <div class="flex items-center gap-2">
          <span>{{ $t("independentEvent.lotteryeggWithdrawLimit2") }}</span>
          <el-input
            v-model="newFormInline.withdrawLimit"
            type="number"
            class="!w-[150px]"
          />
        </div>
        <div
          v-for="(bonus, index) in newFormInline.bonus"
          :key="index"
          class="flex items-center gap-2 mt-2"
        >
          <el-button
            v-if="!disabled"
            link
            type="danger"
            :icon="Delete"
            @click="deleteBonus(index)"
          />
          <span>{{ $t("independentEvent.lotteryeggBonusAmount") }}</span>
          <el-input v-model="bonus.amount" type="number" class="!w-[150px]" />
          <span>{{ $t("independentEvent.lotteryeggBonusNum") }}</span>
          <el-input v-model="bonus.num" type="number" class="!w-[80px]" />
          <el-button
            v-if="index + 1 === newFormInline.bonus.length && !disabled"
            :icon="Plus"
            round
            @click="addBonus"
          >
            {{ $t("independentEvent.lotteryeggBonusAdd") }}
          </el-button>
        </div>
      </div>
    </el-form-item>

    <el-form-item
      :label="$t('independentEvent.lotteryeggMemberMax')"
      prop="memberMax"
    >
      <div class="flex items-center gap-2">
        <el-input
          v-model="newFormInline.memberMax"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggPlaceholder')"
          class="!w-[210px]"
        />
        <span>{{ $t("independentEvent.lotteryeggEventTurnover4") }}</span>
      </div>
    </el-form-item>

    <el-form-item :label="$t('independentEvent.lotteryeggBonusLessNum')">
      <div class="flex items-center gap-2">
        <el-input
          v-model="newFormInline.bonusLessNum"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggPlaceholder')"
          class="!w-[150px]"
        />
        <span>{{ $t("independentEvent.lotteryeggBonusLess") }}</span>
        <el-input
          v-model="newFormInline.bonusLessAmount"
          type="number"
          :placeholder="$t('independentEvent.lotteryeggPlaceholder')"
          class="!w-[150px]"
        />
        <span>{{ $t("independentEvent.lotteryeggBonusLess1") }}</span>
      </div>
    </el-form-item>
  </el-form>
</template>
