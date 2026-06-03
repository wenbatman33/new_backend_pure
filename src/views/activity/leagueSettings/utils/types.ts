interface FormItemProps {
  /** 主鍵 id（編輯時帶入，新增為 0） */
  id?: number;
  /** 賽事名稱 */
  name: string;
  /** 聯賽 ID */
  league: number | null;
  /** 是否啟用：1 啟用 / 2 停用 */
  isActive: number;
  /** 開始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 列表資料項 */
interface LeagueScheduleItem {
  id: number;
  name: string;
  league: number;
  startTime: string;
  endTime: string;
  /** 兩端拼接後的顯示字串 */
  eventTime?: string;
  isActive: number;
}

export type { FormItemProps, FormProps, LeagueScheduleItem };
