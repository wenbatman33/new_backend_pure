import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 金流組別（三方）假資料：source 1=會員 2=代理
const names = [
  "VIP通道",
  "一般通道",
  "高額通道",
  "快速通道",
  "備用通道",
  "测试通道",
  "新会员通道",
  "代理专用",
  "活动通道",
  "夜间通道",
  "周末通道",
  "大额代付"
];

const all = Array.from({ length: 12 }).map((_, i) => ({
  ID: i + 1,
  name: names[i],
  nameEn: `Group${i + 1}`,
  source: (i % 2) + 1,
  remark: i % 3 === 0 ? "默认备注内容" : "",
  payChannelServiceName: `线路${(i % 4) + 1}`,
  payChannelServiceCnt: (i % 5) + 1,
  memberCnt: (i + 1) * 13,
  depositLower: 100 + i * 50,
  depositUpper: 50000 + i * 10000,
  updatedUser: 1000 + i,
  updatedUserName: i % 2 === 0 ? "admin" : "operator01",
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:30`
}));

export default defineFakeRoute([
  {
    // 金流組別列表
    url: "/backend/pay_group/groups",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.source !== undefined && query.source !== "") {
        list = list.filter(v => v.source === Number(query.source));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 取得單一組別
    url: "/backend/pay_group/group",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => v.ID === Number(query.ID));
      return { success: true, data: found ?? all[0] };
    }
  },
  {
    // 新增金流組別
    url: "/backend/pay_group/group",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    // 修改金流組別
    url: "/backend/pay_group/group",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    // 加入會員
    url: "/backend/pay_group/member",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    // 加入代理
    url: "/backend/pay_group/agency",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  }
]);
