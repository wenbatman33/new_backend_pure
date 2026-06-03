import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 站內信列表假資料：type 1 系統 / 2 人工；status 1 待發送 / 3 已發送 / 4 失敗 / 5 已回收
const statusPool = [1, 3, 4, 5];
const titles = [
  "系统维护通知",
  "活动开奖公告",
  "充值优惠活动",
  "账户安全提醒",
  "VIP升级通知",
  "周末特别活动",
  "积分到期提醒",
  "新游戏上线",
  "节日福利发放",
  "系统升级公告"
];

const all = Array.from({ length: 16 }).map((_, i) => ({
  letterSettingId: 1000 + i,
  type: (i % 2) + 1,
  title: `${titles[i % titles.length]}#${i + 1}`,
  titlePh: `${titles[i % titles.length]} EN#${i + 1}`,
  content: `<p>这是第 ${i + 1} 封站内信的内容，请会员留意相关信息。</p>`,
  contentPh: `<p>This is inbox message #${i + 1}.</p>`,
  memberCount: (i + 1) * 5,
  status: statusPool[i % statusPool.length],
  sendAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 11:00:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  // 站內信列表
  {
    url: "/backend/site/letter/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.type) {
        list = list.filter(v => v.type === Number(query.type));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 收件名單（GET）
  {
    url: "/backend/site/letter/member",
    method: "get",
    response: ({ query }) => {
      const count = Number(query.letterSettingId ?? 0) % 7 + 8;
      const list = Array.from({ length: count }).map((_, i) => ({
        memberAccount: `member${i + 1}`,
        sendAt: `2026-05-20 1${i % 9}:20:00`,
        status: i % 3 === 0 ? "已发送" : "待发送"
      }));
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增站內信（POST）
  {
    url: "/backend/site/letter/member",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯站內信（PUT）
  {
    url: "/backend/site/letter/member",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 回收站內信（PUT）
  {
    url: "/backend/site/letter/member/cancel",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
