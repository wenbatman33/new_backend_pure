import { transformI18n as $t } from "@/plugins/i18n";

/** 赛果类型 */
export const resultType = [
  { label: $t("activity.matchResultType1"), value: "0" },
  { label: $t("activity.matchResultType2"), value: "1" },
  { label: $t("activity.matchResultType3"), value: "2" },
  { label: $t("activity.matchResultType4"), value: "3" }
];

/** 赛事进度 */
export const matchType = [
  { label: $t("activity.matchType1"), value: 1 },
  { label: $t("activity.matchType2"), value: 2 },
  { label: $t("activity.matchType3"), value: 3 },
  { label: $t("activity.matchType4"), value: 4 },
  { label: $t("activity.matchType5"), value: 5 }
];

/** 分组 */
export const matchGroup = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "C", value: 3 },
  { label: "D", value: 4 },
  { label: "E", value: 5 },
  { label: "F", value: 6 },
  { label: "G", value: 7 },
  { label: "H", value: 8 },
  { label: "I", value: 21 },
  { label: "J", value: 22 },
  { label: "K", value: 23 },
  { label: "L", value: 24 },
  { label: $t("activity.matchGroup1"), value: 9 },
  { label: $t("activity.matchGroup2"), value: 10 },
  { label: $t("activity.matchGroup3"), value: 11 },
  { label: $t("activity.matchGroup4"), value: 12 },
  { label: $t("activity.matchGroup5"), value: 13 }
];

/** 联赛静态清单（後端 league_schedule 未回時的回退） */
export const leagueList = [
  { label: "2022_world_cup", value: 1 },
  { label: "NBA", value: 2 },
  { label: "英超", value: 3 },
  { label: "西甲", value: 4 },
  { label: "意甲", value: 5 },
  { label: "德甲", value: 6 },
  { label: "法甲", value: 7 },
  { label: "歐冠", value: 8 },
  { label: "中超", value: 9 },
  { label: "CBA", value: 10 },
  { label: "KBL", value: 11 },
  { label: "2023FIFA", value: 12 },
  { label: "2024UEFA", value: 13 },
  { label: "2025世俱杯", value: 14 },
  { label: "2026FIFA_WC", value: 15 }
];
