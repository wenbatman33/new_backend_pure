// 單筆 log 紀錄：欄位是動態的（依後端回傳 key），故用索引簽名
interface VipJobLogRecord {
  [key: string]: any;
}

// 一個 job 群組：name 為 job 名稱、list 為該 job 的紀錄
interface VipJobLogGroup {
  name: string;
  list: VipJobLogRecord[];
}

// 搜尋表單
interface VipJobLogSearchForm {
  id: string;
}

export type { VipJobLogRecord, VipJobLogGroup, VipJobLogSearchForm };
