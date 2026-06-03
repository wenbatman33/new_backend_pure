import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 厂商（遊戲群組）假資料
const gameGroups = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  displayName: `体育厂商${i + 1}`
}));

// 每個厂商底下的游戏假資料
function gamesOfGroup(gameGroupID: number) {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: gameGroupID * 100 + i + 1,
    displayName: `厂商${gameGroupID}-游戏${i + 1}`
  }));
}

// 体育推荐列表假資料（12 筆）
const recommendList = Array.from({ length: 12 }).map((_, i) => {
  const gameGroupID = (i % 6) + 1;
  const gameID = gameGroupID * 100 + (i % 5) + 1;
  return {
    id: i + 1,
    recommendedSort: i + 1,
    gameGroupID,
    gameGroupDisplayName: `体育厂商${gameGroupID}`,
    gameID,
    displayName: `厂商${gameGroupID}-游戏${(i % 5) + 1}`,
    showStatus: i % 3 === 0 ? 0 : 1
  };
});

export default defineFakeRoute([
  // 推荐列表
  {
    url: "/backend/game/recommendsport",
    method: "get",
    response: () => ({
      success: true,
      data: { list: recommendList, total: recommendList.length }
    })
  },
  // 新增推荐
  {
    url: "/backend/game/recommendsport",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯推荐
  {
    url: "/backend/game/recommendsport",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除推荐
  {
    url: "/backend/game/recommendsport",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 厂商下拉
  {
    url: "/backend/game/gamegroup/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: gameGroups, total: gameGroups.length }
    })
  },
  // 游戏下拉（依厂商連動）
  {
    url: "/backend/game/gamelist/list",
    method: "get",
    response: ({ query }) => {
      const gameGroupID = Number(query.gameGroupID) || 1;
      const list = gamesOfGroup(gameGroupID);
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
