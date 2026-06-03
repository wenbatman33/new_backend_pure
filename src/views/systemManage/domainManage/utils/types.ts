// 域名群組或子域名的列表項（樹狀結構，群組底下含 children 子域名）
interface DomainItem {
  id: number;
  // 有 groupID 代表是子域名；無則為群組
  groupID?: number;
  name: string;
  sort: number;
  displayName?: string;
  domain?: string;
  note?: string;
  children?: DomainItem[];
}

// 群組新增/編輯表單
interface GroupFormItemProps {
  id?: number;
  name: string;
  sort: number | string;
  setName: string;
}
interface GroupFormProps {
  formInline: GroupFormItemProps;
  isUpdate: boolean;
}

// 域名新增/編輯表單
interface DomainFormItemProps {
  id?: number;
  groupID: number | string;
  name: string;
  displayName: string;
  domain: string;
  sort: number | string;
  note: string;
}
interface DomainFormProps {
  formInline: DomainFormItemProps;
  // 群組下拉選項
  groupList: Array<{ label: string; value: number }>;
  // limited=true 時僅可編輯 domain 欄位
  limited: boolean;
}

// 快速置換搜尋表單
interface ReplaceFormItemProps {
  searchDomain: string;
  replaceDomain: string;
  searchPort: string;
  replacePort: string;
  matchType: number;
}

export type {
  DomainItem,
  GroupFormItemProps,
  GroupFormProps,
  DomainFormItemProps,
  DomainFormProps,
  ReplaceFormItemProps
};
