import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理存款假資料
const statuses = [1, 2, 3, 4, 5, 6];
const types = [1, 2, 4];
const payments = ["支付宝", "微信", "USDT", "银行卡"];
const lines = ["线路A", "线路B", "线路C"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: `AD${20260600 + i}`,
  type: types[i % types.length],
  memberAccount: `agent${i + 1}`,
  memberName: `代理${i + 1}`,
  memberID: 50000 + i,
  amount: (i + 1) * 1000,
  fee: (i + 1) * 5,
  status: statuses[i % statuses.length],
  depositName: `存款人${i + 1}`,
  gatway: lines[i % lines.length],
  payment: payments[i % payments.length],
  thirdID: `T${900000 + i}`,
  bankcard: i % 2 === 0 ? `6222${1000 + i}` : "",
  device: 1,
  balanceDate: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
  editorName: i % 3 === 0 ? "admin" : "operator01",
  createdAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 10:${String((i % 60)).padStart(2, "0")}:00`,
  updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 11:${String((i % 60)).padStart(2, "0")}:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/pay/deposit",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.id) list = list.filter(v => v.id.includes(query.id));
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.memberName) {
        list = list.filter(v => v.memberAccount.includes(query.memberName));
      }
      const amount = list.reduce((s, v) => s + v.amount, 0);
      const fee = list.reduce((s, v) => s + v.fee, 0);
      return {
        success: true,
        data: {
          list,
          count: list.length,
          amount,
          fee,
          erctotal: 0,
          trctotal: 0
        }
      };
    }
  },
  {
    url: "/backend/payment/beep",
    method: "post",
    response: () => ({ success: true, data: { hasAgencyDeposit: false } })
  },
  {
    url: "/backend/pay/deposit",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/callback",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/fee",
    method: "post",
    response: () => ({ success: true, data: { fee: 88 } })
  },
  {
    url: "/backend/pay/deposit/note",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            note: "系统自动建单",
            author: "system",
            createdAt: "2026-06-01 10:00:00"
          },
          {
            id: 2,
            note: "人工审核通过",
            author: "admin",
            createdAt: "2026-06-01 10:05:00"
          }
        ]
      }
    })
  },
  {
    url: "/backend/pay/deposit/note",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/balancedate",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/hardcancel",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/hardsuccess",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay/deposit/review",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/pay_channel_service/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { serviceCode: [{ alipay: "支付宝" }, { wechat: "微信" }, { usdt: "USDT" }] }
    })
  },
  {
    url: "/backend/pay/pay_channel",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, sn: "PC001" },
          { id: 2, sn: "PC002" }
        ]
      }
    })
  },
  {
    url: "/backend/pay/pay_channel_name",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, name: "商户甲" },
          { id: 2, name: "商户乙" }
        ]
      }
    })
  },
  {
    url: "/backend/pay_channel_service/",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, name: "线路A", status: 1 },
          { id: 2, name: "线路B", status: 1 },
          { id: 3, name: "线路C", status: 2 }
        ]
      }
    })
  }
]);
