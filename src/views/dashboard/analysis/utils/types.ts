// 成長卡片資料結構
interface GrowCardItem {
  // svg 圖示名稱（透過 useRenderIcon 解析）
  icon: string;
  // 卡片標題 i18n key
  titleKey: string;
  // 當期數值
  value: number;
  // 總計數值
  total: number;
  // 標籤顏色
  color: string;
  // 週期文案 i18n key（月/週/年）
  actionKey: string;
}

// 名稱+數值通用結構（圓餅、雷達等）
interface NameValueItem {
  name: string;
  value: number;
}

// 分析頁總資料（對應 mock 回傳的 data）
interface AnalysisData {
  // 成長卡片
  growCardList: GrowCardItem[];
  // 流量趨勢折線（雙系列）
  visitTrend: {
    xAxis: string[];
    series1: number[];
    series2: number[];
  };
  // 訪問量長條
  visitBar: {
    xAxis: string[];
    data: number[];
  };
  // 轉化率雷達
  radar: {
    indicator: { textKey: string; max: number }[];
    visit: number[];
    buy: number[];
  };
  // 訪問來源圓餅
  visitSource: NameValueItem[];
  // 成交占比圓餅
  salesPie: NameValueItem[];
}

export type { GrowCardItem, NameValueItem, AnalysisData };
