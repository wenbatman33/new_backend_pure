import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 風控報表假資料產生器
const tagPool = ["112", "109", "108", "1003", "1004", "155"];
function genList(start = "2026-05-01", end = "2026-05-31") {
  const rows = Array.from({ length: 16 }).map((_, i) => {
    const win = Math.round((Math.random() - 0.4) * 50000);
    return {
      id: i + 1,
      reportDate: end,
      agencyID: 2000 + (i % 5),
      memberID: 300000 + i,
      memberAccount: `riskUser${i + 1}`,
      tagID: [tagPool[i % tagPool.length], tagPool[(i + 1) % tagPool.length]].join(
        ","
      ),
      betAmount: Math.round(Math.random() * 200000),
      deposit: Math.round(Math.random() * 100000),
      bonus: Math.round(Math.random() * 8000),
      winAmountBack: Math.round(Math.random() * 3000),
      winAmount: win,
      money: Math.round(Math.random() * 50000),
      fine: Math.round(Math.random() * 2000),
      dealwith: i % 3 === 0 ? "已通知客服跟進" : "",
      dealwithWay: i % 2 === 0 ? 1 : 0,
      dealwithDept: i % 2 === 0 ? 2 : 0
    };
  });
  return { rows, start, end };
}

export default defineFakeRoute([
  {
    url: "/backend/report/risk",
    method: "get",
    response: ({ query }) => {
      const { rows, end } = genList(query?.startDate, query?.endDate);
      return {
        success: true,
        data: {
          list: rows,
          total: rows.length,
          latestTime: `${end} 03:00:00`
        }
      };
    }
  },
  {
    url: "/backend/report/risk",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/report/risk",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/report/risk/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        // 處理方式：值對標籤（objectToOptions 會轉成 {label,value}）
        dealwithWay: {
          1: "電話聯繫",
          2: "凍結帳號",
          3: "限制優惠",
          4: "正常觀察"
        },
        // 處理部門
        dealwithDept: {
          1: "客服部",
          2: "風控部",
          3: "財務部"
        }
      }
    })
  },
  {
    url: "/backend/report/risk/calc_today",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
