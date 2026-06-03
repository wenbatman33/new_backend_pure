import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 賽事直播假資料：欄位對齊 hook decorate 讀取（matchType/matchGroup/awayTeam/homeTeam/eventTime/link...）
const teams = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  team: `球队${String.fromCharCode(65 + i)}`
}));

const all = Array.from({ length: 14 }).map((_, i) => {
  const isLiveLabel = (i % 2) + 1; // 1 / 2
  const isLive = ((i + 1) % 2) + 1; // 交錯
  const linkCount = (i % 5) + 1;
  const link = Array.from({ length: linkCount }).map(
    (_, n) => `https://live.example.com/stream/${i + 1}/${n + 1}.m3u8`
  );
  return {
    id: i + 1,
    eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`,
    matchType: (i % 2) + 1,
    matchGroup: (i % 13) + 1,
    awayTeam: (i % 8) + 1,
    homeTeam: ((i + 3) % 8) + 1,
    isLiveLabel,
    isLive,
    link,
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 18:30:00`,
    worldCupScheduleId: i + 1
  };
});

export default defineFakeRoute([
  // 球隊列表（onMounted 取用以拼湊賽事名稱）
  {
    url: "/backend/world_cup/team",
    method: "get",
    response: () => ({ success: true, data: { list: teams, total: teams.length } })
  },
  // 直播列表
  {
    url: "/backend/world_cup/live/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.isLive && Number(query.isLive) !== 0) {
        list = list.filter(v => v.isLive === Number(query.isLive));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 單筆詳情
  {
    url: "/backend/world_cup/live",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.worldCupScheduleId);
      const found = all.find(v => v.id === id) ?? all[0];
      return { success: true, data: found };
    }
  },
  // 編輯
  {
    url: "/backend/world_cup/live",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除
  {
    url: "/backend/world_cup/live",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
