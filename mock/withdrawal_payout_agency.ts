import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理出款（手動拆單）模組 mock

// 提款主資料
const withdrawalDetail = {
  id: 880001,
  createdAt: "2026-05-20 14:30:00",
  amount: 5000,
  statusStr: "待出款",
  status: 1,
  agencyAccount: "agency001",
  bankName: "中国银行",
  bankcard: "6222 **** **** 1234",
  thirdID: "BOC",
  member: { key: 100001, value: "agency001" }
};

// 已存在的出款明細（部分已出款 / 已成功 / 已失败）
const payouts = [
  {
    id: 1,
    send_id: "SND-0001",
    amount: 2000,
    payType: { key: 1, value: "银行卡" },
    payID: { key: 11, value: "6222 **** 1234" },
    fee: 0,
    otherAmount: 0,
    exchangeRate: 0,
    status: { key: 3, value: "成功" },
    updatedAt: "2026-05-20 15:00:00",
    thirdSn: "TX-998877",
    editorName: "operator01"
  },
  {
    id: 2,
    send_id: "SND-0002",
    amount: 1500,
    payType: { key: 2, value: "三方通道" },
    payID: { key: 21, value: "ChannelA AP01" },
    fee: 30,
    otherAmount: 0,
    exchangeRate: 0,
    status: { key: 1, value: "出款中" },
    updatedAt: "2026-05-20 15:10:00",
    thirdSn: "TX-998878",
    editorName: "operator02"
  }
];

// 银行卡清单
const bankcardList = Array.from({ length: 5 }).map((_, i) => ({
  ID: 11 + i,
  cardNo: `6222 **** **** ${1234 + i}`
}));

// 三方通道清单
const payChannelList = Array.from({ length: 5 }).map((_, i) => ({
  id: 21 + i,
  name: `Channel${String.fromCharCode(65 + i)}`,
  sn: `AP0${i + 1}`,
  apFee: 5 + i,
  apPerFee: 2
}));

// USDT 清单
const usdtList = Array.from({ length: 4 }).map((_, i) => ({
  id: 31 + i,
  name: `USDT-Wallet${i + 1}`,
  address: `T${i}xAbc...${1000 + i}`
}));

export default defineFakeRoute([
  // 提款主资料
  {
    url: "/backend/withdrawal/agency/info",
    method: "get",
    response: () => ({ success: true, data: withdrawalDetail })
  },
  // 出款资讯
  {
    url: "/backend/withdrawal/payout/info",
    method: "get",
    response: () => ({
      success: true,
      data: { payAmount: 5000, payouts }
    })
  },
  // 银行卡清单
  {
    url: "/backend/pay_bankcard/bankcards",
    method: "get",
    response: () => ({
      success: true,
      data: { list: bankcardList, total: bankcardList.length }
    })
  },
  // 三方通道清单
  {
    url: "/backend/pay/pay_channel",
    method: "get",
    response: () => ({
      success: true,
      data: { list: payChannelList, total: payChannelList.length }
    })
  },
  // USDT 清单
  {
    url: "/backend/pay/usdt",
    method: "get",
    response: () => ({
      success: true,
      data: { list: usdtList, total: usdtList.length }
    })
  },
  // 手动出款
  {
    url: "/backend/withdrawal/pay",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 查询三方回调
  {
    url: "/backend/withdrawal/callback",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 出款单转失败
  {
    url: "/backend/withdrawal/payout/fail",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 出款单转成功
  {
    url: "/backend/withdrawal/payout/success",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
