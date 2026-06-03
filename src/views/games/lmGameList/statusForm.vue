<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { StatusFormProps } from "./utils/types";

const props = withDefaults(defineProps<StatusFormProps>(), {
  formInline: () => ({
    status: 0,
    isNewGame: 0,
    isHotGame: 0,
    isReturn: 0,
    isSlot: 0
  })
});

// 共用「維持不變 / 是 / 否」選項
const yesNoOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("games.yes"), value: 1 },
  { label: $t("games.no"), value: 2 }
];

const statusOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("games.open"), value: 1 },
  { label: $t("games.close"), value: 2 },
  { label: $t("games.maintain"), value: 3 },
  { label: $t("games.hide"), value: 4 }
];

const slotOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("games.participate"), value: 2 },
  { label: $t("games.noParticipate"), value: 1 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="160px">
    <el-form-item :label="$t('games.gameStatus')" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio-button
          v-for="item in statusOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('games.isNewGame')" prop="isNewGame">
      <el-radio-group v-model="newFormInline.isNewGame">
        <el-radio-button
          v-for="item in yesNoOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('games.isHotGame')" prop="isHotGame">
      <el-radio-group v-model="newFormInline.isHotGame">
        <el-radio-button
          v-for="item in yesNoOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('games.isReturn')" prop="isReturn">
      <el-radio-group v-model="newFormInline.isReturn">
        <el-radio-button
          v-for="item in yesNoOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('games.isSlot')" prop="isSlot">
      <el-radio-group v-model="newFormInline.isSlot">
        <el-radio-button
          v-for="item in slotOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
