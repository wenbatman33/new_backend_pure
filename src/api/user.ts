import { http } from "@/utils/http";

/** 真後端登入回傳（沿用舊 18_BO_ADMIN：/backend/admin/user/login） */
export type LoginResult = {
  success: boolean;
  data: {
    account: string;
    name: string;
    adminID: string | number;
    bearerToken: string;
    roles: Array<{ roleName: string; value: string }>;
    status: number;
    homePath?: string;
    forceChangePassword?: boolean;
    gmt?: any;
    timestamp?: any;
    secretQRCode?: string;
    [key: string]: any;
  };
};

/** 兼容 pure-admin 既有型別命名 */
export type UserResult = LoginResult;

export type RefreshTokenResult = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expires: Date;
  };
};

export type UserFnsResult = {
  success: boolean;
  data: {
    list: Array<{ fnKey: string; fnID?: number; [key: string]: any }>;
  };
};

/** 登入（account / password / loginCode 簡訊OTP）—— 沿用舊 endpoint */
export const getLogin = (data?: object) => {
  return http.request<LoginResult>("post", "/backend/admin/user/login", {
    data
  });
};

/** 取得使用者按鈕權限碼清單（fnKey = __btn_xxx） */
export const getUserFns = (adminID: number | string) => {
  return http.request<UserFnsResult>(
    "get",
    `/backend/admin/user/fns?adminID=${parseInt(String(adminID), 10)}`
  );
};

/** 取得使用者資訊 */
export const getUserInfo = (adminID?: number | string) => {
  const q = adminID ? `?adminID=${adminID}` : "";
  return http.request<LoginResult>("get", `/backend/admin/user/admin${q}`);
};

/** pure-admin 內建刷新 token（舊後端無 refresh，保留以相容呼叫端） */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
