import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 操作記錄假資料
const platforms = ["前台站台（新架构）", "后台", "后端", "代理前台", "91站台"];
const accounts = ["admin", "operator01", "operator02", "deployer"];
const logs = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  time: `2026-05-${String((i % 28) + 1).padStart(2, "0")} ${String(
    8 + (i % 12)
  ).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00`,
  account: accounts[i % accounts.length],
  platform: platforms[i % platforms.length]
}));

// 所有部署 endpoint（POST 觸發發布，回傳成功即可）
const deployUrls = [
  "/backend/jenkins/deploy",
  "/backend/jenkins/deployvd",
  "/backend/jenkins/deployvd88luck18v2",
  "/backend/jenkins/deployvd88agency",
  "/backend/jenkins/deployvdnuxt",
  "/backend/jenkins/deployvd88nuxt",
  "/backend/jenkins/deployvdluck18v2",
  "/backend/jenkins/deploytrnuxt",
  "/backend/jenkins/deployvdbo",
  "/backend/jenkins/deployvd88bo"
];

export default defineFakeRoute([
  // 操作記錄列表
  {
    url: "/backend/deploylogs/logs",
    method: "get",
    response: () => ({
      success: true,
      data: { list: logs, total: logs.length }
    })
  },
  // 各部署 endpoint
  ...deployUrls.map(url => ({
    url,
    method: "post" as const,
    response: () => ({ success: true, data: null })
  }))
]);
