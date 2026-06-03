/** 標籤群組（會員標籤分組） */
interface TagGroup {
  id: number;
  name: string;
  color?: string;
}

/** 標籤 */
interface TagItem {
  id: number;
  name: string;
  tagGroupID: number;
  color?: string;
}

/** 代理標籤群組（列表 / 編輯卡片用） */
interface AgencyTagGroup {
  agencyTagGroupId: number;
  agencyId: string;
  /** 後端以逗號分隔字串回傳；前端轉成 number[] 操作 */
  tagId: string | number[];
  remark?: string;
}

/** 新增 / 編輯卡片表單欄位 */
interface FormItemProps {
  /** 代理線（可多筆，逗號分隔），例 10430,10431,10432 */
  agencyId: string;
  /** 已選標籤 id 陣列 */
  tagId: number[];
  /** 備註 */
  remark: string;
}

export type { TagGroup, TagItem, AgencyTagGroup, FormItemProps };
