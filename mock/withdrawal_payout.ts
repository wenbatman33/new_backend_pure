import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 出款頁 mock：涵蓋會員資訊 / 出款單 / 提款歷史 / 出款 / 回調 / 轉成功失敗 / 銀行卡 / USDT / 三方通道

// 出款單列表（含已出款中與未出款的列）
const payouts = [
  {
    id: 1,
    send_id: "6212********1234",
    amount: 5000,
    payType: { key: 1, value: "银行卡" },
    payID: { key: 11, value: "招商银行 6212****1234" },
    fee: 0,
    status: { key: 3, value: "成功" },
    thirdSn: "TX20260601001",
    editorName: "admin",
    updatedAt: "2026-06-01 10:20:30"
  },
  {
    id: 2,
    send_id: "6212********5678",
    amount: 3000,
    payType: { key: 2, value: "商户通道A" },
    payID: { key: 21, value: "通道A SN001" },
    fee: 15,
    status: { key: 1, value: "出款中" },
    thirdSn: "TX20260601002",
    editorName: "operator01",
    updatedAt: "2026-06-01 11:05:00"
  },
  {
    id: 3,
    send_id: "TUSDTaddr...abcd",
    amount: 2000,
    payType: { key: 3, value: "USDT" },
    payID: { key: 31, value: "USDT钱包 - TUSDTaddr...abcd" },
    fee: 1,
    otherAmount: 280,
    exchangeRate: 7.1,
    status: { key: 0, value: "未知" },
    thirdSn: "",
    editorName: "",
    updatedAt: "2026-06-01 12:00:00"
  }
];

// 銀行卡清單
const bankcards = Array.from({ length: 5 }).map((_, i) => ({
  ID: 11 + i,
  cardNo: `6212****${String(1000 + i)}`
}));

// 三方通道清單
const payChannels = Array.from({ length: 5 }).map((_, i) => ({
  id: 21 + i,
  name: `商户通道${String.fromCharCode(65 + i)}`,
  sn: `SN00${i + 1}`,
  apFee: 5,
  apPerFee: 2
}));

// USDT 錢包清單
const usdtList = Array.from({ length: 4 }).map((_, i) => ({
  id: 31 + i,
  name: `USDT钱包${i + 1}`,
  address: `TUSDTaddr...${String.fromCharCode(97 + i)}${String.fromCharCode(98 + i)}cd`
}));

// 提款歷史紀錄
const history = Array.from({ length: 6 }).map((_, i) => ({
  createdAt: `2026-0${(i % 5) + 1}-15 09:${String(10 + i).padStart(2, "0")}:00`,
  name: i % 2 === 0 ? "招商银行" : "工商银行",
  address: `6212****${String(2000 + i)}`,
  success: i % 4 !== 0
}));

export default defineFakeRoute([
  {
    url: "/backend/withdrawal/member/info",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        id: query.id ?? "W202606010001",
        createdAt: "2026-06-01 09:00:00",
        amount: 10000,
        status: { key: 4, value: "待出款" },
        member: { value: "member001" },
        money: 50000,
        lockMoney: 10000,
        vip: 3
      }
    })
  },
  {
    url: "/backend/withdrawal/payout/info",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        orderSn: query.orderSn ?? "W202606010001",
        account: "member001",
        amount: 10000,
        payAmount: 10000,
        totalAmount: 8000,
        bankcard: "6212****9999",
        bankName: "招商银行",
        withdrawalName: "张三",
        payouts
      }
    })
  },
  {
    url: "/backend/withdrawal/history",
    method: "get",
    response: () => ({ success: true, data: { list: history } })
  },
  {
    url: "/backend/withdrawal/pay",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/withdrawal/callback",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/withdrawal/payout/fail",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/withdrawal/payout/success",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay_bankcard/bankcards",
    method: "get",
    response: () => ({ success: true, data: { list: bankcards, total: bankcards.length } })
  },
  {
    url: "/backend/pay/usdt",
    method: "get",
    response: () => ({ success: true, data: { list: usdtList, total: usdtList.length } })
  },
  {
    url: "/backend/pay/pay_channel",
    method: "get",
    response: () => ({ success: true, data: { list: payChannels, total: payChannels.length } })
  }
]);
