interface FormItemProps {
  /** 賽事資訊（唯讀顯示） */
  info: string;
  /** 對應 worldCupScheduleId */
  worldCupScheduleId: number;
  /** 串流網址 1~5 */
  link1: string;
  link2: string;
  link3: string;
  link4: string;
  link5: string;
  /** 直播中：1 是 / 2 否 */
  isLiveLabel: number;
  /** 是否顯示：1 是 / 2 否 */
  isLive: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
