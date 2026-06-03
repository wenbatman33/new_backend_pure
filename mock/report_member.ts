import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員相關報表：依日期區間產生每日一列假資料
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRow(date: string) {
  const registerPeople = rnd(50, 300);
  const firstDepositPeople = rnd(20, registerPeople);
  return {
    reportDate: date,
    registerPeople,
    organicRegisterPeople: rnd(10, registerPeople),
    firstDepositPeople,
    firstDepositAmount: rnd(10000, 200000),
    continueDepositCount: rnd(10, 150),
    continueDepositAmount: rnd(20000, 500000),
    organicRegisterFirstDepositPeople: rnd(5, firstDepositPeople),
    registerFirstDepositPeople: rnd(5, firstDepositPeople),
    organicRegisterNotFirstDepositPeople: rnd(5, 100),
    agentRegisterNotFirstDepositPeople: rnd(5, 100),
    loginPeople: rnd(100, 800),
    loginCount: rnd(200, 3000),
    betPeople: rnd(50, 500),
    maxOnlineMember: rnd(50, 400),
    retentionRateDay1: (Math.random() * 100).toFixed(2),
    retentionRateDay3: (Math.random() * 100).toFixed(2),
    retentionRateDay7: (Math.random() * 100).toFixed(2),
    retentionRateDay15: (Math.random() * 100).toFixed(2),
    retentionRateDay30: (Math.random() * 100).toFixed(2),
    registerRetentionDay1: rnd(10, 200),
    registerRetentionRateDay1: (Math.random() * 100).toFixed(2),
    registerRetentionDay3: rnd(10, 200),
    registerRetentionRateDay3: (Math.random() * 100).toFixed(2),
    registerRetentionDay7: rnd(10, 200),
    registerRetentionRateDay7: (Math.random() * 100).toFixed(2),
    registerRetentionDay15: rnd(10, 200),
    registerRetentionRateDay15: (Math.random() * 100).toFixed(2),
    registerRetentionDay30: rnd(10, 200),
    registerRetentionRateDay30: (Math.random() * 100).toFixed(2),
    registerFirstDepositRetentionDay1: rnd(5, 100),
    registerFirstDepositRetentionRateDay1: (Math.random() * 100).toFixed(2),
    registerFirstDepositRetentionDay3: rnd(5, 100),
    registerFirstDepositRetentionRateDay3: (Math.random() * 100).toFixed(2),
    registerFirstDepositRetentionDay7: rnd(5, 100),
    registerFirstDepositRetentionRateDay7: (Math.random() * 100).toFixed(2),
    registerFirstDepositRetentionDay15: rnd(5, 100),
    registerFirstDepositRetentionRateDay15: (Math.random() * 100).toFixed(2),
    registerFirstDepositRetentionDay30: rnd(5, 100),
    registerFirstDepositRetentionRateDay30: (Math.random() * 100).toFixed(2)
  };
}

// 產 15 列（每日）
const list = Array.from({ length: 15 }).map((_, i) =>
  buildRow(`2026-05-${String(i + 1).padStart(2, "0")}`)
);

// 合計列：人數欄加總、比率/金額欄取概略值
const total: Record<string, any> = { lastUpdatedAt: "2026-06-02 03:00:00" };
const sumProps = [
  "registerPeople",
  "organicRegisterPeople",
  "firstDepositPeople",
  "firstDepositAmount",
  "continueDepositCount",
  "continueDepositAmount",
  "organicRegisterFirstDepositPeople",
  "registerFirstDepositPeople",
  "organicRegisterNotFirstDepositPeople",
  "agentRegisterNotFirstDepositPeople",
  "loginPeople",
  "loginCount",
  "betPeople",
  "maxOnlineMember",
  "registerRetentionDay1",
  "registerRetentionDay3",
  "registerRetentionDay7",
  "registerRetentionDay15",
  "registerRetentionDay30",
  "registerFirstDepositRetentionDay1",
  "registerFirstDepositRetentionDay3",
  "registerFirstDepositRetentionDay7",
  "registerFirstDepositRetentionDay15",
  "registerFirstDepositRetentionDay30"
];
sumProps.forEach(p => {
  total[p] = list.reduce((s, r) => s + Number((r as any)[p] || 0), 0);
});
// 比率欄取平均
const rateProps = [
  "retentionRateDay1",
  "retentionRateDay3",
  "retentionRateDay7",
  "retentionRateDay15",
  "retentionRateDay30",
  "registerRetentionRateDay1",
  "registerRetentionRateDay3",
  "registerRetentionRateDay7",
  "registerRetentionRateDay15",
  "registerRetentionRateDay30",
  "registerFirstDepositRetentionRateDay1",
  "registerFirstDepositRetentionRateDay3",
  "registerFirstDepositRetentionRateDay7",
  "registerFirstDepositRetentionRateDay15",
  "registerFirstDepositRetentionRateDay30"
];
rateProps.forEach(p => {
  total[p] = (
    list.reduce((s, r) => s + Number((r as any)[p] || 0), 0) / list.length
  ).toFixed(2);
});

export default defineFakeRoute([
  {
    // 會員相關報表（沿用舊 endpoint）
    url: "/backend/report/memberrelated",
    method: "get",
    response: () => {
      return { success: true, data: { list, total } };
    }
  }
]);
