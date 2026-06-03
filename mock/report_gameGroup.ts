import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 游戏类型组报表 mock
// list endpoint 回传 { list:[{ gameTypeData, data:[厂商明细] }] }
// total endpoint 回传 { list:[{ ...合计, lastUpdatedAt }] }

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 游戏类型与其下厂商
const gameTypes = [
  { id: 1, name: "电子游戏", vendors: ["PG电子", "PP电子", "BNG电子", "JDB电子"] },
  { id: 2, name: "真人视讯", vendors: ["欧博真人", "DG真人", "WM真人"] },
  { id: 3, name: "体育投注", vendors: ["BTI体育", "沙巴体育"] },
  { id: 4, name: "棋牌游戏", vendors: ["开元棋牌", "AG棋牌", "VG棋牌"] },
  { id: 5, name: "彩票游戏", vendors: ["VR彩票", "VB彩票"] }
];

function buildVendorRow(typeId: number, vendorIndex: number, name: string) {
  const gameGroupID = typeId * 100 + vendorIndex + 1;
  return {
    gameGroupID,
    gameGroupName: name,
    gameTypeName: "", // 厂商明细列无 gameTypeName，前端据此显示连结
    betAmount: rand(-50000, 500000),
    kill: rand(0, 30),
    totalWinAmount: rand(-80000, 120000),
    betPeople: rand(10, 800),
    betCount: rand(50, 5000),
    eventBetAmount: rand(0, 60000)
  };
}

function buildList() {
  return gameTypes.map(t => {
    const children = t.vendors.map((v, i) => buildVendorRow(t.id, i, v));
    // 类型层为各厂商加总
    const sum = (key: string) =>
      children.reduce((acc, c) => acc + Number((c as any)[key] || 0), 0);
    const gameTypeData = {
      gameGroupID: t.id,
      gameTypeName: t.name,
      betAmount: sum("betAmount"),
      kill: sum("kill"),
      totalWinAmount: sum("totalWinAmount"),
      betPeople: sum("betPeople"),
      betCount: sum("betCount"),
      eventBetAmount: sum("eventBetAmount")
    };
    return { gameTypeData, data: children };
  });
}

function buildTotal(list: any[]) {
  const sum = (key: string) =>
    list.reduce((acc, item) => acc + Number(item.gameTypeData[key] || 0), 0);
  return {
    gameGroupName: "合计",
    betAmount: sum("betAmount"),
    kill: sum("kill"),
    totalWinAmount: sum("totalWinAmount"),
    betPeople: sum("betPeople"),
    betCount: sum("betCount"),
    eventBetAmount: sum("eventBetAmount"),
    lastUpdatedAt: "2026-06-03 09:30:00"
  };
}

export default defineFakeRoute([
  {
    url: "/backend/report/gamegroup/list",
    method: "get",
    response: () => {
      const list = buildList();
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/report/gamegroup/total",
    method: "get",
    response: () => {
      const list = buildList();
      return {
        success: true,
        data: { list: [buildTotal(list)], total: 1 }
      };
    }
  },
  {
    url: "/backend/report/gamegroup/refresh",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
