// 風控審核對話框表單資料
interface FormItemProps {
  /** 提單編號 */
  orderSn: string | number;
  /** 會員帳號顯示 */
  memberAccount: string;
  /** 會員 ID */
  memberID: string | number;
  /** 目前風控審核狀態名稱 */
  riskCheckName: string;
  /** 動作模式：pass 通過 / reject 退回 */
  mode: "pass" | "reject";
  /** 後端狀態值：3 通過 / 2 退回 */
  status: number;
  /** 退回原因 ID */
  rejectID: string | number | "";
  /** 備註 */
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
  rejectOptions: Array<{ label: string; value: string | number }>;
}

export type { FormItemProps, FormProps };
