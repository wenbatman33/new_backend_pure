import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 批次派發列表假資料
const batchList = Array.from({ length: 16 }).map((_, i) => ({
  ID: i + 1,
  batchID: 5000 + i,
  promotionID: 9000 + i,
  promotionName: `首存优惠活动 ${i + 1}`,
  internalName: `内部代号-${i + 1}`,
  batchCycle: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
  sendWay: (i % 2) + 1, // 1 自动 / 2 手动
  totalAmount: (i + 1) * 12345,
  memberNumber: (i + 1) * 10,
  memberFailNumber: i % 3,
  sendAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

// 審核列表假资料
const approveList = Array.from({ length: 12 }).map((_, i) => ({
  ID: i + 1,
  memberAccount: `member${i + 1}`,
  bonus: (i + 1) * 100,
  promotionCondRange: [
    { rangeMin: 100, rangeMax: 500, amount: 50 },
    { rangeMin: 500, rangeMax: 0, amount: 100 }
  ],
  createdAt: `2026-05-20 1${i % 10}:20:00`,
  updatedAt: `2026-05-21 1${i % 10}:30:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    // 批次派發列表
    url: "/backend/promotion/member",
    method: "get",
    response: ({ query }) => {
      let list = batchList;
      if (query.promotionID) {
        list = list.filter(v =>
          String(v.promotionID).includes(query.promotionID)
        );
      }
      if (query.promotionName) {
        list = list.filter(v => v.promotionName.includes(query.promotionName));
      }
      if (query.batchID) {
        list = list.filter(v => String(v.batchID).includes(query.batchID));
      }
      if (query.internalName) {
        list = list.filter(v => v.internalName.includes(query.internalName));
      }
      if (query.send_way) {
        list = list.filter(v => v.sendWay === Number(query.send_way));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 審核列表
    url: "/backend/promotion/member/approve",
    method: "get",
    response: ({ query }) => {
      let list = approveList;
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 審核（通過 3 / 拒絕 7）
    url: "/backend/promotion/member/approve",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
