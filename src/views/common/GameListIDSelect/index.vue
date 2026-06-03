<template>
  <div class="game-list-id-select">
    <!-- 遊戲類型 -->
    <el-select
      v-model="selectedGameType"
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.gameType')"
      class="gls-select"
      style="width: 200px"
      filterable
    >
      <el-option
        v-for="item in gameTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 遊戲群組（單選，選後即加入並重置） -->
    <el-select
      :model-value="selectedGameGroup"
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.gameGroup')"
      class="gls-select"
      style="width: 200px"
      filterable
      @change="handleSelectGameGroup"
    >
      <el-option
        v-for="item in filteredGameGroupOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 遊戲列表（多選） -->
    <el-select
      :model-value="selectedGameList"
      multiple
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.gameList')"
      class="gls-select"
      style="width: 200px"
      filterable
      @change="handleSelectGameList"
    >
      <el-option
        v-for="item in filteredGameListOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 已選組合（多選，可移除） -->
    <el-select
      :model-value="selectedGameItems"
      multiple
      :disabled="mode !== 'Create'"
      :placeholder="$t('common.selected')"
      class="gls-select"
      style="width: 600px"
      filterable
      @change="handleGameItemSelect"
    >
      <el-option
        v-for="item in allGameListOptions"
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
import { arrayToOptions } from "@/utils/options";
import { getGameDropdownList } from "@/api/common";

defineOptions({ name: "GameListIDSelect" });

interface GameItemPayload {
  gameTypeID: number;
  gameGroupID: number;
  gameListID: number;
}

const props = withDefaults(
  defineProps<{
    mode?: string;
    originSelectedGameItems?: Array<GameItemPayload | string>;
  }>(),
  {
    mode: "Create",
    originSelectedGameItems: () => []
  }
);

const emit = defineEmits<{
  (e: "updateSelectedGameItems", items: GameItemPayload[]): void;
}>();

// 原始下拉資料（取代舊 gameDropdownStore）
const gameTypeName = ref<any[]>([]);
const gameGroup = ref<any[]>([]);
const gameList = ref<any[]>([]);

const allLabel = computed(() => $t("common.all"));

// 構建包含三層 children 的遊戲類型選項
const gameTypeOptionsWithChildren = computed(() => {
  const gameTypes = gameTypeName.value || [];
  const gameGroups = gameGroup.value || [];
  // status === 1 或 status === 3
  const gameLists =
    (gameList.value || []).filter(
      (list: any) => list.status === 1 || list.status === 3
    ) || [];
  return gameTypes.map((gameType: any) => ({
    value: gameType.value,
    label: gameType.label,
    children: gameGroups
      .filter((group: any) => group.gameTypeID === gameType.value)
      .map((group: any) => ({
        value: group.value,
        label: group.label,
        children: gameLists
          .filter((list: any) => list.gameGroup === group.value)
          .map((list: any) => ({
            value: list.value,
            label: list.label
          }))
      }))
  }));
});

// 遊戲類型選項（第一個 select）
const gameTypeOptions = computed(() =>
  gameTypeOptionsWithChildren.value.map((item: any) => ({
    label: item.label,
    value: item.value
  }))
);

// 所有可能的組合選項（最終多選框）
const allGameListOptions = computed(() => {
  if (gameTypeOptionsWithChildren.value.length === 0) return [];
  const options: any[] = [];
  gameTypeOptionsWithChildren.value.forEach((gameType: any) => {
    options.push({
      label: `${gameType.label}/${allLabel.value}`,
      value: `${gameType.value}-0-0`
    });
    (gameType.children || []).forEach((group: any) => {
      options.push({
        label: `${gameType.label}/${group.label}/${allLabel.value}`,
        value: `${gameType.value}-${group.value}-0`
      });
      (group.children || []).forEach((list: any) => {
        options.push({
          label: `${gameType.label}/${group.label}/${list.label}`,
          value: `${gameType.value}-${group.value}-${list.value}`
        });
      });
    });
  });
  return options;
});

const selectedGameType = ref<string>("");
const selectedGameGroup = ref<string | undefined>(undefined);
const selectedGameList = ref<string[]>([]);
// 遊戲類型/群組/列表的組合
const selectedGameItems = ref<string[]>([]);

const gameGroupOptions = ref<any[]>([]);
const gameListOptions = ref<any[]>([]);

// 過濾後的群組選項（排除已選擇的）
const filteredGameGroupOptions = computed(() => {
  return gameGroupOptions.value.reduce((acc: any[], currentItem: any) => {
    const rawCurrentValue = String(currentItem.value);
    const currentGroupID = rawCurrentValue.split("-");
    const gameTypeValue = currentGroupID[0];
    const gameGroupValue = currentGroupID[1];
    // 「全部」選項
    if (gameGroupValue === "0") {
      const allGameTypeValue = `${gameTypeValue}-0-0`;
      if (!selectedGameItems.value.includes(allGameTypeValue)) {
        acc.push(currentItem);
      }
      return acc;
    }
    const isGroupSelectedOrCovered = selectedGameItems.value.some(
      (selectedGame) => {
        const parts = selectedGame.split("-");
        // X-0-0 覆蓋所有 group
        if (
          parts[1] === "0" &&
          parts[2] === "0" &&
          String(parts[0]) === String(selectedGameType.value)
        ) {
          return true;
        }
        // X-Y-0 覆蓋該 group
        if (
          parts[2] === "0" &&
          String(parts[0]) === String(selectedGameType.value) &&
          String(parts[1]) === gameGroupValue
        ) {
          return true;
        }
        return false;
      }
    );
    if (!isGroupSelectedOrCovered) acc.push(currentItem);
    return acc;
  }, []);
});

// 過濾後的列表選項（排除已選擇/被覆蓋的）
const filteredGameListOptions = computed(() => {
  return gameListOptions.value.reduce((acc: any[], currentItem: any) => {
    const isSelectedOrCovered = selectedGameItems.value.some(
      (selectedGame) => {
        if (selectedGame === currentItem.value) return true;
        const selectedParts = selectedGame.split("-");
        const currentParts = String(currentItem.value).split("-");
        // X-0-0 覆蓋整個 gameType
        if (selectedParts[1] === "0" && selectedParts[2] === "0") {
          return selectedParts[0] === currentParts[0];
        }
        // X-Y-0 覆蓋整個 group
        if (selectedParts[2] === "0") {
          return (
            selectedParts[0] === currentParts[0] &&
            selectedParts[1] === currentParts[1]
          );
        }
        return false;
      }
    );
    if (!isSelectedOrCovered) acc.push(currentItem);
    return acc;
  }, []);
});

// 互斥清除：新增高層級選項時清掉被覆蓋的子項，反之清掉父項
const processCleanUp = (newItem: string, list: string[]) => {
  const parts = newItem.split("-");
  const type = parts[0];
  const group = parts[1];
  const listId = parts[2];
  return list.filter((item) => {
    if (item === newItem) return true;
    // 新增 type-0-0：清掉該 type 下所有子項
    if (group === "0" && listId === "0") {
      if (item.startsWith(`${type}-`)) return false;
    } else if (listId === "0") {
      // 新增 type-group-0：清掉 type-0-0 與該 group 下所有子項
      if (item === `${type}-0-0`) return false;
      if (item.startsWith(`${type}-${group}-`)) return false;
    } else {
      // 新增具體項：清掉祖父與父
      if (item === `${type}-0-0`) return false;
      if (item === `${type}-${group}-0`) return false;
    }
    return true;
  });
};

const emitSelectedGameItems = (items: string[]) => {
  const formatted = items.map((item) => {
    const parts = item.split("-");
    return {
      gameTypeID: Number(parts[0]),
      gameGroupID: Number(parts[1]),
      gameListID: Number(parts[2]) || 0
    };
  });
  emit("updateSelectedGameItems", formatted);
};

const handleSelectGameGroup = async (value: any) => {
  selectedGameGroup.value = value;
  if (value && String(value).length > 0) {
    const selectedGroupValue = String(value).split("-");
    const gameType = selectedGroupValue[0];
    const group = selectedGroupValue[1];
    if (!gameType) return;

    if (group === "0") {
      const allGameTypeValue = `${gameType}-0-0`;
      let newItems = [...selectedGameItems.value];
      if (!newItems.includes(allGameTypeValue)) {
        newItems.push(allGameTypeValue);
        newItems = processCleanUp(allGameTypeValue, newItems);
        selectedGameItems.value = newItems;
        emitSelectedGameItems(selectedGameItems.value);
      }
      await nextTick();
      selectedGameGroup.value = undefined;
      selectedGameList.value = [];
      gameListOptions.value = [];
    } else {
      const getGameType = gameTypeOptionsWithChildren.value.find(
        (item: any) => String(item.value) === String(selectedGameType.value)
      );
      const getGameGroup = getGameType?.children?.find(
        (child: any) => String(child.value) === String(group)
      );
      if (getGameGroup?.children) {
        gameListOptions.value = [
          { label: allLabel.value, value: `${gameType}-${group}-0` },
          ...getGameGroup.children.map((list: any) => ({
            label: list.label,
            value: `${gameType}-${group}-${list.value}`
          }))
        ];
      }
    }
  }
};

const handleSelectGameList = (values: any[]) => {
  selectedGameList.value = [];
  if (values.length > 0) {
    let newItems = [...selectedGameItems.value];
    let hasChange = false;
    values.forEach((val) => {
      if (!newItems.includes(val)) {
        newItems.push(val);
        newItems = processCleanUp(val, newItems);
        hasChange = true;
      }
    });
    if (hasChange) {
      selectedGameItems.value = newItems;
      emitSelectedGameItems(selectedGameItems.value);
    }
  }
};

const handleGameItemSelect = (value: string[]) => {
  const addedItems = value.filter((x) => !selectedGameItems.value.includes(x));
  let newItems = value;
  if (addedItems.length > 0) {
    addedItems.forEach((newItem) => {
      newItems = processCleanUp(newItem, newItems);
    });
  }
  selectedGameItems.value = newItems;
  emitSelectedGameItems(selectedGameItems.value);
};

const normalizeSelectedItems = (items: any[]) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "object" && item !== null) {
      return `${item.gameTypeID}-${item.gameGroupID}-${item.gameListID}`;
    }
    return String(item);
  });
};

watch(
  () => selectedGameType.value,
  () => {
    const gameType = gameTypeOptionsWithChildren.value.find(
      (item: any) => String(item.value) === String(selectedGameType.value)
    );
    if (gameType?.children) {
      gameGroupOptions.value = [
        { label: allLabel.value, value: `${selectedGameType.value}-0` },
        ...gameType.children.map((child: any) => ({
          label: `${child.label}`,
          value: `${selectedGameType.value}-${child.value}`
        }))
      ];
    }
    selectedGameGroup.value = undefined;
    gameListOptions.value = [];
    selectedGameList.value = [];
  }
);

watch(
  () => props.originSelectedGameItems,
  () => {
    selectedGameItems.value = normalizeSelectedItems(
      props.originSelectedGameItems
    );
  }
);

// 載入下拉資料（取代舊 store.fetchGameOptions）
const fetchGameOptions = async () => {
  const { success, data } = await getGameDropdownList();
  if (!success || !data) return;
  gameTypeName.value = arrayToOptions(data.gameType || [], "id", "name");
  gameGroup.value = arrayToOptions(data.gameGroup || [], "id", [
    "name",
    "displayName"
  ]);
  gameList.value = arrayToOptions(data.gameList || [], "id", "displayName");
};

onMounted(async () => {
  await fetchGameOptions();
  await nextTick(() => {
    selectedGameItems.value = normalizeSelectedItems(
      props.originSelectedGameItems
    );
  });
});

onUnmounted(() => {
  selectedGameItems.value = [];
  selectedGameType.value = "";
  selectedGameGroup.value = undefined;
  selectedGameList.value = [];
});
</script>

<style scoped>
.game-list-id-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
