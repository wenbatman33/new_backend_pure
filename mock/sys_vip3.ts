import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 產生某個 job 群組的假紀錄；含 response / bet_item JSON 欄位
function makeRows(prefix: string, count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    id: 100000 + i,
    member_id: 200000 + i,
    job: prefix,
    bet_amount: (i + 1) * 100,
    water: ((i + 1) * 100 * 0.008).toFixed(2),
    status: i % 2 === 0 ? "success" : "fail",
    bet_item: JSON.stringify({
      game: `${prefix}_game_${i}`,
      odds: 1.95,
      lines: [1, 3, 5]
    }),
    response: JSON.stringify({
      code: 0,
      msg: "ok",
      ref: `${prefix}-${i}-${Date.now()}`
    }),
    created_at: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`
  }));
}

export default defineFakeRoute([
  {
    // 沿用舊 endpoint：GET /backend/vipjob/log?id=xxx
    // 回傳物件：key 為 job 名稱、value 為該 job 紀錄陣列
    url: "/backend/vipjob/log",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          rebate_job: makeRows("rebate", 12),
          giftmoney_job: makeRows("giftmoney", 8),
          // 空陣列：頁面應自動略過不渲染
          empty_job: []
        }
      };
    }
  }
]);
