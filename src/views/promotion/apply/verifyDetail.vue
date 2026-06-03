<script setup lang="ts">
import { computed } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "PromotionApplyVerifyDetail" });

const props = defineProps<{
  condRange: any[];
  condTypeMap: Record<string, string>;
}>();

// 優惠條件類型標題（沿用舊碼，排除 type 4）
function getTitle(type: number) {
  const map: Record<number, string> = {
    1: $t("promotion.depositCond"),
    2: $t("promotion.validTurnoverCond"),
    3: $t("promotion.betAmountCond"),
    5: $t("promotion.negativeCond"),
    6: $t("promotion.positiveCond"),
    7: $t("promotion.withdrawalCond")
  };
  return map[type] ?? "";
}

const visibleList = computed(() =>
  (props.condRange ?? []).filter(li => li.promotionCondType !== 4)
);
</script>

<template>
  <div>
    <el-empty
      v-if="visibleList.length === 0"
      :description="$t('promotion.noData')"
    />
    <el-descriptions
      v-for="(li, idx) in visibleList"
      :key="idx"
      :title="getTitle(li.promotionCondType)"
      :column="2"
      border
      class="mb-4"
    >
      <el-descriptions-item :label="$t('promotion.justRule')">
        {{ li.rangeMin }}-{{ li.rangeMax || $t("promotion.noLimit") }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('promotion.generateAmount')">
        {{ li.amount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('promotion.refIds')" :span="2">
        {{ (li.refIds || []).join(", ") }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
