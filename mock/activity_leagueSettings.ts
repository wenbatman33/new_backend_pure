import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 聯賽設定假資料：name 賽事名稱 / league 聯賽 ID / isActive 1啟用 2停用
const leagues = [
  "英超",
  "西甲",
  "意甲",
  "德甲",
  "法甲",
  "2024UEFA",
  "2025世俱杯",
  "歐冠",
  "亞冠",
  "中超",
  "日職",
  "K聯賽"
];

const all = Array.from({ length: 16 }).map((_, i) => {
  const month = String((i % 12) + 1).padStart(2, "0");
  return {
    id: i + 1,
    name: `${leagues[i % leagues.length]}-${2024 + (i % 2)}`,
    league: 3 + i,
    startTime: `2026-${month}-01 00:00:00`,
    endTime: `2026-${month}-28 23:59:59`,
    isActive: i % 4 === 0 ? 2 : 1
  };
});

export default defineFakeRoute([
  {
    url: "/backend/league_schedule/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.league) {
        list = list.filter(v => String(v.league) === String(query.league));
      }
      if (query.year) {
        list = list.filter(
          v => v.startTime.includes(query.year) || v.endTime.includes(query.year)
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/league_schedule",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/league_schedule",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
