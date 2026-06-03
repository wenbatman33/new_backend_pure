import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 线路列表
const channels = [
  { id: 1, name: "支付宝快捷" },
  { id: 2, name: "微信扫码" },
  { id: 3, name: "USDT-TRC" },
  { id: 4, name: "银联快捷" }
];

const currencyMap: Record<number, string> = {
  1: "人民币",
  2: "USDT-ERC",
  3: "USDT-TRC",
  4: "ECNY"
};

// 存款列表假资料
function genList(count = 15) {
  return Array.from({ length: count }).map((_, i) => ({
    orderID: `DP2026060${String(i + 1).padStart(4, "0")}`,
    payChannelServiceName: channels[i % channels.length].name,
    currency: currencyMap[(i % 4) + 1],
    memberAccount: `member${i + 1}`,
    memberID: 100000 + i,
    depositAmount: (i + 1) * 100,
    depositAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`
  }));
}

export default defineFakeRoute([
  // 线路列表
  {
    url: "/backend/pay_channel_service",
    method: "get",
    response: () => ({ success: true, data: { list: channels } })
  },
  // 新增存款
  {
    url: "/fake/tools/payment/deposit",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 搜寻存款
  {
    url: "/fake/tools/payment/deposit",
    method: "get",
    response: () => ({
      success: true,
      data: { list: genList(15), total: 15 }
    })
  },
  // 删除存款
  {
    url: "/fake/tools/payment/deldeposit",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 重算会员基本报表存提
  {
    url: "/backend/report/tool/recalcreportmemberdaily",
    method: "get",
    response: () => ({
      success: true,
      data: { list: genList(10), total: 10 }
    })
  }
]);
