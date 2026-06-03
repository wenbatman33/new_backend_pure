import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 推薦名單假資料
const all = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  memberAccount: `member${i + 1}`,
  recommenderID: 100000 + (i % 5),
  recommenderAccount: `agent${(i % 5) + 1}`,
  recommendCode: `REF${String(1000 + i)}`,
  createdTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/recommend/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.recommenderAccount) {
        list = list.filter(v =>
          v.recommenderAccount.includes(query.recommenderAccount)
        );
      }
      if (query.startTime) {
        list = list.filter(v => v.createdTime >= query.startTime);
      }
      if (query.endTime) {
        list = list.filter(v => v.createdTime <= query.endTime);
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
