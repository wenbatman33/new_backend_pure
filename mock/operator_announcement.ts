import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 公告假資料：每筆含多語系 announcementMultiple（en / zh-CN）
const titles = [
  "系统维护通知",
  "新会员注册活动",
  "充值优惠上线",
  "周末返水加码",
  "App 版本更新",
  "节日活动预告",
  "VIP 专属礼遇",
  "安全提醒公告",
  "邀请好友奖励",
  "限时秒杀活动",
  "新游戏上线",
  "客服时间调整",
  "提现规则说明",
  "积分兑换上线",
  "签到福利升级"
];

const all = Array.from({ length: 15 }).map((_, i) => {
  const zhTitle = titles[i];
  return {
    id: i + 1,
    sort: (i + 1) * 10,
    hidden: i % 4 === 0,
    top: i % 5 === 0,
    start: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 08:30:00`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    editor: 1000 + i,
    editorName: i % 3 === 0 ? "admin" : "operator01",
    announcementMultiple: [
      {
        language: "en",
        title: `Announcement ${i + 1}`,
        context: `<p>This is the content of announcement ${i + 1}.</p>`
      },
      {
        language: "zh-CN",
        title: zhTitle,
        context: `<p>这是公告 ${i + 1} 的内容。</p>`
      }
    ]
  };
});

export default defineFakeRoute([
  {
    url: "/backend/site/announcement",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      if (query.title) {
        list = list.filter(v =>
          v.announcementMultiple.some(m => m.title.includes(query.title))
        );
      }
      if (query.hidden !== undefined && query.hidden !== "") {
        const h = query.hidden === "true" || query.hidden === true;
        list = list.filter(v => v.hidden === h);
      }
      return { success: true, data: { list, count: list.length } };
    }
  },
  {
    url: "/backend/site/announcement",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/site/announcement",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/site/announcement",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
