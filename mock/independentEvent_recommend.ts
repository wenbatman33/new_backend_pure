import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 游戏类型（活动二反水矩阵的栏位来源）
const gameTypes = [
  { id: 1, name: "电子" },
  { id: 2, name: "真人" },
  { id: 3, name: "体育" },
  { id: 4, name: "彩票" }
];

// 依游戏类型产生一组反水阵列
const makeRebate = (base: number) =>
  gameTypes.map(g => ({ gameType: g.id, rebate: base + g.id }));

// 活动一奖金清单假资料（10 笔阶层）
const event1BonusList = Array.from({ length: 10 }).map((_, i) => ({
  people: (i + 1) * 5,
  bonus: (i + 1) * 100
}));

const config = {
  isRun: true,
  event2UpperLimit: 5000,
  event1BonusList,
  event2Rebate1: makeRebate(1),
  event2Rebate2: makeRebate(3),
  event2Rebate3: makeRebate(5),
  event1IsShow: true,
  event2IsShow: false
};

export default defineFakeRoute([
  {
    url: "/backend/game/game_type",
    method: "get",
    response: () => ({ success: true, data: { list: gameTypes } })
  },
  {
    url: "/backend/event/event0054/config",
    method: "get",
    response: () => ({ success: true, data: config })
  },
  {
    url: "/backend/event/event0054/setevent",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/event/event0054/setevent1",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/event/event0054/setevent2",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
