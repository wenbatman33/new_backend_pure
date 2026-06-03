import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提現渠道動態設定假資料（10~20 筆）
const services = [
  "USDT-TRC20",
  "USDT-ERC20",
  "BankCard",
  "Alipay",
  "WeChatPay",
  "QuickPay",
  "Crypto-BTC",
  "Crypto-ETH",
  "OnlineBank",
  "ThirdPay-A",
  "ThirdPay-B",
  "ThirdPay-C"
];

const dynamicConfigs = services.map((name, i) => ({
  serviceCode: `SVC_${i + 1}`,
  serviceName: name,
  min: 100,
  max: 50000,
  minAgency: 200,
  maxAgency: 100000,
  maxAddressCount: 5,
  icon: "",
  available: i % 3 !== 0,
  maintain: i % 4 === 0,
  type: 0,
  docTitle: `${name} 说明`,
  docURL: `https://example.com/doc/${i + 1}`,
  downloadTitle: `${name} 下载`,
  downloadURL: `https://example.com/download/${i + 1}`
}));

const paymentConfig = {
  dynamicConfigs,
  depositTimeoutMinutes: 30,
  depositProcessLimit: 5,
  autoPayoutEnable: true,
  depositRemarkShow: false,
  autoPayoutDayTotalAmount: 1000000,
  autoPayoutAmountMax: 50000,
  skipPayingThird: false,
  defaultWithdrawTimesLimit: 5,
  defaultWithdrawAmountLimit: 200000,
  defaultSingleWithdrawAmountLimit: 20000
};

// USDT 匯率列表
const makeRate = (name: string) => ({
  displayName: name,
  type: 0,
  percentageMultiplier: 1,
  addendRate: 0,
  customRate: 7.2,
  scale: 2,
  publicRate: 7.18,
  finalRate: 7.18
});

const usdtConfig = {
  deposit: ["USDT", "BTC", "ETH"].map(makeRate),
  withdrawal: ["USDT", "BTC", "ETH"].map(makeRate)
};

export default defineFakeRoute([
  {
    url: "/backend/payment/config",
    method: "get",
    response: () => ({ success: true, data: paymentConfig })
  },
  {
    url: "/backend/payment/config",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/payment/rate/config",
    method: "get",
    response: () => ({ success: true, data: usdtConfig })
  },
  {
    url: "/backend/payment/rate/config",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
