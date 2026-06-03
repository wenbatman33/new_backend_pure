import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 用途类型对照表（getMoneyUseType）
const useTypeList = [
  { useTypeID: 1, useTypeName: "充值", useTypeEnName: "Recharge" },
  { useTypeID: 2, useTypeName: "提现", useTypeEnName: "Withdrawal" },
  { useTypeID: 3, useTypeName: "活动赠送", useTypeEnName: "Promotion" },
  { useTypeID: 4, useTypeName: "反水", useTypeEnName: "Rebate" }
];

const colors = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c"];
const groupNames = ["电子游戏", "真人视讯", "体育赛事", "彩票"];

// 生成单笔节点的下注明细
function buildBets(seed: number) {
  const count = (seed % 3) + 1;
  return Array.from({ length: count }).map((_, j) => {
    const idx = (seed + j) % groupNames.length;
    return {
      game_list_id: 1000 + seed * 10 + j,
      gameGroupDisplayName: groupNames[idx],
      gameGroupName: `group_${idx + 1}`,
      typeName: "老虎机",
      typeSecondName: "Slot",
      betAmount: (seed + 1) * 100 + j * 13.5,
      winAmount: (seed + 1) * 80 + j * 9.25,
      withdrawalTurnover: (seed + 1) * 120 + j * 5,
      vipTurnover: (seed + 1) * 110 + j * 4,
      eventTurnover: (seed + 1) * 60 + j * 3
    };
  });
}

// 时间轴列表（getWithdrawalTimeline）：12 笔
const timelineList = Array.from({ length: 12 }).map((_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  const useTypeID = (i % 4) + 1;
  return {
    useTypeID,
    color: colors[(i % colors.length)],
    beforeMoney: 10000 + i * 250.5,
    adjustMoney: (i % 2 === 0 ? 1 : -1) * (500 + i * 30),
    afterMoney: 10500 + i * 280.75,
    turnoverMultiple: 1 + (i % 5),
    turnoverLimit: (500 + i * 30) * (1 + (i % 5)),
    note: `第 ${i + 1} 笔调整备注`,
    right: {
      startTime: `2026-05-${day} 00:00:00`,
      endTime: `2026-05-${day} 23:59:59`,
      bets: buildBets(i)
    }
  };
});

export default defineFakeRoute([
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => {
      return { success: true, data: { list: useTypeList } };
    }
  },
  {
    url: "/backend/withdrawal/timeline",
    method: "get",
    response: () => {
      return {
        success: true,
        data: { list: timelineList, total: timelineList.length }
      };
    }
  }
]);
