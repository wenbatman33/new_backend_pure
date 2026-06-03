import { ref, reactive, onMounted, computed } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getGameGroupCategory,
  getGameGroup,
  create,
  search,
  delBetlog,
  getReportGame
} from "@/api/faketools";
import type {
  GameGroupItem,
  BetlogRow,
  CreateFormProps,
  SearchFormProps
} from "./types";

export function useBetlog() {
  const loading = ref(false);
  const dataList = ref<BetlogRow[]>([]);
  // 已勾選的列（給批次刪除用）
  const selectedRows = ref<BetlogRow[]>([]);

  // 流水模式：1 一般流水 / 2 新利弊流水
  const gameMode = ref(1);
  const modeOptions = [
    { label: $t("faketools.normalBetlog"), value: 1 },
    { label: $t("faketools.lmBetlog"), value: 2 }
  ];

  // 遊戲廠商分組（含遊戲清單）
  const apiGameGroup = ref<GameGroupItem[]>([]);
  // 每個分組已勾選的 gameListId 陣列
  const gameListIDs = ref<number[][]>([]);

  // 更新流水報表的時間範圍
  const reportRange = reactive({
    startTime: dayjs().format("YYYY-MM-DD"),
    endTime: dayjs().format("YYYY-MM-DD")
  });

  // 新增流水表單
  const createForm = reactive<CreateFormProps>({
    type: 1,
    members: "",
    betAt: dayjs().format("YYYY-MM-DD"),
    betTime: dayjs().format("HH:mm"),
    turnover: "",
    winAmount: ""
  });

  // 查詢流水表單
  const searchForm = reactive<SearchFormProps>({
    type: 1,
    members: "",
    qStartTime: dayjs().format("YYYY-MM-DD"),
    qStartTime2: "00:00",
    qEndTime: dayjs().format("YYYY-MM-DD"),
    qEndTime2: "23:59"
  });

  // 暫存查詢條件（刪除後重查用）
  const tempSearchForm = ref<Partial<SearchFormProps>>({});

  const columns: TableColumnList = [
    { type: "selection", width: 55, align: "left" },
    { label: $t("faketools.date"), prop: "betAt", width: 170 },
    { label: $t("faketools.account"), prop: "memberAccount", width: 130 },
    { label: "MemberId", prop: "memberID", width: 120 },
    {
      label: $t("faketools.gameGroup"),
      prop: "gameGroupName",
      width: 150,
      cellRenderer: ({ row }) => (
        <span style="font-weight:600">{row.gameGroupName}</span>
      )
    },
    { label: "BetID", prop: "betID", width: 190 },
    {
      label: $t("faketools.turnover"),
      prop: "turnover",
      width: 130,
      cellRenderer: ({ row }) => {
        try {
          return <span>{commaDecimalFormat(row.turnover, 2)}</span>;
        } catch {
          return <span>{row.turnover}</span>;
        }
      }
    },
    {
      label: $t("faketools.winAmount"),
      prop: "winAmount",
      width: 130,
      cellRenderer: ({ row }) => {
        try {
          return <span>{commaDecimalFormat(row.winAmount, 2)}</span>;
        } catch {
          return <span>{row.winAmount}</span>;
        }
      }
    },
    {
      label: $t("faketools.action"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  // 取得遊戲廠商分組
  async function fetchGameGroup(mode: number) {
    const { data } = await getGameGroup({ mode });
    apiGameGroup.value = data?.list ?? [];
    gameListIDs.value = apiGameGroup.value.map(() => []);
  }

  // 切換流水模式
  function handleChangeMode(mode: number) {
    gameMode.value = mode;
    gameListIDs.value = [];
    fetchGameGroup(mode);
  }

  // 全選 / 全不選
  // gameTypeId === -1 表示全部分組；否則只針對單一分組（以陣列索引對應）
  function selectAll(isSelect: boolean, index: number) {
    if (index === -1) {
      gameListIDs.value = isSelect
        ? apiGameGroup.value.map(g =>
            g.gameGroupList.map(item => item.gameListId).filter(Boolean)
          )
        : apiGameGroup.value.map(() => []);
    } else {
      gameListIDs.value[index] = isSelect
        ? apiGameGroup.value[index].gameGroupList
            .map(item => item.gameListId)
            .filter(Boolean)
        : [];
    }
  }

  // 攤平所有已勾選的 gameListId
  const flatGameListIDs = computed(() => gameListIDs.value.flat());

  // 更新流水報表
  async function handleSearchReportGame() {
    try {
      const startTime = `${reportRange.startTime} 00:00:00`;
      const endTime = `${reportRange.endTime} 23:59:59`;
      const mode =
        gameMode.value === 1
          ? "recalcreportmemberdailygame"
          : "recalcreportmemberdailygamelm";
      const { data } = await getReportGame(mode, { startTime, endTime });
      dataList.value = data?.list ?? [];
      message($t("faketools.updateSuccess"), { type: "success" });
    } catch (err: any) {
      message(err?.message ?? String(err), { type: "error" });
    }
  }

  // 新增流水
  async function handleCreate(formEl) {
    if (!formEl) return;
    formEl.validate(async (valid: boolean) => {
      if (!valid) return;
      if (!Number(createForm.turnover)) {
        message($t("faketools.turnoverMustBeNumber"), { type: "error" });
        return;
      }
      if (!Number(createForm.winAmount)) {
        message($t("faketools.winAmountMustBeNumber"), { type: "error" });
        return;
      }
      const ids = flatGameListIDs.value;
      if (!ids.length) {
        message($t("faketools.pleaseSelectGame"), { type: "error" });
        return;
      }

      let members = createForm.members;
      if (members.endsWith(",")) members = members.slice(0, -1);

      const form: Record<string, any> = {
        betAt: `${dayjs(createForm.betAt).format("YYYY-MM-DD")} ${createForm.betTime}:00`,
        turnover: Number(createForm.turnover),
        winAmount: Number(createForm.winAmount),
        gameListIDs: ids,
        mode: gameMode.value
      };

      if (gameMode.value === 2) {
        form.lmIDs = members.split(",").map(Number);
        form.members = "";
        form.type = 1;
      } else {
        form.members = members;
        form.type = createForm.type;
      }

      const { success } = await create(form);
      if (success) {
        message($t("faketools.createBetlogSuccess"), { type: "success" });
        if (gameMode.value === 1) {
          searchForm.members = members;
          searchForm.type = createForm.type;
        }
      }
    });
  }

  // 查詢流水
  async function handleSearch(formEl?) {
    if (formEl) {
      const valid = await formEl.validate().catch(() => false);
      if (!valid) return;
    }
    if (new Date(searchForm.qStartTime) > new Date(searchForm.qEndTime)) {
      message($t("faketools.startDateGtEndDate"), { type: "error" });
      return;
    }

    // post 是用 gameListId，但 get 查詢要用 gameGroupId，需轉換
    const listToGroup: number[] = [];
    flatGameListIDs.value.forEach(listId => {
      apiGameGroup.value.forEach(gameType => {
        gameType.gameGroupList.forEach(item => {
          if (item.gameListId === listId) listToGroup.push(item.gameGroupId);
        });
      });
    });

    const form: Record<string, any> = {
      qStartTime: `${dayjs(searchForm.qStartTime).format("YYYY-MM-DD")} ${searchForm.qStartTime2}:00`,
      qEndTime: `${dayjs(searchForm.qEndTime).format("YYYY-MM-DD")} ${searchForm.qEndTime2}:59`,
      gameGroupIDs: listToGroup.toString(),
      mode: gameMode.value
    };
    if (gameMode.value === 2) {
      form.type = 1;
      form.members = "";
    } else {
      form.members = searchForm.members;
      form.type = searchForm.type;
    }

    tempSearchForm.value = { ...searchForm };
    loading.value = true;
    try {
      const { data } = await search(form);
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 表格勾選變更
  function handleSelectionChange(rows: BetlogRow[]) {
    selectedRows.value = rows;
  }

  // 刪除流水（單筆 / 批次）
  function handleDelete(row?: BetlogRow, isMultiple = false) {
    const title = isMultiple
      ? $t("faketools.confirmDeleteAllChecked")
      : $t("faketools.confirmDeleteThis");
    ElMessageBox.confirm(title, "", { type: "warning" })
      .then(async () => {
        if (isMultiple && !selectedRows.value.length) {
          message($t("faketools.pleaseCheckAtLeastOne"), { type: "error" });
          return;
        }
        const delList = isMultiple
          ? selectedRows.value.map(item => ({
              betID: item.betID,
              gameGroupID: item.gameGroupID
            }))
          : [{ betID: row!.betID, gameGroupID: row!.gameGroupID }];
        const { success } = await delBetlog({ delList, mode: gameMode.value });
        if (success) {
          message($t("faketools.deleteSuccess"), { type: "success" });
          handleSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    // 取得遊戲廠商與遊戲類型（用於初始化分類資料）
    getGameGroupCategory();
    // 預設 mode 1 一般流水
    fetchGameGroup(1);
  });

  return {
    loading,
    dataList,
    gameMode,
    modeOptions,
    apiGameGroup,
    gameListIDs,
    reportRange,
    createForm,
    searchForm,
    columns,
    handleChangeMode,
    selectAll,
    handleSearchReportGame,
    handleCreate,
    handleSearch,
    handleSelectionChange,
    handleDelete
  };
}
