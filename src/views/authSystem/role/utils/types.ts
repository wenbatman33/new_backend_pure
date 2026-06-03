// 角色（權限群組）相關型別

interface RoleFormItemProps {
  /** 角色 ID（編輯時帶入，唯讀） */
  roleID?: number;
  /** 群組名稱 */
  roleName: string;
  /** 備註 */
  note: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  /** 財務出款提示音 */
  financeWithdrawalBeep: boolean;
  /** 風控出款提示音 */
  riskWithdrawalBeep: boolean;
}

interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { RoleFormItemProps, RoleFormProps };
