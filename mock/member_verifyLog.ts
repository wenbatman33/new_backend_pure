import { defineFakeRoute } from "vite-plugin-fake-server/client";

// type：1 简讯 / 2 Email
// actType / actBehav 组合对应操作行为
const actTypes = [
  { actType: 1002, actBehav: 0 },
  { actType: 1011, actBehav: 0 },
  { actType: 2001, actBehav: 0 },
  { actType: 200, actBehav: 1 },
  { actType: 200, actBehav: 2 },
  { actType: 200, actBehav: 4 }
];

const list = Array.from({ length: 16 }).map((_, i) => {
  const at = actTypes[i % actTypes.length];
  return {
    id: 10000 + i,
    type: (i % 2) + 1,
    actType: at.actType,
    actBehav: at.actBehav,
    account: i % 5 === 0 ? "0" : `member${i + 1}`,
    target: i % 2 === 0 ? `0912${String(100000 + i)}` : `user${i + 1}@mail.com`,
    created_date: `2026-06-0${(i % 9) + 1} 14:${String((i % 60)).padStart(2, "0")}:00`,
    response: i % 3 === 0 ? "success" : `{"status":"ok","msgId":${1000 + i}}`
  };
});

export default defineFakeRoute([
  // 验证记录列表
  {
    url: "/backend/sms/log",
    method: "get",
    response: ({ query }) => {
      let data = list;
      if (query.account) {
        data = data.filter(v => v.account.includes(query.account));
      }
      if (query.target) {
        data = data.filter(v => v.target.includes(query.target));
      }
      if (query.type && Number(query.type) !== 0) {
        data = data.filter(v => v.type === Number(query.type));
      }
      return { success: true, data: { list: data, total: data.length } };
    }
  },
  // 验证信息详情
  {
    url: "/backend/sms/detail",
    method: "get",
    response: ({ query }) => {
      const id = query.id;
      return {
        success: true,
        data: {
          verifyData: `验证资料内容 #${id}`,
          code: String(100000 + Number(id ?? 0)).slice(-6),
          context: `您的验证码为 ${String(100000 + Number(id ?? 0)).slice(-6)}，请于 5 分钟内完成验证。`
        }
      };
    }
  },
  // 操作记录
  {
    url: "/backend/sms/operate",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.id ?? 0);
      const logs = Array.from({ length: 5 }).map((_, i) => ({
        id: id * 10 + i,
        createdAt: `2026-06-0${(i % 9) + 1} 09:${String(i * 7).padStart(2, "0")}:00`,
        adminAccount: i % 2 === 0 ? "admin" : "operator01",
        action: i % 2 === 0 ? "查看" : "重发",
        status: i % 2 === 0 ? 1 : 0,
        note: i % 2 === 0 ? "OTP 验证成功" : "OTP 验证失败"
      }));
      return { success: true, data: { list: logs, total: logs.length } };
    }
  }
]);
