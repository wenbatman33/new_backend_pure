<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getPromotionSportsList,
  addPromotionEventID,
  deletePromotionEventID
} from "@/api/promotion";
import type { EventItem } from "./utils/types";

const props = defineProps<{ record: EventItem }>();

const targetID = ref(props.record.id);
// 已設定的 eventID 標籤
const selectedTags = ref(
  (props.record.eventID ?? []).map(item => ({
    value: item.id,
    label: item.game_display_name + "/" + item.game_event_id
  }))
);

// TODO: 舊碼用 getGroups（@/api/game/gameLog）取得遊戲廠商下拉，game 域尚未移植，先以空陣列佔位
const groupOptions = ref<Array<{ label: string; value: string | number }>>([
  { label: $t("promotion.all"), value: "" }
]);

const sportsTypeOptions = [
  { label: $t("promotion.all"), value: "" },
  { label: $t("promotion.football"), value: "Soccer" },
  { label: $t("promotion.basketball"), value: "Basketball" }
];

const searchForm = reactive({
  eventStartTime: "",
  eventEndTime: "",
  gameGroupID: "",
  sportsName: ""
});

const loading = ref(false);
const dataList = ref<any[]>([]);

const columns: TableColumnList = [
  { label: "gameGroupID", prop: "gameGroupID", width: 100 },
  { label: $t("promotion.type"), prop: "sportsName", width: 100 },
  { label: $t("promotion.manufacturer"), prop: "gameGroup" },
  { label: "EventID", prop: "eventID" },
  { label: $t("promotion.gameTime"), prop: "eventTime", width: 160 },
  { label: $t("promotion.homeTeam"), prop: "homeTeam" },
  { label: $t("promotion.awayTeam"), prop: "awayTeam" },
  { label: $t("promotion.lastUpdate"), prop: "updatedAt", width: 160 },
  { label: $t("promotion.operate"), fixed: "right", width: 100, slot: "operation" }
];

async function onSearch() {
  loading.value = true;
  try {
    const { data } = await getPromotionSportsList({
      eventStartTime: searchForm.eventStartTime,
      eventEndTime: searchForm.eventEndTime,
      gameGroupID: searchForm.gameGroupID,
      sportsName: searchForm.sportsName
    });
    dataList.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

async function createEventID(row) {
  const { success, data } = await addPromotionEventID({
    gameEventID: row.eventID,
    gameGroupID: row.gameGroupID,
    id: targetID.value
  });
  if (success && data?.id) {
    message($t("promotion.addedEventIDSuccessfully"), { type: "success" });
    const groupName = groupOptions.value.find(
      g => g.value === row.gameGroupID
    )?.label;
    selectedTags.value.push({
      value: data.id,
      label: `${groupName ?? row.gameGroupID}-${row.eventID}`
    });
  }
}

async function cancelTag(tag) {
  const { success } = await deletePromotionEventID(tag.value);
  if (success) {
    message(`${$t("promotion.deleteEventID")}: ${tag.label}`, {
      type: "success"
    });
    selectedTags.value = selectedTags.value.filter(t => t.value !== tag.value);
  }
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-card class="mb-3" shadow="never">
      <template #header>
        <span>{{ $t("promotion.eventIDHasBeenSet") }}</span>
      </template>
      <div class="min-h-[60px]">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag.value"
          closable
          class="mr-2 mb-2"
          @close="cancelTag(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </el-card>

    <el-form :inline="true" :model="searchForm" class="mb-2">
      <el-form-item :label="$t('promotion.gameTime')">
        <el-date-picker
          v-model="searchForm.eventStartTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :placeholder="$t('promotion.eventStartTime')"
        />
        <span class="px-2">{{ $t("promotion.to") }}</span>
        <el-date-picker
          v-model="searchForm.eventEndTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :placeholder="$t('promotion.eventEndTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.gameManufacturers')">
        <el-select
          v-model="searchForm.gameGroupID"
          class="!w-[160px]"
          :placeholder="$t('promotion.gameManufacturers')"
        >
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.type')">
        <el-select v-model="searchForm.sportsName" class="!w-[160px]">
          <el-option
            v-for="item in sportsTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">
          {{ $t("promotion.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <pure-table
      align-whole="center"
      showOverflowTooltip
      table-layout="auto"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    >
      <template #operation="{ row }">
        <el-button link type="primary" @click="createEventID(row)">
          {{ $t("promotion.joinIn") }}
        </el-button>
      </template>
    </pure-table>
  </div>
</template>
