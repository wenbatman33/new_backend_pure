import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生單筆代理統計假資料
function makeItem(account: string, parent: string, idx: number) {
  const betAmount = 100000 + idx * 5371;
  const winAmount = 80000 + idx * 4123;
  const returnAmount = 2000 + idx * 137;
  return {
    agencyAccount: account,
    parentAgencyAccount: parent,
    childAgencyCount: (idx % 6) + 1,
    belongMemberCount: 20 + idx * 3,
    betMember: 10 + idx * 2,
    betCount: 300 + idx * 17,
    betAmount,
    winAmount,
    returnAmount,
    totalWinAmount: betAmount - winAmount - returnAmount,
    createdAt: `2026-05-${String((idx % 28) + 1).padStart(2, "0")} 10:30:00`
  };
}

export default defineFakeRoute([
  {
    url: "/backend/agency/team/report",
    method: "get",
    response: ({ query }) => {
      const account = query.agencyAccount || "agency001";
      // 若查的是 agency001 視為頂層（無上層），否則模擬有上層可返回
      const parent = account === "agency001" ? "" : "agency001";

      const mainList = makeItem(account, parent, 0);

      // 下層代理 12 筆
      const childList = Array.from({ length: 12 }).map((_, i) =>
        makeItem(`${account}_child${i + 1}`, account, i + 1)
      );

      return {
        success: true,
        data: { mainList, childList }
      };
    }
  }
]);
