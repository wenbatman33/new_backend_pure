import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 游戏厂商假资料
const gameGroups = [
  { id: 101, name: "PG电子", displayName: "PG" },
  { id: 102, name: "PP电子", displayName: "PP" },
  { id: 103, name: "BBIN真人", displayName: "BBIN" },
  { id: 104, name: "AG真人", displayName: "AG" },
  { id: 105, name: "沙巴体育", displayName: "Saba" }
];

// 游戏厂商日报表假资料（10~20 笔）
const summaryList = Array.from({ length: 14 }).map((_, i) => ({
  date: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
  name: gameGroups[i % gameGroups.length].name,
  betAmount: 100000 + i * 3571.25,
  totalBetAmount: 120000 + i * 4210.5
}));

// 厂商流水帐设定假资料
const timeColumnMap: Record<string, string> = {
  bet_time: "（游戏商时区）依下注时间",
  bet_time_local: "（平台时区）依下注时间",
  settlement_time: "（游戏商时区）依结算时间",
  settlement_time_local: "（平台时区）依结算时间"
};
const statusMap: Record<number, string> = {
  1: "全部投注状态",
  2: "完成状态"
};
const timeColumns = Object.keys(timeColumnMap);
let bettingLogList = Array.from({ length: 12 }).map((_, i) => {
  const tc = timeColumns[i % timeColumns.length];
  const sf = (i % 2) + 1;
  const g = gameGroups[i % gameGroups.length];
  return {
    id: i + 1,
    gameGroupID: g.id,
    gameGroupName: g.name,
    timeColumn: tc,
    statusFilter: sf,
    statusFilterString: statusMap[sf]
  };
});

export default defineFakeRoute([
  // 游戏厂商下拉
  {
    url: "/backend/game/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        gameGroup: gameGroups.map(g => ({
          label: `${g.name}(${g.displayName})`,
          value: g.id,
          name: g.name
        }))
      }
    })
  },
  // 游戏厂商日报表
  {
    url: "/backend/game/summery",
    method: "get",
    response: () => ({
      success: true,
      data: { list: summaryList, total: summaryList.length }
    })
  },
  // 手动补流水（noc）
  {
    url: "/game/game/log/noc_manual",
    method: "get",
    response: () => ({ success: true, data: null })
  },
  // 清除手动补流水 Task
  {
    url: "/game/game/log/manual",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 厂商流水帐设定 - 列表
  {
    url: "/backend/bettinglog/setting",
    method: "get",
    response: () => ({
      success: true,
      data: { list: bettingLogList, total: bettingLogList.length }
    })
  },
  // 厂商流水帐设定 - 新增
  {
    url: "/backend/bettinglog/setting",
    method: "post",
    response: ({ body }) => {
      const id = bettingLogList.length
        ? Math.max(...bettingLogList.map(v => v.id)) + 1
        : 1;
      const g = gameGroups.find(v => v.id === Number(body?.gameGroupID));
      bettingLogList.push({
        id,
        gameGroupID: Number(body?.gameGroupID),
        gameGroupName: g?.name ?? body?.name ?? "",
        timeColumn: body?.timeColumn ?? "",
        statusFilter: Number(body?.statusFilter) || 1,
        statusFilterString: statusMap[Number(body?.statusFilter)] ?? ""
      });
      return { success: true, data: { id } };
    }
  },
  // 厂商流水帐设定 - 修改
  {
    url: "/backend/bettinglog/setting",
    method: "put",
    response: ({ body }) => {
      bettingLogList = bettingLogList.map(v =>
        v.id === Number(body?.id)
          ? {
              ...v,
              timeColumn: body?.timeColumn ?? v.timeColumn,
              statusFilter: Number(body?.statusFilter) || v.statusFilter,
              statusFilterString:
                statusMap[Number(body?.statusFilter)] ?? v.statusFilterString
            }
          : v
      );
      return { success: true, data: null };
    }
  },
  // 厂商流水帐设定 - 删除
  {
    url: "/backend/bettinglog/setting",
    method: "delete",
    response: ({ query }) => {
      bettingLogList = bettingLogList.filter(v => v.id !== Number(query?.id));
      return { success: true, data: null };
    }
  }
]);
