import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 聯賽輸贏報表 mock：樹狀資料（運動 -> 聯賽 -> 球隊）
const sports = ["足球", "篮球", "网球", "棒球"];
const leaguesMap: Record<string, string[]> = {
  足球: ["英超", "西甲", "意甲"],
  篮球: ["NBA", "CBA"],
  网球: ["温网", "美网"],
  棒球: ["MLB", "日职棒"]
};
const teamsMap: Record<string, string[]> = {
  英超: ["曼联", "利物浦"],
  西甲: ["皇马", "巴萨"],
  意甲: ["国米", "尤文"],
  NBA: ["湖人", "勇士"],
  CBA: ["广东", "辽宁"],
  温网: ["选手A", "选手B"],
  美网: ["选手C", "选手D"],
  MLB: ["洋基", "道奇"],
  日职棒: ["巨人", "阪神"]
};

function rndAmount(seed: number) {
  return (((seed * 9301 + 49297) % 233280) / 233280) * 100000;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

let counter = 0;

function buildTeams(league: string) {
  return (teamsMap[league] ?? []).map(team => {
    counter += 1;
    const bets = (counter % 50) + 5;
    const betAmt = rndAmount(counter);
    const winAmt = rndAmount(counter + 7) - 50000; // 部分為負
    return {
      title: team,
      numberOfBetsText: String(bets),
      totalBetAmountText: fmt(betAmt),
      totalWinAmount: Number(winAmt.toFixed(2)),
      totalWinAmountText: fmt(winAmt),
      children: []
    };
  });
}

function buildLeagues(sport: string) {
  return (leaguesMap[sport] ?? []).map(league => {
    const children = buildTeams(league);
    const bets = children.reduce((s, c) => s + Number(c.numberOfBetsText), 0);
    const winAmt = children.reduce((s, c) => s + c.totalWinAmount, 0);
    return {
      title: league,
      numberOfBetsText: String(bets),
      totalBetAmountText: fmt(rndAmount(bets)),
      totalWinAmount: Number(winAmt.toFixed(2)),
      totalWinAmountText: fmt(winAmt),
      children
    };
  });
}

function buildTree() {
  counter = 0;
  return sports.map((sport, idx) => {
    const children = buildLeagues(sport);
    const bets = children.reduce((s, c) => s + Number(c.numberOfBetsText), 0);
    const winAmt = children.reduce((s, c) => s + c.totalWinAmount, 0);
    return {
      title: sport,
      gameGroupName: sport,
      gameGroupID: String(idx + 1),
      numberOfBetsText: String(bets),
      totalBetAmountText: fmt(rndAmount(idx + 100)),
      totalWinAmount: Number(winAmt.toFixed(2)),
      totalWinAmountText: fmt(winAmt),
      children
    };
  });
}

export default defineFakeRoute([
  {
    // 聯賽輸贏報表列表
    url: "/backend/bettinglog/report/league/win",
    method: "get",
    response: () => {
      return { success: true, data: { list: buildTree() } };
    }
  },
  {
    // 運動下拉（含 gameGroup）
    url: "/backend/game/dropdown/list/sport",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          gameGroup: sports.map((name, i) => ({ id: String(i + 1), name }))
        }
      };
    }
  },
  {
    // 注單聯動下拉（sport/league/team/betType）
    url: "/backend/game/dropdown/list/bettingLog",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          sport: sports,
          league: Object.values(leaguesMap).flat(),
          team: Object.values(teamsMap).flat(),
          betType: ["让球", "大小", "独赢", "波胆"]
        }
      };
    }
  }
]);
