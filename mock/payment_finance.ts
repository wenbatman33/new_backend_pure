import { defineFakeRoute } from "vite-plugin-fake-server/client";

// payment / finance 顯示項目（充值線路）模組 mock
const names = [
  "微信支付",
  "支付寶",
  "銀行卡轉帳",
  "USDT 充值",
  "雲閃付",
  "快捷支付",
  "網銀支付",
  "數字人民幣",
  "京東支付",
  "QQ 錢包",
  "翼支付",
  "聚合掃碼",
  "ApplePay",
  "GooglePay",
  "信用卡"
];

const list = names.map((name, i) => ({
  id: i + 1,
  name,
  note: i % 3 === 0 ? "推薦通道" : "",
  currency: (i % 4) + 1,
  nums: (i % 5) + 1,
  status: i % 4 === 0 ? 2 : 1,
  maintain: i % 5 === 0 ? 1 : 2,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01",
  isDefault: i === 0,
  filterSetting: i % 2 === 0 ? [1, 2] : [3],
  icon: "",
  isRecommend: i % 3 === 0,
  needRealName: i % 4 === 0,
  tooltip: "",
  hasDoc: false,
  docTitle: "",
  docURL: "",
  quickAmount: "100,200,500,1000"
}));

export default defineFakeRoute([
  {
    url: "/backend/finance",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query.status && Number(query.status) !== 0) {
        result = result.filter(v => v.status === Number(query.status));
      }
      if (query.maintain && Number(query.maintain) !== 0) {
        result = result.filter(v => v.maintain === Number(query.maintain));
      }
      return {
        success: true,
        data: {
          list: result,
          total: result.length,
          depositAllowChoosePayChannelService: true
        }
      };
    }
  },
  {
    url: "/backend/finance/create",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/finance/edit",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/finance/finance_delete",
    method: "delete",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/finance/setdefault",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/payment/deposit/default/amount/config",
    method: "get",
    response: () => ({
      success: true,
      data: { amount: "100,200,500,1000,2000" }
    })
  },
  {
    url: "/backend/payment/deposit/default/amount/config",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  }
]);
