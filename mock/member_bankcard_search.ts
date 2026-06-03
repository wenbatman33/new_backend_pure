import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 銀行卡查詢 假資料
const banks = ["工商银行", "建设银行", "招商银行", "农业银行", "中国银行"];
const areas = ["广东", "北京", "上海", "浙江", "江苏"];
const branches = ["天河支行", "海淀支行", "浦东支行", "西湖支行", "玄武支行"];

const all = Array.from({ length: 15 }).map((_, i) => ({
  memberId: 100000 + i,
  memberAccount: `member${i + 1}`,
  type: ((i % 4) === 3 ? 5 : (i % 4) + 1), // 1/2/3/5
  name: `持卡人${i + 1}`,
  serviceCode: `SVC${String(1000 + i)}`,
  address: `6222${String(100000000000 + i * 137)}`,
  bankCode: banks[i % banks.length],
  area: areas[i % areas.length],
  branch: branches[i % branches.length],
  isDefault: i % 3 === 0 ? 1 : 0,
  status: i % 5 === 0 ? 0 : 1,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/member/search_bankno",
    method: "get",
    response: ({ query }) => {
      let list = all;
      // 依類型過濾
      if (query.type) {
        list = list.filter(v => v.type === Number(query.type));
      }
      // bankNo（提款帳號）模糊比對
      if (query.bankNo) {
        list = list.filter(v => v.address.includes(String(query.bankNo)));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
