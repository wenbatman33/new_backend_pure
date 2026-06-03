// 代理操作紀錄列表項
interface OperationRecordItem {
  /** 操作時間 */
  createdAt: string;
  /** 操作類型：1~8 */
  opType: number;
  /** 操作內容 */
  opContent: string;
  /** 操作管理員帳號 */
  opAdmin: string;
}

export type { OperationRecordItem };
