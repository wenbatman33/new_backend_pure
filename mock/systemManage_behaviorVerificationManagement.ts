import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 行為驗證（人機驗證）廠商線路 — status: 1 啟用 / 2 關閉
const vendorNames = [
  "腾讯防水墙",
  "顶象验证",
  "极验 Geetest",
  "网易易盾",
  "阿里云验证码",
  "数美验证",
  "瑞数动态防护",
  "Google reCAPTCHA",
  "Cloudflare Turnstile",
  "hCaptcha",
  "字节火山验证",
  "百度云加速验证"
];

const list = vendorNames.map((name, i) => ({
  id: i + 1,
  // 僅第一條預設啟用，其餘關閉（互斥）
  status: i === 0 ? 1 : 2,
  name,
  pcAppID: `pc_app_${1000 + i}`,
  pcAppSecret: `pc_secret_${Math.random().toString(36).slice(2, 10)}`,
  h5AppID: `h5_app_${2000 + i}`,
  h5AppSecret: `h5_secret_${Math.random().toString(36).slice(2, 10)}`,
  captchaUrl: `https://captcha.vendor${i + 1}.com/api/verify`,
  boUrl: `https://bo.vendor${i + 1}.com/console`,
  secretID: `sid_${3000 + i}`,
  secretKey: `skey_${Math.random().toString(36).slice(2, 12)}`,
  pendingStatus: false
}));

export default defineFakeRoute([
  {
    // 列表
    url: "/backend/actionverifyline/list",
    method: "get",
    response: () => {
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 單筆明細（編輯時讀取）
    url: "/backend/actionVerifyLine",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.id);
      const detail = list.find(v => v.id === id) ?? list[0];
      return { success: true, data: detail };
    }
  },
  {
    // 編輯儲存
    url: "/backend/actionVerifyLine",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 關閉線路
    url: "/backend/actionVerifyLine/turnOff",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 啟用線路
    url: "/backend/actionVerifyLine/turnOn",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
