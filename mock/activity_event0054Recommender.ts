import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 推薦人活動報表假資料
const accounts = [
  "alice01",
  "bob_king",
  "charlie",
  "dragon88",
  "ella_w",
  "frank9",
  "grace",
  "henry",
  "ivy777",
  "jack_m",
  "kelly",
  "leo_star",
  "mia",
  "nick_x",
  "olivia",
  "peter"
];

const all = accounts.map((account, i) => {
  const friendTotal = 5 + (i % 7) * 3;
  const friend = Math.max(0, friendTotal - (i % 4));
  const depositPeople = Math.max(0, friend - (i % 3));
  return {
    memberID: 200000 + i,
    account,
    friendTotal,
    friend,
    depositPeople,
    depositAmount: (depositPeople * 1280 + i * 37).toFixed(2),
    betPeople: Math.max(0, depositPeople - (i % 2)),
    eventTurnover: (depositPeople * 5600 + i * 211).toFixed(2),
    withdrawPeople: Math.max(0, depositPeople - (i % 5)),
    eventBonus: (depositPeople * 88 + i * 13).toFixed(2)
  };
});

export default defineFakeRoute([
  {
    url: "/backend/event/event0054/recommender",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.recommenderAccount) {
        list = list.filter(v =>
          v.account.includes(String(query.recommenderAccount))
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
