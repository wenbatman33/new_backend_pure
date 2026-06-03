// 假會員列表單筆資料
interface MemberRow {
  id: number | string;
  account: string;
  name_cert: number; // 真名驗證 1/0
  phone_cert: number; // 手機驗證 1/0
  has_bank_card: number; // 是否有銀行卡 1/0
  vip_level: number | string; // VIP 等級 0~10
  created_date: string; // 註冊時間
  // 表格內勾選狀態（前端用）
  _checked?: boolean;
}

// 新增會員表單
interface CreateFormState {
  accountPrefix: string;
  startNumber: string | number;
  endNumber: string | number;
}

export type { MemberRow, CreateFormState };
