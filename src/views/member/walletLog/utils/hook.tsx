import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getWalletLogList,
  getMoneyUseType,
  type UseTypeItem
} from "@/api/member";
import { changeRedColorForNegative } from "@/utils/number";
import { findByValue } from "@/utils/options";
import { exportExcel } from "@/utils/report";
import type { UseTypeOption, WalletLogSearchForm } from "./types";

// note 文案對照（type=20 VIP 禮金 / type=21 VIP 反水）
const noteKeys: Record<number, Record<string, string>> = {
  20: {
    VIP_GIFT_MONTH: $t("member.noteKey20VipGiftMonth"),
    VIP_GIFT_UPGRADE: $t("member.noteKey20VipGiftUpgrade"),
    VIP_GIFT_YEAR: $t("member.noteKey20VipGiftYear"),
    VIP_GIFT_BIRTHDAY: $t("member.noteKey20VipGiftBirthday"),
    VIP_GIFT_WEEK: $t("member.noteKey20VipGiftWeek")
  },
  21: {
    VIP_RETURN_SPORT: $t("member.noteKey21VipReturnSport"),
    VIP_RETURN_PERSON: $t("member.noteKey21VipReturnPerson"),
    VIP_RETURN_LOTTERY: $t("member.noteKey21VipReturnLottery"),
    VIP_RETURN_ESPORT: $t("member.noteKey21VipReturnEsport"),
    VIP_RETURN_CHESS: $t("member.noteKey21VipReturnChess"),
    VIP_RETURN_FISH: $t("member.noteKey21VipReturnFish"),
    VIP_RETURN_SLOT: $t("member.noteKey21VipReturnSlot"),
    VIP_RETURN_MINIGAME: $t("member.noteKey21VipReturnMinigame"),
    VIP_RETURN_COCKFIGH: $t("member.noteKey21VipReturnCockfigh"),
    VIP_RETURN_BINGO: $t("member.noteKey21VipReturnBingo"),
    VIP_RETURN_ELECTRONIC: $t("member.noteKey21VipReturnElectronic")
  }
};

export function useWalletLog() {
  const route = useRoute();
  // 由路由參數取得會員 ID
  const memberID = Number(route.params?.id);

  const searchForm = reactive<WalletLogSearchForm>({
    account: "",
    inOut: "",
    type: [],
    // 預設近三個月
    startTime: dayjs().subtract(3, "month").format("YYYY-MM-DD 00:00:00"),
    endTime: dayjs().format("YYYY-MM-DD 23:59:59"),
    filter: "",
    ignore: ""
  });

  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const totalAmount = ref(0);
  // 收支類型選項
  const typeOptions = ref<UseTypeOption[]>([]);
  // TODO: 舊碼用 @/utils/dropdown 的 gameOptions() 取得遊戲分類；dropdown 尚未移植，先以空陣列佔位
  const gameGroupList = ref<any[]>([]);

  const inOutOptions = [
    { label: "in", value: 1 },
    { label: "out", value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 依 type 取得收支類型文字與顏色
  function typeText(type: number) {
    const target = typeOptions.value.find(item => item.useTypeID === type) || {
      color: "#000",
      useTypeName: "undefined type"
    };
    return (
      <span style={{ color: (target as UseTypeOption).color || "#000" }}>
        {(target as UseTypeOption).useTypeName}
      </span>
    );
  }

  // 依 note key 轉成可讀文字
  function noteText(row: any) {
    if (row.type === 20) {
      let result20: string | undefined;
      Object.keys(noteKeys[20]).forEach(item => {
        if (typeof row.note === "string" && row.note.indexOf(item) !== -1) {
          const note = row.note.split("/");
          result20 = noteKeys[20][note[0]];
        }
      });
      return result20 ?? row.note;
    } else if (row.type === 21) {
      let result21: string | undefined;
      Object.keys(noteKeys[21]).forEach(item => {
        if (typeof row.note === "string" && row.note.indexOf(item) !== -1) {
          const note = row.note.split("/");
          result21 =
            noteKeys[21][note[0]] +
            " : " +
            findByValue(gameGroupList.value, Number(note[1]));
        }
      });
      return result21 ?? row.note;
    }
    return row.note;
  }

  const columns: TableColumnList = [
    { label: $t("member.walletLogDate"), prop: "date", width: 180, sortable: true },
    {
      label: $t("member.walletLogInOut"),
      prop: "inOut",
      width: 100,
      cellRenderer: ({ row }) => <span>{row.inOut === 1 ? "in" : "out"}</span>
    },
    {
      label: $t("member.walletLogType"),
      prop: "type",
      width: 130,
      cellRenderer: ({ row }) => typeText(row.type)
    },
    {
      label: $t("member.walletLogBefore"),
      prop: "before",
      width: 160,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.before)}</span>
      )
    },
    {
      label: $t("member.walletLogAmount"),
      prop: "amount",
      width: 160,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.amount)}</span>
      )
    },
    {
      label: $t("member.walletLogAfter"),
      prop: "after",
      width: 160,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.after)}</span>
      )
    },
    {
      label: $t("member.walletLogTurnoverMultiple"),
      prop: "turnoverMultiple",
      width: 100,
      sortable: true,
      cellRenderer: ({ row }) => <span>{row.turnoverMultiple || "-"}</span>
    },
    {
      label: $t("member.walletLogTurnoverLimit"),
      prop: "turnoverLimit",
      width: 160,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{changeRedColorForNegative(row.turnoverLimit)}</span>
      )
    },
    {
      label: $t("member.walletLogNote"),
      prop: "note",
      minWidth: 250,
      align: "left",
      cellRenderer: ({ row }) => <span>{noteText(row)}</span>
    },
    {
      label: $t("member.walletLogRefID"),
      prop: "refID",
      minWidth: 200,
      align: "left"
    }
  ];

  // 將 array type 轉成逗號字串、過濾空值
  function buildSearchParams() {
    const search: Record<string, any> = {};
    if (!searchForm.account) {
      search.memberID = memberID;
    }
    search.orderBy = "date";
    search.sortBy = 2;

    const typeStr =
      Array.isArray(searchForm.type) && searchForm.type.length
        ? searchForm.type.join(",")
        : undefined;

    const raw: Record<string, any> = {
      account: searchForm.account,
      inOut: searchForm.inOut,
      type: typeStr,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      filter: searchForm.filter,
      ignore: searchForm.ignore
    };
    Object.keys(raw).forEach(key => {
      const value = raw[key];
      if (value !== "" && value !== undefined && value !== 0) {
        search[key] = value;
      }
    });
    return search;
  }

  async function onSearch() {
    if (!searchForm.startTime || !searchForm.endTime) {
      return;
    }
    loading.value = true;
    try {
      const { data } = await getWalletLogList(buildSearchParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      totalAmount.value = data?.totalAmount ?? 0;
      // 自動帶出搜尋帳號
      if (data?.list?.[0]?.account) {
        searchForm.account = data.list[0].account;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    searchForm.account = "";
    searchForm.inOut = "";
    searchForm.type = [];
    searchForm.startTime = dayjs()
      .subtract(3, "month")
      .format("YYYY-MM-DD 00:00:00");
    searchForm.endTime = dayjs().format("YYYY-MM-DD 23:59:59");
    searchForm.filter = "";
    searchForm.ignore = "";
    onSearch();
  }

  function handleExport() {
    exportExcel("/backend/member/walletlogs/export", buildSearchParams());
  }

  onMounted(async () => {
    // 載入收支類型
    const { data } = await getMoneyUseType();
    typeOptions.value = (data?.list ?? []) as UseTypeItem[] as UseTypeOption[];
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    typeOptions,
    inOutOptions,
    totalAmount,
    onSearch,
    resetForm,
    handleExport
  };
}
