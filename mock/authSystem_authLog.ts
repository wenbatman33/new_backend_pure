import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 操作類型代碼（1~18）與欄位代碼（1001~1014）對應舊 routes.system.authLogs
const accounts = ["admin", "operator01", "operator02", "supervisor"];
const targets = ["member1001", "群组A", "权限key_user_edit", "VPN-Group", "admin002"];
const columnCodes = [1001, 1002, 1003, 1004, 1007, 1009, 1012];

function buildSubData(i: number) {
  // 偶數筆：欄位變更；奇數第 3 筆模擬 VPN IP 變更
  if (i % 3 === 0) {
    return [
      {
        admin_user_account: accounts[i % accounts.length],
        vpn_ip: `10.0.${i}.${(i * 7) % 255}`
      }
    ];
  }
  const code = columnCodes[i % columnCodes.length];
  return [
    {
      column: code,
      oldValue: `旧值${i}`,
      newValue: `新值${i}`
    },
    {
      column: columnCodes[(i + 1) % columnCodes.length],
      oldValue: i % 2,
      newValue: (i + 1) % 2
    }
  ];
}

const all = Array.from({ length: 16 }).map((_, i) => ({
  account: accounts[i % accounts.length],
  action: (i % 18) + 1,
  target: targets[i % targets.length],
  time: `2026-05-${String((i % 28) + 1).padStart(2, "0")} ${String(
    (i % 24)
  ).padStart(2, "0")}:30:00`,
  sub_data: buildSubData(i)
}));

export default defineFakeRoute([
  {
    url: "/backend/authLogs/Logs",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.account) {
        list = list.filter(v => v.account.includes(query.account));
      }
      // startDate / endDate 簡單模擬：以日期字串比較
      if (query.startDate) {
        list = list.filter(v => v.time.slice(0, 10) >= query.startDate);
      }
      if (query.endDate) {
        list = list.filter(v => v.time.slice(0, 10) <= query.endDate);
      }
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
