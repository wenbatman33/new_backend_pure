import { defineFakeRoute } from "vite-plugin-fake-server/client";

// event0054 階層報表假資料（被推薦人三階流水/人數/派發獎勵）
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const all = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  account: `recommended${i + 1}`,
  people1: rand(1, 50),
  eventTurnover1: rand(1000, 99999),
  eventBonus1: rand(10, 999),
  people2: rand(1, 30),
  eventTurnover2: rand(500, 50000),
  eventBonus2: rand(10, 599),
  people3: rand(1, 20),
  eventTurnover3: rand(100, 20000),
  eventBonus3: rand(5, 399)
}));

export default defineFakeRoute([
  {
    url: "/backend/event/event0054/hierarchy",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      // 模擬推薦人帳號搜尋
      if (query.recommenderAccount) {
        list = list.filter(v =>
          v.account.includes(query.recommenderAccount)
        );
      }
      // 模擬排序（orderBy 1~6 對應欄位；order: ascend/descend）
      const orderByField: Record<string, string> = {
        "1": "people1",
        "2": "eventTurnover1",
        "3": "people2",
        "4": "eventTurnover2",
        "5": "people3",
        "6": "eventTurnover3"
      };
      const field = orderByField[String(query.orderBy)];
      if (field) {
        const asc = query.order === "ascend";
        list.sort((a, b) => (asc ? a[field] - b[field] : b[field] - a[field]));
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
