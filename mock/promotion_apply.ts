import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 優惠申請清單假資料（10~20 筆）
const names = ["首存优惠", "周末红包", "签到奖励", "返水活动", "新人礼包"];
const list = Array.from({ length: 16 }).map((_, i) => ({
  ID: 1000 + i,
  agencyID: 200 + (i % 5),
  memberID: 500000 + i,
  memberAccount: `member${i + 1}`,
  bonus: (i + 1) * 88,
  // 狀態 1~7，部分為 2 + sendWay 2 以觸發手動派發按鈕
  status: (i % 7) + 1,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
  sendAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:00:00`,
  promotionName: names[i % names.length],
  internalName: `${names[i % names.length]}_内部`,
  promotionID: 3000 + i,
  promotionCondTypes: { 0: 1, 1: 2 },
  promotionCondRange: [
    {
      promotionCondType: 1,
      rangeMin: 100,
      rangeMax: 1000,
      amount: 88,
      refIds: [`D2026050${i}`, `D2026051${i}`]
    },
    {
      promotionCondType: 2,
      rangeMin: 500,
      rangeMax: 0,
      amount: 168,
      refIds: []
    }
  ],
  note: i % 2 === 0 ? "正常申请" : "",
  registerIP: `192.168.1.${i + 1}`,
  lastLoginIP: `10.0.0.${i + 1}`,
  batchID: 7000 + i,
  batchCycle: "2026-05-01 ~ 2026-05-31",
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 11:00:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01",
  sendWay: i % 2 === 0 ? 2 : 1
}));

export default defineFakeRoute([
  {
    url: "/backend/promotion/member/list",
    method: "get",
    response: ({ query }) => {
      let data = list;
      if (query.memberAccount) {
        data = data.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.status) {
        data = data.filter(v => v.status === Number(query.status));
      }
      return {
        success: true,
        data: {
          list: data,
          total: data.length,
          totalAmount: data.reduce((s, v) => s + v.bonus, 0),
          count: data.length
        }
      };
    }
  },
  {
    url: "/backend/promotion/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        promotionStatus: [
          { 1: "申请中" },
          { 2: "待审核" },
          { 3: "已派发" },
          { 4: "已领取" },
          { 5: "已取消" },
          { 6: "已放弃" },
          { 7: "已拒绝" }
        ],
        promotionCondType: [
          { 1: "存款条件" },
          { 2: "有效流水条件" },
          { 3: "投注金额条件" },
          { 5: "负盈利条件" },
          { 6: "正盈利条件" },
          { 7: "提款条件" }
        ],
        cycleType: [{ 1: "每日" }, { 2: "每周" }, { 3: "每月" }]
      }
    })
  },
  {
    url: "/backend/promotion/member/log",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { updatedAt: "2026-05-01 09:00:00", updatedUser: "member1", status: 1 },
          { updatedAt: "2026-05-01 10:00:00", updatedUser: "admin", status: 2 },
          { updatedAt: "2026-05-01 11:00:00", updatedUser: "admin", status: 3 }
        ],
        total: 3
      }
    })
  },
  {
    url: "/backend/promotion/member/cancel",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/member/reapply",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/member/approve",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
