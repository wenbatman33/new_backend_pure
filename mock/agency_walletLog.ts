import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理钱包异动纪录 假资料
const depoTypes = [1, 2];
const adjUseTypes = [1, 2, 6, 7, 9, 10, 14, 16, 17, 18, 51, 52, 53];
const remarks = ["系统调整", "手动加点", "活动派彩", "扣回错误金额", "结算返水"];

const all = Array.from({ length: 18 }).map((_, i) => {
  const depoWithType = depoTypes[i % depoTypes.length];
  const base = (i + 1) * 1000;
  const adjustMoney = depoWithType === 2 ? -base : base;
  return {
    date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:${String(
      (i % 60)
    ).padStart(2, "0")}:00`,
    agencyID: 200000 + i,
    agencyAccount: `agency${i + 1}`,
    depoWithType,
    adjUseType: adjUseTypes[i % adjUseTypes.length],
    adjustMoney,
    afterMoney: 1000000 + i * 500,
    remark: remarks[i % remarks.length]
  };
});

const totalAdjustMoney = all.reduce((s, v) => s + v.adjustMoney, 0);

export default defineFakeRoute([
  {
    url: "/backend/agency/walletlogs",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyID) {
        list = list.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      if (query.depoWithType && Number(query.depoWithType) !== 0) {
        list = list.filter(v => v.depoWithType === Number(query.depoWithType));
      }
      if (query.adjUseType && Number(query.adjUseType) !== 0) {
        list = list.filter(v => v.adjUseType === Number(query.adjUseType));
      }
      return {
        success: true,
        data: { list, total: list.length, totalAdjustMoney }
      };
    }
  }
]);
