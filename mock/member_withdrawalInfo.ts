import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 服務類型（提款方式）
const services = [
  { serviceCode: "BANK", name: "银行卡" },
  { serviceCode: "USDT", name: "USDT" },
  { serviceCode: "ALIPAY", name: "支付宝" }
];

const banks = [
  { bankName: "中国工商银行", bankCode: "ICBC" },
  { bankName: "中国建设银行", bankCode: "CCB" },
  { bankName: "中国农业银行", bankCode: "ABC" }
];

const areas = ["广东省", "北京市", "上海市", "江苏省"];
const branches = ["天河支行", "海淀支行", "浦东支行", "鼓楼支行"];

const all = Array.from({ length: 16 }).map((_, i) => {
  const svc = services[i % services.length];
  const bank = banks[i % banks.length];
  return {
    userID: 100000 + i,
    userAccount: `member${i + 1}`,
    name: `提款人${i + 1}`,
    serviceCode: svc.serviceCode,
    serviceName: svc.name,
    address:
      svc.serviceCode === "USDT"
        ? `TXk${i}abcdef1234567890hijklmn`
        : `622848${String(1000000000000 + i)}`,
    bankName: svc.serviceCode === "BANK" ? bank.bankName : "",
    bankCode: svc.serviceCode === "BANK" ? bank.bankCode : "",
    area: svc.serviceCode === "BANK" ? areas[i % areas.length] : "",
    branch: svc.serviceCode === "BANK" ? branches[i % branches.length] : "",
    isDefault: i % 3 === 0 ? 1 : 0,
    status: i % 5 === 0 ? 0 : 1,
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:45:00`
  };
});

export default defineFakeRoute([
  {
    url: "/backend/info/withdrawal/dropdown",
    method: "get",
    response: () => ({ success: true, data: { services } })
  },
  {
    url: "/backend/info/withdrawal",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.address) {
        list = list.filter(v => v.address.includes(query.address));
      }
      if (query.serviceCode) {
        list = list.filter(v => v.serviceCode === query.serviceCode);
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
