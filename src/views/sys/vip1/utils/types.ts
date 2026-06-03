// vip1（VIP 遊戲資訊查詢）型別

/** 遊戲群組（group）單筆 */
interface GameGroupItem {
  id: number;
  name: string;
  display_name: string;
  maintain_time: string;
  wallet_type: string;
  platform_fee_ratio: string;
  game_agency_id: number;
  game_type_id: number;
  game_url: string;
  game_wallet_id: number;
  open_game_list_id: number;
  open_way: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  image_h5: string;
  image_pc: string;
  logo_image: string;
}

/** 遊戲代理（agency）單筆 */
interface GameAgencyItem {
  id: number;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
  image_pc: string;
  image_h5: string;
}

/** 遊戲列表（list）單筆 */
interface GameListItem {
  id: number;
  name: string;
  display_name: string;
  game_group_id: number;
  game_type_id: number;
  is_hot_game: number;
  is_slot: number;
  is_special: number;
  room_url: string;
  demo_url: string;
  trial_play: number;
  betting_code: string;
  game_code_h5: string;
  game_code_pc: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  image_h5: string;
  image_pc: string;
  recommended_image_h5: string;
  recommended_image_pc: string;
  recommended_sort: number;
  screen_shot_h5: string;
  screen_shot_pc: string;
}

/** /backend/vipjob/game 回傳結構 */
interface VipGameInfo {
  group: GameGroupItem;
  agency: GameAgencyItem;
  list: GameListItem;
}

export type { GameGroupItem, GameAgencyItem, GameListItem, VipGameInfo };
