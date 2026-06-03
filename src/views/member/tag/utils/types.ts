/** 標籤群組 */
interface TagGroupItem {
  id: number;
  name: string;
  color?: string;
  children?: TagItem[];
}

/** 標籤 */
interface TagItem {
  id: number;
  name: string;
  tagGroupID?: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  onlyBySystem?: boolean;
  loginForbidden?: boolean;
  loginReason?: boolean;
  withdrawalForbidden?: boolean;
  withdrawReason?: boolean;
  depositForbidden?: boolean;
  riskNotifyAlways?: boolean;
  riskNotifyOnce?: boolean;
  riskCondition?: boolean;
  financialNotifyAlways?: boolean;
  loginNotify?: boolean;
  withdrawalColor?: boolean;
  withdrawalSpecialNoColor?: boolean;
  loginWhiteList?: boolean;
}

/** 群組表單欄位 */
interface GroupFormItemProps {
  id?: number;
  name: string;
  color: string;
}

/** 標籤表單欄位 */
interface TagFormItemProps {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  tagGroupID?: number;
  onlyBySystem: boolean;
  loginForbidden: boolean;
  loginReason: boolean;
  withdrawalForbidden: boolean;
  withdrawReason: boolean;
  depositForbidden: boolean;
  riskNotifyAlways: boolean;
  riskNotifyOnce: boolean;
  riskCondition: boolean;
  financialNotifyAlways: boolean;
  loginNotify: boolean;
  withdrawalColor: boolean;
  withdrawalSpecialNoColor: boolean;
  loginWhiteList: boolean;
}

interface GroupFormProps {
  formInline: GroupFormItemProps;
  isUpdate: boolean;
}

interface TagFormProps {
  formInline: TagFormItemProps;
  isUpdate: boolean;
  /** 群組下拉選項（id/name） */
  groupOptions: { value: number; label: string }[];
}

export type {
  TagGroupItem,
  TagItem,
  GroupFormItemProps,
  TagFormItemProps,
  GroupFormProps,
  TagFormProps
};
