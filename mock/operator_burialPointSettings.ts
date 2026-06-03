import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 分类：1 GTM / 2 GA / 3 FB / 4 Mouseflow / 5 Microsoft Clarity / 6 Other
const eventTypeNames = ["GTM", "GA", "FB", "Mouseflow", "Microsoft Clarity", "Other"];
const sampleUrls = [
  "https://www.example-a.com",
  "https://www.example-b.com",
  "https://m.example-c.com"
];

// 埋点列表假资料
const trackingList = Array.from({ length: 14 }).map((_, i) => {
  const eventType = (i % 6) + 1;
  return {
    id: i + 1,
    name: `${eventTypeNames[eventType - 1]} 埋点 ${i + 1}`,
    url: sampleUrls.slice(0, (i % 3) + 1),
    eventType,
    eventCode:
      eventType === 1
        ? `GTM-ABC${100 + i}`
        : eventType === 2
          ? `G-XYZ${200 + i}`
          : `code-${1000 + i}`,
    // GTM/GA/FB 支持事件=1 是，其余=2 否
    event: eventType <= 3 ? 1 : 2,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`
  };
});

// 域名设置假资料（旧后端结构：data.children）
const domainChildren = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  displayName: `站点${i + 1}`,
  domain: `https://site${i + 1}.example.com`,
  note: i % 2 === 0 ? "主站" : "备用站",
  groupID: 1,
  name: "siteUrl"
}));

export default defineFakeRoute([
  // 埋点列表
  {
    url: "/backend/event_tracking",
    method: "get",
    response: () => ({
      success: true,
      data: { list: trackingList, total: trackingList.length }
    })
  },
  // 新增埋点
  {
    url: "/backend/event_tracking",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 编辑埋点
  {
    url: "/backend/event_tracking",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 删除埋点
  {
    url: "/backend/event_tracking",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 埋点可选网址清单
  {
    url: "/backend/domain/get_event_tracking_url_list",
    method: "get",
    response: () => ({
      success: true,
      data: { eventTrackingUrlList: sampleUrls }
    })
  },
  // 域名设置列表（含 children）
  {
    url: "/backend/domain/siteUrl",
    method: "get",
    response: () => ({
      success: true,
      data: {
        id: 1,
        name: "siteUrl",
        displayName: "站点网址",
        children: domainChildren
      }
    })
  },
  // 新增域名
  {
    url: "/backend/domain/domain",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 编辑域名
  {
    url: "/backend/domain/domain",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 删除域名
  {
    url: "/backend/domain/domain",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
