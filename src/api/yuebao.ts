import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// 余额宝申请列表
export interface YuebaoListItem {
  id: number;
  memberID: number;
  memberAccount: string;
  calcMoney: number;
  profit: number;
  status: number;
  createdAt: string;
  numero: string;
  sendAt: string;
  updatedAt: string;
  updatedUser: string;
}

export interface YuebaoListData {
  list: YuebaoListItem[];
  total: number;
  count: number;
  sendTotal: number;
  reciveTotal: number;
  giveupTotal: number;
}

/** 余额宝申请列表（沿用旧 endpoint /backend/yuebao，GET 带 query） */

export const getYuebaoList = (params?: object) => {
  return http.request<Result<YuebaoListData>>("get", "/backend/yuebao", {
    params
  });
};
