import { http } from "@/utils/http";

type Result<T = any> = {
  success: boolean;
  data: T;
};


// === GameListIDSelect 所需：取得遊戲下拉清單（type/group/list 三層原始資料）===
// 舊端點：GET /backend/game/dropdown/list（Vben defHttp.get 無 body）
export interface GameDropdownRaw {
  gameType: Array<{ id: number; name: string; dropDownName?: string; [k: string]: any }>;
  gameGroup: Array<{ id: number; name: string; displayName?: string; gameTypeID: number; [k: string]: any }>;
  gameAgency?: Array<{ id: number; name: string; [k: string]: any }>;
  gameList: Array<{ id: number; displayName: string; gameGroup: number; status: number; [k: string]: any }>;
}

/** 取得遊戲三層下拉資料（給 GameListIDSelect 等元件做 type/group/list 串接） */

export function getGameDropdownList() {
  return http.request<Result<GameDropdownRaw>>(
    "get",
    "/backend/game/dropdown/list"
  );
}

// ===== UploadFile 共用圖片上傳，合併進 src/api/common.ts =====
// Result<T> 已於檔頭定義，勿重複宣告；http 由檔頭 import。
export interface FileUploadResult {
  /** 上傳後檔案路徑（相對路徑，顯示時需經 apiServerUrl 包裝） */
  url: string;
}

/**
 * 共用圖片/影片上傳
 * 舊端點：POST /file/file/upload，body 為 FormData(type,file)
 */

export function fileUpload(data: FormData) {
  return http.request<Result<FileUploadResult>>(
    "post",
    "/file/file/upload",
    { data }
  );
}
