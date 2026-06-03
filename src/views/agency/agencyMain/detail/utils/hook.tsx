import { h, ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import bankcardForm from "../bankcardForm.vue";
import usdtForm from "../usdtForm.vue";
import ecnyForm from "../ecnyForm.vue";
import withdrawInfoForm from "../withdrawInfoForm.vue";
import promotionLinkForm from "../promotionLinkForm.vue";
import addPlatformRatesForm from "../addPlatformRatesForm.vue";
import editPlatformRatesForm from "../editPlatformRatesForm.vue";
import {
  getAgencyDetail,
  getAgencyDetailGroup,
  getAgencyDetailDefaultCard,
  getAgencyDetailDefaultUsdt,
  getAgencyDetailDefaultEcny,
  getAgencyDetailRecord,
  getAgencyDetailRecentMoneyLog,
  getAgencyDetailMoneyUseType,
  putAgencyDetailByKey,
  putAgencyDetailStatus,
  putAgencyDetailGroup,
  editAgencyDetailPassword,
  editAgencyDetailTransPassword,
  verifyAgencyDetailPhone,
  createAgencyDetailPromotionlink,
  updateAgencyDetailPromotionlink,
  deleteAgencyDetailPromotionlink,
  getAgencyDetailPlatformFeeRatioList,
  addAgencyDetailPlatformFeeRatio,
  updateAgencyDetailPlatformFeeRatio,
  deleteAgencyDetailPlatformFeeRatio,
  getAgencyDetailGameListType,
  createAgencyDetailPayGroup,
  getAgencyDetailPayGroups
} from "@/api/agency";
import type { AgencyBasic } from "./types";

export function useAgencyDetail() {
  const route = useRoute();
  const userId = Number(route.params?.id ?? route.query?.id ?? 0);

  const formBasic = reactive<AgencyBasic>({
    id: "",
    account: "",
    name: "",
    memberAccount: "",
    parentAgencyID: "",
    parentAgencyAccount: "",
    childAgencyCount: "",
    memberCount: "",
    phone: "",
    email: "",
    wechat: "",
    qq: "",
    reivewAgencyTime: "",
    lastLoginTime: "",
    applyAgencyIp: "",
    lastLoginIp: "",
    editableName: false,
    editablePhone: false,
    editableEmail: false,
    editableWechat: false,
    editableAdminRemark: false,
    editableBankcardGroups: false,
    editablePaymentGroups: false,
    editableQQ: false,
    editablePassword: false,
    editableTransPassword: false,
    promotionLinks: [],
    defaultCard: "",
    defaultUSDT: "",
    defaultEcny: "",
    password: "",
    transPassword: "",
    adminRemark: "",
    updateAdmin: "",
    bankcardGroups: undefined,
    paymentGroups: undefined,
    phoneCert: 2,
    businessType: "",
    telegram: "",
    whatsapp: "",
    netProfitBase: "",
    platformCharge: true,
    totalCharge: true,
    totalBonus: true
  });

  const staticRecord = reactive<Record<string, number>>({
    money: 0,
    frozenMoney: 0,
    rechargeAmount: 0,
    withdrawAmount: 0,
    commission: 0,
    transferMember: 0,
    manualRecharge: 0,
    manualWithdraw: 0,
    bonusAmount: 0
  });

  // 帳號/分層設定表單
  const accountForm = reactive<any>({
    agencyID: userId,
    status: 1,
    depositLimit: 1,
    withdrawLimit: 1,
    transferLimit: 1,
    walletManualOperationLimit: 1,
    allowOtherBankCard: 1,
    giveOffer: 1,
    rankGroupID: undefined,
    offerPercent: 0,
    agencyReturnProportion: 0,
    memberReturnProportion: 0
  });

  const userBankcard = ref<any>(null);
  const userPayment = ref<any>(null);
  const allowOtherBankCard = ref<any>("");
  const realName = ref("");
  const rankGroupOptions = ref<any[]>([]);

  // 錢包異動紀錄
  const moneyType = ref<any[]>([]);
  const walletLogList = ref<any[]>([]);
  const walletLogLoading = ref(false);
  const walletLogColumns: TableColumnList = [
    { label: $t("agency.detailIndex39"), prop: "id", width: 120 },
    {
      label: $t("agency.detailIndex40"),
      prop: "useType",
      cellRenderer: ({ row }) => {
        const t = moneyType.value.find(i => i.useTypeID === row.useType);
        return <span>{t?.useTypeName || row.useType}</span>;
      }
    },
    {
      label: $t("agency.detailIndex41"),
      prop: "amount",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.amount, 2)}</span>
    },
    {
      label: $t("agency.detailIndex42"),
      prop: "afterMoney",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.afterMoney, 2)}</span>
    },
    { label: $t("agency.detailIndex43"), prop: "date", width: 180 },
    { label: $t("agency.detailIndex44Remark"), prop: "remark", width: 200 }
  ];

  // 客製平台費率
  const gameType = ref<any[]>([]);
  const platformRatesList = ref<any[]>([]);
  const platformRatesLoading = ref(false);
  const platformRatesColumns: TableColumnList = [
    { label: $t("agency.displayName"), prop: "gameGroupDisplayName" },
    {
      label: $t("agency.gameType"),
      prop: "gameTypeID",
      cellRenderer: ({ row }) => {
        const t = gameType.value.find(i => i.key == row.gameTypeID);
        return <span>{t?.value ?? row.gameTypeID}</span>;
      }
    },
    { label: $t("agency.platformRate"), prop: "platformFeeRatio" },
    {
      label: $t("agency.platformFeeCalculationBasis"),
      prop: "bettingFrom",
      width: 180,
      cellRenderer: ({ row }) => (
        <span>
          {row.bettingFrom == 1
            ? $t("agency.negative")
            : $t("agency.effectiveFlow")}
        </span>
      )
    },
    { label: $t("agency.operate"), fixed: "right", width: 140, slot: "platformAction" }
  ];

  const netProfitBaseOptions = [
    { value: 1, label: $t("agency.companyWinOrLose") },
    { value: 2, label: $t("agency.depositAndWithdrawalReduce") },
    { value: 3, label: $t("agency.turnover") }
  ];

  async function loadBasic() {
    const { data: res } = await getAgencyDetail({ id: userId });
    if (!res) return;
    userBankcard.value = res.bankcardGroups?.[0];
    userPayment.value = res.paymentGroups?.[0];
    formBasic.bankcardGroups = res.bankcardGroups?.[0]?.ID;
    formBasic.paymentGroups = res.paymentGroups?.[0]?.ID;
    formBasic.id = res.id;
    formBasic.name = res.name;
    formBasic.account = res.account;
    formBasic.memberAccount = res.memberAccount;
    formBasic.parentAgencyID = res.parentAgencyID;
    formBasic.parentAgencyAccount = res.parentAgencyAccount;
    formBasic.childAgencyCount = res.childAgencyCount;
    formBasic.memberCount = res.memberCount;
    formBasic.phone = res.phone;
    formBasic.email = res.email;
    formBasic.wechat = res.wechat;
    formBasic.adminRemark = res.adminRemark;
    formBasic.updateAdmin = res.updateAdmin;
    formBasic.qq = res.qq;
    formBasic.reivewAgencyTime = res.reivewAgencyTime;
    formBasic.lastLoginTime = res.lastLoginTime;
    formBasic.applyAgencyIp = res.applyAgencyIp;
    formBasic.lastLoginIp = res.lastLoginIp;
    formBasic.promotionLinks = res.promotionLinks ?? [];
    formBasic.phoneCert = res.phoneCert;
    formBasic.telegram = res.telegram;
    formBasic.whatsapp = res.whatsapp;
    allowOtherBankCard.value = res.allowOtherBankCard;
    realName.value = res.name;
    return res;
  }

  async function initUserDetail() {
    const res = await loadBasic();
    const { data: groupRes } = await getAgencyDetailGroup({ id: userId });
    const { data: card } = await getAgencyDetailDefaultCard({ agencyID: userId });
    const { data: usdt } = await getAgencyDetailDefaultUsdt({ agencyID: userId });
    const { data: ecny } = await getAgencyDetailDefaultEcny({ agencyID: userId });
    const { data: records } = await getAgencyDetailRecord({ id: userId });
    const { data: useTypeData } = await getAgencyDetailMoneyUseType();
    moneyType.value = useTypeData?.list ?? [];

    if (records) {
      Object.entries(records).forEach(([k, v]) => {
        staticRecord[k] = v as number;
      });
    }

    formBasic.defaultCard = card ? `${card.cardNo} (${card.bankName})` : "";
    formBasic.defaultUSDT = usdt?.address ?? "";
    formBasic.defaultEcny = ecny?.address ?? "";

    if (groupRes) {
      formBasic.businessType = groupRes.businessType;
      formBasic.netProfitBase = groupRes.netProfitBase;
      formBasic.platformCharge = groupRes.platformCharge === 1;
      formBasic.totalCharge = groupRes.totalCharge === 1;
      formBasic.totalBonus = groupRes.totalBonus === 1;
    }

    accountForm.agencyID = userId;
    accountForm.status = res?.status;
    accountForm.depositLimit = res?.depositLimit;
    accountForm.withdrawLimit = res?.withdrawLimit;
    accountForm.transferLimit = res?.transferLimit;
    accountForm.walletManualOperationLimit = res?.walletManualOperationLimit;
    accountForm.allowOtherBankCard = res?.allowOtherBankCard;
    accountForm.giveOffer = groupRes?.giveOffer;
    accountForm.rankGroupID = groupRes?.groupID;
    accountForm.offerPercent = groupRes?.offerPercent;
    accountForm.agencyReturnProportion = groupRes?.agencyReturnProportion;
    accountForm.memberReturnProportion = groupRes?.memberReturnProportion;
  }

  async function loadWalletLog() {
    walletLogLoading.value = true;
    try {
      const { data } = await getAgencyDetailRecentMoneyLog({ id: userId });
      walletLogList.value = data?.list ?? (Array.isArray(data) ? data : []);
    } finally {
      walletLogLoading.value = false;
    }
  }

  async function loadPlatformRates() {
    platformRatesLoading.value = true;
    try {
      const { data: typeData } = await getAgencyDetailGameListType();
      gameType.value = typeData?.list ?? [];
      const { data } = await getAgencyDetailPlatformFeeRatioList({
        agencyID: userId
      });
      platformRatesList.value = data?.list ?? (Array.isArray(data) ? data : []);
    } finally {
      platformRatesLoading.value = false;
    }
  }

  // 切換編輯狀態
  function editable(key: keyof AgencyBasic) {
    (formBasic[key] as any) = true;
  }

  function handleCopy(str: any) {
    const text = String(str ?? "");
    navigator.clipboard?.writeText(text).then(
      () => message(`${text}${$t("agency.detailIndex44")}`, { type: "success" }),
      () => message(`${text}${$t("agency.detailIndex45")}`, { type: "error" })
    );
  }

  // 提交單一欄位編輯
  async function formBasicSubmit(col: string, value: any, editKey: keyof AgencyBasic) {
    const { success } = await putAgencyDetailByKey({ id: userId, [col]: value });
    if (success) {
      message($t("agency.detailIndex51"), { type: "success" });
      (formBasic[editKey] as any) = false;
      await loadBasic();
    } else {
      message($t("agency.detailIndex50"), { type: "error" });
    }
  }

  // 認證手機
  async function agencyVerifyPhone() {
    const { success } = await verifyAgencyDetailPhone({
      id: Number(formBasic.id),
      account: formBasic.account
    });
    if (success) await loadBasic();
  }

  // 修改密碼 type:1 後台 2 交易
  async function handlePassword(type: number, password: string) {
    if (type === 1) {
      const { success } = await editAgencyDetailPassword({ id: userId, password });
      if (success) {
        message($t("agency.detailIndex52"), { type: "success" });
        formBasic.editablePassword = false;
        formBasic.password = "";
      }
    } else {
      const { success } = await editAgencyDetailTransPassword({
        id: userId,
        pinNumber: password
      });
      if (success) {
        message($t("agency.detailIndex52"), { type: "success" });
        formBasic.editableTransPassword = false;
        formBasic.transPassword = "";
      }
    }
  }

  // 金流組別更新 type:1 銀行卡 2 三方
  async function editPayGroupAgency(type: number) {
    const { success } = await createAgencyDetailPayGroup({
      payGroupID: type === 1 ? formBasic.bankcardGroups : formBasic.paymentGroups,
      agencyAccounts: formBasic.account
    });
    if (success) {
      message($t("agency.detailIndex51"), { type: "success" });
      if (type === 1) formBasic.editableBankcardGroups = false;
      else formBasic.editablePaymentGroups = false;
    } else {
      message($t("agency.detailIndex50"), { type: "error" });
    }
    await loadBasic();
  }

  // 提交分層 + 狀態
  async function formAccountSubmit() {
    const groupRes = await putAgencyDetailGroup({
      agencyID: userId,
      giveOffer: accountForm.giveOffer,
      rankGroupID: accountForm.rankGroupID,
      offerPercent: accountForm.offerPercent,
      agencyReturnProportion: accountForm.agencyReturnProportion,
      memberReturnProportion: accountForm.memberReturnProportion,
      netProfitBase: formBasic.netProfitBase,
      platformCharge: formBasic.platformCharge ? 1 : 2,
      totalCharge: formBasic.totalCharge ? 1 : 2,
      totalBonus: formBasic.totalBonus ? 1 : 2
    });
    groupRes.success
      ? message($t("agency.detailIndex46"), { type: "success" })
      : message($t("agency.detailIndex47"), { type: "error" });

    const statusRes = await putAgencyDetailStatus({
      id: userId,
      status: accountForm.status,
      depositLimit: accountForm.depositLimit,
      withdrawLimit: accountForm.withdrawLimit,
      walletManualOperationLimit: accountForm.walletManualOperationLimit,
      allowOtherBankCard: accountForm.allowOtherBankCard,
      transferLimit: accountForm.transferLimit
    });
    statusRes.success
      ? message($t("agency.detailIndex48"), { type: "success" })
      : message($t("agency.detailIndex49"), { type: "error" });

    await initUserDetail();
  }

  // ===== 對話框 =====
  function openCardDialog() {
    addDialog({
      title: $t("agency.bankCardModal1"),
      width: "850px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(bankcardForm, {
          agencyID: userId,
          agencyAccount: formBasic.account,
          allowOtherBankCard: allowOtherBankCard.value,
          realName: realName.value
        }),
      closeCallBack: () => initUserDetail()
    });
  }

  function openUsdtDialog() {
    addDialog({
      title: $t("agency.usdtModal1"),
      width: "850px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(usdtForm, { agencyID: userId, agencyAccount: formBasic.account }),
      closeCallBack: () => initUserDetail()
    });
  }

  function openEcnyDialog() {
    addDialog({
      title: $t("agency.ecnyModal1"),
      width: "700px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(ecnyForm, { agencyID: userId, agencyAccount: formBasic.account }),
      closeCallBack: () => initUserDetail()
    });
  }

  function openWithdrawDialog() {
    addDialog({
      title: $t("agency.withdrawalInfoList"),
      width: "850px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(withdrawInfoForm, { userId })
    });
  }

  // 推廣連結 新增/編輯
  function openPromotionLinkDialog(mode: "Add" | "Edit", row?: any) {
    const formRef = ref();
    addDialog({
      title:
        mode === "Add"
          ? $t("agency.addPromotionLinkModal5")
          : $t("agency.addPromotionLinkModal6"),
      width: "50%",
      draggable: true,
      props: {
        formInline: {
          mode,
          id: mode === "Add" ? userId : row?.id,
          promotionLink: row?.promotionLink ?? "",
          newpromotionLink: ""
        }
      },
      contentRenderer: () => h(promotionLinkForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const cur = (options.props as any).formInline;
        if (!cur.newpromotionLink) return;
        let res;
        if (mode === "Add") {
          res = await createAgencyDetailPromotionlink({
            agencyID: cur.id,
            type: 2,
            promotionLink: cur.newpromotionLink
          });
        } else {
          res = await updateAgencyDetailPromotionlink({
            id: cur.id,
            type: 0,
            promotionLink: cur.newpromotionLink
          });
        }
        if (res.success) {
          message($t("agency.addPromotionLinkModal8"), { type: "success" });
          done();
          await loadBasic();
        } else {
          message($t("agency.addPromotionLinkModal7"), { type: "error" });
        }
      }
    });
  }

  function handlePromotionLinkDelete(id: number | string) {
    ElMessageBox.confirm($t("agency.detailIndex37"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteAgencyDetailPromotionlink(id);
        if (success) {
          message($t("agency.detailIndex38"), { type: "success" });
          await loadBasic();
        }
      })
      .catch(() => {});
  }

  // 新增客製平台費率
  function openAddPlatformRates() {
    const formRef = ref();
    addDialog({
      title: $t("agency.chooseGameManufacturer"),
      width: "820px",
      draggable: true,
      contentRenderer: () => h(addPlatformRatesForm, { ref: formRef, userId }),
      beforeSure: async done => {
        const cur = formRef.value.getRef();
        const { success } = await addAgencyDetailPlatformFeeRatio({
          agencyID: cur.agencyID,
          gameGroupID: cur.gameGroupID,
          platformFeeRatio: cur.platformFeeRatio
        });
        if (success) {
          message($t("agency.detailIndex51"), { type: "success" });
          done();
          loadPlatformRates();
        }
      }
    });
  }

  // 編輯客製平台費率
  function openEditPlatformRates(row: any) {
    const formRef = ref();
    addDialog({
      title: $t("agency.editGameStatus"),
      width: "420px",
      draggable: true,
      props: {
        formInline: {
          id: row.id,
          gameGroupID: row.gameGroupID,
          gameGroupDisplayName: row.gameGroupDisplayName,
          platformFeeRatio: row.platformFeeRatio * 100
        }
      },
      contentRenderer: () => h(editPlatformRatesForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const cur = (options.props as any).formInline;
        const { success } = await updateAgencyDetailPlatformFeeRatio({
          id: cur.id,
          platformFeeRatio: Number((cur.platformFeeRatio / 100).toFixed(2))
        });
        if (success) {
          message($t("agency.detailIndex51"), { type: "success" });
          done();
          loadPlatformRates();
        }
      }
    });
  }

  function handlePlatformDelete(row: any) {
    ElMessageBox.confirm($t("common.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteAgencyDetailPlatformFeeRatio(row.id);
        if (success) loadPlatformRates();
      })
      .catch(() => {});
  }

  async function loadRankGroupOptions() {
    const { data } = await getAgencyDetailPayGroups({ type: 2, source: 2 });
    // 預載銀行卡金流組別下拉（依需求頁面可改 type）
    void data;
  }

  onMounted(async () => {
    await initUserDetail();
    await loadWalletLog();
    await loadPlatformRates();
    void loadRankGroupOptions;
  });

  return {
    userId,
    formBasic,
    staticRecord,
    accountForm,
    userBankcard,
    userPayment,
    rankGroupOptions,
    netProfitBaseOptions,
    walletLogList,
    walletLogLoading,
    walletLogColumns,
    platformRatesList,
    platformRatesLoading,
    platformRatesColumns,
    commaDecimalFormat,
    editable,
    handleCopy,
    formBasicSubmit,
    agencyVerifyPhone,
    handlePassword,
    editPayGroupAgency,
    formAccountSubmit,
    openCardDialog,
    openUsdtDialog,
    openEcnyDialog,
    openWithdrawDialog,
    openPromotionLinkDialog,
    handlePromotionLinkDelete,
    openAddPlatformRates,
    openEditPlatformRates,
    handlePlatformDelete,
    loadPlatformRates
  };
}
