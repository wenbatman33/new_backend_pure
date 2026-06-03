import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 系統站內信設定假資料
const users = ["admin", "operator01", "operator02"];
const all = Array.from({ length: 15 }).map((_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id: i + 1,
    title: `系统公告 ${i + 1}`,
    titlePh: `System Notice ${i + 1}`,
    content: `<p>这是第 ${i + 1} 则系统站内信内容，包含<strong>重点提示</strong>。</p>`,
    contentPh: `<p>This is system letter content No.${i + 1}.</p>`,
    startTime: `2026-05-${day} 09:00:00`,
    endTime: `2026-06-${day} 09:00:00`,
    updatedAt: `2026-05-${day} 12:30:00`,
    updatedUser: users[i % users.length],
    deletedAt: i % 5 === 0 && i !== 0 ? `2026-05-${day} 18:00:00` : null
  };
});

export default defineFakeRoute([
  {
    url: "/backend/site/letter/setting/list",
    method: "get",
    response: () => {
      return { success: true, data: { list: all, total: all.length } };
    }
  },
  {
    url: "/backend/site/letter/setting",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/site/letter/setting",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/site/letter/member/cancel",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
