<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    recommendedSort: "",
    gameGroupID: "",
    gameID: "",
    showStatus: 1,
    gameTypeID: ""
  }),
  gameGroupOptions: () => [],
  gameOptions: () => [],
  onGameGroupChange: () => {}
});

// 前台狀態選項：0 隱藏 / 1 顯示
const statusOptions = [
  { label: $t("games.statusHide"), value: 0 },
  { label: $t("games.statusShow"), value: 1 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 廠商切換時清空已選遊戲並向上連動載入遊戲清單
function handleGroupChange(val: string | number) {
  newFormInline.value.gameID = "";
  props.onGameGroupChange(val);
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
    label-width="100px"
  >
    <el-form-item :label="$t('games.recommendedSort')" prop="recommendedSort">
      <el-input v-model="newFormInline.recommendedSort" disabled class="!w-[260px]" />
    </el-form-item>

    <el-form-item :label="$t('games.gameGroupName')" prop="gameGroupID">
      <el-select
        v-model="newFormInline.gameGroupID"
        clearable
        class="!w-[260px]"
        :placeholder="$t('games.gameGroupName')"
        @change="handleGroupChange"
      >
        <el-option
          v-for="item in gameGroupOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('games.gameName')" prop="gameID">
      <el-select
        v-model="newFormInline.gameID"
        clearable
        filterable
        class="!w-[260px]"
        :placeholder="$t('games.gameName')"
      >
        <el-option
          v-for="item in gameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('games.frontShowStatus')" prop="showStatus">
      <el-select
        v-model="newFormInline.showStatus"
        class="!w-[260px]"
        :placeholder="$t('games.frontShowStatus')"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
