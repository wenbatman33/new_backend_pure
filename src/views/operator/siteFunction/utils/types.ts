// 網站功能設定表單型別（前端 UI 用，布林開關以 boolean 表示）
interface SiteFunctionFormData {
  // profile
  phone_edit: boolean;
  modify_password_mode: number;
  email_show: boolean;
  email_verfiy: boolean;
  email_get_password: boolean;
  // function
  luckmoney_active: boolean;
  chatroom_entrance: boolean;
  lobbyxinliQuickBetWidget: boolean;
  lobbySabaQuickBetWidget: boolean;
  sabaWidgetID: string;
  eventLeague: boolean;
  eventLeagueID: string;
  websocketMatchScheduleStatus: boolean;
  websocketMatchScheduleLeague: string;
  websocketMatchSchedulePreEventTime?: number;
  home_lottery: boolean;
  home_lottery_title: string;
  home_lottery_link: string;
  welfare: boolean;
  // area
  specific_1: boolean;
  specific_title: string;
  specific_link: string;
}

export type { SiteFunctionFormData };
