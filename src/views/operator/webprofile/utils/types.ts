/** 網站基本設定資料結構 */
interface WebProfileData {
  /** 網站名稱 */
  nuxtPublicName: string;
  /** 網站標題 */
  nuxtPublicTitle: string;
  /** 網站描述 */
  nuxtPublicDescription: string;
  /** 網站關鍵字（以逗號分隔的字串） */
  nuxtPublicKeywords: string;
}

export type { WebProfileData };
