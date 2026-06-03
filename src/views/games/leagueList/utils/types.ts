interface FormItemProps {
  /** 主鍵 id（提交時帶回） */
  id: number;
  /** 聯賽編號 */
  leagueID: number;
  /** 聯賽名稱 */
  leagueName: string;
  /** 運動種類名稱 */
  sportName: string;
  /** logo 圖片路徑（上傳後回傳的 url） */
  logoImage: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
