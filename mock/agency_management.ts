import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理 公告 / 活動 管理 mock
function makeList(prefix: string, len: number) {
  return Array.from({ length: len }).map((_, i) => ({
    id: i + 1,
    title: `${prefix}${i + 1}`,
    sort: i + 1,
    contents: `<p>${prefix}内容 ${i + 1}</p>`,
    imageH5: "",
    imagePc: "",
    startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
    endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
    status: (i % 2) + 1,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    lastEditor: i % 3 === 0 ? "admin" : "operator01"
  }));
}

const announcements = makeList("公告", 15);
const activities = makeList("活动", 12);

export default defineFakeRoute([
  {
    url: "/backend/agency/announcement/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: announcements, total: announcements.length }
    })
  },
  {
    url: "/backend/agency/announcement/new",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/announcement/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/activity/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: activities, total: activities.length }
    })
  },
  {
    url: "/backend/agency/activity/new",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/activity/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
