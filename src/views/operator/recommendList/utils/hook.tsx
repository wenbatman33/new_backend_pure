import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import { findByValue } from "@/utils/options";
import { isArray } from "@/utils/is";
import {
  getRecommendList,
  editRecommendTime,
  type RecommendListItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 推薦項目對應：1 賽前投注 / 2 直播賽事
const recommendItemType = [
  { label: $t("operator.matchBetting"), value: 1 },
  { label: $t("operator.liveEvents"), value: 2 }
];

export function useRecommendList() {
  // 預設查詢比賽時間區間：今天 ~ 三天後
  const defaultEventStart = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const defaultEventEnd = dayjs()
    .add(3, "day")
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");

  const searchForm = reactive({
    // 比賽時間區間
    eventRange: [defaultEventStart, defaultEventEnd] as [string, string] | null,
    // 上架時間區間
    recommendRange: null as [string, string] | null,
    hasStreaming: "",
    isLive: "",
    checkRecommend: "",
    sportsName: "",
    recommendItem: 0,
    keyWord: "",
    // 關鍵字搜尋欄位（多選）：1 聯賽 / 2 主隊 / 3 客隊
    keyWordColumn: [] as number[]
  });

  const dataList = ref<RecommendListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是否支援直播 / 是否滾球 下拉選項
  const yesNoOptions = [
    { label: $t("operator.yes"), value: 1 },
    { label: $t("operator.no"), value: 2 }
  ];

  // 首頁推薦：是 1 / 否 0
  const recommendOptions = [
    { label: $t("operator.yes"), value: 1 },
    { label: $t("operator.no"), value: 0 }
  ];

  // 賽事種類
  const sportsOptions = [
    { label: $t("operator.all"), value: "" },
    { label: $t("operator.football"), value: 1 },
    { label: $t("operator.basketball"), value: 2 }
  ];

  // 推薦項目（含全部）
  const recommendItemOptions = [
    { label: $t("operator.all"), value: 0 },
    ...recommendItemType
  ];

  // 關鍵字欄位選項
  const keyWordColumnOptions = [
    { label: $t("operator.leagueName"), value: 1 },
    { label: $t("operator.homeTeamName"), value: 2 },
    { label: $t("operator.awayTeamName"), value: 3 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90, sortable: true },
    { label: $t("operator.type"), prop: "sportsName", width: 80 },
    { label: $t("operator.leagueName"), prop: "leagueName", minWidth: 200 },
    { label: $t("operator.eventID"), prop: "eventID", width: 120 },
    {
      label: $t("operator.matchTime"),
      prop: "eventTime",
      width: 160,
      sortable: true
    },
    { label: $t("operator.homeTeam"), prop: "homeTeam", width: 100 },
    { label: $t("operator.awayTeam"), prop: "awayTeam", width: 100 },
    {
      label: $t("operator.projectRecommendations"),
      prop: "recommendItem",
      width: 110,
      cellRenderer: ({ row }) => {
        const val = row.recommendItem;
        if (isArray(val)) {
          return (
            <>
              {val.map(item => (
                <div>{findByValue(recommendItemType, Number(item))}</div>
              ))}
            </>
          );
        }
        return <span>{val}</span>;
      }
    },
    {
      label: $t("operator.whetherToSupportLiveBroadcast"),
      prop: "hasStreaming",
      width: 110,
      cellRenderer: ({ row }) => <span>{row.hasStreaming === 1 ? "Y" : "N"}</span>
    },
    {
      label: $t("operator.whetherToRollingBall"),
      prop: "isLive",
      width: 100,
      cellRenderer: ({ row }) => <span>{row.isLive === 1 ? "Y" : "N"}</span>
    },
    {
      label: $t("operator.shelfStartTime"),
      prop: "recommendStartTime",
      width: 160,
      sortable: true
    },
    {
      label: $t("operator.shelfEndTime"),
      prop: "recommendEndTime",
      width: 160
    },
    { label: $t("operator.updatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("operator.updatedUser"), prop: "updatedUser", width: 100 },
    { label: $t("operator.action"), fixed: "right", width: 180, slot: "operation" }
  ];

  async function onSearch() {
    // 比賽時間區間最多查詢 30 天（沿用舊邏輯）
    const range = searchForm.eventRange;
    if (range && range[0] && range[1]) {
      const diff = dayjs(range[1]).diff(dayjs(range[0]), "day");
      if (diff > 29) {
        message($t("operator.searchForUpToThirtyDays"), { type: "error" });
        return;
      }
    }
    loading.value = true;
    try {
      const { data } = await getRecommendList({
        eventStartTime: range?.[0] ?? "",
        eventEndTime: range?.[1] ?? "",
        recommendStartTime: searchForm.recommendRange?.[0] ?? "",
        recommendEndTime: searchForm.recommendRange?.[1] ?? "",
        hasStreaming: searchForm.hasStreaming,
        isLive: searchForm.isLive,
        checkRecommend: searchForm.checkRecommend,
        sportsName: searchForm.sportsName,
        recommendItem: searchForm.recommendItem,
        keyWord: searchForm.keyWord,
        keyWordColumn: searchForm.keyWordColumn
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    // 重置回預設比賽時間區間
    searchForm.eventRange = [defaultEventStart, defaultEventEnd];
    searchForm.recommendRange = null;
    searchForm.recommendItem = 0;
    searchForm.keyWordColumn = [];
    onSearch();
  }

  function openDialog(row: RecommendListItem) {
    const recommendItem =
      isArray(row.recommendItem) && row.recommendItem.length
        ? row.recommendItem.map(i => Number(i))
        : [1];
    addDialog({
      title: $t("operator.recommendedReleaseTimeSettings"),
      props: {
        formInline: {
          id: row.id,
          homeTeam: row.homeTeam,
          awayTeam: row.awayTeam,
          eventTime: row.eventTime,
          recommendStartTime: row.recommendStartTime || "",
          recommendEndTime: row.recommendEndTime || row.eventTime || "",
          recommendItem
        } as FormItemProps
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await editRecommendTime({
            id: curData.id,
            recommend_start_time: curData.recommendStartTime,
            recommend_end_time: curData.recommendEndTime,
            recommend_item: curData.recommendItem
          });
          if (success) {
            message($t("operator.operationSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    yesNoOptions,
    recommendOptions,
    sportsOptions,
    recommendItemOptions,
    keyWordColumnOptions,
    onSearch,
    resetForm,
    openDialog
  };
}
