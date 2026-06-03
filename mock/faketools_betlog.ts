import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲廠商分組（含遊戲清單），欄位名與 hook 讀取一致
const gameGroupList = [
  {
    Id: 0,
    name: "体育",
    gameGroupList: [
      { gameListId: 505, gameGroupId: 505, displayName: "新利体育" },
      { gameListId: 162, gameGroupId: 162, displayName: "IM体育" },
      { gameListId: 781, gameGroupId: 781, displayName: "皇冠体育" }
    ]
  },
  {
    Id: 1,
    name: "真人",
    gameGroupList: [
      { gameListId: 1, gameGroupId: 1, displayName: "AG娱乐城" },
      { gameListId: 782, gameGroupId: 782, displayName: "BG娱乐城" },
      { gameListId: 912, gameGroupId: 912, displayName: "CQ9娱乐城" }
    ]
  },
  {
    Id: 2,
    name: "彩票",
    gameGroupList: [
      { gameListId: 360, gameGroupId: 360, displayName: "双赢彩票" },
      { gameListId: 506, gameGroupId: 506, displayName: "KG快乐彩" }
    ]
  },
  {
    Id: 3,
    name: "老虎机",
    gameGroupList: [
      { gameListId: 417, gameGroupId: 417, displayName: "PG老虎机" },
      { gameListId: 517, gameGroupId: 517, displayName: "CQ9老虎机" }
    ]
  }
];

// 遊戲廠商與遊戲類型（分類）
const gameCategory = [
  { id: 0, name: "体育" },
  { id: 1, name: "真人" },
  { id: 2, name: "彩票" },
  { id: 3, name: "老虎机" }
];

const groupNames = ["新利体育", "AG娱乐城", "双赢彩票", "PG老虎机", "IM体育"];

// 產生流水列表假資料
function buildBetlogList(count = 15) {
  return Array.from({ length: count }).map((_, i) => ({
    betAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:0${i % 6}:00`,
    memberAccount: `member${i + 1}`,
    memberID: 100000 + i,
    gameGroupName: groupNames[i % groupNames.length],
    gameGroupID: gameGroupList[i % gameGroupList.length].gameGroupList[0].gameGroupId,
    betID: `BET${20260500 + i}`,
    turnover: 100000 + i * 5000,
    winAmount: (i % 2 === 0 ? 1 : -1) * (3000 + i * 500)
  }));
}

export default defineFakeRoute([
  // 取得遊戲廠商與遊戲類型
  {
    url: "/backend/game/gamegroup/getgamegroupcategorizedbygametype",
    method: "get",
    response: () => ({ success: true, data: { list: gameCategory } })
  },
  // 取得遊戲廠商分組（含遊戲清單）
  {
    url: "/fake/tools/game/gamegroup",
    method: "get",
    response: () => ({ success: true, data: { list: gameGroupList } })
  },
  // 新增流水
  {
    url: "/fake/tools/betlog/add",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 新增流水（檔案模式）
  {
    url: "/fake/tools/betlog/addforfile",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 搜尋流水
  {
    url: "/fake/tools/betlog/search",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildBetlogList(15), total: 15 }
    })
  },
  // 刪除流水
  {
    url: "/fake/tools/betlog/delete",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 重算會員基本報表（一般）
  {
    url: "/backend/report/tool/recalcreportmemberdailygame",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildBetlogList(12), total: 12 }
    })
  },
  // 重算會員基本報表（新利幣）
  {
    url: "/backend/report/tool/recalcreportmemberdailygamelm",
    method: "get",
    response: () => ({
      success: true,
      data: { list: buildBetlogList(12), total: 12 }
    })
  }
]);
