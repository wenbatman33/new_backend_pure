// VIP 返水設定表的一筆資料（各遊戲類別的反水比例與單日上限）
interface ReturnItem {
  level: number | string;
  [key: string]: number | string;
}

export type { ReturnItem };
