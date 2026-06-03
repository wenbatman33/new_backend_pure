import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 樹狀域名清單：頂層為群組（無 groupID），children 為子域名（有 groupID）
function buildList() {
  const groups = [
    { id: 1, name: "主站群组", displayName: "主站" },
    { id: 2, name: "代理群组", displayName: "代理" },
    { id: 3, name: "活动群组", displayName: "活动" }
  ];
  return groups.map((g, gi) => ({
    id: g.id,
    name: g.name,
    sort: (gi + 1) * 10,
    displayName: g.displayName,
    domain: "",
    note: "",
    children: Array.from({ length: 4 }).map((_, di) => {
      const idx = gi * 10 + di + 1;
      return {
        id: 100 + idx,
        groupID: g.id,
        name: `${g.displayName}-domain${di + 1}`,
        sort: di + 1,
        displayName: `${g.displayName}显示名${di + 1}`,
        domain: `https://${g.displayName}${di + 1}.example.com`,
        note: di % 2 === 0 ? "正常使用" : "备用"
      };
    })
  }));
}

export default defineFakeRoute([
  {
    url: "/backend/domain/list",
    method: "get",
    response: () => {
      const list = buildList();
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/domain/group",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/group",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/domain",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/domain",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/domain",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/json",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/domain/quick_replacement",
    method: "get",
    response: () => {
      const list = Array.from({ length: 6 }).map((_, i) => ({
        domainDisplayName: `平台${i + 1}`,
        domainName: `site${i + 1}`,
        domain: `https://old${i + 1}.example.com:8080`,
        replaceDomain: `https://new${i + 1}.example.com:9090`
      }));
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/domain/quick_replacement",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
