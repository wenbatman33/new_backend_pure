interface FormItemProps {
  /** 主鍵 id（編輯時帶入） */
  id?: number;
  /** 對應賽程 id */
  matchScheduleId?: number;
  /** 賽事時間（唯讀顯示） */
  eventTime?: string;
  /** 聯賽（唯讀顯示，值為 league 代碼） */
  league?: number;
  /** 聯賽名稱（唯讀顯示） */
  leagueName?: string;
  /** 主隊名稱（唯讀顯示） */
  homeTeam?: string;
  /** 主隊比分 */
  homeScore?: string;
  /** 主隊 PC 圖檔名/網址 */
  homePc?: string;
  /** 主隊 H5 圖檔名/網址 */
  homeH5?: string;
  /** 主隊說明 */
  homeExplain?: string;
  /** 客隊名稱（唯讀顯示） */
  awayTeam?: string;
  /** 客隊比分 */
  awayScore?: string;
  /** 客隊 PC 圖檔名/網址 */
  awayPc?: string;
  /** 客隊 H5 圖檔名/網址 */
  awayH5?: string;
  /** 客隊說明 */
  awayExplain?: string;
  /** 推薦文字 */
  recommend?: string;
  /** 分析（原為富文本，pure 暫以多行文字替代） */
  matchExplain?: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 是否為編輯模式 */
  isEdit: boolean;
}

export type { FormItemProps, FormProps };
