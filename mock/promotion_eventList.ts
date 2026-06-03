import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 賽事列表假資料
const displayNames = ["FB体育", "SABA", "BTI", "皇冠"];
const notes = ["英超联赛", "西甲焦点战", "NBA常规赛", "欧冠淘汰赛", "世界杯预选赛"];
const events = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  promoEventID: `PE${String(1000 + i)}`,
  promoGameID: String(2000 + i),
  note: notes[i % notes.length],
  eventStartTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
  eventEndTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  eventID: [
    {
      id: i * 10 + 1,
      game_display_name: displayNames[i % displayNames.length],
      game_event_id: `EV${String(50000 + i)}`
    }
  ],
  score: (i + 1) * 100,
  status: i % 3 === 0 ? 0 : 1,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:20:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

// 賽事盘口（sportlist）假资料
const sportsList = Array.from({ length: 12 }).map((_, i) => ({
  gameGroupID: (i % 3) + 1,
  sportsName: i % 2 === 0 ? "Soccer" : "Basketball",
  gameGroup: displayNames[i % displayNames.length],
  eventID: `EV${String(50000 + i)}`,
  eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`,
  homeTeam: `主队${i + 1}`,
  awayTeam: `客队${i + 1}`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/promotion/gameevent/list",
    method: "get",
    response: ({ query }) => {
      let list = events;
      if (query.promoEventID) {
        list = list.filter(v => v.promoEventID.includes(query.promoEventID));
      }
      if (query.promoGameID) {
        list = list.filter(v => v.promoGameID.includes(query.promoGameID));
      }
      if (query.eventID) {
        list = list.filter(v =>
          v.eventID.some(e => e.game_event_id.includes(query.eventID))
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/promotion/gameevent/createevent",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/gameevent/editevent",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/gameevent/deleteevent",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/gameevent/editscore",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/gameevent/createeventid",
    method: "post",
    response: () => ({
      success: true,
      data: { id: Math.floor(Math.random() * 100000) }
    })
  },
  {
    url: "/backend/promotion/gameevent/deleteeventid",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion/gameevent/sportlist",
    method: "get",
    response: () => ({ success: true, data: { list: sportsList, total: sportsList.length } })
  }
]);
