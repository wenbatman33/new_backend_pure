import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 標籤群組假資料
const groups = [
  { id: 1, name: "风控群组", color: "#ff647c" },
  { id: 2, name: "财务群组", color: "#1890ff" },
  { id: 3, name: "营运群组", color: "#52c41a" }
];

// 標籤假資料（tagGroupID 對應群組）
const boolKeys = [
  "onlyBySystem",
  "loginForbidden",
  "loginReason",
  "withdrawalForbidden",
  "withdrawReason",
  "depositForbidden",
  "riskNotifyAlways",
  "riskNotifyOnce",
  "riskCondition",
  "financialNotifyAlways",
  "loginNotify",
  "withdrawalColor",
  "withdrawalSpecialNoColor",
  "loginWhiteList"
];

const tagNames = [
  "异常IP关联",
  "异常Device关联",
  "高风险会员",
  "套利标记",
  "禁止提款",
  "禁止登录",
  "财务关注",
  "VIP保护",
  "白名单",
  "多帐号关联",
  "存款异常",
  "提款显色",
  "登录通知",
  "系统标记",
  "黑名单候选"
];

const tags = Array.from({ length: 15 }).map((_, i) => {
  const item: Record<string, any> = {
    id: i + 1,
    name: tagNames[i],
    tagGroupID: (i % 3) + 1,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
  };
  // 散佈幾個勾選欄位讓畫面有 ✓
  boolKeys.forEach((k, ki) => {
    item[k] = (i + ki) % 4 === 0;
  });
  return item;
});

export default defineFakeRoute([
  {
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({ success: true, data: { list: groups, total: groups.length } })
  },
  {
    url: "/backend/member/tag/tags",
    method: "get",
    response: ({ query }) => {
      let list = tags;
      if (query.id) {
        list = list.filter(v => String(v.id).includes(String(query.id)));
      }
      if (query.name) {
        const fuzzy = query.isFuzzySearch === "true" || query.isFuzzySearch === true;
        list = list.filter(v =>
          fuzzy ? v.name.includes(query.name) : v.name === query.name
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/member/tag/group",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/member/tag/group",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/member/tag/tag",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/member/tag/tag",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
