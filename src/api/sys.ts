import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== sys/vip1：VIP 遊戲資訊查詢 =====
// group / agency / list 皆為單筆物件
export interface VipGameGroupItem {
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

export interface VipGameAgencyItem {
  id: number;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
  image_pc: string;
  image_h5: string;
}

export interface VipGameListItem {
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

export interface VipGameInfo {
  group: VipGameGroupItem;
  agency: VipGameAgencyItem;
  list: VipGameListItem;
}

/** sys/vip1 依遊戲 ID 查詢遊戲群組/代理/列表資訊（沿用舊 endpoint /backend/vipjob/game） */

export const getVipGameInfo = (params: { id: string | number }) => {
  return http.request<Result<VipGameInfo>>("get", "/backend/vipjob/game", {
    params
  });
};

export interface VipJobLogItem {
  id?: number;
  module?: string;
  status?: string;
  url?: string;
  response?: string;
  createdAt?: string;
  [key: string]: any;
}

/** 取得 VIP 排程工作日誌（沿用舊 endpoint /backend/vipjob/log/log） */

export const getVipJobLog = (params: {
  module?: string;
  start?: string;
  end?: string;
}) => {
  return http.request<Result<{ list: VipJobLogItem[]; total: number }>>(
    "get",
    "/backend/vipjob/log/log",
    { params }
  );
};

// ===== VIP3（VIP 任務 log 查詢）=====
// 沿用舊 endpoint：GET /backend/vipjob/log
// 回傳物件：key 為 job 名稱、value 為該 job 的紀錄陣列（動態欄位）
export type VipJobLogResp = Record<string, Array<Record<string, any>>>;

/** 查詢 VIP 任務 log（依會員 id） */

// sys/vip3 專用：依 id 取 VIP 排程日誌（與 vip2 的 getVipJobLog 不同端點 /backend/vipjob/log）
export const getVipJobLogById = (params: { id: string }) => {
  return http.request<Result<any>>("get", "/backend/vipjob/log", { params });
};
