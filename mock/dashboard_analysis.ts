import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 儀表板分析頁假資料。舊模組為純靜態圖表頁（無真實 API），
// 此處以合成 endpoint /backend/dashboard/analysis 提供圖表資料，欄位與 hook/types 對齊。
const hours = Array.from({ length: 18 }).map((_, i) => `${i + 6}:00`);
const months = Array.from({ length: 12 }).map((_, i) => `dashboard.month${i + 1}`);

export default defineFakeRoute([
  {
    url: "/backend/dashboard/analysis",
    method: "get",
    response: () => ({
      success: true,
      data: {
        growCardList: [
          {
            icon: "ep:view",
            titleKey: "dashboard.visitNumber",
            value: 2000,
            total: 120000,
            color: "#41b584",
            actionKey: "dashboard.cycleMonth"
          },
          {
            icon: "ri:money-cny-circle-line",
            titleKey: "dashboard.turnover",
            value: 20000,
            total: 500000,
            color: "#409eff",
            actionKey: "dashboard.cycleMonth"
          },
          {
            icon: "ep:download",
            titleKey: "dashboard.downloadNumber",
            value: 8000,
            total: 120000,
            color: "#e6a23c",
            actionKey: "dashboard.cycleWeek"
          },
          {
            icon: "ri:exchange-line",
            titleKey: "dashboard.dealCount",
            value: 5000,
            total: 50000,
            color: "#a259ff",
            actionKey: "dashboard.cycleYear"
          }
        ],
        visitTrend: {
          xAxis: hours,
          series1: [
            111, 222, 4000, 18000, 33333, 55555, 66666, 33333, 14000, 36000,
            66666, 44444, 22222, 11111, 4000, 2000, 500, 333
          ],
          series2: [
            33, 66, 88, 333, 3333, 5000, 18000, 3000, 1200, 13000, 22000, 11000,
            2221, 1201, 390, 198, 60, 30
          ]
        },
        visitBar: {
          xAxis: months,
          data: [
            3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000,
            3200
          ]
        },
        radar: {
          indicator: [
            { textKey: "dashboard.radarComputer", max: 100 },
            { textKey: "dashboard.radarCharger", max: 100 },
            { textKey: "dashboard.radarHeadset", max: 100 },
            { textKey: "dashboard.radarPhone", max: 100 },
            { textKey: "dashboard.radarIpad", max: 100 },
            { textKey: "dashboard.radarKeyboard", max: 100 }
          ],
          visit: [90, 50, 86, 40, 50, 20],
          buy: [70, 75, 70, 76, 20, 85]
        },
        visitSource: [
          { value: 1048, name: "搜索引擎" },
          { value: 735, name: "直接访问" },
          { value: 580, name: "邮件营销" },
          { value: 484, name: "联盟广告" }
        ],
        salesPie: [
          { value: 500, name: "电子产品" },
          { value: 310, name: "服装" },
          { value: 274, name: "化妆品" },
          { value: 400, name: "家居" }
        ]
      }
    })
  }
]);
