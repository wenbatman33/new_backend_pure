// 廣告點擊報表 - 主列表單列（每日彙總）
interface BannerClickRow {
  date: string;
  clickTotal: number | string;
  clickGuest: number | string;
  clickMember: number | string;
  countMember: number | string;
}

// 詳細記錄單列（依廣告細分）
interface BannerClickDetailRow {
  bannerID: number | string;
  bannerTitle: string;
  clickTotal: number | string;
  clickGuest: number | string;
  clickMember: number | string;
  countMember: number | string;
}

// 詳細對話框 props
interface DetailProps {
  date: string;
}

export type { BannerClickRow, BannerClickDetailRow, DetailProps };
