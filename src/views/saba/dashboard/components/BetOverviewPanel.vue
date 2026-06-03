<script setup lang="ts">
import { ref, reactive, watch, onMounted, type Ref } from "vue";
import dayjs from "dayjs";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { http } from "@/utils/http";
import {
  getSortOptions,
  buildBarOption,
  columnSets,
  getSabaLanguage
} from "../utils/hook";
import type { RankRow } from "../utils/types";

/**
 * 近期投注概況（tab1_2 bysite / tab2_2 bypool）
 * 上方概況卡，下方 球類 / 聯賽 / 球隊 三區，各自有排序 + 圖表/列表切換
 */
const props = defineProps<{
  // bysite 或 bypool 一組 endpoint
  overviewUrl: string;
  sportUrl: string;
  leagueUrl: string;
  teamUrl: string;
}>();

const sortOptions = getSortOptions();
const language = getSabaLanguage();
const loading = ref(false);
const showType = ref(1);

const dateRange = ref<[Date, Date]>([
  dayjs().add(-14, "day").startOf("day").toDate(),
  dayjs().endOf("day").toDate()
]);

const overview = ref<RankRow>({});

// 三個區塊狀態
const blocks = reactive({
  sport: { sortBy: 1, data: [] as RankRow[], labelProp: "SportName" },
  league: { sortBy: 1, data: [] as RankRow[], labelProp: "LeagueName" },
  team: { sortBy: 1, data: [] as RankRow[], labelProp: "LeagueName" }
});

const columnsSport = columnSets.betSport();
const columnsLeague = columnSets.betLeague();
const columnsTeam = columnSets.betTeam();

const chartSportRef = ref<HTMLDivElement | null>(null);
const chartLeagueRef = ref<HTMLDivElement | null>(null);
const chartTeamRef = ref<HTMLDivElement | null>(null);
const { setOptions: setSport, resize: resizeSport } = useECharts(
  chartSportRef as Ref<HTMLDivElement>
);
const { setOptions: setLeague, resize: resizeLeague } = useECharts(
  chartLeagueRef as Ref<HTMLDivElement>
);
const { setOptions: setTeam, resize: resizeTeam } = useECharts(
  chartTeamRef as Ref<HTMLDivElement>
);

function baseParams() {
  return {
    start_date: dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
    end_date: dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
    language
  };
}

async function fetchOverview() {
  const { success, data } = await http.request<{
    success: boolean;
    data: { Data: RankRow[] };
  }>("get", props.overviewUrl, { params: baseParams() });
  if (success) overview.value = data?.Data?.[0] ?? {};
}

async function fetchBlock(
  key: "sport" | "league" | "team",
  url: string,
  setter: (o: any) => void,
  resize: () => void,
  leftPad: number
) {
  const blk = blocks[key];
  const { success, data } = await http.request<{
    success: boolean;
    data: { Data: RankRow[] };
  }>("get", url, {
    params: { ...baseParams(), sort_by: blk.sortBy }
  });
  if (success) {
    blk.data = data?.Data ?? [];
    if (showType.value === 1) {
      setter(
        buildBarOption(blk.data, blk.labelProp as keyof RankRow, blk.sortBy, leftPad)
      );
      resize();
    }
  }
}

async function reload() {
  if (!dateRange.value?.length) return;
  loading.value = true;
  try {
    await fetchOverview();
    await fetchBlock("sport", props.sportUrl, setSport, resizeSport, 110);
    await fetchBlock("league", props.leagueUrl, setLeague, resizeLeague, 200);
    await fetchBlock("team", props.teamUrl, setTeam, resizeTeam, 200);
  } finally {
    loading.value = false;
  }
}

watch(showType, () => {
  if (showType.value === 1) reload();
});

defineExpose({ reload });

onMounted(() => reload());
</script>

<template>
  <div v-loading="loading">
    <el-form :inline="true" class="mb-2">
      <el-form-item>
        <el-radio-group v-model="showType" :disabled="loading">
          <el-radio-button :value="1">{{ $t("saba.showType1") }}</el-radio-button>
          <el-radio-button :value="2">{{ $t("saba.showType2") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('saba.dateRange')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :disabled="loading"
          range-separator="~"
          :start-placeholder="$t('saba.startDate')"
          :end-placeholder="$t('saba.endDate')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="reload">
          {{ $t("saba.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 概況卡 -->
    <el-card class="mb-3" shadow="never">
      <template #header>{{ $t("saba.betOverview") }}</template>
      <div class="flex justify-around">
        <div class="flex flex-col items-center p-4">
          <div class="text-2xl font-bold">
            {{ commaDecimalFormat(overview.BetTurnOver) }}
          </div>
          <div class="text-gray-500">{{ $t("saba.overviewBetTurnOver") }}</div>
        </div>
        <div class="flex flex-col items-center p-4">
          <div class="text-2xl font-bold">
            {{ commaDecimalFormat(overview.BetWinloss) }}
          </div>
          <div class="text-gray-500">{{ $t("saba.overviewBetWinloss") }}</div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span>{{ $t("saba.blockSport") }}</span>
              <el-select
                v-model="blocks.sport.sortBy"
                class="!w-[150px]"
                :disabled="loading"
                @change="reload"
              >
                <el-option
                  v-for="o in sortOptions"
                  :key="o.value"
                  :label="o.label"
                  :value="o.value"
                />
              </el-select>
            </div>
          </template>
          <div v-show="showType === 1">
            <div
              ref="chartSportRef"
              :style="{ width: '100%', height: blocks.sport.data.length * 32 + 120 + 'px' }"
            />
          </div>
          <pure-table
            v-show="showType === 2"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :data="blocks.sport.data"
            :columns="columnsSport"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span>{{ $t("saba.blockTeam") }}</span>
              <el-select
                v-model="blocks.team.sortBy"
                class="!w-[150px]"
                :disabled="loading"
                @change="reload"
              >
                <el-option
                  v-for="o in sortOptions"
                  :key="o.value"
                  :label="o.label"
                  :value="o.value"
                />
              </el-select>
            </div>
          </template>
          <div v-show="showType === 1">
            <div
              ref="chartTeamRef"
              :style="{ width: '100%', height: blocks.team.data.length * 32 + 120 + 'px' }"
            />
          </div>
          <pure-table
            v-show="showType === 2"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :data="blocks.team.data"
            :columns="columnsTeam"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-3" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ $t("saba.blockLeague") }}</span>
          <el-select
            v-model="blocks.league.sortBy"
            class="!w-[150px]"
            :disabled="loading"
            @change="reload"
          >
            <el-option
              v-for="o in sortOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </div>
      </template>
      <div v-show="showType === 1">
        <div
          ref="chartLeagueRef"
          :style="{ width: '100%', height: blocks.league.data.length * 32 + 120 + 'px' }"
        />
      </div>
      <pure-table
        v-show="showType === 2"
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :data="blocks.league.data"
        :columns="columnsLeague"
      />
    </el-card>
  </div>
</template>
