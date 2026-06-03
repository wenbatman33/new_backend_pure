import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 上传会员名单 假资料：依 /backend/member/by-upload 回传栏位
const locations = ["台北", "高雄", "台中", "新北", "桃园"];
const devices = ["Android", "iOS", "Web", "H5"];

function genRow(i: number) {
  const loginStatus = (i % 3) + 1; // 1 启用 2 停用 3 锁定
  return {
    memberID: 100000 + i,
    memberAccount: `member${String(i + 1).padStart(3, "0")}`,
    memberName: `测试会员${i + 1}`,
    phone: `09${String(10000000 + i * 137).slice(0, 8)}`,
    phoneCert: i % 2,
    vipLevel: `VIP${i % 6}`,
    loginStatus,
    depositStatus: (i % 2) + 1,
    withdrawalStatus: ((i + 1) % 2) + 1,
    topAgencyAccount: `topAgency${i % 4}`,
    agencyAccount: `agency${i % 7}`,
    recommenderAccount: i % 3 === 0 ? `referrer${i}` : "",
    totalMoney: (Math.random() * 100000).toFixed(2),
    firstDepositTime: `2026-04-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    firstDepositAmount: (Math.random() * 5000).toFixed(2),
    totalDepositAmount: (Math.random() * 200000).toFixed(2),
    totalDepositCount: Math.floor(Math.random() * 200),
    firstWithdrawalAmount: (Math.random() * 3000).toFixed(2),
    firstWithdrawalCount: Math.floor(Math.random() * 50),
    totalReward: (Math.random() * 8000).toFixed(2),
    totalBetAmount: (Math.random() * 500000).toFixed(2),
    totalValidBetAmount: (Math.random() * 400000).toFixed(2),
    totalWinAmount: (Math.random() * 300000).toFixed(2),
    totalProfitAndLoss: (Math.random() * 100000 - 50000).toFixed(2),
    registerAt: `2026-01-${String((i % 28) + 1).padStart(2, "0")} 08:00:00`,
    registerLocation: locations[i % locations.length],
    registerDeviceTypeStr: devices[i % devices.length],
    lastLoginAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 22:30:00`,
    lastLoginLocation: locations[(i + 2) % locations.length],
    lastLoginDeviceTypeStr: devices[(i + 1) % devices.length],
    lastDepositAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    lastWithdrawalAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:00:00`
  };
}

const all = Array.from({ length: 16 }).map((_, i) => genRow(i));

export default defineFakeRoute([
  {
    // 旧 endpoint：POST /backend/member/by-upload（body 带 account/pageSize）
    url: "/backend/member/by-upload",
    method: "post",
    response: ({ body }) => {
      let list = all;
      const account = body?.account;
      if (account) {
        // 支援逗号分隔多帐号过滤；若皆不命中则回全部以便预览
        const keys = String(account)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
        const filtered = list.filter(v =>
          keys.some(k => v.memberAccount.includes(k))
        );
        if (filtered.length > 0) list = filtered;
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 旧 endpoint：POST /backend/member/by-upload/export
    url: "/backend/member/by-upload/export",
    method: "post",
    response: () => ({ success: true, data: { list: all, total: all.length } })
  }
]);
