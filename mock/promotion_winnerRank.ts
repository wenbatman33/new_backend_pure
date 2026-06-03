import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 排行榜列表假資料
const rankList = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  eventCode: `EVT${String(1000 + i)}`,
  name: `冠军排行榜 ${i + 1}`,
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59`,
  status: (i % 2) + 1, // 1 启用 / 2 停用
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01",
  // 設定表單回填欄位
  cycleType: (i % 3) + 1,
  finalEndTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59`,
  rankAmount: 10 + i,
  type: (i % 2) + 1,
  gameItem: [],
  tag: [182],
  displayStartTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00`,
  displayEndTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59`,
  bonusShow: 1,
  typeShow: 1,
  imgUrl: "",
  announcement: "<p>排行榜公告内容</p>"
}));

// 排行榜會員假資料
const memberList = Array.from({ length: 10 }).map((_, i) => ({
  order: i + 1,
  memberAccount: `member${i + 1}`,
  eventBetAmount: (10000 - i * 500).toString()
}));

// 操作記錄假資料
const operateLog = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:${String(
    (i % 60)
  ).padStart(2, "0")}:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01",
  item: i % 2 === 0 ? "状态" : "排行名次",
  content: i % 2 === 0 ? "启用 → 停用" : "更新会员名次清单"
}));

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/event/rank/list",
    method: "get",
    response: ({ query }) => {
      let list = rankList;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.keyword) {
        list = list.filter(
          v =>
            v.name.includes(query.keyword) ||
            v.eventCode.includes(query.keyword)
        );
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增排行榜
  {
    url: "/backend/event/rank",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 修改排行榜
  {
    url: "/backend/event/rank",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 排行榜會員清單
  {
    url: "/backend/event/rank/memberlist",
    method: "get",
    response: () => ({ success: true, data: { list: memberList } })
  },
  // 編輯排行榜會員清單
  {
    url: "/backend/event/rank/memberlist",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 操作記錄
  {
    url: "/backend/event/rank/log",
    method: "get",
    response: () => ({ success: true, data: { list: operateLog } })
  }
]);
