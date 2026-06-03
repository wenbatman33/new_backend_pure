import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 操作類型 1~8 對應內容範例
const opTypeContents: Record<number, string> = {
  1: "新增代理",
  2: "佣金审核",
  3: "修改代理资料",
  4: "调整代理额度",
  5: "停用代理",
  6: "启用代理",
  7: "重置密码",
  8: "导出报表"
};

const admins = ["admin", "operator01", "manager02", "agent_admin"];

const all = Array.from({ length: 18 }).map((_, i) => {
  const opType = (i % 8) + 1;
  return {
    id: i + 1,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} ${String(
      (i % 12) + 8
    ).padStart(2, "0")}:25:13`,
    opType,
    opContent: `${opTypeContents[opType]}（操作单号 ${10000 + i}）`,
    opAdmin: admins[i % admins.length]
  };
});

export default defineFakeRoute([
  {
    url: "/backend/agency/operationnote",
    method: "get",
    response: ({ query }) => {
      let list = all;
      // 模擬搜尋條件
      if (query.adminAccount) {
        list = list.filter(v => v.opAdmin.includes(query.adminAccount));
      }
      if (query.opType) {
        list = list.filter(v => v.opType === Number(query.opType));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
