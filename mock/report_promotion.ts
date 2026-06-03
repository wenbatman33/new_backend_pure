import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 优惠项目定义
const promotions = [
  { promotionID: 101, promotionName: "首充优惠" },
  { promotionID: 102, promotionName: "每日签到" },
  { promotionID: 103, promotionName: "周末返水" },
  { promotionID: 104, promotionName: "VIP 专属" }
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 产生指定日期范围的报表资料
function buildReport(type: number) {
  const days = type === 3 ? 6 : type === 2 ? 8 : 15;
  const list = Array.from({ length: days }).map((_, i) => {
    let date: string;
    if (type === 3) {
      date = `2026-${String(i + 1).padStart(2, "0")}-01`;
    } else if (type === 2) {
      date = `2026-05-${String(i * 7 + 1).padStart(2, "0")}`;
    } else {
      date = `2026-05-${String(i + 1).padStart(2, "0")}`;
    }
    return {
      date,
      list: promotions.map(p => ({
        promotionID: p.promotionID,
        promotionName: p.promotionName,
        bonus: String(rand(1000, 99999)),
        memberCnt: String(rand(5, 500))
      }))
    };
  });

  // 合计列：依优惠 ID 汇总
  const bonus = promotions.map(p => {
    let sumBonus = 0;
    let sumCnt = 0;
    list.forEach(row => {
      const d = row.list.find(x => x.promotionID === p.promotionID);
      sumBonus += Number(d?.bonus ?? 0);
      sumCnt += Number(d?.memberCnt ?? 0);
    });
    return {
      promotionID: p.promotionID,
      bonus: String(sumBonus),
      memberCnt: String(sumCnt)
    };
  });

  const total = bonus.reduce((acc, b) => acc + Number(b.bonus), 0);

  return { list, bonus, total };
}

export default defineFakeRoute([
  {
    url: "/backend/report/promotion",
    method: "get",
    response: ({ query }) => {
      const type = Number(query?.type ?? 1);
      return {
        success: true,
        data: buildReport(type)
      };
    }
  }
]);
