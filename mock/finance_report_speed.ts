import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生長度 24 的假資料陣列（對應 0~23 時段）
function genArr(base: number, variance: number): number[] {
  return Array.from({ length: 24 }).map((_, i) =>
    Math.round(base + Math.random() * variance + i * (base / 24))
  );
}

export default defineFakeRoute([
  {
    url: "/backend/report/payment/speed",
    method: "get",
    response: () => {
      const depositSpeed = genArr(30, 60); // 秒
      const withdrawalSpeed = genArr(50, 120);
      return {
        success: true,
        data: {
          depositTotalSpeed: 45.32,
          withdrawalTotalSpeed: 88.71,
          depositCount: genArr(20, 80),
          depositAmount: genArr(5000, 50000),
          depositSpeed,
          withdrawalCount: genArr(10, 50),
          withdrawalAmount: genArr(8000, 60000),
          withdrawalSpeed,
          payoutSpeed: genArr(40, 80),
          withdrawalRiskCheckSpeed: genArr(60, 100),
          withdrawalFinancialCheckSpeed: genArr(50, 90)
        }
      };
    }
  }
]);
