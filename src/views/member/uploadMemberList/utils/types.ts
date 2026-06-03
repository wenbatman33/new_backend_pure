// 上传会员名单 列表项型别（依旧后端 /backend/member/by-upload 回传栏位）
interface MemberItem {
  memberID: number;
  memberAccount: string;
  memberName: string;
  phone: string;
  phoneCert: number;
  vipLevel: string | number;
  loginStatus: number; // 1 启用 2 停用 3 锁定
  depositStatus: number; // 1 启用 2 停用
  withdrawalStatus: number; // 1 启用 2 停用
  topAgencyAccount: string;
  agencyAccount: string;
  recommenderAccount: string;
  totalMoney: number | string;
  firstDepositTime: string;
  firstDepositAmount: number | string;
  totalDepositAmount: number | string;
  totalDepositCount: number | string;
  firstWithdrawalAmount: number | string;
  firstWithdrawalCount: number | string;
  totalReward: number | string;
  totalBetAmount: number | string;
  totalValidBetAmount: number | string;
  totalWinAmount: number | string;
  totalProfitAndLoss: number | string;
  registerAt: string;
  registerLocation: string;
  registerDeviceTypeStr: string;
  lastLoginAt: string;
  lastLoginLocation: string;
  lastLoginDeviceTypeStr: string;
  lastDepositAt: string;
  lastWithdrawalAt: string;
}

export type { MemberItem };
