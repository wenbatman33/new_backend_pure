import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 产生单笔分层设定（S~F 共 7 阶）
function makeRow(i: number) {
  const rankContent = Array.from({ length: 7 }).map((_, r) => ({
    minProfit: (r + 1) * 10000 + i * 1000,
    activeMemberCount: (r + 1) * 5 + i,
    commissionPercent: 30 - r * 3
  }));
  return {
    id: i + 1,
    groupName: `代理分层方案 ${i + 1}`,
    // 多数为分层(1)，少数不分层(2)
    type: i % 4 === 0 ? 2 : 1,
    rankContent
  };
}

const all = Array.from({ length: 14 }).map((_, i) => makeRow(i));

export default defineFakeRoute([
  {
    // 分层设定列表
    url: "/backend/agency/ranksetting/list",
    method: "get",
    response: () => {
      return { success: true, data: { list: all, total: all.length } };
    }
  },
  {
    // 分层设定下拉选项
    url: "/backend/agency/ranksetting/all",
    method: "get",
    response: () => {
      const list = all.map(v => ({ key: v.id, value: v.groupName }));
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 新增分层设定
    url: "/backend/agency/ranksetting",
    method: "post",
    response: () => ({ success: true, data: { id: all.length + 1 } })
  },
  {
    // 更新分层设定
    url: "/backend/agency/ranksetting",
    method: "put",
    response: ({ body }) => ({
      success: true,
      data: { groupID: body?.groupID ?? 1 }
    })
  }
]);
