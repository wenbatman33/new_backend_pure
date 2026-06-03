import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員主資料假資料
const memberDetail = {
  id: 100001,
  account: "test_member01",
  name: "王小明",
  status: 1,
  depositLimit: 1,
  withdrawLimit: 1,
  agencyID: 2001,
  agency: "agent_a",
  agencyIDSelf: 100001,
  agencyAccountSelf: "test_member01",
  phone: "0912345678",
  phoneArea: "+886",
  phoneCert: 1,
  email: "test@example.com",
  emailCert: 1,
  address: "中正路一段",
  provinceId: 1,
  cityId: 2,
  stateId: 3,
  streetId: 4,
  vipLevel: 3,
  vipLevelName: "黄金会员",
  vipWithdrawQuota: 500000,
  vip2Level: 2,
  createdAt: "2025-01-15 10:20:30",
  lastLoginAt: "2026-06-01 09:18:00",
  birthday: "1990-05-20",
  withdrawQuota: "300000",
  currentStatus: true,
  registerIp: "1.2.3.4",
  registerArea: "台北",
  loginIp: "5.6.7.8",
  lastLoginArea: "高雄"
};

// 標籤群組（含顏色）+ 會員標籤
const tagGroups = [
  { id: 101, name: "行为标签", color: "#f50" },
  { id: 102, name: "风险标签", color: "#2db7f5" }
];
const memberTags = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `标签${i + 1}`,
  tagGroupID: i % 2 === 0 ? 101 : 102,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 11:00:00`
}));

// 錢包資料
const walletData = {
  totalMoney: 123456.78,
  gameWallet: 5000,
  totalBalance: 118456.78,
  totalLock: 2000,
  totalDeposit: 500000,
  totalWithdraw: 380000,
  depositWithdrawDiff: 120000,
  promotionAmount: 8000,
  vipGiftAmount: 1500,
  returnAmount: 3200,
  totalBonus: 12700,
  totalProfitAndLoss: -25000,
  totalWin: -25000,
  totalRate: 1.05,
  totalBetAmount: 980000,
  sumAdjustmentTypeDeposit: 2000,
  sumAdjustmentTypeWithdrawal: 500,
  transferMember: 0,
  luckDeposit: 10000,
  luckWithdraw: 6000
};

// 新幣（樂幣）錢包資料
const luckMoneyData = {
  totalLuckMoney: 8888.88,
  luckDeposit: 10000,
  luckWithdraw: 6000,
  luckDepositWithdrawDiff: 4000,
  totalInitialMoney: 2000,
  totalLuckBetAmount: 35000,
  totalLuckProfitAndLoss: -1500,
  totalLuckWin: -1500
};

// 備註
const comments = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `备注标题 ${i + 1}`,
  content: `这是第 ${i + 1} 笔会员备注内容，仅供前端渲染验证使用。`,
  creator: i % 2 === 0 ? "admin" : "operator01",
  updator: i % 3 === 0 ? "admin" : "operator02",
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:00:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 15:30:00`
}));

export default defineFakeRoute([
  // 會員主資料
  {
    url: "/backend/member/detail",
    method: "get",
    response: () => ({ success: true, data: { ...memberDetail } })
  },
  // 錢包主資料
  {
    url: "/backend/member/detail/money",
    method: "get",
    response: () => ({ success: true, data: { ...walletData } })
  },
  // 戰績（合併進錢包）
  {
    url: "/backend/member/career",
    method: "get",
    response: () => ({
      success: true,
      data: { totalWin: walletData.totalWin, totalRate: walletData.totalRate }
    })
  },
  // 新幣錢包
  {
    url: "/backend/member/detail/luckMoney",
    method: "get",
    response: () => ({ success: true, data: { ...luckMoneyData } })
  },
  // 會員標籤
  {
    url: "/backend/member/tag",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: memberTags,
        groups: tagGroups,
        depositForbidden: 0,
        loginForbidden: 0,
        withdrawalForbidden: 0
      }
    })
  },
  // 備註
  {
    url: "/backend/member/comments",
    method: "get",
    response: () => ({
      success: true,
      data: { list: comments, total: comments.length }
    })
  },
  // 帳號轉 ID
  {
    url: "/backend/member/id/account",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: { id: 100001, account: query?.account ?? "test_member01" }
    })
  },
  // 移除提款密碼
  {
    url: "/backend/withdrawal/password/removePassword",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 恢復殭屍帳號
  {
    url: "/backend/member/relieveZombie",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 關閉會員
  {
    url: "/backend/member/closemember",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 清除真實姓名
  {
    url: "/backend/member/name",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
