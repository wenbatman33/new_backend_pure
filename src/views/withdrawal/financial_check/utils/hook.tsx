import { h, ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import dayjs from "dayjs";
import editForm from "../form.vue";
import type { ActionFormProps, WithdrawalItem, MemberInfo } from "./types";
import {
  getWithdrawalList,
  getWithdrawalMemberInfo,
  getWithdrawalStake,
  getWithdrawalWalletLog,
  getWithdrawalHistory,
  getWithdrawalTurnoverList,
  postWithdrawalTurnoverPass,
  postWithdrawalSmooth,
  putWithdrawalFinancePass,
  putWithdrawalFinanceReject,
  putWithdrawalFinanceSubmitRisk,
  getMoneyUseType,
  getMoneyInOutType,
  getMemberTag,
  getPromotionMemberWithdraw,
  getAdjustmentSearch,
  type UseTypeItem,
  type InOutTypeItem
} from "@/api/withdrawal";

const fmt = (d?: string | dayjs.Dayjs) =>
  d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : "";

export function useFinancialCheck() {
  const route = useRoute();
  const router = useRouter();

  /** 路由參數 sn（提款單號） */
  const orderSn = computed(() => String(route.params?.sn ?? ""));

  const memberInfo = ref<MemberInfo>({});
  const withdrawalData = ref<WithdrawalItem>({});
  const memberInfoRaw = ref<any>({});

  const useTypeList = ref<UseTypeItem[]>([]);
  const inOutTypeList = ref<InOutTypeItem[]>([]);
  const useTypeListOption = ref<{ label: string; value: number }[]>([]);

  const promotionMemberWithdraw = ref<any[]>([]);
  const adjustmentApply = ref<any[]>([]);
  const tags = ref<any[]>([]);

  /** 流水明細彙總 */
  const stakeTotal = reactive({ betAmount: 0, winAmount: 0 });

  /** 錢包紀錄搜尋條件 */
  const moneyLogSearch = reactive({
    start: "",
    end: "",
    type: [] as number[],
    hiddenGameMoney: false,
    timestamp: false
  });

  /** 表格資料 */
  const walletLogList = ref<any[]>([]);
  const stakeDetailList = ref<any[]>([]);
  const withdrawalList = ref<any[]>([]);

  const walletLogLoading = ref(false);
  const stakeLoading = ref(false);

  // 按鈕顯示條件
  const showRejectButton = computed(() => withdrawalData.value.status?.key === 1);
  const showSubmitRiskButton = computed(
    () =>
      withdrawalData.value.status?.key === 1 &&
      withdrawalData.value.riskCheck?.key === 4
  );
  const showPassButton = computed(() => withdrawalData.value.status?.key === 1);

  // 含 bankGroup / thirdGroup 的會員資訊（給描述列用）
  const memberInfoWithGroup = computed(() => ({
    ...memberInfo.value,
    bankGroup: withdrawalData.value.bankGroup,
    thirdGroup: withdrawalData.value.thirdGroup
  }));

  // ---- 流水明細表格欄位 ----
  const stakeDetailColumns: TableColumnList = [
    { label: $t("withdrawal.platform"), prop: "name", width: 110, align: "left" },
    { label: $t("withdrawal.stake"), prop: "betAmount", width: 95 },
    { label: $t("withdrawal.winAmount"), prop: "winAmount", width: 95 }
  ];

  // ---- 錢包紀錄表格欄位 ----
  const walletLogColumns: TableColumnList = [
    { label: $t("withdrawal.date"), prop: "date", width: 155, sortable: true },
    {
      label: $t("withdrawal.inOut"),
      prop: "inOut",
      width: 80,
      cellRenderer: ({ row }) => {
        const item = inOutTypeList.value.find(i => i.inOutTypeID == row.inOut);
        return <span>{item ? item.inOutTypeName : row.inOut}</span>;
      }
    },
    {
      label: $t("withdrawal.type"),
      prop: "type",
      width: 140,
      cellRenderer: ({ row }) => {
        const item = useTypeList.value.find(i => i.useTypeID == row.type);
        const text = item
          ? `${item.useTypeName} ${item.useTypeEnName ?? ""}`
          : row.type;
        const color = item?.color || "";
        return (
          <el-tag
            style={{
              color,
              border: `1px solid ${color}`,
              background: "transparent",
              whiteSpace: "pre-wrap"
            }}
          >
            {text}
          </el-tag>
        );
      }
    },
    { label: $t("withdrawal.previous"), prop: "before", width: 90 },
    { label: $t("withdrawal.amount"), prop: "amount", width: 90 },
    { label: $t("withdrawal.current"), prop: "after", width: 90 },
    { label: $t("withdrawal.multiple"), prop: "turnoverMultiple", width: 70 },
    { label: $t("withdrawal.turnoverNeed"), prop: "turnoverLimit", width: 90 },
    { label: $t("withdrawal.detail"), prop: "note", width: 180 }
  ];

  // ---- 側邊待審提款列表欄位 ----
  const withdrawalListColumns: TableColumnList = [
    {
      label: $t("withdrawal.memberAC"),
      prop: "member",
      width: 110,
      cellRenderer: ({ row }) => <span>{row.member?.value?.account ?? ""}</span>
    },
    {
      label: $t("withdrawal.withdrawalAmount"),
      prop: "amount",
      width: 90,
      cellRenderer: ({ row }) => (
        <a href={`/withdrawal/financial/check/${row.transactionID}`}>{row.amount}</a>
      )
    },
    {
      label: $t("withdrawal.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => <span>{row.status?.value ?? ""}</span>
    },
    { label: $t("withdrawal.bankName"), prop: "bankCode", width: 110 }
  ];

  /** 取得會員資訊（先打、決定流水區間） */
  async function loadMemberInfo() {
    const { data } = await getWithdrawalMemberInfo({ id: orderSn.value });
    memberInfoRaw.value = data || {};
    memberInfo.value = data || {};
    moneyLogSearch.start = data?.turnoverDurationStart || "";
    moneyLogSearch.end = data?.turnoverDurationEnd || "";
  }

  /** 取得流水明細（tree） */
  async function loadStake() {
    stakeLoading.value = true;
    try {
      const memberId = withdrawalData.value?.member?.key;
      const { data } = await getWithdrawalStake({
        id: memberId,
        startTime: fmt(moneyLogSearch.start),
        endTime: fmt(moneyLogSearch.end),
        timestamp: moneyLogSearch.timestamp ? 1 : 0
      });
      const list = data?.list ?? (Array.isArray(data) ? data : []);
      // 遞迴把 list 轉成 children 供 tree 顯示
      const setChildren = (items: any[]) => {
        items.forEach(it => {
          if (it && Array.isArray(it.list) && it.list.length > 0) {
            it.children = it.list;
            setChildren(it.children);
          }
        });
      };
      setChildren(list);
      stakeDetailList.value = list;
      stakeTotal.betAmount = data?.totalBetAmount ?? 0;
      stakeTotal.winAmount = data?.totalWinAmount ?? 0;
    } finally {
      stakeLoading.value = false;
    }
  }

  /** 取得錢包紀錄 */
  async function loadWalletLog() {
    walletLogLoading.value = true;
    try {
      const params: any = {
        memberID: withdrawalData.value?.member?.key || 0,
        startTime: fmt(moneyLogSearch.start),
        endTime: fmt(moneyLogSearch.end),
        orderBy: "date",
        sortBy: 2,
        hiddenGameMoney: moneyLogSearch.hiddenGameMoney ? 0 : 1,
        pageSize: 999
      };
      if (moneyLogSearch.type.length > 0) params.type = moneyLogSearch.type;
      const { data } = await getWithdrawalWalletLog(params);
      walletLogList.value = data?.list ?? [];
    } finally {
      walletLogLoading.value = false;
    }
  }

  /** 取得優惠領取資訊 */
  async function loadPromotion() {
    const { data } = await getPromotionMemberWithdraw({
      memberID: withdrawalData.value.member?.key,
      startTime: fmt(moneyLogSearch.start),
      endTime: fmt(moneyLogSearch.end),
      promotionCondType: 1,
      status: 4
    });
    promotionMemberWithdraw.value = data?.list || [];
  }

  /** 取得調整申請 */
  async function loadAdjustmentApply() {
    const { data } = await getAdjustmentSearch({
      memberName: withdrawalData.value.member?.value?.account,
      verifyDateStart: fmt(moneyLogSearch.start),
      verifyDateEnd: fmt(moneyLogSearch.end),
      status: 1,
      pageSize: 999,
      page: 1
    });
    adjustmentApply.value = data?.list || [];
  }

  /** 主流程：取得提款資料 */
  async function loadWithdrawalData() {
    const { data } = await getWithdrawalList({
      orderSn: orderSn.value,
      withdrawalStart: dayjs(memberInfoRaw.value.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      withdrawalEnd: dayjs(memberInfoRaw.value.createdAt)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    });
    withdrawalData.value = data?.list?.[0] || {};
    await loadPromotion();
    await loadAdjustmentApply();
    await loadStake();
    await loadWalletLog();
    const tagRes = await getMemberTag(withdrawalData.value?.member?.key);
    tags.value = (tagRes.data?.list || []).filter(
      (it: any) => it.tagGroupID === 100
    );
  }

  /** 側邊待審列表（今日） */
  async function loadWithdrawalList() {
    const { data } = await getWithdrawalList({
      status: 1,
      withdrawalStart: dayjs()
        .subtract(1, "day")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      withdrawalEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      pageSize: 999
    });
    withdrawalList.value = data?.list || [];
  }

  /** 優惠調整限制文字 */
  function adjustmentLimit(limitArr: any[]) {
    return (limitArr || [])
      .map(item => {
        let text = item.gameTypeName;
        text += item.gameGroupName ? "/" + item.gameGroupName : "";
        return text;
      })
      .join(",");
  }

  /** 通用：開啟審核對話框（reject / pass / submitRisk） */
  function openActionDialog(mode: ActionFormProps["mode"]) {
    const titleMap = {
      reject: $t("withdrawal.reject"),
      pass: $t("withdrawal.pass"),
      submitRisk: $t("withdrawal.passRiskReviw")
    };
    const formRef = ref();
    addDialog({
      title: `${titleMap[mode]} / ${withdrawalData.value.transactionID || ""}`,
      props: {
        mode,
        formInline: {
          transactionID: withdrawalData.value.transactionID,
          amount: withdrawalData.value.amount,
          transactionTime: withdrawalData.value.transactionTime,
          status: withdrawalData.value.status?.value,
          rejectID: "",
          rejectReason: "",
          note: ""
        },
        // TODO: 退回原因下拉 rejectOptions 來自舊 @/utils/dropdown（未移植），先空陣列
        rejectOptions: []
      },
      width: "560px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as ActionFormProps).formInline;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const orderSnVal = withdrawalData.value.transactionID || "";
          let res;
          if (mode === "pass") {
            res = await putWithdrawalFinancePass({
              orderSn: orderSnVal,
              note: curData.note || ""
            });
          } else if (mode === "submitRisk") {
            res = await putWithdrawalFinanceSubmitRisk({
              orderSn: orderSnVal,
              note: curData.note || ""
            });
          } else {
            res = await putWithdrawalFinanceReject({
              orderSn: orderSnVal,
              note: curData.note || "",
              rejectID: curData.rejectID || "",
              rejectReason: curData.rejectReason || ""
            });
          }
          if (res?.success) {
            message($t("withdrawal.actionSuccess"), { type: "success" });
            done();
            loadWithdrawalData();
          } else {
            message($t("withdrawal.actionFail"), { type: "error" });
          }
        });
      }
    });
  }

  /** 流水稽核（turnover）對話框 */
  function openTurnoverDialog() {
    const list = ref<any[]>([]);
    const loading = ref(false);
    const load = async () => {
      loading.value = true;
      try {
        const { data } = await getWithdrawalTurnoverList({ id: orderSn.value });
        list.value = data?.list ?? (Array.isArray(data) ? data : []);
      } finally {
        loading.value = false;
      }
    };
    const typeMap: Record<number, string> = {
      1: $t("withdrawal.turnoverType1"),
      2: $t("withdrawal.turnoverType2"),
      3: $t("withdrawal.turnoverType3"),
      4: $t("withdrawal.turnoverType4")
    };
    const handlePass = async (row: any) => {
      await postWithdrawalTurnoverPass({ type: row.type, id: row.eventID });
      load();
    };
    const handleSmooth = async () => {
      const res = await postWithdrawalSmooth(withdrawalData.value?.member?.key);
      if (res?.success) message($t("withdrawal.actionSuccess"), { type: "success" });
    };
    load();
    addDialog({
      title: $t("withdrawal.turnoverListTitle"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h("div", [
          h(
            "div",
            { style: "margin-bottom:8px" },
            h(
              "el-button" as any,
              { type: "primary", onClick: handleSmooth },
              () => $t("withdrawal.turnoverSmooth")
            )
          ),
          h(
            "el-table" as any,
            { data: list.value, border: true, loading: loading.value },
            () => [
              h("el-table-column" as any, {
                label: $t("withdrawal.turnoverEventTime"),
                prop: "eventTime",
                width: 150
              }),
              h("el-table-column" as any, {
                label: $t("withdrawal.turnoverTypeLabel"),
                width: 120,
                formatter: (r: any) => typeMap[r.type] ?? ""
              }),
              h("el-table-column" as any, {
                label: $t("withdrawal.turnoverEventAmount"),
                prop: "eventAmount",
                width: 100
              }),
              h("el-table-column" as any, {
                label: $t("withdrawal.turnoverLimit"),
                prop: "limitTurnover",
                width: 100
              }),
              h("el-table-column" as any, {
                label: $t("withdrawal.turnoverUsed"),
                prop: "usedTurnover",
                width: 100
              }),
              h("el-table-column" as any, {
                label: $t("withdrawal.action"),
                width: 100,
                cellRenderer: ({ row }: any) =>
                  h(
                    "el-button" as any,
                    { link: true, type: "primary", onClick: () => handlePass(row) },
                    () => $t("withdrawal.pass")
                  )
              })
            ]
          )
        ])
    });
  }

  /** 歷史提款帳號對話框 */
  function openHistoryDialog() {
    const list = ref<any[]>([]);
    const loading = ref(false);
    (async () => {
      loading.value = true;
      try {
        const { data } = await getWithdrawalHistory({
          id: Number(orderSn.value)
        });
        list.value = data?.list ?? (Array.isArray(data) ? data : []);
      } finally {
        loading.value = false;
      }
    })();
    addDialog({
      title: $t("withdrawal.pastWithdrawAcc"),
      width: "700px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(
          "el-table" as any,
          { data: list.value, border: true, loading: loading.value },
          () => [
            h("el-table-column" as any, {
              label: $t("withdrawal.todayWithdrawal"),
              prop: "createdAt",
              width: 180
            }),
            h("el-table-column" as any, {
              label: $t("withdrawal.bankWithdrawal"),
              prop: "name",
              width: 150
            }),
            h("el-table-column" as any, {
              label: $t("withdrawal.cardAddressWalletID"),
              prop: "address"
            })
          ]
        )
    });
  }

  /** 審核紀錄（checkNote）對話框 */
  function openLogDialog() {
    const notes = withdrawalData.value.checkNote || [];
    addDialog({
      title: $t("withdrawal.applyDetail"),
      width: "700px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(
          "ul",
          { style: "margin:1rem;list-style:disc" },
          notes.map((li: string) => h("li", { style: "margin-bottom:1rem" }, li))
        )
    });
  }

  /** 開啟時間軸（新分頁） */
  function openTimeline() {
    const routeLocation = router.resolve({
      path: `/withdrawal/financial/timeline/`,
      query: {
        startTime: fmt(moneyLogSearch.start),
        endTime: fmt(moneyLogSearch.end),
        id: withdrawalData.value?.member?.key || 0
      }
    });
    window.open(routeLocation.href, "_blank");
  }

  function moneyLogSearchTypeSelectAll() {
    moneyLogSearch.type = useTypeListOption.value.map(i => i.value);
  }
  function moneyLogSearchTypeClean() {
    moneyLogSearch.type = [];
  }

  /** 重新查詢錢包紀錄 + 流水（搜尋鈕） */
  async function onSearchWalletLog() {
    await loadStake();
    await loadWalletLog();
  }

  onMounted(async () => {
    await loadMemberInfo();
    await loadWithdrawalData();
    await loadWithdrawalList();

    const useTypeRes = await getMoneyUseType();
    useTypeList.value = useTypeRes.data?.list || [];
    useTypeListOption.value = useTypeList.value
      .filter(item => Number(item.useTypeID) <= 1000)
      .map(item => ({ label: item.useTypeName, value: item.useTypeID }));

    const inOutRes = await getMoneyInOutType();
    inOutTypeList.value = inOutRes.data?.list || [];

    nextTick();
  });

  return {
    orderSn,
    memberInfo,
    withdrawalData,
    memberInfoWithGroup,
    useTypeListOption,
    promotionMemberWithdraw,
    adjustmentApply,
    tags,
    moneyLogSearch,
    stakeTotal,
    walletLogList,
    stakeDetailList,
    withdrawalList,
    walletLogLoading,
    stakeLoading,
    showRejectButton,
    showSubmitRiskButton,
    showPassButton,
    stakeDetailColumns,
    walletLogColumns,
    withdrawalListColumns,
    adjustmentLimit,
    openActionDialog,
    openTurnoverDialog,
    openHistoryDialog,
    openLogDialog,
    openTimeline,
    onSearchWalletLog,
    moneyLogSearchTypeSelectAll,
    moneyLogSearchTypeClean
  };
}
