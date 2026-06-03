// 顯示項目（線路）表單資料
interface FormItemProps {
  /** ID（編輯用） */
  id?: number;
  /** 前台名稱 */
  name: string;
  /** 備註 */
  note: string;
  /** 幣別 1:法幣 2:USDT-ERC 3:USDT-TRC 4:数字人民币 */
  currency: number;
  /** 同時啟用最大線路數量 */
  nums: number;
  /** 顯示狀態 1:開啟 2:關閉 */
  status: number;
  /** 維護狀態 1:維護中 2:正常 */
  maintain: number;
  /** 過濾設置 */
  filterSetting: number[];
  /** icon 圖片 */
  icon: string;
  /** 是否推薦 */
  isRecommend: boolean;
  /** 是否需要實名 */
  needRealName: boolean;
  /** 提示文案 */
  tooltip: string;
  /** 是否有教學文件 */
  hasDoc: boolean;
  /** 教學文件標題 */
  docTitle: string;
  /** 教學文件連結 */
  docURL: string;
  /** 快捷金額 */
  quickAmount: string;
}

interface FormProps {
  formInline: FormItemProps;
}

// 站台充值金額設定
interface AmountConfigProps {
  formInline: {
    amount: string;
  };
}

// 列表回傳項目
interface FinanceRow {
  id: number;
  name: string;
  note: string;
  currency: number;
  nums: number;
  status: number;
  maintain: number;
  updatedAt: string;
  updatedUser: string;
  isDefault: boolean;
  filterSetting: number[];
  icon?: string;
  isRecommend?: boolean;
  needRealName?: boolean;
  tooltip?: string;
  hasDoc?: boolean;
  docTitle?: string;
  docURL?: string;
  quickAmount?: string;
}

export type { FormItemProps, FormProps, AmountConfigProps, FinanceRow };
