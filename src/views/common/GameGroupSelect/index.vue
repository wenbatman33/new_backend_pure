<template>
  <div class="game-group-select">
    <!-- 遊戲分類 -->
    <el-select
      v-model="selectedGameType"
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.gameType')"
      class="gg-select gg-select--type"
      clearable
    >
      <el-option
        v-for="item in gameTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 遊戲廠商(多選,選後併入已選清單) -->
    <el-select
      :model-value="selectedGameGroup"
      multiple
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.gameProvider')"
      class="gg-select gg-select--group"
      @change="handleSelectGameGroup"
    >
      <el-option
        v-for="item in filteredGameProviderOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 已選的「分類/廠商」組合 -->
    <el-select
      v-model="selectedGameItems"
      multiple
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.selectedGameItems')"
      class="gg-select gg-select--items"
      @change="handleGameItemSelect"
    >
      <el-option
        v-for="item in allGameGroupOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "GameGroupSelect" });

interface GameTypeChild {
  label: string;
  value: string | number;
}
interface GameTypeNode {
  label: string;
  value: string | number;
  children: GameTypeChild[];
}

const props = withDefaults(
  defineProps<{
    gameTypeOptions: GameTypeNode[];
    mode?: string;
    originSelectedGameItems?: string[];
  }>(),
  {
    mode: "Create",
    originSelectedGameItems: () => []
  }
);

const emit = defineEmits<{
  (e: "updateSelectedGameItems", value: string[]): void;
}>();

// 所有「分類/廠商」組合(攤平 tree)
const allGameGroupOptions = computed(() => {
  return (props.gameTypeOptions || []).flatMap(item => {
    return (item.children || []).map(child => {
      return {
        label: `${item.label}/${child.label}`,
        value: `${item.value}-${child.value}`
      };
    });
  });
});

const selectedGameType = ref<string | number>("");
const selectedGameGroup = ref<string[]>([]);
// 遊戲分類跟遊戲廠商的組合
const selectedGameItems = ref<string[]>([]);

// 當前分類下的遊戲廠商
const gameProviderOptions = ref<{ label: string; value: string }[]>([]);

// 過濾掉已選過的廠商
const filteredGameProviderOptions = computed(() => {
  if (selectedGameItems.value.length === 0) {
    return gameProviderOptions.value;
  }
  return gameProviderOptions.value.filter(
    currentItem =>
      !selectedGameItems.value.find(
        selectedGame => selectedGame === currentItem.value
      )
  );
});

const handleSelectGameGroup = (value: string[]) => {
  selectedGameGroup.value = [];
  if (value.length) {
    selectedGameItems.value.push(value[0]);
    emit("updateSelectedGameItems", selectedGameItems.value);
  }
};

const handleGameItemSelect = (value: string[]) => {
  selectedGameItems.value = value;
  emit("updateSelectedGameItems", selectedGameItems.value);
};

watch(
  () => selectedGameType.value,
  () => {
    const node = (props.gameTypeOptions || []).find(
      item => item.value === selectedGameType.value
    );
    gameProviderOptions.value = node
      ? node.children.map(child => ({
          label: `${child.label}`,
          value: `${selectedGameType.value}-${child.value}`
        }))
      : [];
  }
);

watch(
  () => props.originSelectedGameItems,
  () => {
    selectedGameItems.value = props.originSelectedGameItems || [];
  }
);

onMounted(async () => {
  await nextTick(() => {
    selectedGameItems.value = props.originSelectedGameItems || [];
  });
});

onUnmounted(() => {
  selectedGameItems.value = [];
  selectedGameType.value = "";
  selectedGameGroup.value = [];
});
</script>

<style scoped>
.game-group-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.gg-select--type {
  width: 200px;
}
.gg-select--group {
  width: 200px;
}
.gg-select--items {
  width: 400px;
}
</style>
