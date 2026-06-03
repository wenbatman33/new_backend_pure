// 自訂會員報表：基本資料 + 條件設定(requestData) + 報表欄位設定(responseData)

/** 搜尋表單 */
interface SearchFormProps {
  id: string;
  title: string;
}

/** 步驟一：基本資料 */
interface Step1Data {
  id?: number;
  title: string;
  description: string;
  /** "1" 不限時間 / "2" 自訂時間 */
  dateRangeType: string;
  dateRange: [string, string] | null;
  start: string;
  end: string;
}

/** 表單整體資料（建立/編輯/複製對話框使用） */
interface FormItemProps extends Step1Data {
  /** 條件設定：欄位 -> 值 / 區間 / sign+值 */
  requestData: Record<string, any>;
  /** 報表欄位設定：欄位 -> 0|1 */
  responseData: Record<string, number>;
  mode: "create" | "edit" | "copy";
}

interface FormProps {
  formInline: FormItemProps;
  /** VIP 等級下拉選項（由父層注入） */
  vipSettingList: { label: string; value: any }[];
}

/** 報表檢視對話框資料 */
interface ReportProps {
  record: FormItemProps;
  vipSettingList: { label: string; value: any }[];
}

export type {
  SearchFormProps,
  Step1Data,
  FormItemProps,
  FormProps,
  ReportProps
};
