import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 上下分報表：樹狀彙總假資料（每日一列，內含 2 個明細子列）
function rnd(min: number, max: number, dec = 0) {
  const v = Math.random() * (max - min) + min;
  return dec === 0 ? Math.floor(v) : Number(v.toFixed(dec));
}

const list = Array.from({ length: 15 }).map((_, i) => {
  const date = `2026-05-${String(i + 1).padStart(2, "0")}`;
  const children = ["1", "2"].map(type => ({
    date: type === "1" ? `${date} 上分` : `${date} 下分`,
    amountAdd: type === "1" ? rnd(10000, 80000, 2) : 0,
    amountSub: type === "2" ? rnd(5000, 50000, 2) : 0,
    applyCount: rnd(5, 50),
    applyMember: rnd(3, 40),
    approvedMember: rnd(2, 35),
    applyAmount: rnd(10000, 90000, 2),
    approvedAmount: rnd(8000, 85000, 2)
  }));
  return {
    date,
    amountAdd: children[0].amountAdd,
    amountSub: children[1].amountSub,
    applyCount: children[0].applyCount + children[1].applyCount,
    applyMember: children[0].applyMember + children[1].applyMember,
    approvedMember: children[0].approvedMember + children[1].approvedMember,
    applyAmount: Number(
      (children[0].applyAmount + children[1].applyAmount).toFixed(2)
    ),
    approvedAmount: Number(
      (children[0].approvedAmount + children[1].approvedAmount).toFixed(2)
    ),
    children
  };
});

export default defineFakeRoute([
  {
    url: "/backend/report/adjustment",
    method: "get",
    response: () => {
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
