import { defineFakeRoute } from "vite-plugin-fake-server/client";

// VIP 排程工作日誌：依 module/start/end 查詢，回傳動態欄位列表
const modules = ["vipUpgrade", "vipRebate", "vipGift", "vipBirthday"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  module: modules[i % modules.length],
  status: i % 4 === 0 ? "fail" : "success",
  cost: (Math.random() * 1000).toFixed(2),
  url: `https://api.example.com/backend/vipjob/${modules[i % modules.length]}/run?page=${i + 1}`,
  response: `{"code":0,"msg":"ok","handled":${i * 7},"detail":"job ${i + 1} processed for module ${modules[i % modules.length]}"}`,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 0${i % 9}:30:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/vipjob/log/log",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.module) {
        list = list.filter(v => v.module.includes(query.module));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
