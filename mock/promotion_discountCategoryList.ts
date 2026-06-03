import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 優惠分類假資料
const locales = ["zh-CN", "en-US", "ja-JP", "ko-KR"];
const names = [
  "新会员优惠",
  "存款优惠",
  "返水活动",
  "节日活动",
  "体育优惠",
  "电子游戏优惠",
  "真人娱乐优惠",
  "棋牌优惠",
  "彩票优惠",
  "VIP 专属优惠",
  "限时活动",
  "推荐好友",
  "签到奖励",
  "周年庆典"
];

const all = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  // 第一筆 promotionTypeID = 0（系统预设，不可删除）
  promotionTypeID: i,
  locale: locales[i % locales.length],
  typeName: names[i % names.length],
  sort: (i + 1) * 10,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/promotion/type/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: all, total: all.length }
    })
  },
  {
    url: "/backend/promotion/type/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/type/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/type/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
