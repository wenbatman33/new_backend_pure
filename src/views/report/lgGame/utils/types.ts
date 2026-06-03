interface FormItemProps {
  /** 重算起始时间 */
  startTime: string;
  /** 重算结束时间 */
  endTime: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
