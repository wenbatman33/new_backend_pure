import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import {
  getMemberDetail,
  getMemberTag,
  getMemberWalletDetail,
  getMemberComments,
  getMemberLuckMoneyDetail,
  accountToMemberId,
  removeMemberWithdrawalPassword,
  relieveMemberZombieAccount,
  closeMember,
  clearMemberRealName
} from "@/api/member";
import type {
  MemberDetail,
  WalletData,
  MemberTag,
  CommentItem,
  DescItem
} from "./types";

// 會員主資料展示欄位（el-descriptions）。render 用 cellRenderer 風格在 index.vue 內處理特殊欄位
export const memberDetailSchema: DescItem[] = [
  { field: "id", label: "ID" },
  { field: "account", label: $t("member.account") },
  { field: "name", label: $t("member.name") },
  { field: "agencyIDSelf", label: $t("member.agencyID") },
  { field: "statusText", label: $t("member.loginStatus") },
  { field: "depositLimitText", label: $t("member.depositLimit") },
  { field: "withdrawLimitText", label: $t("member.withdrawLimit") },
  { field: "owningAgent", label: $t("member.owningAgent") },
  { field: "phoneText", label: $t("member.phone") },
  { field: "email", label: $t("member.email") },
  { field: "fullAddress", label: $t("member.address"), span: 2 },
  { field: "vipLevelText", label: $t("member.vipLevel") },
  { field: "withdrawQuota", label: $t("member.withdrawQuota") },
  { field: "createdAt", label: $t("member.createdAtDate") },
  { field: "lastLoginAt", label: $t("member.lastLoginAt") },
  { field: "birthday", label: $t("member.birthday") },
  { field: "currentStatusText", label: $t("member.currentStatus") }
];

// 錢包資料欄位
export const walletTotalSchema: DescItem[] = [
  { field: "totalMoney", label: $t("member.totalMoney"), span: 2 },
  { field: "gameWallet", label: $t("member.gameWallet") },
  { field: "totalBalance", label: $t("member.walletTotalBalance") },
  { field: "totalLock", label: $t("member.walletTotalLock") },
  { field: "totalDeposit", label: $t("member.walletTotalDeposit"), span: 2 },
  { field: "totalWithdraw", label: $t("member.walletTotalWithdraw"), span: 2 },
  { field: "depositWithdrawDiff", label: $t("member.walletDepositWithdrawDiff") },
  { field: "promotionAmount", label: $t("member.walletPromotionAmount") },
  { field: "vipGiftAmount", label: $t("member.walletVipGiftAmount") },
  { field: "returnAmount", label: $t("member.walletReturnAmount") },
  { field: "totalBonus", label: $t("member.walletTotalBonus") },
  { field: "totalProfitAndLoss", label: $t("member.walletTotalProfitAndLoss"), span: 2 },
  { field: "totalWin", label: $t("member.walletTotalWin"), span: 2 },
  { field: "totalRate", label: $t("member.walletTotalRate"), span: 2 }
];

// 新幣（樂幣）錢包資料欄位
export const luckMoneySchema: DescItem[] = [
  { field: "totalLuckMoney", label: $t("member.luckMoneyTotalMoney") },
  { field: "luckDeposit", label: $t("member.luckMoneyDeposit") },
  { field: "luckWithdraw", label: $t("member.luckMoneyWithdraw") },
  { field: "luckDepositWithdrawDiff", label: $t("member.luckMoneyDepositWithdrawDiff") },
  { field: "totalInitialMoney", label: $t("member.luckMoneyTotalInitialMoney") },
  { field: "totalLuckBetAmount", label: $t("member.luckMoneyTotalBetAmount") },
  { field: "totalLuckProfitAndLoss", label: $t("member.luckMoneyTotalProfitAndLoss") },
  { field: "totalLuckWin", label: $t("member.luckMoneyTotalWin") }
];

const vip2LevelOptions = [
  { label: $t("member.Bronze"), value: 0 },
  { label: $t("member.Silver"), value: 1 },
  { label: $t("member.Gold"), value: 2 },
  { label: $t("member.Platinum"), value: 3 },
  { label: $t("member.Diamond"), value: 4 },
  { label: "VIP", value: 5 }
];

export function useMemberDetail() {
  const route = useRoute();
  const userId = Number(route.params?.id) || 0;

  const loading = ref(false);
  const userDetail = ref<MemberDetail>({});
  const walletData = ref<WalletData>({});
  const luckMoneyData = ref<WalletData>({});
  const tags = ref<MemberTag[]>([]);
  const tagColor = ref<any[]>([]);
  const comments = ref<CommentItem[]>([]);
  const luckMoneyExpanded = ref(false);

  // 搜尋會員（依帳號 / ID 跳頁）
  const searchAccount = ref("");
  const searchID = ref("");

  async function searchMember() {
    if (!searchAccount.value) return;
    const { success, data } = await accountToMemberId({
      account: searchAccount.value
    });
    if (success && data?.id) {
      location.href = "/member/detail/" + String(data.id);
    }
  }

  function searchMemberID() {
    if (searchID.value) {
      location.href = "/member/detail/" + String(searchID.value);
    }
  }

  // 取得會員狀態文字
  function statusText(val: number) {
    if (val === 1) return $t("member.enable");
    if (val === 2) return $t("member.disable");
    if (val === 3) return $t("member.lock");
    return $t("member.unknownStatus");
  }

  function vipLevelText(d: MemberDetail) {
    const name = d.vipLevelName ? ` ${$t("member.vipName")} : ${d.vipLevelName}` : "";
    return `LV ${d.vipLevel ?? ""}${name}`;
  }

  function vip2LevelText(val: number) {
    return vip2LevelOptions.find(i => i.value === val)?.label ?? "";
  }

  async function initUserDetail() {
    const { success, data } = await getMemberDetail(userId);
    if (success) {
      // 組合衍生欄位供 el-descriptions 直接顯示
      data.statusText = statusText(data.status);
      data.depositLimitText =
        data.depositLimit === 1 ? $t("member.enable") : $t("member.disable");
      data.withdrawLimitText =
        data.withdrawLimit === 1 ? $t("member.enable") : $t("member.disable");
      data.owningAgent = data.agencyID ? `${data.agencyID} (${data.agency ?? ""})` : "";
      data.agencyIDSelf = `${data.agencyIDSelf ?? ""} (${data.agencyAccountSelf ?? ""})`;
      data.phoneText = data.phone ? `${data.phone}(${data.phoneArea ?? ""})` : "";
      data.vipLevelText = vipLevelText(data);
      data.vip2LevelText = vip2LevelText(data.vip2Level);
      data.currentStatusText = data.currentStatus
        ? $t("member.online")
        : $t("member.offline");
      userDetail.value = data;
    }
  }

  async function initTag() {
    const { success, data } = await getMemberTag(userId);
    if (success) {
      tags.value = data?.list ?? [];
      tagColor.value = data?.groups ?? [];
    }
  }

  async function initWallet() {
    const { success, data } = await getMemberWalletDetail(userId);
    if (success) walletData.value = data ?? {};
  }

  async function initLuckMoney() {
    try {
      const { success, data } = await getMemberLuckMoneyDetail(userId);
      if (success) luckMoneyData.value = data ?? {};
    } catch {
      luckMoneyData.value = {};
    }
  }

  async function initComments() {
    const { success, data } = await getMemberComments(userId);
    if (success) comments.value = data?.list ?? [];
  }

  function handleSuccess() {
    initUserDetail();
    initComments();
    initTag();
  }

  // 移除提款密碼
  async function handleRemoveWithdrawalPassword() {
    ElMessageBox.confirm(
      $t("member.handleRemoveWithdrawalPassword"),
      "",
      { type: "warning" }
    )
      .then(async () => {
        const { success } = await removeMemberWithdrawalPassword(userId);
        if (success) {
          message($t("member.handleRemoveWithdrawalPassword"), { type: "success" });
          handleSuccess();
        }
      })
      .catch(() => {});
  }

  // 恢復殭屍帳號
  async function handleRecoverZombie(account: string) {
    const { success } = await relieveMemberZombieAccount({ account });
    if (success) {
      message($t("member.memberRecover"), { type: "success" });
      handleSuccess();
    }
  }

  // 關閉會員
  async function handleCloseMember(account: string) {
    const { success } = await closeMember({ account });
    if (success) {
      message($t("member.memberClosed"), { type: "success" });
      handleSuccess();
    }
  }

  // 清除真實姓名
  async function handleClearRealName() {
    const { success } = await clearMemberRealName({ id: userId });
    if (success) {
      message($t("member.clearRealName"), { type: "success" });
      handleSuccess();
    }
  }

  // 錢包紀錄 / 操作紀錄（沿用舊路徑開新視窗）
  function openWalletLog() {
    window.open("/member/walletLog/" + userId);
  }
  function openActionLog(account: string) {
    window.open("/member/log/" + account);
  }

  // TODO: 下列操作在舊頁面以獨立 modal 實作（編輯資料、改密碼、改提款密碼、改 VIP、
  // 標籤編輯、備註、銀行卡、USDT、電子支付、代付地址、限紅、賽事限紅、遊戲限制、
  // 遊戲回收/填充、提款額度、提款明細等），各自為獨立子模組，待後續分模組遷移。

  onMounted(() => {
    if (userId) {
      loading.value = true;
      Promise.all([
        initUserDetail(),
        initTag(),
        initWallet(),
        initComments(),
        initLuckMoney()
      ]).finally(() => {
        loading.value = false;
      });
    }
  });

  return {
    userId,
    loading,
    userDetail,
    walletData,
    luckMoneyData,
    tags,
    tagColor,
    comments,
    luckMoneyExpanded,
    searchAccount,
    searchID,
    memberDetailSchema,
    walletTotalSchema,
    luckMoneySchema,
    hasAuth,
    searchMember,
    searchMemberID,
    handleSuccess,
    handleRemoveWithdrawalPassword,
    handleRecoverZombie,
    handleCloseMember,
    handleClearRealName,
    openWalletLog,
    openActionLog
  };
}
