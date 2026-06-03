import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型假資料
const gameTypes = [
  { id: 1, name: "电子" },
  { id: 2, name: "真人" },
  { id: 3, name: "体育" },
  { id: 4, name: "棋牌" },
  { id: 5, name: "彩票" }
];

// 代理假資料
const agencies = [
  "PG电子",
  "AG真人",
  "沙巴体育",
  "开元棋牌",
  "BBIN"
];

const all = Array.from({ length: 16 }).map((_, i) => {
  const gt = gameTypes[i % gameTypes.length];
  return {
    id: i + 1,
    name: `manufacturer_${i + 1}`,
    displayName: `厂商${i + 1}`,
    sort: (i + 1) * 10,
    gameAgencyName: agencies[i % agencies.length],
    gameAgencyID: (i % agencies.length) + 1,
    walletType: (i % 2) + 1,
    gameType: { id: gt.id, name: gt.name },
    platformFeeRatio: Number(((i % 10) / 100 + 0.05).toFixed(2)),
    status: (i % 4) + 1
  };
});

export default defineFakeRoute([
  // 廠商列表（平台費率）
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
      if (query.gameAgencyID) {
        list = list.filter(
          v => String(v.gameAgencyID) === String(query.gameAgencyID)
        );
      }
      if (query.walletType && Number(query.walletType) !== 0) {
        list = list.filter(v => v.walletType === Number(query.walletType));
      }
      if (query.gameTypeID) {
        list = list.filter(
          v => String(v.gameType.id) === String(query.gameTypeID)
        );
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 廠商詳細（取得最新平台費率、維護時間等）
  {
    url: "/backend/game/gamegroup",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return {
        success: true,
        data: {
          ...item,
          platformFeeRatio: item.platformFeeRatio,
          maintainTime: "",
          openGameListIDs: []
        }
      };
    }
  },
  // 代理下拉
  {
    url: "/backend/game/gameagency/all",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: agencies.map((name, i) => ({ key: i + 1, value: name }))
      }
    })
  },
  // 遊戲類型下拉
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: gameTypes.map(g => ({ key: g.id, value: g.name }))
      }
    })
  },
  // 更新平台費率
  {
    url: "/backend/game/gamegroup/updateplatformfeeratio",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
