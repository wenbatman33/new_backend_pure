import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 新币游戏类型与厂商报表 mock
// 游戏类型（父节点）；每个类型下挂厂商（子节点）
const gameTypes = [
  { id: "G1", name: "电子" },
  { id: "G2", name: "捕鱼" },
  { id: "G3", name: "棋牌" },
  { id: "G4", name: "真人" }
];
const vendors = ["PG", "PP", "JILI", "CQ9", "MG"];

const rand = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// 构造一笔厂商资料
function buildVendor(typeId: string, vIdx: number) {
  const betAmount = rand(10000, 500000);
  const totalWinAmount = rand(-50000, 80000);
  return {
    gameGroupID: `${typeId}_${vIdx}`,
    gameGroupName: vendors[vIdx],
    betAmount,
    kill: rand(-10, 35),
    totalWinAmount,
    betPeople: Math.floor(rand(5, 800)),
    betCount: Math.floor(rand(50, 20000)),
    eventBetAmount: rand(0, 120000)
  };
}

// 列表：[{ gameTypeData, data:[厂商...] }]
function buildReportList() {
  return gameTypes.map(gt => {
    const data = vendors.map((_, vIdx) => buildVendor(gt.id, vIdx));
    // 类型层（父）为该类型下各厂商加总
    const sum = (key: string) =>
      Math.round(
        data.reduce((acc, cur: any) => acc + Number(cur[key] || 0), 0) * 100
      ) / 100;
    return {
      gameTypeData: {
        gameGroupID: gt.id,
        gameTypeName: gt.name,
        betAmount: sum("betAmount"),
        kill: rand(-5, 30),
        totalWinAmount: sum("totalWinAmount"),
        betPeople: sum("betPeople"),
        betCount: sum("betCount"),
        eventBetAmount: sum("eventBetAmount")
      },
      data
    };
  });
}

// 合计列
function buildTotal(list: any[]) {
  const sum = (key: string) =>
    Math.round(
      list.reduce(
        (acc, cur) => acc + Number(cur.gameTypeData[key] || 0),
        0
      ) * 100
    ) / 100;
  return {
    lastUpdatedAt: "2026-06-03 12:00:00",
    betAmount: sum("betAmount"),
    kill: rand(-5, 30),
    totalWinAmount: sum("totalWinAmount"),
    betPeople: sum("betPeople"),
    betCount: sum("betCount"),
    eventBetAmount: sum("eventBetAmount")
  };
}

export default defineFakeRoute([
  {
    url: "/backend/report/gamegroup/list/lm",
    method: "get",
    response: () => {
      const list = buildReportList();
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/report/gamegroup/total/lm",
    method: "get",
    response: () => {
      const list = buildReportList();
      return { success: true, data: { list: [buildTotal(list)] } };
    }
  }
]);
