import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型
const gameTypes = [
  { key: 1, value: "电子" },
  { key: 2, value: "真人" },
  { key: 3, value: "体育" },
  { key: 4, value: "捕鱼" },
  { key: 5, value: "棋牌" }
];

const groupPool = ["PG", "PP", "JILI", "CQ9", "MG", "AG", "BBIN", "SA"];

// 代理商假資料
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: `Agency-${String(i + 1).padStart(2, "0")}`,
  gameTypeID: (i % gameTypes.length) + 1,
  gameGroups: [groupPool[i % groupPool.length], groupPool[(i + 1) % groupPool.length]],
  gameLists: [gameTypes[i % gameTypes.length].value],
  imageH5: `game/agency_h5_${(i % 4) + 1}.png`,
  imagePc: `game/agency_pc_${(i % 4) + 1}.png`,
  status: (i % 4) + 1
}));

export default defineFakeRoute([
  // 取得遊戲代理商 list
  {
    url: "/backend/game/gameagency/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.toLowerCase().includes(String(query.name).toLowerCase()));
      }
      if (query.gameTypeID) {
        list = list.filter(v => v.gameTypeID === Number(query.gameTypeID));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 取得遊戲類型（搜尋下拉）
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => {
      return { success: true, data: { list: gameTypes } };
    }
  },
  // 修改遊戲代理商
  {
    url: "/backend/game/gameagency",
    method: "put",
    response: ({ body }) => {
      return { success: true, data: { ...body } };
    }
  },
  // 上傳圖檔
  {
    url: "/file/file/upload/game",
    method: "post",
    response: () => {
      return {
        success: true,
        data: { url: `game/uploaded_${Date.now()}.png` }
      };
    }
  }
]);
