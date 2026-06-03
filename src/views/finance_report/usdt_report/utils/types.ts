// U 钱包帐变明细 行资料
interface UsdtReportItem {
  id: number;
  createdAt: string;
  subjectID: number;
  /** 1=收入 2=支出 */
  type: number;
  amount: number;
  in: number;
  out: number;
  fee: number;
  balance: number;
  relationID: string;
  thirdID: string;
  targetName: string;
  editorName: string;
  note: string;
}

// 备注编辑表单
interface FormItemProps {
  id: number;
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { UsdtReportItem, FormItemProps, FormProps };
