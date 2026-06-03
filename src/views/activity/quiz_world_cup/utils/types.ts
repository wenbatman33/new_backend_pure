interface FormItemProps {
  /** 竞猜 ID */
  id: number;
  /** 赛事资讯（唯讀顯示） */
  info: string;
  /** 竞猜开始时间 */
  startTime: string;
  /** 竞猜结束时间 */
  endTime: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
