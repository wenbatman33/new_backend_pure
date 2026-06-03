import { h, ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getLuckyWalletList,
  getLuckyWalletLog,
  getLuckyWalletUseType
} from "@/api/member";
import type {
  UseTypeItem,
  WalletLogItem,
  WalletInfo,
  SearchFormProps
} from "./types";

// 錢包狀態對應：[文案, 顏色]
const statusMap: Record<number, [string, string]> = {
  1: [$t("member.walletStatusEstablished"), "#000000"],
  2: [$t("member.walletStatusInProgress"), "#87D1CE"],
  3: [$t("member.walletStatusProcessing"), "#000000"],
  4: [$t("member.walletStatusEndClose"), "#E9726A"],
  5: [$t("member.walletStatusEndFreeze"), "#000000"]
};

function safeFormat(text: any) {
  try {
    return commaDecimalFormat(text, 2);
  } catch (e) {
    return text;
  }
}

export function useLuckwalletLog() {
  const route = useRoute();

  const walletId = ref<number | string>("");
  const show = ref(true); // 搜尋區與錢包資訊展開狀態
  const useType = ref<UseTypeItem[]>([]);
  const walletInfo = ref<WalletInfo>({});
  const dataList = ref<WalletLogItem[]>([]);
  const loading = ref(false);

  const searchForm = reactive<SearchFormProps>({
    inOut: "",
    startTime: "",
    endTime: "",
    refId: "",
    type: [],
    ignore: ""
  });

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 進出帳下拉
  const inOutOptions = [
    { label: $t("member.all"), value: "" },
    { label: "in", value: 1 },
    { label: "out", value: 2 }
  ];

  // 用途類型下拉（僅顯示 useTypeID >= 1000）
  const typeOptions = ref<{ label: string; value: number }[]>([]);

  const columns: TableColumnList = [
    {
      label: $t("member.createTime"),
      prop: "createdAt",
      sortable: true,
      width: 160
    },
    {
      label: $t("member.breakEven"),
      prop: "inOutType",
      width: 90,
      cellRenderer: ({ row }) => <span>{row.inOutType == 1 ? "in" : "out"}</span>
    },
    {
      label: $t("member.walletLogType"),
      prop: "useType",
      minWidth: 150,
      cellRenderer: ({ row }) => {
        if (row.useType === 0) return <span />;
        const cur = useType.value.find(item => item.useTypeID == row.useType);
        if (!cur) return <span>{row.useType}</span>;
        return (
          <div style={{ color: cur.color }}>
            <div>{cur.useTypeName}</div>
            <div style={{ color: cur.color }}>{cur.useTypeEnName}</div>
          </div>
        );
      }
    },
    {
      label: $t("member.preTransactionAmount"),
      prop: "beforeMoney",
      width: 130,
      cellRenderer: ({ row }) => <span>{safeFormat(row.beforeMoney)}</span>
    },
    {
      label: $t("member.tradeAmount"),
      prop: "adjustMoney",
      width: 130,
      cellRenderer: ({ row }) => <span>{safeFormat(row.adjustMoney)}</span>
    },
    {
      label: $t("member.amountAfterTransaction"),
      prop: "afterMoney",
      width: 130,
      cellRenderer: ({ row }) => <span>{safeFormat(row.afterMoney)}</span>
    },
    { label: $t("member.detailContent"), prop: "note", minWidth: 150 },
    { label: $t("member.relatedOrderNumber"), prop: "refId", minWidth: 130 }
  ];

  // 錢包資訊展示欄位（label/取值/自訂渲染）
  const walletInfoFields: {
    label: string;
    render: (info: WalletInfo) => any;
  }[] = [
    { label: $t("member.createTime"), render: i => i.createdAt },
    {
      label: $t("member.status"),
      render: i => {
        const m = statusMap[i.status as number];
        return m ? h("span", { style: `color:${m[1]}` }, m[0]) : i.status;
      }
    },
    { label: $t("member.periodOfUse"), render: i => i.expirationDate },
    { label: $t("member.relatedOrderNumber"), render: i => i.orderID },
    { label: $t("member.source"), render: i => i.source },
    { label: $t("member.startAmount"), render: i => i.initialMoney },
    { label: $t("member.totalBonus"), render: i => safeFormat(i.totalBonus) },
    { label: $t("member.limitTurnover"), render: i => i.withdrawalLimit },
    { label: $t("member.gameAccount"), render: i => i.gameAccount },
    {
      label: $t("member.gameAccountCreateTime"),
      render: i => i.gameAccountCreatedAt
    },
    {
      label: $t("member.availableManufacturers"),
      render: i =>
        (i.gameItem ?? [])
          .map(g => g.gameGroupName)
          .filter(n => n != null)
          .join("、")
    },
    {
      label: $t("member.resignatedManufacturer"),
      render: i => i.assignedGameGroup
    },
    { label: $t("member.transferLimit"), render: i => i.maxWithdrawal },
    { label: $t("member.transferOutLower"), render: i => i.minWithdrawal },
    { label: $t("member.needTransferAmount"), render: i => i.depositAmount },
    { label: $t("member.memberID"), render: i => i.memberID }
  ];

  // 組合錢包紀錄查詢參數
  function buildLogParams() {
    const params: Record<string, any> = {
      lmID: walletId.value,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    if (searchForm.startTime)
      params.startTime = searchForm.startTime + " 00:00:00";
    if (searchForm.endTime) params.endTime = searchForm.endTime + " 23:59:59";
    if (searchForm.type?.length) params.type = searchForm.type.join(",");
    if (searchForm.inOut !== "") params.inOut = searchForm.inOut;
    if (searchForm.refId) params.refId = searchForm.refId;
    if (searchForm.ignore) params.ignore = searchForm.ignore;
    return params;
  }

  // 查詢錢包紀錄列表
  async function fetchLog() {
    if (!walletId.value) return;
    loading.value = true;
    try {
      const { data } = await getLuckyWalletLog(buildLogParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 查詢錢包資訊 + 紀錄
  async function getWalletListInfo(id: number | string) {
    if (!id) {
      message($t("member.plzInputWalletId"), { type: "error" });
      return;
    }
    walletId.value = id;
    try {
      const { data } = await getLuckyWalletList({ id });
      const list = data?.list ?? [];
      if (list[0]) {
        walletInfo.value = list[0];
        pagination.currentPage = 1;
        await fetchLog();
      } else {
        walletInfo.value = {};
        dataList.value = [];
        pagination.total = 0;
        message($t("member.noSuchWalletDetailsFound"), { type: "error" });
      }
    } catch (_) {
      message($t("member.getWalletDetailerror"), { type: "error" });
    }
  }

  function onSearch() {
    pagination.currentPage = 1;
    fetchLog();
  }

  function toggleShow() {
    show.value = !show.value;
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    fetchLog();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    fetchLog();
  }

  onMounted(async () => {
    const { data } = await getLuckyWalletUseType();
    useType.value = data?.list ?? [];
    typeOptions.value = useType.value
      .filter(item => item.useTypeID >= 1000)
      .map(item => ({ label: item.useTypeName, value: item.useTypeID }));
    // 支援由路由帶入 walletId
    if (route.params.id) {
      getWalletListInfo(Number(route.params.id));
    }
  });

  return {
    walletId,
    show,
    searchForm,
    inOutOptions,
    typeOptions,
    walletInfo,
    walletInfoFields,
    columns,
    dataList,
    loading,
    pagination,
    getWalletListInfo,
    onSearch,
    toggleShow,
    handleSizeChange,
    handleCurrentChange
  };
}
