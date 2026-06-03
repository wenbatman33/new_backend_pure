import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生長度 23 的整數陣列
function arr(min: number, max: number) {
  return Array.from({ length: 23 }).map(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}

// 由每小時值累積為遞增曲線
function cumulative(src: number[]) {
  let sum = 0;
  return src.map(v => (sum += v));
}

function buildHourReport() {
  const winAmount = arr(-5000, 20000);
  const registerMember = arr(0, 50);
  const firstDepositMember = arr(0, 30);
  return {
    winAmount,
    totalWinAmount: cumulative(winAmount),
    registerMember,
    totalRegisterMember: cumulative(registerMember),
    firstDepositMember,
    totalFirstDepositMember: cumulative(firstDepositMember),
    gameMember: arr(50, 500),
    rechargeMember: arr(10, 120),
    withdrawMember: arr(5, 80),
    rechargeAmount: arr(10000, 200000),
    withdrawAmount: arr(5000, 150000),
    rechargeCount: arr(10, 200),
    withdrawCount: arr(5, 100)
  };
}

export default defineFakeRoute([
  {
    url: "/backend/report/hour",
    method: "get",
    response: () => {
      return { success: true, data: buildHourReport() };
    }
  }
]);
