<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { BatchFormProps } from "./utils/types";

const props = withDefaults(defineProps<BatchFormProps>(), {
  formInline: () => ({
    status: 0,
    isNewGame: 0,
    isHotGame: 0,
    isReturn: 0,
    isSlot: 0
  })
});

const newFormInline = ref(props.formInline);

const statusOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("games.open"), value: 1 },
  { label: $t("games.close"), value: 2 },
  { label: $t("games.maintain"), value: 3 },
  { label: $t("games.hide"), value: 4 }
];
const yesNoOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("common.yes"), value: 1 },
  { label: $t("common.no"), value: 2 }
];
const slotOptions = [
  { label: $t("games.stayTheSame"), value: 0 },
  { label: $t("games.participate"), value: 2 },
  { label: $t("games.noParticipate"), value: 1 }
];
</script>

<template>
  <el-form :model="newFormInline" label-width="160px">
    <el-form-item :label="$t('games.gameStatus')">
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
    <el-form-item :label="$t('games.isNewGame')">
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
    <el-form-item :label="$t('games.isHotGame')">
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
    <el-form-item :label="$t('games.isReturn')">
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
    <el-form-item :label="$t('games.isSlot')">
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
