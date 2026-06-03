import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 用途類型（useType）假資料，僅 useTypeID >= 1000 會出現在搜尋下拉
const useTypeList = [
  {
    useTypeID: 1001,
    useTypeName: "存款赠送",
    useTypeEnName: "Deposit Bonus",
    color: "#409EFF"
  },
  {
    useTypeID: 1002,
    useTypeName: "活动赠送",
    useTypeEnName: "Activity Bonus",
    color: "#67C23A"
  },
  {
    useTypeID: 1003,
    useTypeName: "投注流水",
    useTypeEnName: "Bet Turnover",
    color: "#E6A23C"
  },
  {
    useTypeID: 1004,
    useTypeName: "提领扣除",
    useTypeEnName: "Withdraw Deduct",
    color: "#F56C6C"
  }
];

// 錢包紀錄列表假資料（15 筆）
const logList = Array.from({ length: 15 }).map((_, i) => {
  const before = 1000 + i * 50;
  const adjust = (i % 2 === 0 ? 1 : -1) * (i + 1) * 20;
  return {
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:${String(
      (i * 3) % 60
    ).padStart(2, "0")}:00`,
    inOutType: i % 2 === 0 ? 1 : 2,
    useType: useTypeList[i % useTypeList.length].useTypeID,
    beforeMoney: before,
    adjustMoney: adjust,
    afterMoney: before + adjust,
    note: `紅利錢包異動 #${i + 1}`,
    refId: `ORD${20260500 + i}`
  };
});

// 錢包資訊假資料
const walletInfo = {
  createdAt: "2026-05-01 09:00:00",
  status: 2,
  expirationDate: "2026-06-01 09:00:00",
  orderID: "ORD20260501",
  source: "存款活动",
  initialMoney: 1000,
  totalBonus: 500.55,
  withdrawalLimit: 5000,
  gameAccount: "game_user_001",
  gameAccountCreatedAt: "2026-05-01 09:05:00",
  gameItem: [{ gameGroupName: "电子游戏" }, { gameGroupName: "真人娱乐" }],
  assignedGameGroup: "电子游戏",
  maxWithdrawal: 8000,
  minWithdrawal: 100,
  depositAmount: 30000,
  memberID: 100001
};

export default defineFakeRoute([
  // 用途類型下拉（/backend/money/useType）
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({ success: true, data: { list: useTypeList } })
  },
  // 錢包資訊列表（/backend/memberluckmoneywallet/list）
  {
    url: "/backend/memberluckmoneywallet/list",
    method: "get",
    response: ({ query }) => {
      // 模擬：傳入 id 才回傳
      if (query.id) {
        return {
          success: true,
          data: { list: [{ ...walletInfo }], total: 1 }
        };
      }
      return { success: true, data: { list: [], total: 0 } };
    }
  },
  // 錢包紀錄（/backend/memberluckmoneywallet/log）
  {
    url: "/backend/memberluckmoneywallet/log",
    method: "get",
    response: ({ query }) => {
      let list = logList;
      if (query.inOut) {
        list = list.filter(v => v.inOutType === Number(query.inOut));
      }
      if (query.type) {
        const types = String(query.type)
          .split(",")
          .map(Number);
        list = list.filter(v => types.includes(v.useType));
      }
      if (query.refId) {
        list = list.filter(v => v.refId.includes(query.refId));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
