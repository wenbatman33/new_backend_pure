<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  mode: "Create",
  isReportDateTypeWeek: false,
  formInline: () => ({
    id: undefined,
    groupName: "",
    type: 1,
    rank1MinProfit: "",
    rank1ActiveMemberCount: "",
    rank1CommissionPercent: "",
    rank2MinProfit: "",
    rank2ActiveMemberCount: "",
    rank2CommissionPercent: "",
    rank3MinProfit: "",
    rank3ActiveMemberCount: "",
    rank3CommissionPercent: "",
    rank4MinProfit: "",
    rank4ActiveMemberCount: "",
    rank4CommissionPercent: "",
    rank5MinProfit: "",
    rank5ActiveMemberCount: "",
    rank5CommissionPercent: "",
    rank6MinProfit: "",
    rank6ActiveMemberCount: "",
    rank6CommissionPercent: "",
    rank7MinProfit: "",
    rank7ActiveMemberCount: "",
    rank7CommissionPercent: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 7 阶设定：title 为表头字母与颜色
const ranks = [
  { idx: 1, label: "S", color: "#ce2a2a" },
  { idx: 2, label: "A", color: "#ff8219" },
  { idx: 3, label: "B", color: "#fb0" },
  { idx: 4, label: "C", color: "#a22db9" },
  { idx: 5, label: "D", color: "#6e3fe7" },
  { idx: 6, label: "E", color: "#2577e0" },
  { idx: 7, label: "F", color: "#00b1a3" }
];

// type===2 不分层，只显示 S（第一阶）；type===1 显示全部
const visibleRanks = computed(() =>
  newFormInline.value.type === 1 ? ranks : ranks.slice(0, 1)
);

// 净利栏位标题随国别切换文案
const profitLabel = computed(() =>
  props.isReportDateTypeWeek
    ? $t("agency.agencyGroupNetProfitMonth")
    : $t("agency.agencyGroupNetProfitWeek")
);

function setType(t: number) {
  newFormInline.value.type = t;
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
    label-width="120px"
  >
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item :label="$t('agency.agencyGroupId')" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('agency.agencyGroupName')" prop="groupName">
          <el-input
            v-model="newFormInline.groupName"
            clearable
            :placeholder="$t('agency.agencyGroupNameTip')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('agency.agencyGroupType')">
          <el-radio-group
            :model-value="newFormInline.type"
            @update:model-value="setType"
          >
            <el-radio-button :value="2">
              {{ $t("agency.agencyGroupTypeNone") }}
            </el-radio-button>
            <el-radio-button :value="1">
              {{ $t("agency.agencyGroupTypeRank") }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 表头：分层字母 -->
    <el-row :gutter="10" class="rank-header">
      <el-col :span="3" />
      <el-col
        v-for="r in visibleRanks"
        :key="r.idx"
        :span="newFormInline.type === 1 ? 3 : 21"
      >
        <b :style="{ color: r.color }">
          {{ newFormInline.type === 1 ? r.label : "S~F" }}
        </b>
      </el-col>
    </el-row>

    <!-- 净利列 -->
    <el-row :gutter="10">
      <el-col :span="3">
        <p class="row-title">{{ profitLabel }}</p>
      </el-col>
      <el-col
        v-for="r in visibleRanks"
        :key="`profit-${r.idx}`"
        :span="newFormInline.type === 1 ? 3 : 21"
      >
        <el-form-item label-width="0" :prop="`rank${r.idx}MinProfit`">
          <el-input
            v-model="newFormInline[`rank${r.idx}MinProfit`]"
            type="number"
            :min="0"
            :max="9999999"
          >
            <template #append>{{ $t("agency.agencyGroupUnitMoney") }}</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 活跃会员数列 -->
    <el-row :gutter="10">
      <el-col :span="3">
        <p class="row-title">{{ $t("agency.agencyGroupActiveMember") }}</p>
      </el-col>
      <el-col
        v-for="r in visibleRanks"
        :key="`count-${r.idx}`"
        :span="newFormInline.type === 1 ? 3 : 21"
      >
        <el-form-item label-width="0" :prop="`rank${r.idx}ActiveMemberCount`">
          <el-input
            v-model="newFormInline[`rank${r.idx}ActiveMemberCount`]"
            type="number"
            :min="0"
            :max="999"
          >
            <template #append>{{ $t("agency.agencyGroupUnitPeople") }}</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 佣金百分比列 -->
    <el-row :gutter="10">
      <el-col :span="3">
        <p class="row-title">{{ $t("agency.agencyGroupCommission") }}</p>
      </el-col>
      <el-col
        v-for="r in visibleRanks"
        :key="`percent-${r.idx}`"
        :span="newFormInline.type === 1 ? 3 : 21"
      >
        <el-form-item label-width="0" :prop="`rank${r.idx}CommissionPercent`">
          <el-input
            v-model="newFormInline[`rank${r.idx}CommissionPercent`]"
            type="number"
            :min="0"
            :max="100"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped lang="scss">
.rank-header {
  margin-bottom: 8px;
  text-align: center;
}
.row-title {
  margin: 0;
  line-height: 32px;
}
</style>
