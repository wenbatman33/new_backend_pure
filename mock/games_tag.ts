import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型下拉（key/value 結構，與舊後端一致）
const gameTypes = [
  { key: "1", value: "电子游戏" },
  { key: "2", value: "真人娱乐" },
  { key: "3", value: "体育竞技" },
  { key: "4", value: "棋牌游戏" },
  { key: "5", value: "彩票游戏" }
];

// Tag 假資料
const tagNames = [
  "热门",
  "新上线",
  "推荐",
  "高赔率",
  "经典",
  "限时活动",
  "独家",
  "人气榜",
  "竞速",
  "捕鱼",
  "百家乐",
  "龙虎斗",
  "斗地主",
  "麻将",
  "德州扑克"
];

const allTags = tagNames.map((name, i) => ({
  id: i + 1,
  name,
  sort: i + 1,
  isLeftShow: i % 2 === 0,
  tagImg: `https://picsum.photos/seed/tagimg${i}/200/80`,
  tagIcon: `https://picsum.photos/seed/tagicon${i}/40/40`
}));

export default defineFakeRoute([
  // 取得遊戲類型
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({
      success: true,
      data: { list: gameTypes, total: gameTypes.length }
    })
  },
  // Tag 列表
  {
    url: "/backend/game/tag/list",
    method: "get",
    response: ({ query }) => {
      // 依 gameTypeID 模擬不同數量（這裡簡單回固定清單）
      void query;
      return {
        success: true,
        data: { list: allTags, total: allTags.length }
      };
    }
  },
  // 建立
  {
    url: "/backend/game/tag/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 修改
  {
    url: "/backend/game/tag/update",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除（舊端點以 query string ?id= 傳入）
  {
    url: "/backend/game/tag/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
