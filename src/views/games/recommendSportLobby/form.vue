<script setup lang="ts">
import { ref, watch } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";
import { getRecommendSportGameList } from "@/api/games";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    recommendedSort: "",
    gameGroupID: "",
    gameID: "",
    showStatus: ""
  }),
  gameGroupOptions: () => []
});

// 前台排序選項 1~999
const sortOptions = Array.from({ length: 999 }, (_, i) => ({
  label: String(i + 1),
  value: i + 1
}));

// 前台状态選項
const statusOptions = [
  { label: $t("games.statusHide"), value: 0 },
  { label: $t("games.statusShow"), value: 1 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 游戏名称選項，依厂商連動
const gameOptions = ref<Array<{ label: string; value: number | string }>>([]);

async function loadGameList(gameGroupID: number | string) {
  if (gameGroupID === "" || gameGroupID === undefined || gameGroupID === null) {
    gameOptions.value = [];
    return;
  }
  const { data } = await getRecommendSportGameList({ gameGroupID });
  gameOptions.value = (data?.list ?? []).map((item: any) => ({
    label: item.displayName,
    value: item.id
  }));
}

function handleGameGroupChange(val: number | string) {
  newFormInline.value.gameID = "";
  loadGameList(val);
}

// 編輯模式進來時，預載當前厂商對應的游戏清單
watch(
  () => props.formInline.gameGroupID,
  val => {
    if (val !== "" && val !== undefined && val !== null) {
      loadGameList(val);
    }
  },
  { immediate: true }
);

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
      <el-select
        v-model="newFormInline.recommendedSort"
        filterable
        clearable
        class="w-full"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('games.gameGroupName')" prop="gameGroupID">
      <el-select
        v-model="newFormInline.gameGroupID"
        filterable
        clearable
        class="w-full"
        @change="handleGameGroupChange"
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
        filterable
        clearable
        class="w-full"
      >
        <el-option
          v-for="item in gameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('games.frontStatus')" prop="showStatus">
      <el-select v-model="newFormInline.showStatus" clearable class="w-full">
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
