import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 標籤群組顏色對照
const tagGroups = [
  { id: 1, name: "VIP", color: "#f56c6c" },
  { id: 2, name: "風控", color: "#e6a23c" },
  { id: 3, name: "活躍", color: "#67c23a" }
];

const sampleTags = [
  [{ id: 11, name: "高價值", tagGroupID: 1, updatedAt: "2026-05-10 12:00" }],
  [{ id: 12, name: "套利疑慮", tagGroupID: 2, updatedAt: "2026-05-12 09:30" }],
  [
    { id: 13, name: "周活躍", tagGroupID: 3, updatedAt: "2026-05-15 18:00" },
    { id: 11, name: "高價值", tagGroupID: 1, updatedAt: "2026-05-15 18:05" }
  ],
  []
];

const list = Array.from({ length: 16 }).map((_, i) => {
  const betAmount = 10000 + i * 1234.56;
  const totalWinAmount = (i % 3 === 0 ? -1 : 1) * (3000 + i * 321.5);
  const withdrawAmount = 5000 + i * 200;
  const rechargeAmount = 8000 + i * 150;
  return {
    memberID: 200000 + i,
    memberAccount: `vipmember${i + 1}`,
    platformType: (i % 2) + 1,
    useSameDeviceId: i % 4 === 0 ? 1 : 0,
    betAmount,
    totalWinAmount,
    rechargeAmount,
    rechargeCount: 3 + (i % 7),
    withdrawAmount,
    withdrawDepositDiff: rechargeAmount - withdrawAmount,
    transferMember: 1000 + i * 50,
    activeStatus: i % 2,
    lastLoginTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 20:15:00`,
    regTime: `2026-01-${String((i % 28) + 1).padStart(2, "0")} 11:00:00`,
    tags: sampleTags[i % sampleTags.length]
  };
});

function sum(key: string) {
  return list.reduce((acc, cur) => acc + Number(cur[key] ?? 0), 0);
}

export default defineFakeRoute([
  {
    // 代理會員報表列表
    url: "/backend/report/agencyMember/list",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query.platformType && Number(query.platformType) !== 0) {
        result = result.filter(
          v => v.platformType === Number(query.platformType)
        );
      }
      return {
        success: true,
        data: {
          list: result,
          total: result.length,
          sumBetAmount: sum("betAmount"),
          sumRechargeAmount: sum("rechargeAmount"),
          sumTotalWinAmount: sum("totalWinAmount"),
          sumTransferMember: sum("transferMember"),
          sumWithdrawAmount: sum("withdrawAmount"),
          sumWithdrawDepositDiff: sum("withdrawDepositDiff"),
          sumRechargeCount: sum("rechargeCount")
        }
      };
    }
  },
  {
    // 標籤群組（顏色對照）
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({
      success: true,
      data: { list: tagGroups }
    })
  }
]);
