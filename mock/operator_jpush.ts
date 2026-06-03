import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 狀態：1 已發送 / 2 定時推送已註冊 / 3 已刪除
const titles = [
  "週末加碼活動",
  "新會員首存禮",
  "限時免費旋轉",
  "VIP 專屬回饋",
  "簽到送好禮",
  "體育投注返水",
  "充值大放送",
  "邀請好友獎勵"
];

const all = Array.from({ length: 16 }).map((_, i) => {
  const status = (i % 3) + 1; // 1~3 循環
  return {
    id: i + 1,
    title: titles[i % titles.length],
    alert: `${titles[i % titles.length]}內容說明 ${i + 1}`,
    deeplinkType: i % 4,
    deeplinkPage: "xinli://home",
    deeplinkID: i % 4 > 0 ? String(100 + i) : "",
    sendTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    status,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 13:30:00`,
    updatedUser: i % 2 === 0 ? "admin" : "operator01"
  };
});

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/notification/jpush/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 明細
  {
    url: "/backend/notification/jpush/detail",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => v.id === Number(query.id)) ?? all[0];
      return { success: true, data: found };
    }
  },
  // 立即發送
  {
    url: "/backend/notification/jpush/send",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 預約發送
  {
    url: "/backend/notification/jpush/schedule/send",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯（預約）
  {
    url: "/backend/notification/jpush/schedule/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除（預約）
  {
    url: "/backend/notification/jpush/schedule/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
