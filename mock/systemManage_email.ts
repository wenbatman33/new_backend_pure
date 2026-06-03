import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 郵件廠商假資料
const vendors = ["Mailgun", "SendGrid", "Amazon SES", "Postmark", "SMTP"];
const all = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: vendors[i % vendors.length] + `-${i + 1}`,
  domain: `mail${i + 1}.example.com`,
  key: `key_${Math.random().toString(36).slice(2, 14)}`,
  from: `noreply${i + 1}@example.com`,
  subject: `系统通知 #${i + 1}`,
  templet: `<p>尊敬的用户您好，这是第 ${i + 1} 个邮件模板内容。</p>`,
  // status: 1 表示已启用
  status: i === 0 ? 1 : 0
}));

export default defineFakeRoute([
  {
    url: "/backend/email/vendor",
    method: "get",
    response: () => {
      return { success: true, data: { list: all, total: all.length } };
    }
  },
  {
    // 启用廠商
    url: "/backend/email/vendor",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 编辑廠商
    url: "/backend/email/vendor/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
