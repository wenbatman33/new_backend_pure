import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 联赛 value 對應 hook 內 leagueList
const leagueValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15];
const teams = [
  ["阿根廷", "法国"],
  ["巴西", "德国"],
  ["西班牙", "意大利"],
  ["英格兰", "葡萄牙"],
  ["湖人", "勇士"],
  ["凯尔特人", "热火"]
];
const operators = ["admin", "operator01", "operator02"];

const all = Array.from({ length: 16 }).map((_, i) => {
  const [home, away] = teams[i % teams.length];
  const day = String((i % 27) + 1).padStart(2, "0");
  return {
    id: i + 1,
    eventTime: `2026-05-${day} 20:00:00`,
    homeTeamName: home,
    awayTeamName: away,
    league: leagueValues[i % leagueValues.length],
    status: i % 2,
    startTime: `2026-05-${day} 18:00:00`,
    endTime: `2026-05-${day} 19:55:00`,
    quizMember: (i + 1) * 13,
    updatedUser: operators[i % operators.length],
    updatedAt: `2026-05-${day} 17:30:00`
  };
});

export default defineFakeRoute([
  {
    url: "/backend/match/quiz/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.status !== undefined && query.status !== "") {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.startTime) {
        list = list.filter(v => v.startTime >= query.startTime);
      }
      if (query.endTime) {
        list = list.filter(v => v.endTime <= query.endTime);
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/match/quiz/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/match/quiz/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/match/quiz/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/match/quiz/csv",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
