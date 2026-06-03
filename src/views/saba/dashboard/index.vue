<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { columnSets } from "./utils/hook";
import OverviewPanel from "./components/OverviewPanel.vue";
import BetOverviewPanel from "./components/BetOverviewPanel.vue";
import RankPanel from "./components/RankPanel.vue";

defineOptions({ name: "SabaDashboard" });

const activeTab = ref("1");
const sub1 = ref("1_1");
const sub2 = ref("2_2");

// tab1 子按鈕（站台維度 bysite）
const tab1Buttons = [
  { key: "1_1", label: $t("saba.tab1_1") },
  { key: "1_2", label: $t("saba.tab1_2") },
  { key: "1_3", label: $t("saba.tab1_3") },
  { key: "1_4", label: $t("saba.tab1_4") },
  { key: "1_5", label: $t("saba.tab1_5") },
  { key: "1_6", label: $t("saba.tab1_6") }
];
// tab2 子按鈕（彩池維度 bypool）
const tab2Buttons = [
  { key: "2_2", label: $t("saba.tab1_2") },
  { key: "2_3", label: $t("saba.tab1_3") },
  { key: "2_4", label: $t("saba.tab1_4") },
  { key: "2_5", label: $t("saba.tab1_5") },
  { key: "2_6", label: $t("saba.tab1_6") }
];
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <el-tabs v-model="activeTab" type="card">
        <!-- 站台維度 -->
        <el-tab-pane :label="$t('saba.tab1')" name="1">
          <div class="mb-3">
            <el-button
              v-for="b in tab1Buttons"
              :key="b.key"
              :type="sub1 === b.key ? 'primary' : 'default'"
              class="!ml-0 !mr-2"
              @click="sub1 = b.key"
            >
              {{ b.label }}
            </el-button>
          </div>

          <div v-show="sub1 === '1_1'">
            <OverviewPanel v-if="sub1 === '1_1'" />
          </div>
          <div v-show="sub1 === '1_2'">
            <BetOverviewPanel
              v-if="sub1 === '1_2'"
              overview-url="/game/bo/saba/recentlybetoverviewbysite"
              sport-url="/game/bo/saba/recentlybetsportsrankbysite"
              league-url="/game/bo/saba/recentlybetleaguerankbysite"
              team-url="/game/bo/saba/recentlybetteamrankbysite"
            />
          </div>
          <div v-show="sub1 === '1_3'">
            <RankPanel
              v-if="sub1 === '1_3'"
              url="/game/bo/saba/recentlysportsrankbysite"
              label-prop="SportName"
              :columns="columnSets.sportFull()"
              :chart-left-pad="110"
            />
          </div>
          <div v-show="sub1 === '1_4'">
            <RankPanel
              v-if="sub1 === '1_4'"
              url="/game/bo/saba/recentlyleaguerankbysite"
              label-prop="LeagueName"
              :columns="columnSets.leagueFull()"
              :chart-left-pad="200"
            />
          </div>
          <div v-show="sub1 === '1_5'">
            <RankPanel
              v-if="sub1 === '1_5'"
              url="/game/bo/saba/recentlyleaguebettyperankbysite"
              label-prop="LeagueName"
              :columns="columnSets.leagueBetType()"
              :chart-left-pad="200"
            />
          </div>
          <div v-show="sub1 === '1_6'">
            <RankPanel
              v-if="sub1 === '1_6'"
              url="/game/bo/saba/recentlymatchrankbysite"
              label-prop="LeagueName"
              :columns="columnSets.matchFull()"
              :chart-left-pad="200"
            />
          </div>
        </el-tab-pane>

        <!-- 彩池維度 -->
        <el-tab-pane :label="$t('saba.tab2')" name="2">
          <div class="mb-3">
            <el-button
              v-for="b in tab2Buttons"
              :key="b.key"
              :type="sub2 === b.key ? 'primary' : 'default'"
              class="!ml-0 !mr-2"
              @click="sub2 = b.key"
            >
              {{ b.label }}
            </el-button>
          </div>

          <div v-show="sub2 === '2_2'">
            <BetOverviewPanel
              v-if="sub2 === '2_2'"
              overview-url="/game/bo/saba/recentlybetoverviewbysite"
              sport-url="/game/bo/saba/recentlybetsportsrankbypool"
              league-url="/game/bo/saba/recentlybetleaguerankbypool"
              team-url="/game/bo/saba/recentlybetteamrankbypool"
            />
          </div>
          <div v-show="sub2 === '2_3'">
            <RankPanel
              v-if="sub2 === '2_3'"
              url="/game/bo/saba/recentlysportsrankbypool"
              label-prop="SportName"
              :columns="columnSets.poolSport()"
              :chart-left-pad="110"
            />
          </div>
          <div v-show="sub2 === '2_4'">
            <RankPanel
              v-if="sub2 === '2_4'"
              url="/game/bo/saba/recentlyleaguerankbypool"
              label-prop="LeagueName"
              :columns="columnSets.poolLeague()"
              :chart-left-pad="200"
            />
          </div>
          <div v-show="sub2 === '2_5'">
            <RankPanel
              v-if="sub2 === '2_5'"
              url="/game/bo/saba/recentlyleaguebettyperankbypool"
              label-prop="LeagueName"
              :columns="columnSets.poolLeagueBetType()"
              :chart-left-pad="200"
            />
          </div>
          <div v-show="sub2 === '2_6'">
            <RankPanel
              v-if="sub2 === '2_6'"
              url="/game/bo/saba/recentlymatchrankbypool"
              label-prop="LeagueName"
              :columns="columnSets.poolMatch()"
              :chart-left-pad="200"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
