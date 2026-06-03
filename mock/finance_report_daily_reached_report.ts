import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 線路名稱對照（key -> 顯示名稱）
const channels: Record<string, string> = {
  c1: "支付宝线路A",
  c2: "微信线路B",
  c3: "USDT线路C"
};
const channelNames = [...Object.values(channels), "TOTAL"];

// 產生報表列（每小時一列）
function buildList(rows = 14) {
  const list: Record<string, any>[] = [];
  for (let i = 0; i < rows; i++) {
    const row: Record<string, any> = {
      date: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
      time: `${String(i % 24).padStart(2, "0")}:00`
    };
    channelNames.forEach((name, idx) => {
      const base = (i + 1) * (idx + 1);
      row[`${name}_amount`] = base * 1000 + idx * 137;
      row[`${name}_count`] = base + idx;
    });
    list.push(row);
  }
  return list;
}

export default defineFakeRoute([
  // 進款統計報表
  {
    url: "/backend/report/channel/deposit",
    method: "get",
    response: () => {
      const list = buildList(14);
      return {
        success: true,
        data: {
          channels,
          list,
          count: list.length,
          updatedAt: "2026-06-02 12:30:00"
        }
      };
    }
  },
  // 支付方式下拉（serviceCode 為 [{key:label}] 結構）
  {
    url: "/backend/pay_channel_service/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        groups: [],
        status: [],
        method: [],
        serviceCode: [
          { ali: "支付宝" },
          { wx: "微信" },
          { usdt: "USDT" },
          { union: "银联" }
        ]
      }
    })
  },
  // 商戶號（線路 id）下拉
  {
    url: "/backend/pay/pay_channel/4report",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: i + 1,
          name: `线路${i + 1}`
        }))
      }
    })
  }
]);
