// 埋点设置表单（新增/编辑埋点）
interface PointFormItemProps {
  /** 编辑时的主键 */
  id?: number;
  /** 名称 */
  name: string;
  /** 分类：1 GTM / 2 GA / 3 FB / 4 Mouseflow / 5 Microsoft Clarity / 6 Other */
  eventType: number | string;
  /** 代码 */
  eventCode: string;
  /** 是否支持事件：1 是 / 2 否 */
  event: number;
  /** 适用网址（多选） */
  url: string[];
}

interface PointFormProps {
  formInline: PointFormItemProps;
  /** 网址多选选项 */
  urlOptions: { label: string; value: string }[];
}

// 域名设置表单（新增/编辑域名）
interface DomainFormItemProps {
  /** 编辑时的主键 */
  id?: number;
  /** 显示名称 */
  displayName: string;
  /** 域名 */
  domain: string;
  /** 备注 */
  note: string;
}

interface DomainFormProps {
  formInline: DomainFormItemProps;
}

export type {
  PointFormItemProps,
  PointFormProps,
  DomainFormItemProps,
  DomainFormProps
};
