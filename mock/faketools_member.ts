import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生假會員列表
function buildList(prefix = "qatest", count = 15) {
  return Array.from({ length: count }).map((_, i) => {
    const seq = String(i + 1).padStart(3, "0");
    return {
      id: 10000 + i,
      account: `${prefix}${seq}`,
      name_cert: i % 2,
      phone_cert: (i + 1) % 2,
      has_bank_card: i % 3 === 0 ? 1 : 0,
      vip_level: i % 11,
      created_date: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`
    };
  });
}

export default defineFakeRoute([
  // 取得會員資料
  {
    url: "/fake/tools/member/search",
    method: "get",
    response: ({ query }) => {
      // account 可能是換行/逗號分隔的多筆帳號，取第一段當前綴
      const raw = (query.account ?? "") as string;
      const prefix = raw.split(/[\n,，\s]+/).filter(Boolean)[0] || "qatest";
      const list = buildList(prefix);
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 建立會員
  {
    url: "/fake/tools/member/register",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 修改會員
  {
    url: "/fake/tools/member/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 批次修改密碼
  {
    url: "/fake/tools/member/password",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
