interface ProviderOption {
  label: string;
  value: string;
}

// 取得情報網址的請求參數
interface IntelligenceUrlParams {
  lang: string;
  provider: string;
}

export type { ProviderOption, IntelligenceUrlParams };
