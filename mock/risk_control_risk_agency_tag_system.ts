import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 標籤群組
const tagGroups = [
  { id: 1, name: "風控群組", color: "#f56c6c" },
  { id: 2, name: "VIP 群組", color: "#e6a23c" },
  { id: 3, name: "活動群組", color: "#67c23a" },
  { id: 4, name: "行為群組", color: "#409eff" }
];

// 標籤（隸屬群組）
const tags = [
  { id: 101, name: "高風險", tagGroupID: 1 },
  { id: 102, name: "套利", tagGroupID: 1 },
  { id: 103, name: "多帳號", tagGroupID: 1 },
  { id: 201, name: "VIP1", tagGroupID: 2 },
  { id: 202, name: "VIP2", tagGroupID: 2 },
  { id: 203, name: "大客戶", tagGroupID: 2 },
  { id: 301, name: "活動參與", tagGroupID: 3 },
  { id: 302, name: "薅羊毛", tagGroupID: 3 },
  { id: 401, name: "活躍", tagGroupID: 4 },
  { id: 402, name: "沉睡", tagGroupID: 4 }
];

// 代理標籤群組列表（每筆 = 一張卡片）
const remarks = ["定期巡檢", "風控標記", "活動觀察", "重點關注", ""];
const agencyTagGroups = Array.from({ length: 14 }).map((_, i) => {
  const pick = [tags[i % tags.length].id, tags[(i + 3) % tags.length].id];
  return {
    agencyTagGroupId: i + 1,
    agencyId: `${10430 + i},${10431 + i}`,
    tagId: Array.from(new Set(pick)).join(","),
    remark: remarks[i % remarks.length]
  };
});

export default defineFakeRoute([
  // 代理標籤群組列表
  {
    url: "/backend/agency/tag/tags",
    method: "get",
    response: ({ query }) => {
      let list = agencyTagGroups;
      if (query.agencyID) {
        const keys = String(query.agencyID).split(",").filter(Boolean);
        list = list.filter(v => keys.some(k => v.agencyId.includes(k)));
      }
      if (query.tagID) {
        const want = String(query.tagID).split(",").map(Number);
        list = list.filter(v =>
          v.tagId.split(",").map(Number).some(t => want.includes(t))
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增 / 編輯 / 刪除 代理標籤群組
  {
    url: "/backend/agency/tag/group",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/tag/group",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/tag/group",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 會員標籤群組
  {
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({
      success: true,
      data: { list: tagGroups, total: tagGroups.length }
    })
  },
  // 會員標籤
  {
    url: "/backend/member/tag/tags",
    method: "get",
    response: () => ({
      success: true,
      data: { list: tags, total: tags.length }
    })
  }
]);
