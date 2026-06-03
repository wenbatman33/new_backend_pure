import { defineFakeRoute } from "vite-plugin-fake-server/client";

// saba 注單明細 mock
const sports = ["足球", "篮球", "网球", "电竞"];
const leagues = ["英超", "西甲", "NBA", "ATP巡回赛"];
const betTypes = ["让球", "大小", "独赢", "波胆"];
const statuses = ["已结算", "未结算", "已取消"];
const platforms = ["WAP", "WEB", "APP"];
const lives = ["滚球", "早盘"];

const betList = Array.from({ length: 16 }).map((_, i) => {
  const stake = (i + 1) * 100;
  const winloss = i % 2 === 0 ? stake * 0.95 : -stake;
  return {
    txId: `TX${20260603000 + i}`,
    userName: `member${i + 1}`,
    actualStake: stake,
    transactionTime: `2026-06-03 1${i % 9}:20:30`,
    betDetail: {
      betChoice: `主队 +0.5 @ ${(1.8 + (i % 5) * 0.1).toFixed(2)}`,
      betType: betTypes[i % betTypes.length],
      match: `主队${i + 1} vs 客队${i + 1}`,
      sport: sports[i % sports.length],
      league: leagues[i % leagues.length],
      eventDate: `2026-06-03 20:00:00`
    },
    odds: Number((1.8 + (i % 5) * 0.1).toFixed(2)),
    oddsType: "MY",
    stake,
    winloss: Number(winloss.toFixed(2)),
    status: statuses[i % statuses.length],
    platform: platforms[i % platforms.length],
    liveInfo: lives[i % lives.length]
  };
});

const summary = {
  totalStake: betList.reduce((s, v) => s + v.stake, 0),
  totalActualStake: betList.reduce((s, v) => s + v.actualStake, 0),
  totalWinloss: Number(
    betList.reduce((s, v) => s + v.winloss, 0).toFixed(2)
  )
};

const opt = (
  arr: string[],
  start = 1
): { label: string; value: number }[] =>
  arr.map((label, i) => ({ label, value: start + i }));

export default defineFakeRoute([
  {
    url: "/game/bo/saba/advanced",
    method: "post",
    response: () => ({
      success: true,
      data: { betList, summary }
    })
  },
  {
    url: "/game/bo/saba/get_selector",
    method: "post",
    response: () => ({
      success: true,
      data: {
        ticketStatusList: opt(statuses),
        liveStatusList: opt(lives),
        riskLevelList: opt(["低", "中", "高"]),
        oddsGroupList: opt(["A组", "B组", "C组"]),
        platformList: opt(platforms),
        productList: opt(["体育", "电竞", "虚拟"])
      }
    })
  },
  {
    url: "/game/bo/saba/get_sport_list",
    method: "post",
    response: () => ({
      success: true,
      data: {
        sportList: [{ label: "全部", value: 0 }, ...opt(sports)]
      }
    })
  },
  {
    url: "/game/bo/saba/get_bettype_list",
    method: "post",
    response: () => ({
      success: true,
      data: {
        betTypeList: [{ label: "全部", value: 0 }, ...opt(betTypes)]
      }
    })
  },
  {
    url: "/game/bo/saba/get_league_list",
    method: "post",
    response: () => ({
      success: true,
      data: {
        leagueList: [{ label: "全部", value: 0 }, ...opt(leagues)]
      }
    })
  },
  {
    url: "/game/bo/saba/get_match_list",
    method: "post",
    response: () => ({
      success: true,
      data: {
        matchList: [
          { label: "全部", value: 0 },
          { label: "主队1 vs 客队1", value: 1 },
          { label: "主队2 vs 客队2", value: 2 }
        ]
      }
    })
  }
]);
