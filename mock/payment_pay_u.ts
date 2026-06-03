import { defineFakeRoute } from "vite-plugin-fake-server/client";

// U 帐户（USDT 钱包）假资料
// type: 2 ERC / 3 TRC；useType: 0~4；status: 1 启用 / 2 停用
const names = [
  "主收款钱包A",
  "代收钱包B",
  "代付钱包C",
  "结算钱包D",
  "备用钱包E"
];
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: `${names[i % names.length]}-${i + 1}`,
  type: (i % 2) + 2, // 2 或 3
  useType: i % 5, // 0~4
  todayIn: Math.round(Math.random() * 50000),
  todayOut: Math.round(Math.random() * 40000),
  balance: Math.round(Math.random() * 200000),
  address: `T${Math.random().toString(36).slice(2, 12).toUpperCase()}${i}`,
  originalAmount: Math.round(Math.random() * 100000),
  status: (i % 4 === 0 ? 2 : 1) as number
}));

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/pay/usdt",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.useType && Number(query.useType) !== -1) {
        list = list.filter(v => v.useType === Number(query.useType));
      }
      if (query.type && query.type !== "0") {
        list = list.filter(v => v.type === Number(query.type));
      }
      if (query.status && query.status !== "0") {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增
  {
    url: "/backend/pay/usdt",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 编辑
  {
    url: "/backend/pay/usdt",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 商户下发
  {
    url: "/backend/pay/usdt/money/in",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 充值商户号
  {
    url: "/backend/pay/usdt/money/out",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 冻结
  {
    url: "/backend/pay/usdt/money/freeze",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 解冻
  {
    url: "/backend/pay/usdt/money/unfreeze",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // U 转帐
  {
    url: "/backend/pay/usdt/money/transfer",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 资金异动
  {
    url: "/backend/pay/usdt/trade",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 商户号搜寻（取得资讯）
  {
    url: "/backend/pay/pay_channel/search",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        id: 8801,
        name: `商户-${query.keyword ?? ""}`,
        type: 2
      }
    })
  }
]);
