/** 下拉選項 */
interface OptionItem {
  id: string | number;
  name: string;
}

/** 新增遊戲群組對話框表單 */
interface FormItemProps {
  /** 已選的遊戲群組 ID */
  gameGroupID: string | number;
  /** 可選的遊戲群組清單（已排除表格內既有的） */
  gameGroupOptions: OptionItem[];
}

interface FormProps {
  formInline: FormItemProps;
}

export type { OptionItem, FormItemProps, FormProps };
