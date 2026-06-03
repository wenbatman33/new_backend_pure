import { h, ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import editForm from "../form.vue";
import type { FormItemProps } from "./types";
import {
  getRiskMemberInfo,
  getRiskWithdrawal,
  getRiskStake,
  postRiskAuditLock,
  putRiskCheck,
  getRiskWalletDetail,
  getRiskCareer,
  getRiskPromotionDetail,
  getRiskMemberTag,
  getRiskComments,
  getRiskWalletLog,
  getRiskUseType,
  getRiskInOutType,
  getRiskTagGroup
} from "@/api/withdrawal";

export function useRiskCheck() {
  const route = useRoute();
  const router = useRouter();
  const formRef = ref();

  const loading = ref(false);
  const orderSn = computed(() => String(route.params?.sn ?? ""));
  const memberInfo = ref<any>({});
  const memberID = computed(() => memberInfo.value?.member?.key);
  const showButton = ref(false);

  // 资金记录搜尋條件
  const moneyLogSearch = reactive({
    start: "",
    end: "",
    type: [] as Array<string | number>,
    hiddenGameMoney: false
  });

  // 各區塊資料
  const promotionDetailData = ref<any>({ list: [] });
  const tagsData = ref<any>({ list: [] });
  const tagColor = ref<any[]>([]);
  const commentsData = ref<any[]>([]);
  const walletLogList = ref<any[]>([]);
  const stakeList = ref<any[]>([]);
  const stakeTotal = ref<any>({});
  const useTypeList = ref<any[]>([]);
  const inOutTypeList = ref<any[]>([]);
  const useTypeListOption = ref<any[]>([]);

  function fmtStart(d: string) {
    return d ? dayjs(d).startOf("day").format("YYYY-MM-DD HH:mm:ss") : "";
  }
  function fmtEnd(d: string) {
    return d ? dayjs(d).endOf("day").format("YYYY-MM-DD HH:mm:ss") : "";
  }

  // 基本资料欄位（label / value 渲染）
  const baseInfoColumns = computed(() => [
    { label: $t("withdrawal.memberAccount"), value: memberInfo.value?.member?.value },
    { label: "VIP", value: memberInfo.value?.vip != null ? `VIP${memberInfo.value.vip}` : "" },
    { label: $t("withdrawal.withdrawNumber"), value: memberInfo.value?.id },
    { label: $t("withdrawal.withdrawApplyTime"), value: memberInfo.value?.createdAt },
    {
      label: $t("withdrawal.withdrawalAmount"),
      value: commaDecimalFormat(memberInfo.value?.amount)
    },
    {
      label: $t("withdrawal.financialCheckStatus"),
      value: memberInfo.value?.financialCheck?.value
    },
    { label: $t("withdrawal.agencyID"), value: memberInfo.value?.agencyID }
  ]);

  // 钱包资料欄位
  const walletInfoColumns = computed(() => [
    {
      label: $t("withdrawal.singleWithdrawalLimit"),
      value: commaDecimalFormat(memberInfo.value?.dayUpper)
    },
    {
      label: $t("withdrawal.todayDeposit"),
      value: commaDecimalFormat(memberInfo.value?.todayDepositAmount)
    },
    {
      label: $t("withdrawal.todayWithdrawal"),
      value: commaDecimalFormat(memberInfo.value?.todayWithdrawalAmount)
    },
    {
      label: $t("withdrawal.todayDepositDiff"),
      value: commaDecimalFormat(memberInfo.value?.spread)
    },
    { label: $t("withdrawal.spread30"), value: commaDecimalFormat(memberInfo.value?.spread30) },
    {
      label: $t("withdrawal.winAmount"),
      value: commaDecimalFormat(memberInfo.value?.totalDonate, 2)
    },
    { label: $t("withdrawal.walletTotal"), value: commaDecimalFormat(memberInfo.value?.money) },
    {
      label: $t("withdrawal.freezeAmount"),
      value: commaDecimalFormat(memberInfo.value?.lockMoney)
    },
    { label: $t("withdrawal.totalRate"), value: commaDecimalFormat(memberInfo.value?.totalRate) },
    { label: $t("withdrawal.platform"), value: commaDecimalFormat(memberInfo.value?.totalWin) }
  ]);

  // 優惠表格欄位
  const promotionColumns: TableColumnList = [
    { label: $t("withdrawal.promotionName"), prop: "name" },
    {
      label: $t("withdrawal.promotionAmount"),
      prop: "amount",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.amount)}</span>
    },
    { label: $t("withdrawal.promotionStatus"), prop: "statusName" },
    { label: $t("withdrawal.promotionSendAt"), prop: "sendAt" }
  ];

  // 標籤表格欄位
  const tagColumns: TableColumnList = [
    {
      label: $t("withdrawal.tagID"),
      prop: "name",
      cellRenderer: ({ row }) => {
        const grp = tagColor.value.find((g: any) => g.id === row.tagGroupID);
        return (
          <el-tag style={{ color: grp?.color, borderColor: grp?.color }} effect="plain">
            {row.name}
          </el-tag>
        );
      }
    },
    { label: $t("withdrawal.updatedAt"), prop: "updatedAt" }
  ];

  // 资金记录表格欄位
  const walletLogColumns: TableColumnList = [
    { label: $t("withdrawal.date"), prop: "date", width: 155 },
    { label: $t("withdrawal.inOut"), prop: "inOutName", width: 90 },
    { label: $t("withdrawal.type"), prop: "typeName", width: 120 },
    { label: $t("withdrawal.previous"), prop: "before", width: 90 },
    { label: $t("withdrawal.amount"), prop: "amount", width: 90 },
    { label: $t("withdrawal.current"), prop: "after", width: 90 },
    { label: $t("withdrawal.multiple"), prop: "turnoverMultiple", width: 80 },
    { label: $t("withdrawal.turnoverNeed"), prop: "turnoverLimit", width: 90 },
    { label: $t("withdrawal.detail"), prop: "note", minWidth: 180 }
  ];

  // 流水详情（遊戲）表格欄位
  const stakeColumns: TableColumnList = [
    { label: $t("withdrawal.platform"), prop: "name", width: 130 },
    { label: $t("withdrawal.stake"), prop: "betAmount", width: 110 },
    { label: $t("withdrawal.gameWinAmount"), prop: "winAmount", width: 110 }
  ];

  async function initOptions() {
    useTypeList.value = (await getRiskUseType()).data?.list ?? [];
    useTypeListOption.value = useTypeList.value
      .filter((item: any) => Number(item.useTypeID) <= 1000)
      .map((item: any) => ({ label: item.useTypeName, value: item.useTypeID }));
    inOutTypeList.value = (await getRiskInOutType()).data?.list ?? [];
    tagColor.value = (await getRiskTagGroup()).data?.list ?? [];
  }

  async function loadMemberInfo() {
    const { data } = await getRiskMemberInfo({ id: orderSn.value });
    moneyLogSearch.start = data?.turnoverDurationStart || "";
    moneyLogSearch.end = data?.turnoverDurationEnd || "";
    memberInfo.value = data || {};
  }

  async function loadWithdrawal() {
    const { data } = await getRiskWithdrawal({
      orderSn: orderSn.value,
      withdrawalStart: fmtStart(memberInfo.value?.createdAt),
      withdrawalEnd: fmtEnd(memberInfo.value?.createdAt)
    });
    const wd = data?.list?.[0] || {};
    memberInfo.value.financialCheck = wd.financialCheck;
    memberInfo.value.agencyID = wd.agencyID;
    memberInfo.value.withdrawalData = wd;
    // 當提單狀態為待審核(1)且風控審核為待審核(1)或審核中(6)時顯示審核按鈕
    showButton.value =
      wd?.status?.key === 1 && (wd?.riskCheck?.key === 1 || wd?.riskCheck?.key === 6);
  }

  async function loadWalletDetail() {
    const { data } = await getRiskWalletDetail({ id: memberID.value });
    const career = (await getRiskCareer({ memberID: memberID.value })).data || {};
    const detail = { ...data, ...career };
    const m = Number(detail.totalMoney || 0) + Number(detail.gameWallet || 0);
    const withdrawTotal = Number(detail.WithdrawDetailTotal) || 0;
    const depositTotal = Number(detail.DepositDetailTotal) || 0;
    const totalLock = Number(detail.totalLock) || 0;
    memberInfo.value.totalDonate = withdrawTotal - depositTotal + totalLock + m;
    memberInfo.value.totalRate = detail.totalRate;
    memberInfo.value.totalWin = detail.totalWin;
  }

  async function loadPromotion() {
    const { data } = await getRiskPromotionDetail({
      memberID: memberID.value,
      sendAtStart: fmtStart(moneyLogSearch.start),
      sendAtEnd: fmtEnd(moneyLogSearch.end),
      status: 4,
      walletType: 1
    });
    promotionDetailData.value = data || { list: [] };
  }

  async function loadTags() {
    const { data } = await getRiskMemberTag({ id: memberID.value });
    tagsData.value = data || { list: [] };
  }

  async function loadComments() {
    const { data } = await getRiskComments({ id: memberID.value });
    commentsData.value = data?.list ?? [];
  }

  async function loadWalletLog() {
    const params: any = {
      memberID: memberID.value,
      startTime: fmtStart(moneyLogSearch.start),
      endTime: fmtEnd(moneyLogSearch.end),
      orderBy: "date",
      sortBy: 2,
      hiddenGameMoney: moneyLogSearch.hiddenGameMoney ? 0 : 1
    };
    if (moneyLogSearch.type.length > 0) params.type = moneyLogSearch.type;
    const { data } = await getRiskWalletLog(params);
    walletLogList.value = data?.list ?? [];
  }

  async function loadStake() {
    const { data } = await getRiskStake({
      id: memberID.value,
      startTime: fmtStart(moneyLogSearch.start),
      endTime: fmtEnd(moneyLogSearch.end)
    });
    stakeList.value = data?.list ?? [];
    stakeTotal.value = {
      betAmount: data?.totalBetAmount,
      winAmount: data?.totalWinAmount
    };
  }

  async function handleReload() {
    loading.value = true;
    try {
      await loadMemberInfo();
      await loadWithdrawal();
      await loadWalletDetail();
      await loadPromotion();
      await loadTags();
      await loadComments();
      await loadWalletLog();
      await loadStake();
    } finally {
      loading.value = false;
    }
  }

  // 重新查詢资金记录（含流水與優惠）
  async function handleMoneyLogSearch() {
    loading.value = true;
    try {
      await loadStake();
      await loadWalletLog();
      await loadPromotion();
    } finally {
      loading.value = false;
    }
  }

  function selectAllType() {
    moneyLogSearch.type = useTypeListOption.value.map((item: any) => item.value);
  }
  function cleanType() {
    moneyLogSearch.type = [];
  }

  function openTimeline() {
    const routeLocation = router.resolve({
      path: "/withdrawal/financial/timeline/",
      query: {
        startTime: fmtStart(moneyLogSearch.start),
        endTime: fmtEnd(moneyLogSearch.end),
        id: memberID.value
      }
    });
    window.open(routeLocation.href, "_blank");
  }

  // 開啟通過 / 退回對話框
  function openAuditDialog(mode: "pass" | "reject") {
    // TODO: 退回原因下拉 rejectOptions 來源 @/utils/dropdown 尚未移植，暫以空陣列佔位
    const rejectOptions: any[] = [];
    addDialog({
      title: `${$t("withdrawal.withdrawReview")} \\ ${memberInfo.value?.id ?? ""} ${
        mode === "pass" ? $t("withdrawal.pass") : $t("withdrawal.reject")
      }`,
      props: {
        formInline: {
          orderSn: memberInfo.value?.id ?? "",
          memberAccount: memberInfo.value?.member?.value ?? "",
          memberID: memberID.value ?? "",
          riskCheckName: memberInfo.value?.withdrawalData?.riskCheckName ?? "",
          mode,
          status: mode === "pass" ? 3 : 2,
          rejectID: "",
          note: ""
        },
        rejectOptions
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const params: any = {
            orderSn: curData.orderSn,
            status: curData.status,
            note: curData.note
          };
          if (curData.rejectID) params.rejectID = curData.rejectID;
          const { success } = await putRiskCheck(params);
          if (success) {
            message($t("withdrawal.riskCheckSuccess"), { type: "success" });
            done();
            handleReload();
          } else {
            message($t("withdrawal.riskCheckFail"), { type: "error" });
          }
        });
      }
    });
  }

  onMounted(async () => {
    await initOptions();
    // 提示是否有其他風控人員審核中
    const { data } = await postRiskAuditLock({ id: orderSn.value });
    if (data?.adminAccount) {
      message($t("withdrawal.riskAuditLocked", { account: data.adminAccount }), {
        type: "warning"
      });
    }
    await handleReload();
  });

  return {
    loading,
    orderSn,
    memberInfo,
    showButton,
    moneyLogSearch,
    promotionDetailData,
    tagsData,
    commentsData,
    walletLogList,
    stakeList,
    stakeTotal,
    useTypeListOption,
    baseInfoColumns,
    walletInfoColumns,
    promotionColumns,
    tagColumns,
    walletLogColumns,
    stakeColumns,
    handleReload,
    handleMoneyLogSearch,
    selectAllType,
    cleanType,
    openTimeline,
    openAuditDialog
  };
}
