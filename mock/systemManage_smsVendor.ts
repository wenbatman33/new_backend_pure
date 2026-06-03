import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 簡訊供應商假資料（status: 1 啟用 / 2 停用）
const names = [
  "Twilio",
  "Nexmo",
  "AWS SNS",
  "Aliyun SMS",
  "Tencent Cloud SMS",
  "Mitake",
  "Every8d",
  "SendCloud",
  "Submail",
  "Yunpian",
  "Plivo",
  "MessageBird",
  "Infobip",
  "Bandwidth"
];

const list = names.map((displayName, i) => ({
  id: i + 1,
  status: i === 0 ? 1 : 2, // 只有第一筆為啟用中
  displayName,
  quota: i % 4 === 0 ? 80 : 1000 + i * 137,
  credit: 500 + i * 50,
  successRate: `${(90 + (i % 10)).toFixed(0)}%`,
  backendUrl: `https://console.${displayName.toLowerCase().replace(/\s+/g, "")}.com`,
  username: `user_${i + 1}`,
  password: "******",
  key: `key_${i + 1}`,
  secret: `secret_${i + 1}`,
  apiUrl: `https://api.${displayName.toLowerCase().replace(/\s+/g, "")}.com/send`,
  template: `template_${i + 1}`,
  param: `param_${i + 1}`,
  apiParam:
    i % 3 === 0
      ? { appId: `app_${i + 1}`, region: "ap-southeast-1" }
      : {}
}));

export default defineFakeRoute([
  // 取得簡訊供應商列表（無分頁，後端一次回傳全部）
  {
    url: "/backend/sms/vendor",
    method: "get",
    response: () => ({
      success: true,
      data: { list, total: list.length }
    })
  },
  // 啟用/停用切換
  {
    url: "/backend/sms/vendor",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 編輯供應商設定
  {
    url: "/backend/sms/vendor/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
