import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型
const gameTypes = [
  { key: 1, value: "电子" },
  { key: 2, value: "真人" },
  { key: 3, value: "体育" },
  { key: 4, value: "棋牌" },
  { key: 5, value: "彩票" }
];

// 廠商列表假資料 15 筆
const all = Array.from({ length: 15 }).map((_, i) => {
  const gt = gameTypes[i % gameTypes.length];
  return {
    id: i + 1,
    name: `Provider${i + 1}`,
    displayName: `厂商${i + 1}`,
    sort: (i + 1) * 10,
    gameAgencyName: `代理商${(i % 3) + 1}`,
    walletType: (i % 2) + 1,
    gameType: { id: gt.key, name: gt.value },
    openWayPc: (i % 5) + 1,
    openWayH5: (i % 5) + 1,
    platformFeeRatio: (i % 5) + 1,
    bettingFrom: (i % 2) + 1,
    imageH5: "",
    imagePc: "",
    logoImage: "",
    logoImage2: "",
    imgRecommend1: "",
    status: [1, 2, 3, 4, 99][i % 5],
    ishow: (i % 2) + 1
  };
});

export default defineFakeRoute([
  // 廠商列表
  {
    url: "/backend/game/gamegroup/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.displayName) {
        list = list.filter(v => v.displayName.includes(query.displayName));
      }
      if (query.walletType) {
        list = list.filter(v => v.walletType === Number(query.walletType));
      }
      if (query.gameTypeID) {
        list = list.filter(v => v.gameType.id === Number(query.gameTypeID));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 單筆廠商細節
  {
    url: "/backend/game/gamegroup",
    method: "get",
    response: ({ query }) => {
      const row = all.find(v => v.id === Number(query.id)) ?? all[0];
      return {
        success: true,
        data: {
          ...row,
          platformFeeRatio: row.platformFeeRatio,
          maintainTime: "",
          gameListIDTurnover: "",
          gameResultType: 1,
          showDetailLinkButton: 0,
          openGameListIDs: []
        }
      };
    }
  },
  // 修改廠商
  {
    url: "/backend/game/gamegroup",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 代理商選單
  {
    url: "/backend/game/gameagency/all",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { key: 1, value: "代理商1" },
          { key: 2, value: "代理商2" },
          { key: 3, value: "代理商3" }
        ]
      }
    })
  },
  // 遊戲類型選單
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypes } })
  },
  // 賽事推薦設定（讀）
  {
    url: "/backend/config/sporteventrecommendgroupid",
    method: "get",
    response: () => ({
      success: true,
      data: {
        recommendGroupId: "100",
        luckysportGroupId: "200",
        isVirtual: 1,
        countRecord: 10,
        countDay: 7,
        rankingGameGroupList: [1, 2]
      }
    })
  },
  // 賽事推薦設定（寫）
  {
    url: "/backend/config/sporteventrecommendgroupid",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 操作紀錄
  {
    url: "/backend/game/log",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:00:00`,
          updatedUser: i % 2 === 0 ? "admin" : "operator01",
          action: "编辑",
          content: `修改字段 sort: ${i} → ${i + 1}`
        })),
        total: 8
      }
    })
  },
  // 圖片上傳
  {
    url: "/file/file/upload/gamegroup",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "uploads/mock-image.png" }
    })
  }
]);
