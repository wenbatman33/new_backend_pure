import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 角色（權限群組）相關 API（沿用舊 endpoint）=====
// 角色列表（舊碼 pageSize=1000 一次撈全部，故走 query string）
export const getRoles = (params: any) =>
  http.request<Result<{ list: any[]; total: number }>>("get", "/backend/admin/role/adminroles", { params });

// 新增角色（舊 defHttp.post 的 params 實為 body → 轉 data）

export const addRole = (data: any) =>
  http.request<Result<any>>("post", "/backend/admin/role/adminrole", { data });

// 編輯角色（舊 defHttp.put 的 params 實為 body → 轉 data）

export const updateRole = (data: any) =>
  http.request<Result<any>>("put", "/backend/admin/role/adminroleinfo", { data });

// 原始功能清單（功能/選單），舊碼帶 pageSize

export const getRawFnList = (pageSize: number) =>
  http.request<Result<{ list: { all: any[]; parent: any[] } }>>("get", "/backend/admin/function/functions", { params: { pageSize } });

// 某角色已勾選的功能

export const getRoleFns = (roleID: number) =>
  http.request<Result<{ list: any[]; total: number }>>("get", "/backend/admin/role/roles", { params: { pageSize: 1000, roleID } });

// 設定角色功能（body）

export const setRoleFns = (data: { roleID: number; fnIDs: number[] }) =>
  http.request<Result<any>>("put", "/backend/admin/role/fns", { data });

// 角色底下帳號

export const getRoleUsers = (roleID: number) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/admin/role/adminusers", { params: { pageSize: 500, roleID } });

// 批次新增/移除功能（body：roleIDs / fnIDs / action 1=add 2=del）

export const bulkPutFns = (data: { roleIDs: number[]; fnIDs: number[]; action: number }) =>
  http.request<Result<{ successMsg?: string }>>("put", "/backend/admin/role/fns/action", { data });

// 群組額度上限

export const getPaymentRole = (params: any) =>
  http.request<Result<any>>("get", "/backend/payment/role", { params });

export const putPaymentRole = (data: any) =>
  http.request<Result<any>>("put", "/backend/payment/role", { data });
// 舊碼以 query string 帶 id 走 DELETE

export const delPaymentRole = (params: { id: number }) =>
  http.request<Result<any>>("delete", "/backend/payment/role", { params });

// 隱藏群組 / 例外群組

export const getRoleRoleHide = () =>
  http.request<Result<any[]>>("get", "/backend/admin/role/roleHide");

export const postRoleExcept = (data: { exceptRoleID: number; roleID: string }) =>
  http.request<Result<any>>("post", "/backend/admin/role/except", { data });
// 舊碼以 query string 帶 roleID/exceptRoleID 走 DELETE

export const deleteRoleExcept = (params: { exceptRoleID: number; roleID: string }) =>
  http.request<Result<any>>("delete", "/backend/admin/role/except", { params });

// 隱藏單一角色

export const postRoleHide = (data: { roleID: number }) =>
  http.request<Result<any>>("post", "/backend/admin/role/hide", { data });
// 舊碼以 query string 帶 roleID 走 DELETE

export const deleteRoleHide = (params: { roleID: number }) =>
  http.request<Result<any>>("delete", "/backend/admin/role/hide", { params });

// ===== authSystem onlineUserManagement (在線使用者管理) =====
// 在線管理者清單項目
export interface OnlineUserItem {
  adminID: number;
  account: string;
  online: number;
  status: number; // 1 啟用 / 0 停用
  roleName: string;
  deptName: string;
  lastLoginAt: string;
}

/** 取得在線管理者清單（舊後端不帶查詢參數） */

export const getUserOnlineadmins = () => {
  return http.request<Result<{ list: OnlineUserItem[]; total: number }>>(
    "get",
    "/backend/admin/user/onlineadmins"
  );
};

/** 強制登出（踢出在線帳號） */

export const postUserKickadminuser = (data: { adminID: number }) => {
  return http.request<Result<null>>(
    "post",
    "/backend/admin/user/kickadminuser",
    { data }
  );
};

// ===== OTP 狀態列表（authSystem / otpStatusList）=====
// 沿用舊 endpoint：/backend/admin/otpStatus/list（GET）、/backend/admin/otpStatus/modify（PUT）
export interface OtpStatusItem {
  fnID: number;
  fnName: string;
  displayFnName: string;
  fnKey: string;
  updatedAt: string;
  /** 1 啟用 / 2 停用 */
  otpStatus: number;
}

/** OTP 狀態列表（無分頁） */

export const getOtpStatusList = (params?: {
  fnID?: string | number;
  fnName?: string;
  fnKey?: string;
}) => {
  return http.request<Result<{ list: OtpStatusItem[]; total: number }>>(
    "get",
    "/backend/admin/otpStatus/list",
    { params }
  );
};

/** 修改單筆功能的 OTP 狀態（status：1 啟用 / 2 停用） */

export const putOtpStatusModify = (data: { fnID: number; status: number }) => {
  // 舊 Vben put({url, params}) 的 params 實為 body，故轉成 { data }
  return http.request<Result<null>>(
    "put",
    "/backend/admin/otpStatus/modify",
    { data }
  );
};

// ===== authSystem / 功能權限(auth) 相關 =====
// 端點沿用舊 system.ts
export interface FunctionItem {
  fnID?: number;
  fnName: string;
  displayFnName: string;
  fnKey: string;
  parentID?: number;
}

/**
 * 取得功能樹（後端回 { list: { all, parent } }，此處整理成父帶 children 的樹）
 */

export const getFnList = (params: Record<string, any>) => {
  if (params.fnID === "") delete params.fnID;
  if (params.fnName === "") delete params.fnName;
  const queryString = Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&");
  return http
    .request<Result<{ list: { all: any[]; parent: any[] } }>>(
      "get",
      `/backend/admin/function/functions?${queryString}`
    )
    .then(res => {
      const all = res.data?.list?.all ?? [];
      const parentArr = res.data?.list?.parent ?? [];
      const root = all.filter((fn: any) => fn.parentID === 0);
      all.forEach((item: any) => {
        if (item.parentID !== 0) {
          const parent = parentArr.find((fn: any) => fn.fnID === item.parentID);
          const exist = root.some((r: any) => r.fnID === item.parentID);
          if (parent && !exist) root.push(parent);
        }
      });
      root.forEach((parent: any) => {
        parent.children = all.filter((fn: any) => fn.parentID === parent.fnID);
      });
      // 包成 { success, data } 供呼叫端解構
      return { success: res.success, data: root };
    });
};

/** 新增功能 */

export const setFn = (data: FunctionItem) =>
  http.request<Result<any>>("post", "/backend/admin/function/function", { data });

/** 編輯功能 */

export const updateFn = (data: FunctionItem) =>
  http.request<Result<any>>("put", "/backend/admin/function/function", { data });

/** 刪除功能 */

export const deleteFn = (fnID: number) =>
  http.request<Result<any>>(
    "delete",
    `/backend/admin/function/function?fnID=${fnID}`
  );

/** 角色清單 */

export const getFnRoleList = (id: number) =>
  http.request<Result<{ list: string[] }>>(
    "get",
    "/backend/admin/function/function/role",
    { params: { id } }
  );

/** 隱藏權限清單 */

export const getFunctionHide = () =>
  http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/admin/function/function/hide"
  );

/** 新增隱藏權限 */

export const postFunctionHide = (data: Record<string, any>) =>
  http.request<Result<any>>(
    "post",
    "/backend/admin/function/function/hide",
    { data }
  );

/** 刪除隱藏權限 */

export const deleteFunctionHide = (params: { funcID: number | string }) =>
  http.request<Result<any>>(
    "delete",
    `/backend/admin/function/function/hide?funcID=${params?.funcID}`
  );

/** 新增角色例外隱藏 */

export const postFunctionRoleHide = (data: Record<string, any>) =>
  http.request<Result<any>>(
    "post",
    "/backend/admin/function/function/rolehide",
    { data }
  );

/** 刪除角色例外隱藏 */

export const deleteFunctionRoleHide = (params: {
  funcID: string;
  roleID: string;
}) =>
  http.request<Result<any>>(
    "delete",
    `/backend/admin/function/function/rolehide?funcID=${params?.funcID}&roleID=${params?.roleID}`
  );

export interface AccountRole {
  roleID: number;
  roleName: string;
}

/** 帳號列表項 */

export interface AccountItem {
  adminID: number;
  id?: number;
  account: string;
  name: string;
  email: string;
  status: number;
  deptID: number;
  title: string;
  vpnIP: string;
  commentCategory: string;
  tagID?: number | null;
  roles: AccountRole[];
  lastLoginAt: string;
  updatedAt: string;
}

/** 新增/編輯帳號參數 */

export interface AccountCreateParams {
  adminID?: number;
  account?: string;
  name?: string;
  email?: string;
  password?: string;
  status?: number;
  deptID?: number;
  title?: string;
  vpnIP?: string;
  commentCategory?: string;
  roleID?: number;
  tagID?: number | null;
}

/** 帳號列表（沿用舊邏輯：以 query string 帶條件） */

export const getAccountList = (params: Record<string, any>) => {
  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&");
  const url = queryString
    ? `/backend/admin/user/admins?${queryString}`
    : "/backend/admin/user/admins";
  return http.request<Result<{ list: AccountItem[]; total: number }>>("get", url);
};

/** 部門清單 */

export const getDeptList = () =>
  http.request<Result<{ list: { deptID: number; deptName: string }[] }>>(
    "get",
    "/backend/admin/user/depts"
  );

/** 功能角色清單 */

export const getTagGroup = () =>
  http.request<Result<{ list: { id: number; name: string }[] }>>(
    "get",
    "/backend/member/tag/groups"
  );

/** 新增帳號（舊 defHttp.post 的 params 實為 body） */

export const createAccount = (data: AccountCreateParams) =>
  http.request<Result<null>>("post", "/backend/admin/user/admin", { data });

/** 編輯帳號（舊 defHttp.put 的 params 實為 body） */

export const updateAccount = (data: AccountCreateParams) =>
  http.request<Result<null>>("put", "/backend/admin/user/info", { data });

/** 重置密碼 */

export const resetPassword = (data: { adminID?: number; password: string }) =>
  http.request<Result<null>>("put", "/backend/admin/user/resetpassword", {
    data
  });

/** 重置 OTP（舊碼以 body 帶 adminID） */

export const resetOtp = (adminID: number) =>
  http.request<Result<null>>("post", "/backend/admin/user/resetotp", {
    data: { adminID }
  });

/** 批次新增 VPN IP */

export const batchAddVpnIP = (data: {
  adminUserIDs: string;
  vpnIps: string;
}) =>
  http.request<Result<null>>("post", "/backend/admin/user/batchAddVpnIp", {
    data
  });

/** 批次移除 VPN IP（舊碼以 query string 帶參數） */

export const batchRemoveVpnIP = (params: {
  adminUserIDs: string;
  vpnIps: string;
}) =>
  http.request<Result<null>>(
    "delete",
    `/backend/admin/user/batchremovevpnip?adminUserIDs=${params.adminUserIDs}&vpnIps=${params.vpnIps}`
  );

// 操作日誌列表（沿用舊 endpoint /backend/authLogs/Logs，GET 帶 query）
export interface AuthLogSubData {
  column?: number;
  oldValue?: string | number;
  newValue?: string | number;
  vpn_ip?: string;
  admin_user_account?: string;
}

export interface AuthLogItem {
  account: string;
  action: number;
  target: string;
  time: string;
  sub_data: AuthLogSubData[];
}

export interface AuthLogListData {
  list: AuthLogItem[];
  total: number;
}

/** 取得權限操作日誌（params: { startDate?, endDate?, account? }，空值由呼叫端過濾） */

export const getAuthLogs = (params: Record<string, any>) =>
  http.request<Result<AuthLogListData>>("get", "/backend/authLogs/Logs", { params });
