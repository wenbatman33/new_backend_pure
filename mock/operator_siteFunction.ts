import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 網站功能設定（單物件設定頁，1=開 2=關）
const settings = {
  phone_edit: 2,
  modify_password_mode: 1,
  email_show: 1,
  email_verfiy: 1,
  email_get_password: 2,
  luckmoney_active: 1,
  chatroom_entrance: 1,
  lobbyxinliQuickBetWidget: 2,
  lobbySabaQuickBetWidget: 1,
  sabaWidgetID: "SABA-88888",
  eventLeague: 1,
  eventLeagueID: "1001,1002,1003",
  websocketMatchSchedule: {
    status: 1,
    league: [2001, 2002],
    preEventTime: 15
  },
  home_lottery: 1,
  home_lottery_title: "彩票大厅",
  home_lottery_link: "https://example.com/lottery",
  welfare: 2,
  specific_1: 1,
  specific_title: "赞助专区",
  specific_link: "https://example.com/sponsor"
};

export default defineFakeRoute([
  {
    url: "/backend/config/page",
    method: "get",
    response: () => ({ success: true, data: settings })
  },
  {
    url: "/backend/config/page",
    method: "put",
    response: ({ body }) => {
      // 模擬寫回
      Object.assign(settings, body || {});
      return { success: true, data: null };
    }
  }
]);
