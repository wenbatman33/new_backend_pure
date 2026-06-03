import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 團隊報表：list 為 7 個時間區段（today/yesterday/thisWeek/lastWeek/thisMonth/lastMonth/custom）
function rnd(min: number, max: number, fixed = 0) {
  const v = Math.random() * (max - min) + min;
  return fixed === 0 ? Math.round(v) : Number(v.toFixed(fixed));
}

function makeSegment(seed: number) {
  const recharge = rnd(10000, 500000, 2);
  const withdraw = rnd(5000, 300000, 2);
  const bet = rnd(20000, 800000, 2);
  // 公司輸贏（正數=下級盈利，可能正可能負）
  const win = rnd(-100000, 100000, 2);
  const bonus = rnd(1000, 50000, 2);
  return {
    loginMemberCount: rnd(50, 500),
    registerMemberCount: rnd(5, 100),
    firstDepositMemberCount: rnd(1, 60),
    totalBonus: bonus,
    totalBonusMemberCount: rnd(1, 80),
    betAmount: bet,
    winAmount: win,
    betMemberCount: rnd(10, 200),
    rechargeAmount: recharge,
    rechargeMemberCount: rnd(5, 150),
    withdrawAmount: withdraw,
    withdrawMemberCount: rnd(3, 100),
    // 團隊盈虧 = 存款 - 提款 - 紅利（最後一段模擬無資料）
    netProfit:
      seed === 6 ? null : Number((recharge - withdraw - bonus).toFixed(2))
  };
}

const list = Array.from({ length: 7 }).map((_, i) => makeSegment(i));

export default defineFakeRoute([
  {
    url: "/backend/report/teamAgency",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list,
          teamAgencyCount: 128
        }
      };
    }
  },
  {
    // 匯出（前端走 XHR 下載，這裡僅回傳成功避免 404）
    url: "/backend/report/teamAgency/export",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
