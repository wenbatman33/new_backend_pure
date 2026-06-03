// 优惠报表查询参数
interface PromotionSearchForm {
  /** 报表类型：1 日报 / 2 周报 / 3 月报 */
  dateType: number;
  /** 起始日期（YYYY-MM-DD） */
  reportDateStart: string;
  /** 结束日期（YYYY-MM-DD） */
  reportDateEnd: string;
  /** 代理编号 */
  agencyID: string;
  /** 优惠类型：1 中心钱包 / 2 红包 */
  walletType: number;
}

// 单笔优惠明细（API 回传 list[].list[] 内的元素）
interface PromotionDetail {
  promotionID: number | string;
  promotionName: string;
  bonus: number | string;
  memberCnt: number | string;
}

// API 回传的单列（依日期）
interface PromotionRow {
  date: string;
  list: PromotionDetail[];
}

// 合计列（依优惠 ID 汇总）
interface PromotionBonus {
  promotionID: number | string;
  bonus: number | string;
  memberCnt: number | string;
}

export type {
  PromotionSearchForm,
  PromotionDetail,
  PromotionRow,
  PromotionBonus
};
