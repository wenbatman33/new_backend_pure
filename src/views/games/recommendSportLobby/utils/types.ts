interface FormItemProps {
  id?: string | number;
  /** 前台排序 */
  recommendedSort: number | string;
  /** 厂商（遊戲群組）ID */
  gameGroupID: number | string;
  /** 游戏 ID */
  gameID: number | string;
  /** 前台状态：0 隐藏 / 1 显示 */
  showStatus: number | string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 厂商下拉選項 */
  gameGroupOptions: Array<{ label: string; value: number | string }>;
}

export type { FormItemProps, FormProps };
