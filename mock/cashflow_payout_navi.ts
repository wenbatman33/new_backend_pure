import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 出款面板假資料：12 筆三方出款通道
const channels = [
  "聚合支付A",
  "银联快捷B",
  "网银扫码C",
  "支付宝D",
  "微信E",
  "云闪付F",
  "数字货币G",
  "代收通道H",
  "快捷支付I",
  "网关支付J",
  "三方钱包K",
  "聚合代付L"
];

const list = channels.map((name, i) => ({
  id: i + 1,
  sort: (i + 1) * 10,
  name,
  thirdBalance: `${(100000 - i * 3210).toLocaleString()},冻结 ${(i * 500).toLocaleString()}`,
  thirdSecondBalance: (50000 + i * 1234).toLocaleString(),
  paying: i % 3 === 0,
  status: i % 4 === 0 ? 2 : 1,
  eighteenApLowerLimit: String(100 + i * 50),
  eighteenApUpperLimit: String(50000 + i * 1000)
}));

export default defineFakeRoute([
  {
    // 出款面板列表
    url: "/backend/withdrawal/payout/navi",
    method: "get",
    response: () => ({
      success: true,
      data: { list, total: list.length }
    })
  },
  {
    // 出款面板排序
    url: "/backend/withdrawal/payout/navi/sort",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 出款面板狀態開關
    url: "/backend/withdrawal/payout/navi/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 刷新三方餘額：回傳更新後的單列
    url: "/backend/pay/pay_channel/balance",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id) || 1;
      const item = list.find(v => v.id === id) ?? list[0];
      return {
        success: true,
        data: {
          ...item,
          thirdBalance: `${(Math.floor(Math.random() * 100000)).toLocaleString()},冻结 0`
        }
      };
    }
  },
  {
    // 更新 18 單筆限額
    url: "/backend/pay/pay_channel/ap/18limit",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
