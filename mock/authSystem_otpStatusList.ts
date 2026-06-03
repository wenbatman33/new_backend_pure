import { defineFakeRoute } from "vite-plugin-fake-server/client";

// OTP 狀態列表假資料：otpStatus 1 啟用 / 2 停用
const fnDefs = [
  { fnKey: "login", cn: "登入", en: "Login" },
  { fnKey: "withdraw", cn: "提款", en: "Withdraw" },
  { fnKey: "transfer", cn: "轉帳", en: "Transfer" },
  { fnKey: "bind_bank", cn: "綁定銀行卡", en: "Bind Bank Card" },
  { fnKey: "change_pwd", cn: "修改密碼", en: "Change Password" },
  { fnKey: "reset_pwd", cn: "重設密碼", en: "Reset Password" },
  { fnKey: "bind_phone", cn: "綁定手機", en: "Bind Phone" },
  { fnKey: "unbind_phone", cn: "解綁手機", en: "Unbind Phone" },
  { fnKey: "add_admin", cn: "新增管理員", en: "Add Admin" },
  { fnKey: "del_admin", cn: "刪除管理員", en: "Delete Admin" },
  { fnKey: "edit_role", cn: "編輯角色", en: "Edit Role" },
  { fnKey: "export_report", cn: "匯出報表", en: "Export Report" },
  { fnKey: "adjust_balance", cn: "調整餘額", en: "Adjust Balance" },
  { fnKey: "audit_deposit", cn: "存款審核", en: "Audit Deposit" },
  { fnKey: "audit_withdraw", cn: "提款審核", en: "Audit Withdraw" },
  { fnKey: "send_bonus", cn: "派發紅利", en: "Send Bonus" }
];

const all = fnDefs.map((f, i) => ({
  fnID: i + 1,
  fnName: f.cn,
  displayFnName: f.en,
  fnKey: f.fnKey,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:25:00`,
  otpStatus: (i % 2) + 1
}));

export default defineFakeRoute([
  {
    url: "/backend/admin/otpStatus/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.fnID) {
        list = list.filter(v => String(v.fnID).includes(query.fnID));
      }
      if (query.fnName) {
        list = list.filter(
          v => v.fnName.includes(query.fnName) || v.displayFnName.includes(query.fnName)
        );
      }
      if (query.fnKey) {
        list = list.filter(v => v.fnKey.includes(query.fnKey));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/admin/otpStatus/modify",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
