import { h, ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getAgencyWithdrawalDetail,
  getAgencyWithdrawalList,
  getAgencyWalletLog,
  getMoneyUseType,
  getMoneyInOutType,
  putWithdrawalFinancePass,
  putWithdrawalFinanceReject
} from "@/api/withdrawal";
import type {
  AgencyWithdrawDetail,
  WithdrawalItem,
  WalletLogItem,
  UseType,
  InOutType,
  FormItemProps
} from "./types";

/** useType 顏色對應（沿用舊碼色票） */
const typeColorMap: Record<number, string> = {
  1: "#01A39D",
  2: "#404244",
  3: "#FF3857",
  4: "#D0C9D6",
  6: "#F0453A",
  7: "#F0453A",
  10: "#01A39D",
  11: "#D0C9D6",
  12: "#D0C9D6",
  13: "#D0C9D6",
  14: "#D0C9D6",
  15: "#D0C9D6",
  16: "#D0C9D6"
};

/** 數字千分位（容錯） */
function toLocale(v: any): string {
  try {
    return Number(v || "0").toLocaleString();
  } catch {
    return String(v ?? "");
  }
}

export function useFinancialCheckAgency() {
  const route = useRoute();
  const formRef = ref();

  // 訂單編號（route param :sn）
  const orderSn = computed(() => String(route.params?.sn ?? ""));

  const loading = ref(true);
  const walletLogLoading = ref(false);

  // 會員 / 代理詳情
  const memberInfo = ref<AgencyWithdrawDetail>({});
  // 當前提款單
  const withdrawalData = ref<WithdrawalItem>({});
  // 錢包異動列表
  const walletLogList = ref<WalletLogItem[]>([]);
  // 右側提款單列表
  const withdrawalList = ref<WithdrawalItem[]>([]);

  const useTypeList = ref<UseType[]>([]);
  const inOutTypeList = ref<InOutType[]>([]);

  // 錢包異動時間區間（預設上月初～今日底）
  const moneyLogSearch = reactive({
    start: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  });

  const title = computed(() => withdrawalData.value?.transactionID || "");

  // status.key === 1 才顯示退回 / 通過按鈕
  const showActionButtons = computed(
    () => withdrawalData.value?.status?.key === 1
  );

  /** 上方提款描述欄位 */
  const withdrawalDescItems = computed(() => {
    const d = memberInfo.value;
    return [
      { label: $t("withdrawal.fcaWithdrawNumber"), value: d.id ?? "" },
      { label: $t("withdrawal.fcaWithdrawApplyTime"), value: d.createdAt ?? "" },
      { label: $t("withdrawal.fcaWithdrawalAmount"), value: toLocale(d.amount) },
      { label: $t("withdrawal.fcaStatus"), value: d.statusStr ?? "" },
      {
        label: $t("withdrawal.fcaAgencyAccount"),
        value: d.agencyAccount ?? "",
        link: `/agencyDetail/detail/${d.agencyID || 0}`
      },
      { label: $t("withdrawal.fcaAccName"), value: d.bankName ?? "" },
      { label: $t("withdrawal.fcaBankAccount"), value: d.bankcard ?? "" },
      { label: $t("withdrawal.fcaBankName"), value: d.thirdID ?? "" }
    ];
  });

  /** 下方會員資訊描述欄位 */
  const memberDescItems = computed(() => {
    const d = memberInfo.value;
    const lower = toLocale(d.limitLower);
    const upper = toLocale(d.limitUpper);
    return [
      {
        label: $t("withdrawal.fcaWithdrawStatus"),
        value: d.agencyWithdrawStatus ? "✔" : "✘",
        ok: !!d.agencyWithdrawStatus
      },
      {
        label: $t("withdrawal.fcaSingleWithdrawLimit"),
        value: `${lower}~${upper}`,
        ok: !!d.limitStatus
      },
      {
        label: $t("withdrawal.fcaSingleWithdrwalLimit"),
        value: toLocale(d.withdrawDayLimit),
        ok: !!d.dayUpperStatus
      },
      { label: $t("withdrawal.fcaTodayDeposit"), value: toLocale(d.todayDepositAmount) },
      { label: $t("withdrawal.fcaTodayDepositDiff"), value: toLocale(d.spread) },
      { label: $t("withdrawal.fcaWalletTotal"), value: toLocale(d.money) },
      { label: $t("withdrawal.fcaFreezeAmount"), value: toLocale(d.lockMoney) },
      { label: $t("withdrawal.fcaTodayWithdrawal"), value: toLocale(d.todayWithdrawalAmount) }
    ];
  });

  /** 錢包異動表格欄位 */
  const walletLogColumns: TableColumnList = [
    { label: $t("withdrawal.fcaDate"), prop: "date", width: 160, sortable: true },
    {
      label: $t("withdrawal.fcaInOut"),
      prop: "inOut",
      cellRenderer: ({ row }) => {
        const found = inOutTypeList.value.find(i => i.inOutTypeID == row.inOut);
        return <span>{found?.inOutTypeName ?? row.inOut}</span>;
      }
    },
    {
      label: $t("withdrawal.fcaType"),
      prop: "type",
      width: 140,
      cellRenderer: ({ row }) => {
        const found = useTypeList.value.find(u => u.useTypeID == row.type);
        const text = found
          ? `${found.useTypeName ?? ""} ${found.useTypeEnName ?? ""}`
          : row.type;
        const color = typeColorMap[row.type] ?? "#909399";
        return (
          <span
            style={{
              color,
              border: `1px solid ${color}`,
              borderRadius: "4px",
              padding: "1px 6px",
              whiteSpace: "pre-wrap"
            }}
          >
            {text}
          </span>
        );
      }
    },
    {
      label: $t("withdrawal.fcaPrevious"),
      prop: "before",
      cellRenderer: ({ row }) => <span>{toLocale(row.before)}</span>
    },
    {
      label: $t("withdrawal.fcaAmount"),
      prop: "amount",
      cellRenderer: ({ row }) => <span>{toLocale(row.amount)}</span>
    },
    {
      label: $t("withdrawal.fcaCurrent"),
      prop: "after",
      cellRenderer: ({ row }) => <span>{toLocale(row.after)}</span>
    },
    { label: $t("withdrawal.fcaMultiple"), prop: "turnoverMultiple" },
    {
      label: $t("withdrawal.fcaTurnoverNeed"),
      prop: "turnoverLimit",
      cellRenderer: ({ row }) => <span>{toLocale(row.turnoverLimit)}</span>
    },
    { label: $t("withdrawal.fcaDetail"), prop: "note", width: 180 }
  ];

  /** 右側提款單列表欄位 */
  const withdrawalListColumns: TableColumnList = [
    { label: $t("withdrawal.fcaAgencyAccount"), prop: "member" },
    {
      label: $t("withdrawal.fcaWithdrawalAmount"),
      prop: "amount",
      cellRenderer: ({ row }) => (
        <a
          href={`/withdrawal/financial/check/agency/${row.transactionID}`}
          style={{ color: "var(--el-color-primary)" }}
        >
          {row.amount}
        </a>
      )
    },
    {
      label: $t("withdrawal.fcaStatus"),
      prop: "status",
      cellRenderer: ({ row }) => <span>{row.status?.value ?? ""}</span>
    },
    { label: $t("withdrawal.fcaBankName"), prop: "bankCode" }
  ];

  /** 取得使用型別 / 進出款型別字典 */
  async function loadDicts() {
    const [useRes, inOutRes] = await Promise.all([
      getMoneyUseType(),
      getMoneyInOutType()
    ]);
    useTypeList.value = useRes?.data?.list ?? [];
    inOutTypeList.value = inOutRes?.data?.list ?? [];
  }

  /** 取得代理 / 會員詳情 */
  async function loadDetail() {
    const { data } = await getAgencyWithdrawalDetail({ id: orderSn.value });
    memberInfo.value = data ?? {};
  }

  /** 取得當前提款單資料 */
  async function loadWithdrawalData() {
    const { data } = await getAgencyWithdrawalList({
      orderSn: orderSn.value,
      withdrawalStart: dayjs(memberInfo.value.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      withdrawalEnd: dayjs(memberInfo.value.createdAt)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      source: 2
    });
    withdrawalData.value = data?.list?.[0] ?? {};
  }

  /** 取得錢包異動列表 */
  async function loadWalletLog() {
    walletLogLoading.value = true;
    try {
      const { data } = await getAgencyWalletLog({
        agencyID: memberInfo.value.agencyID,
        startTime: moneyLogSearch.start,
        endTime: moneyLogSearch.end,
        orderBy: "date",
        sortBy: 2
      });
      walletLogList.value = data?.list ?? [];
    } finally {
      walletLogLoading.value = false;
    }
  }

  /** 取得右側近一日代理提款單列表 */
  async function loadWithdrawalList() {
    const { data } = await getAgencyWithdrawalList({
      withdrawalStart: dayjs()
        .subtract(1, "day")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      withdrawalEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      source: 2,
      pageSize: 999
    });
    withdrawalList.value = data?.list ?? [];
  }

  /** 退回 / 通過共用彈窗 */
  function openActionDialog(isReject: boolean) {
    const rec = withdrawalData.value;
    addDialog({
      title: isReject
        ? `${$t("withdrawal.fcaWithdrawReview")} / ${rec.transactionID ?? ""} ${$t("withdrawal.fcaReject")}`
        : `${$t("withdrawal.fcaPass")} / ${rec.transactionID ?? ""}`,
      props: {
        formInline: {
          transactionID: rec.transactionID ?? "",
          amount: rec.amount ?? "",
          transactionTime: rec.transactionTime ?? "",
          rejectID: "",
          note: "",
          isReject
        }
      },
      width: "560px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          if (isReject) {
            const { success } = await putWithdrawalFinanceReject({
              orderSn: rec.transactionID ?? "",
              note: curData.note ?? "",
              rejectID: curData.rejectID ?? ""
            });
            if (success) {
              message(`${rec.transactionID} ${$t("withdrawal.fcaRejectSuccess")}`, {
                type: "success"
              });
              done();
              refresh();
            }
          } else {
            const { success } = await putWithdrawalFinancePass({
              orderSn: rec.transactionID ?? "",
              note: curData.note ?? ""
            });
            if (success) {
              message(`${rec.transactionID} ${$t("withdrawal.fcaPassSuccess")}`, {
                type: "success"
              });
              done();
              refresh();
            }
          }
        });
      }
    });
  }

  /** 重新載入提款單與錢包異動 */
  async function refresh() {
    await loadDetail();
    await loadWithdrawalData();
    await loadWalletLog();
  }

  onMounted(async () => {
    loading.value = true;
    try {
      await loadDicts();
      await loadDetail();
      await loadWithdrawalData();
      await loadWalletLog();
      await loadWithdrawalList();
    } finally {
      loading.value = false;
    }
  });

  return {
    loading,
    walletLogLoading,
    title,
    memberInfo,
    withdrawalData,
    moneyLogSearch,
    showActionButtons,
    withdrawalDescItems,
    memberDescItems,
    walletLogColumns,
    walletLogList,
    withdrawalListColumns,
    withdrawalList,
    loadWalletLog,
    openActionDialog
  };
}
