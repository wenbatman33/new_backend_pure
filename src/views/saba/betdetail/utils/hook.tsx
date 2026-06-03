import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { isNullOrUnDef } from "@/utils/is";
import {
  postSabaAdvanced,
  postGetSelector,
  postGetSportList,
  postGetBetTypeList,
  postGetLeagueList,
  postGetMatchList
} from "@/api/saba";
import type {
  OptionItem,
  SearchForm,
  BetDetailItem,
  SummaryData
} from "./types";

export function useSabaBetdetail() {
  // 語系（saba 後端用 cs/en）
  const Language = $t("saba._locale") === "en" ? "en" : "cs";
  const allOption: OptionItem[] = [{ label: $t("saba.all"), value: 0 }];

  const searchForm = reactive<SearchForm>({
    QueryStartDate: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    QueryEndDate: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    QueryDateType: 0,
    VendorMemberId: "",
    TxId: "",
    ticketStatusIds: [],
    liveStatusIds: [],
    riskLevelIds: [],
    oddsGroupIds: [],
    platformIds: [],
    productId: 0,
    BetTypeId: 0,
    SportId: 0,
    LeagueId: 0,
    MatchId: 0
  });

  // 日期區間（el-date-picker datetimerange 綁定）
  const dateRange = ref<[string, string]>([
    searchForm.QueryStartDate,
    searchForm.QueryEndDate
  ]);

  const dateTypeOptions: OptionItem[] = [
    { label: $t("saba.queryDateType0"), value: 0 },
    { label: $t("saba.queryDateType1"), value: 1 }
  ];

  // 各下拉選項
  const ticketStatusOptions = ref<OptionItem[]>([]);
  const liveStatusOptions = ref<OptionItem[]>([]);
  const riskLevelOptions = ref<OptionItem[]>([]);
  const oddsGroupOptions = ref<OptionItem[]>([]);
  const platformOptions = ref<OptionItem[]>([]);
  const productOptions = ref<OptionItem[]>([]);
  const betTypeOptions = ref<OptionItem[]>([...allOption]);
  const sportOptions = ref<OptionItem[]>([...allOption]);
  const leagueOptions = ref<OptionItem[]>([...allOption]);
  const matchOptions = ref<OptionItem[]>([...allOption]);

  const dataList = ref<BetDetailItem[]>([]);
  const loading = ref(false);
  const summaryData = reactive<SummaryData>({
    stake: 0,
    actualStake: 0,
    winloss: 0
  });

  // 此報表不分頁（舊碼 pagination:false），全部回傳
  const pagination = reactive({
    total: 0,
    pageSize: 9999,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("saba.txId"), prop: "txId", width: 140 },
    {
      label: $t("saba.userName"),
      prop: "userName",
      width: 140,
      cellRenderer: ({ row }) => (
        <a
          href={`/memberDetail/detail/?account=${row.userName}`}
          target="_blank"
        >
          {row.userName}
        </a>
      )
    },
    { label: $t("saba.actualStake"), prop: "actualStake", width: 90 },
    { label: $t("saba.transactionTime"), prop: "transactionTime", width: 160 },
    {
      label: $t("saba.betDetail"),
      prop: "betDetail",
      width: 220,
      cellRenderer: ({ row }) => {
        const d = row.betDetail || {};
        return (
          <div class="text-right">
            <div style="color:red">{d.betChoice}</div>
            <div style="color:blue">{d.betType}</div>
            <div>{d.match}</div>
            <div>
              <span style="color:blue">{d.sport}</span>*<span>{d.league}</span>
            </div>
            <div>{d.eventDate}</div>
          </div>
        );
      }
    },
    { label: $t("saba.odds"), prop: "odds", width: 80 },
    { label: $t("saba.oddsType"), prop: "oddsType", width: 70 },
    { label: $t("saba.stake"), prop: "stake", width: 90 },
    { label: $t("saba.winloss"), prop: "winloss", width: 90 },
    { label: $t("saba.ticketStatusIds"), prop: "status", width: 90 },
    { label: $t("saba.platformIds"), prop: "platform", width: 100 },
    { label: $t("saba.liveStatusIds"), prop: "liveInfo", width: 100 }
  ];

  // 合計列
  function getSummaries(param: { columns: any[] }) {
    const { columns: cols } = param;
    const sums: string[] = [];
    cols.forEach((column, index) => {
      if (index === 0) {
        sums[index] = $t("saba.total");
        return;
      }
      if (column.property === "actualStake") {
        sums[index] = String(summaryData.actualStake);
      } else if (column.property === "stake") {
        sums[index] = String(summaryData.stake);
      } else if (column.property === "winloss") {
        sums[index] = String(summaryData.winloss);
      } else {
        sums[index] = "";
      }
    });
    return sums;
  }

  async function onSearch() {
    if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
      searchForm.QueryStartDate = dateRange.value[0];
      searchForm.QueryEndDate = dateRange.value[1];
    }
    loading.value = true;
    try {
      const arg: any = { ...searchForm, Language };
      const { success, data } = await postSabaAdvanced(arg);
      if (success && data) {
        dataList.value = data.betList ?? data.list ?? [];
        pagination.total = dataList.value.length;
        const s = data.summary || {};
        summaryData.stake = s.totalStake ?? 0;
        summaryData.actualStake = s.totalActualStake ?? 0;
        summaryData.winloss = s.totalWinloss ?? 0;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    Object.assign(searchForm, {
      QueryDateType: 0,
      VendorMemberId: "",
      TxId: "",
      ticketStatusIds: [],
      riskLevelIds: [],
      oddsGroupIds: [],
      platformIds: [],
      productId: 0,
      BetTypeId: 0,
      SportId: 0,
      LeagueId: 0,
      MatchId: 0
    });
    dateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    onSearch();
  }

  // 載入初始下拉選項
  async function loadSelector() {
    const { success, data } = await postGetSelector({ Language });
    if (success && data) {
      ticketStatusOptions.value = data.ticketStatusList ?? [];
      liveStatusOptions.value = data.liveStatusList ?? [];
      riskLevelOptions.value = data.riskLevelList ?? [];
      oddsGroupOptions.value = data.oddsGroupList ?? [];
      platformOptions.value = data.platformList ?? [];
      productOptions.value = data.productList ?? [];
      // 預設全選 liveStatus（沿用舊行為）
      searchForm.liveStatusIds = (data.liveStatusList ?? []).map(
        (item: OptionItem) => item.value
      );
    }
  }

  // 產品改變 → 重置並載入 betType / sport / league
  async function onProductChange(productId: string | number) {
    searchForm.BetTypeId = 0;
    searchForm.SportId = 0;
    searchForm.LeagueId = 0;
    searchForm.MatchId = 0;
    matchOptions.value = [...allOption];
    if (isNullOrUnDef(productId) || productId === 0) {
      betTypeOptions.value = [...allOption];
      sportOptions.value = [...allOption];
      leagueOptions.value = [...allOption];
      return;
    }
    loading.value = true;
    try {
      const [betTypeRes, sportRes, leagueRes] = await Promise.all([
        postGetBetTypeList({ Language, ProductId: productId }),
        postGetSportList({ Language, ProductId: productId }),
        postGetLeagueList({ Language, ProductId: productId, SportId: 0 })
      ]);
      betTypeOptions.value = betTypeRes?.data?.betTypeList ?? [];
      sportOptions.value = sportRes?.data?.sportList ?? [];
      leagueOptions.value = leagueRes?.data?.leagueList ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 運動改變 → 重新載入 league
  async function onSportChange(sportId: string | number) {
    searchForm.LeagueId = 0;
    searchForm.MatchId = 0;
    matchOptions.value = [...allOption];
    if (isNullOrUnDef(sportId) || sportId === 0) {
      leagueOptions.value = [...allOption];
      return;
    }
    loading.value = true;
    try {
      const { data } = await postGetLeagueList({
        Language,
        ProductId: searchForm.productId,
        SportId: sportId
      });
      leagueOptions.value = data?.leagueList ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 聯賽改變 → 載入 match
  async function onLeagueChange(leagueId: string | number) {
    searchForm.MatchId = 0;
    if (isNullOrUnDef(leagueId) || leagueId === 0) {
      matchOptions.value = [...allOption];
      return;
    }
    loading.value = true;
    try {
      const { data } = await postGetMatchList({
        Language,
        ProductId: searchForm.productId,
        SportId: searchForm.SportId,
        LeagueId: leagueId
      });
      matchOptions.value = data?.matchList ?? [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadSelector();
  });

  return {
    searchForm,
    dateRange,
    dateTypeOptions,
    ticketStatusOptions,
    liveStatusOptions,
    riskLevelOptions,
    oddsGroupOptions,
    platformOptions,
    productOptions,
    betTypeOptions,
    sportOptions,
    leagueOptions,
    matchOptions,
    loading,
    columns,
    dataList,
    pagination,
    getSummaries,
    onSearch,
    resetForm,
    onProductChange,
    onSportChange,
    onLeagueChange
  };
}
