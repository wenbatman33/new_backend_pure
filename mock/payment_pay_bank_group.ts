import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 銀行卡金流組別假資料（source: 1 會員 / 2 代理）
const remarks = ["主要組別", "備用通道", "高額專用", "風控限制", "測試組別"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  ID: i + 1,
  name: i === 0 ? "刚注册" : `银行卡组别${i + 1}`,
  nameEn: i === 0 ? "NewRegister" : `BankGroup${i + 1}`,
  source: (i % 2) + 1,
  remark: remarks[i % remarks.length],
  payChannelServiceName: `通道服务${(i % 4) + 1}`,
  payChannelServiceCnt: (i % 5) + 1,
  memberCnt: (i * 7) % 120,
  depositLower: 100 * (i + 1),
  depositUpper: 100000 * (i + 1),
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updatedUserName: i % 3 === 0 ? "admin" : "operator0" + ((i % 3) + 1)
}));

export default defineFakeRoute([
  {
    // 金流組別列表
    url: "/backend/pay_group/groups",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(
          v => v.name.includes(query.name) || v.nameEn.includes(query.name)
        );
      }
      if (query.source !== undefined && query.source !== "") {
        list = list.filter(v => v.source === Number(query.source));
      }
      const total = list.length;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 10;
      const pageList = list.slice((page - 1) * pageSize, page * pageSize);
      return { success: true, data: { list: pageList, total } };
    }
  },
  {
    // 新增金流組別
    url: "/backend/pay_group/group",
    method: "post",
    response: () => ({ success: true, data: { ID: all.length + 1 } })
  },
  {
    // 修改金流組別
    url: "/backend/pay_group/group",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 加入會員
    url: "/backend/pay_group/member",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 加入代理
    url: "/backend/pay_group/agency",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
