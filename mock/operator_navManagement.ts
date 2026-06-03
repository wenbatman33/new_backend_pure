import { defineFakeRoute } from "vite-plugin-fake-server/client";

// lobbyType：1 遊戲分類 / 2 啟動遊戲 / 3 前往指定頁面
const langs = ["cn", "en"];
const notes = ["热门", "新游戏", "推荐", "活动专区", "体育"];

function makeNames(idx: number) {
  return langs.map(language => ({
    language,
    name: language === "cn" ? `导航${idx + 1}` : `Nav${idx + 1}`
  }));
}

const all = Array.from({ length: 14 }).map((_, i) => {
  const lobbyType = (i % 3) + 1;
  let content: string | number = "";
  if (lobbyType === 2) content = (i % 4) + 1; // 遊戲 id
  else if (lobbyType === 3) content = `https://example.com/page/${i + 1}`;
  else content = "slot";
  return {
    id: i + 1,
    sort: i + 1,
    lobbyType,
    name: makeNames(i),
    status: i % 2 === 0 ? 1 : 0,
    dynamic: i % 2 === 0 ? 1 : 2,
    icon: "",
    iconColor: "",
    iconColor2: "",
    content,
    note: notes[i % notes.length],
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01"
  };
});

// 遊戲下拉假資料（廠商 + 遊戲清單）
const gameGroup = [
  { id: 1, displayName: "PG电子", status: 1 },
  { id: 2, displayName: "PP电子", status: 1 },
  { id: 3, displayName: "停用厂商", status: 0 }
];
const gameList = [
  { id: 1, displayName: "麻将胡了", gameGroup: 1, status: 1 },
  { id: 2, displayName: "寻宝黄金城", gameGroup: 1, status: 1 },
  { id: 3, displayName: "大力神之金", gameGroup: 2, status: 1 },
  { id: 4, displayName: "甜蜜糖果", gameGroup: 2, status: 1 }
];

export default defineFakeRoute([
  {
    url: "/backend/navigation/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.lobbyType) {
        list = list.filter(v => v.lobbyType === Number(query.lobbyType));
      }
      if (query.status !== undefined && query.status !== "") {
        const want = query.status === "true" || query.status === true ? 1 : 0;
        list = list.filter(v => v.status === want);
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/game/dropdown/list",
    method: "get",
    response: () => ({ success: true, data: { gameGroup, gameList } })
  },
  {
    url: "/backend/navigation",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/navigation",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/navigation",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/navigation/sort",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/navigation/status",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
