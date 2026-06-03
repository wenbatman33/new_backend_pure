import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員明細列表假資料
const names = ["王小明", "李大華", "張美麗", "陳志強", "林淑芬"];
const all = Array.from({ length: 18 }).map((_, i) => ({
  id: 100000 + i,
  account: `member${i + 1}`,
  name: names[i % names.length],
  phone: `09${String(10000000 + i).slice(0, 8)}`,
  email: `member${i + 1}@example.com`,
  money: (10000 + i * 137.5).toFixed(2),
  isFirstDeposit: i % 2,
  vipLevel: i % 5,
  current_status: i % 3 === 0 ? 1 : 0,
  deposit_limit: (i % 2) + 1,
  withdraw_limit: (i % 2) + 1,
  status: (i % 3) + 1,
  created_at: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  last_login_at: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 18:20:00`,
  register_ip: `192.168.1.${i + 1}`,
  register_area: "台北",
  last_login_ip: `192.168.2.${i + 1}`,
  last_login_area: "高雄",
  topAgencyID: 9000 + i,
  agency_id: 8000 + i,
  recommenderAccount: `agent${i + 1}`,
  payment_groups: i % 2 === 0 ? "默认支付组" : "VIP支付组",
  bankcard_groups: i % 2 === 0 ? "默认银行卡组" : "VIP银行卡组",
  careerDepositAmount: (50000 + i * 1000).toFixed(2),
  careerWithdrawAmount: (30000 + i * 800).toFixed(2)
}));

export default defineFakeRoute([
  {
    url: "/backend/member/search",
    method: "get",
    response: ({ query }) => {
      let list = all.slice();
      if (query.id) {
        list = list.filter(v => String(v.id).includes(String(query.id)));
      }
      if (query.account) {
        list = list.filter(v => v.account.includes(String(query.account)));
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(String(query.name)));
      }
      if (query.phone) {
        list = list.filter(v => v.phone.includes(String(query.phone)));
      }
      if (query.vip_level !== undefined && query.vip_level !== "") {
        list = list.filter(v => v.vipLevel === Number(query.vip_level));
      }
      if (query.status !== undefined && query.status !== "") {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/sms/reset_sms_usage",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/member/vip/setting/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 5 }).map((_, i) => ({ level: i }))
      }
    })
  }
]);
