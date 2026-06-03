// 遊戲列表單筆資料
interface GameListItem {
  id: number;
  sort: number;
  gameGroupID: number;
  gameGroupDisplayName: string;
  name: string;
  displayName: string;
  gameTypeID: number;
  gameTypeName: string;
  status: number;
  trialPlay: number;
  isSpecial: number;
  isSlot: number;
  gameCodePc?: string;
  gameCodeH5?: string;
}

// 選項型別
interface OptionItem {
  label: string;
  value: number;
}

// 新增遊戲表單欄位
interface AddFormItemProps {
  gameGroupID: number | undefined;
  gameTypeID: number | undefined;
  name: string;
  displayName: string;
  sort: number | string;
  gameCodePc: string;
  gameCodeH5: string;
  isNewGame: boolean;
  isHotGame: boolean;
  status: number;
  trialPlay: number | undefined;
}

// 編輯遊戲表單欄位
interface EditFormItemProps {
  id: number;
  gameGroupID: number | undefined;
  gameTypeID: number | undefined;
  name: string;
  displayName: string;
  sort: number | string;
  bettingCode?: string;
  gameCodePc: string;
  gameCodeH5: string;
  isNewGame: boolean;
  isHotGame: boolean;
  status: number;
}

// 批次修改狀態表單欄位
interface StatusFormItemProps {
  status: number;
  isNewGame: number;
  isHotGame: number;
  isReturn: number;
  isSlot: number;
}

interface AddFormProps {
  formInline: AddFormItemProps;
  gameTypeOptions: OptionItem[];
  gameGroupOptions: OptionItem[];
}

interface EditFormProps {
  formInline: EditFormItemProps;
  gameTypeOptions: OptionItem[];
  gameGroupOptions: OptionItem[];
}

interface StatusFormProps {
  formInline: StatusFormItemProps;
}

export type {
  GameListItem,
  OptionItem,
  AddFormItemProps,
  EditFormItemProps,
  StatusFormItemProps,
  AddFormProps,
  EditFormProps,
  StatusFormProps
};
