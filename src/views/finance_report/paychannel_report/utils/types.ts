// 帳務明細列表單筆
interface PayChannelLogItem {
  id: number;
  createdAt: string;
  subjectID: number;
  in: number;
  out: number;
  fee: number;
  remainBalance: number;
  frozenBalance: number;
  relationID: string;
  thirdID: string;
  targetName: string;
  editorName: string;
  note: string;
}

// 備註編輯表單
interface FormItemProps {
  id: number;
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { PayChannelLogItem, FormItemProps, FormProps };
