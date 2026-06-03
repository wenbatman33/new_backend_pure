import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型
const gameTypes = [
  { key: 1, value: "电子" },
  { key: 2, value: "捕鱼" },
  { key: 3, value: "真人" },
  { key: 4, value: "棋牌" },
  { key: 5, value: "体育" },
  { key: 6, value: "彩票" },
  { key: 7, value: "电竞" }
];

// 廠商（遊戲群組）
const gameGroups = Array.from({ length: 8 }).map((_, i) => ({
  key: i + 1,
  name: `Provider${i + 1}`,
  displayName: `厂商${i + 1}`,
  gameTypeID: (i % gameTypes.length) + 1
}));

// 標籤
const tags = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `标签${i + 1}`,
  gameTypeID: (i % gameTypes.length) + 1
}));

const gameNames = [
  "Fortune Tiger",
  "Sweet Bonanza",
  "Mahjong Ways",
  "Gates of Olympus",
  "Wild West Gold",
  "Lucky Neko",
  "Treasure Bowl",
  "Dragon Hatch",
  "Captain Bone",
  "Bikini Paradise",
  "Ganesha Gold",
  "Jungle Delight",
  "Mask Carnival",
  "Egypt's Book",
  "Wild Bandito"
];

const all = gameNames.map((name, i) => {
  const grp = gameGroups[i % gameGroups.length];
  return {
    id: i + 1,
    sort: (i + 1) * 10,
    gameGroupID: grp.key,
    gameGroupName: grp.name,
    gameGroupDisplayName: grp.displayName,
    gameTypeID: grp.gameTypeID,
    gameTypeName: gameTypes.find(t => t.key === grp.gameTypeID)?.value ?? "",
    name,
    displayName: `${name} 中文`,
    bettingCode: `BET${1000 + i}`,
    gameCodePc: `PC_${100 + i}`,
    gameCodeH5: `H5_${100 + i}`,
    sortNo: i,
    status: (i % 4) + 1,
    trialPlay: (i % 2) + 1,
    isReturn: (i % 2) + 1,
    isSlot: (i % 2) + 1,
    isHotGame: i % 3 === 0 ? 1 : 2,
    isNewGame: i % 4 === 0 ? 1 : 2,
    recommendedSort: i % 5 === 0 ? i % 20 : 0,
    imageH5: "",
    imagePc: "",
    screenShotH5: "",
    screenShotPc: "",
    recommendedImageH5: "",
    gameTags: i % 2 === 0 ? [tags[i % tags.length]] : [],
    createdAt: "2026-05-01 10:00:00",
    updatedAt: "2026-05-20 18:30:00"
  };
});

export default defineFakeRoute([
  {
    url: "/backend/game/gamelist/list",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      if (query.gameTypeID)
        list = list.filter(v => v.gameTypeID === Number(query.gameTypeID));
      if (query.gameGroupID)
        list = list.filter(v => v.gameGroupID === Number(query.gameGroupID));
      if (query.name)
        list = list.filter(v => v.name.toLowerCase().includes(String(query.name).toLowerCase()));
      if (query.displayName)
        list = list.filter(v => v.displayName.includes(query.displayName));
      if (query.status && Number(query.status) !== 0)
        list = list.filter(v => v.status === Number(query.status));
      if (query.id) list = list.filter(v => String(v.id) === String(query.id));
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 取得單筆遊戲
    url: "/backend/game/gamelist",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return { success: true, data: found };
    }
  },
  {
    // 新增遊戲
    url: "/backend/game/gamelist",
    method: "post",
    response: () => ({ success: true, data: { id: all.length + 1 } })
  },
  {
    // 修改遊戲
    url: "/backend/game/gamelist",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 遊戲類型
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypes } })
  },
  {
    // 廠商選項
    url: "/backend/game/gamegroup/all",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroups } })
  },
  {
    // 標籤列表
    url: "/backend/game/tag/list",
    method: "get",
    response: ({ query }) => {
      let list = [...tags];
      if (query.gameTypeID)
        list = list.filter(v => v.gameTypeID === Number(query.gameTypeID));
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 批次修改狀態
    url: "/backend/game/gamelist/batchupdate",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 圖片上傳
    url: "/file/file/upload/gamegroup",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "game/mock-uploaded.png" }
    })
  },
  {
    // 操作紀錄
    url: "/backend/game/log",
    method: "get",
    response: () => {
      const list = Array.from({ length: 6 }).map((_, i) => ({
        updatedAt: `2026-05-${String(i + 10).padStart(2, "0")} 12:00:00`,
        updatedUser: i % 2 === 0 ? "admin" : "operator01",
        action: i % 2 === 0 ? "修改" : "新增",
        content: `<div>变更内容 ${i + 1}</div>`
      }));
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
