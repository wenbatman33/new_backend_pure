// 工作台各區塊資料型別

// 頂部統計
export interface WorkbenchStats {
  todo: string; // 例 "2/10"
  project: number;
  team: number;
}

// 項目卡片
export interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  group: string;
}

// 快捷導航
export interface NavItem {
  title: string;
  icon: string;
  color: string;
}

// 最新動態
export interface DynamicInfoItem {
  avatar: string;
  name: string;
  date: string;
  desc: string;
}

// 銷售統計（雷達圖）
export interface SaleRadarSeries {
  name: string;
  color: string;
  value: number[];
}

export interface SaleRadarData {
  indicator: { text: string; max: number }[];
  series: SaleRadarSeries[];
}

// 整個工作台聚合資料
export interface WorkbenchData {
  stats: WorkbenchStats;
  navItems: NavItem[];
  groupItems: GroupItem[];
  dynamicInfoItems: DynamicInfoItem[];
  saleRadar: SaleRadarData;
}
