// LOGO 設定資料結構（後端 /backend/config/logo 回傳）
export interface LogoData {
  logoWithTextHorizontal?: string; // Logo-品牌（橫式含字）
  logoWithPureBlack?: string; // Logo-導覽列（純黑）
  logoWithLoadingText?: string; // Logo-加載（含字）
  logoWithBackground?: string; // Logo-版本（含背景）
  logoWithTextVertical?: string; // Logo-維護（直式含字）
}

// 單一 LOGO 欄位設定（畫面渲染用）
export interface LogoField {
  key: keyof LogoData; // 對應 LogoData 的欄位
  title: string; // 區塊標題
  desc: string; // 區塊描述
}
