import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 聯賽假資料
const leagues = Array.from({ length: 16 }).map((_, i) => ({
  ID: i + 1,
  name: `League ${i + 1}`,
  keyword: `keyword-${i + 1}, vendor-${(i % 3) + 1}`,
  leagueReportCalc: (i % 2) + 1,
  status: (i % 4 === 0 ? 2 : 1) as number,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

// 各聯賽的關鍵字
const keywordStore: Record<number, { ID: number; keyword: string }[]> = {};
leagues.forEach(l => {
  keywordStore[l.ID] = Array.from({ length: 3 }).map((_, k) => ({
    ID: l.ID * 100 + k + 1,
    keyword: `kw-${l.ID}-${k + 1}`
  }));
});

export default defineFakeRoute([
  // 聯賽列表
  {
    url: "/backend/league/list",
    method: "get",
    response: ({ query }) => {
      let list = leagues;
      if (query.keyword) {
        list = list.filter(v => v.keyword.includes(query.keyword));
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增聯賽
  {
    url: "/backend/league",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯聯賽
  {
    url: "/backend/league",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除聯賽
  {
    url: "/backend/league",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 關鍵字列表
  {
    url: "/backend/league/list/keyword",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.ID);
      return {
        success: true,
        data: { list: keywordStore[id] ?? [], total: (keywordStore[id] ?? []).length }
      };
    }
  },
  // 新增關鍵字
  {
    url: "/backend/league/list/keyword",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 刪除關鍵字
  {
    url: "/backend/league/list/keyword",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 聯賽下拉
  {
    url: "/backend/league/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { list: leagues.map(l => ({ ID: l.ID, name: l.name })) }
    })
  }
]);
