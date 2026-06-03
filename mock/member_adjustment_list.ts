import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 調整單列表假資料
const subjects = ["内部测试加分", "活动派彩", "风控扣分", "线下活动派彩", "营销特殊存款"];
const operators = ["admin", "operator01", "finance02", "risk03"];
const gameSets = [
  [{ gameTypeName: "电子", gameGroupName: "PG" }],
  [{ gameTypeName: "真人", gameGroupName: "" }],
  [
    { gameTypeName: "体育", gameGroupName: "BTI" },
    { gameTypeName: "彩票", gameGroupName: "" }
  ],
  []
];

const all = Array.from({ length: 16 }).map((_, i) => {
  const adjustmentType = (i % 2) + 1; // 1 加分 / 2 减分
  const status = (i % 4) + 1;
  return {
    id: 1000 + i,
    adjustmentID: 5000 + i,
    transactionID: `TX${String(20260601000 + i)}`,
    memberID: 100000 + i,
    memberName: `member${i + 1}`,
    subject: subjects[i % subjects.length],
    reason: (i % 15) + 1,
    description: `调整说明 ${i + 1}`,
    amount: (i + 1) * 1000,
    amountTimes: (i % 5) + 1,
    adjustmentType,
    status,
    adjustmentLimit: gameSets[i % gameSets.length],
    luckMoneyGameList: [{ gameTypeName: "红包游戏", gameGroupName: "" }],
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
    verifyAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 11:00:00`,
    updateUser: operators[i % operators.length],
    feDescription: i % 2 === 0 ? "前台显示说明" : ""
  };
});

export default defineFakeRoute([
  {
    url: "/backend/adjustment/search",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      if (query.memberName) {
        list = list.filter(v => v.memberName.includes(query.memberName));
      }
      if (query.reason) {
        list = list.filter(v => v.reason === Number(query.reason));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.adjustmentType) {
        list = list.filter(
          v => v.adjustmentType === Number(query.adjustmentType)
        );
      }
      if (query.transactionID) {
        list = list.filter(v => v.transactionID.includes(query.transactionID));
      }
      if (query.updateUser) {
        list = list.filter(v => v.updateUser.includes(query.updateUser));
      }
      if (query.amountTimes) {
        list = list.filter(v => v.amountTimes === Number(query.amountTimes));
      }
      const total = list.length;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      const paged = list.slice(start, start + pageSize);
      return { success: true, data: { list: paged, total } };
    }
  }
]);
