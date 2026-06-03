import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag } from "element-plus";
import { getImagPath } from "@/utils/imgUrl";
import { checkIsVD } from "@/utils/country";
import editForm from "../form.vue";
import batchForm from "../batchForm.vue";
import recordTable from "../record.vue";
import {
  getGameList,
  getGame,
  createGame,
  putGame,
  getGameListType,
  getGameGroupOption,
  getGameTagList,
  putGameBatchUpdate,
  type GameListItem
} from "@/api/games";
import type { FormItemProps } from "./types";

const imagPath = getImagPath();

const statusMap: Record<number, string> = {
  0: $t("games.all"),
  1: $t("games.open"),
  2: $t("games.close"),
  3: $t("games.maintain"),
  4: $t("games.hide")
};
const statusTagType: Record<number, string> = {
  1: "success",
  2: "danger",
  3: "warning",
  4: "info"
};

export function useGameList() {
  const searchForm = reactive({
    gameTypeID: "",
    gameGroupID: "",
    name: "",
    displayName: "",
    status: 0,
    trialPlay: 0,
    isSlot: 0,
    isRecommended: 0,
    isNewGame: 0,
    id: "",
    gameCodeH5: "",
    gameCodePC: ""
  });
  const dataList = ref<GameListItem[]>([]);
  const loading = ref(true);
  const selectedIds = ref<Array<number | string>>([]);

  // 下拉選項
  const gameTypeOptions = ref<Array<{ label: string; value: number }>>([]);
  const gameGroupOptionsAll = ref<
    Array<{ label: string; value: number; gameTypeID?: number }>
  >([]);
  // 依目前選擇的遊戲類型過濾後的廠商選項
  const gameGroupOptions = ref<
    Array<{ label: string; value: number; gameTypeID?: number }>
  >([]);

  const statusOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.open"), value: 1 },
    { label: $t("games.close"), value: 2 },
    { label: $t("games.maintain"), value: 3 },
    { label: $t("games.hide"), value: 4 }
  ];
  const trialPlayOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.no"), value: 1 },
    { label: $t("games.yes"), value: 2 }
  ];
  const isSlotOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.participate"), value: 2 },
    { label: $t("games.noParticipate"), value: 1 }
  ];
  const yesNoOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.true"), value: 1 },
    { label: $t("games.false"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("games.sort"), prop: "sort", width: 90, sortable: true },
    {
      label: $t("games.group"),
      prop: "gameGroupDisplayName",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <span>
          {row.gameGroupName} ({row.gameGroupDisplayName})
        </span>
      )
    },
    { label: $t("games.name"), prop: "name", minWidth: 120 },
    { label: $t("games.displayName"), prop: "displayName", minWidth: 120 },
    { label: $t("games.type"), prop: "gameTypeName", width: 90 },
    {
      label: $t("games.imageH5"),
      prop: "imageH5",
      width: 110,
      cellRenderer: ({ row }) =>
        row.imageH5 ? (
          <img
            src={imagPath + row.imageH5}
            style="width:80px;border-radius:4px"
          />
        ) : (
          <span></span>
        )
    },
    {
      label: $t("games.imagePc"),
      prop: "imagePc",
      width: 110,
      hide: () => checkIsVD(),
      cellRenderer: ({ row }) =>
        row.imagePc ? (
          <img
            src={imagPath + row.imagePc}
            style="width:80px;border-radius:4px"
          />
        ) : (
          <span></span>
        )
    },
    {
      label: $t("games.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <ElTag type={statusTagType[row.status] ?? "info"} effect="plain">
          {statusMap[row.status] ?? row.status}
        </ElTag>
      )
    },
    {
      label: $t("games.trialPlay"),
      prop: "trialPlay",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.trialPlay === 2 ? $t("games.true") : $t("games.false")}</span>
      )
    },
    {
      label: $t("games.isReturn"),
      prop: "isReturn",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.isReturn === 1 ? $t("games.true") : $t("games.false")}</span>
      )
    },
    {
      label: $t("games.isSlot"),
      prop: "isSlot",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>
          {row.isSlot === 2
            ? $t("games.participate")
            : row.isSlot === 1
              ? $t("games.noParticipate")
              : ""}
        </span>
      )
    },
    {
      label: $t("games.isHotGame"),
      prop: "isHotGame",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.isHotGame === 1 ? $t("games.true") : $t("games.false")}</span>
      )
    },
    {
      label: $t("games.recommendedSort"),
      prop: "recommendedSort",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>
          {row.recommendedSort === 0
            ? ""
            : $t("games.order") + row.recommendedSort}
        </span>
      )
    },
    {
      label: $t("games.isNewGame"),
      prop: "isNewGame",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.isNewGame === 1 ? $t("games.true") : $t("games.false")}</span>
      )
    },
    {
      label: $t("games.tags"),
      prop: "gameTags",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <span>
          {(row.gameTags ?? []).map(t => (
            <div>{t.name}</div>
          ))}
        </span>
      )
    },
    { label: $t("games.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  /** 依條件去除空值 */
  function buildQuery() {
    const q: Record<string, any> = {};
    Object.keys(searchForm).forEach(k => {
      const v = (searchForm as any)[k];
      if (v !== "" && v !== undefined && v !== null) q[k] = v;
    });
    return q;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameList(buildQuery());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? data?.list?.length ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 0;
    searchForm.trialPlay = 0;
    searchForm.isSlot = 0;
    searchForm.isRecommended = 0;
    searchForm.isNewGame = 0;
    gameGroupOptions.value = [...gameGroupOptionsAll.value];
    onSearch();
  }

  /** 遊戲類型變動時過濾廠商選項 */
  function onGameTypeChange(value) {
    if (!value) {
      gameGroupOptions.value = [...gameGroupOptionsAll.value];
    } else {
      gameGroupOptions.value = gameGroupOptionsAll.value.filter(
        i => i.gameTypeID === value
      );
      const exist = gameGroupOptions.value.some(
        i => i.value === searchForm.gameGroupID
      );
      if (!exist) searchForm.gameGroupID = "";
    }
  }

  /** 取得標籤選項 */
  async function fetchTagOptions(gameTypeID?: number) {
    const { data } = await getGameTagList({
      gameTypeID,
      page: 1,
      pageSize: 999
    });
    return (data?.list ?? []).map(item => ({
      label: item.name,
      value: item.id
    }));
  }

  const formRef = ref();

  async function openDialog(isAdd: boolean, row?: GameListItem) {
    let formInline: FormItemProps = {
      id: undefined,
      gameGroupID: undefined,
      gameTypeID: undefined,
      name: "",
      displayName: "",
      sort: "",
      bettingCode: "",
      gameCodePc: "",
      gameCodeH5: "",
      status: 1,
      trialPlay: 1,
      isHotGame: false,
      isNewGame: false,
      recommendedSort: 0,
      isSlot: 1,
      isReturn: 1,
      tagIDs: [],
      imageH5: "",
      imagePc: "",
      screenShotH5: "",
      screenShotPc: "",
      recommendedImageH5: ""
    };
    let tagOptions: Array<{ label: string; value: number }> = [];

    if (!isAdd && row) {
      const { data } = await getGame({ id: row.id });
      tagOptions = await fetchTagOptions(row.gameTypeID);
      formInline = {
        id: data?.id,
        gameGroupID: row.gameGroupID,
        gameTypeID: row.gameTypeID,
        name: data?.name ?? "",
        displayName: data?.displayName ?? "",
        sort: data?.sort ?? "",
        bettingCode: data?.bettingCode ?? "",
        gameCodePc: data?.gameCodePc ?? row.gameCodePc ?? "",
        gameCodeH5: data?.gameCodeH5 ?? row.gameCodeH5 ?? "",
        status: data?.status ?? 1,
        trialPlay: data?.trialPlay ?? 1,
        isHotGame: data?.isHotGame === 1,
        isNewGame: data?.isNewGame === 1,
        recommendedSort: data?.recommendedSort ?? 0,
        isSlot: row.isSlot ?? 1,
        isReturn: data?.isReturn ?? 1,
        tagIDs: (row.gameTags ?? []).map(t => t.id),
        imageH5: data?.imageH5 ?? row.imageH5 ?? "",
        imagePc: data?.imagePc ?? row.imagePc ?? "",
        screenShotH5: data?.screenShotH5 ?? "",
        screenShotPc: data?.screenShotPc ?? "",
        recommendedImageH5: data?.recommendedImageH5 ?? ""
      };
    }

    addDialog({
      title: isAdd ? $t("games.newGame") : $t("games.edit"),
      props: {
        formInline,
        isAdd,
        gameGroupOptions: gameGroupOptionsAll.value,
        gameTypeOptions: gameTypeOptions.value,
        tagOptions
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as any).formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            id: curData.id,
            gameGroupID: curData.gameGroupID,
            gameTypeID: curData.gameTypeID,
            bettingCode: curData.bettingCode,
            isHotGame: curData.isHotGame ? 1 : 2,
            isNewGame: curData.isNewGame ? 1 : 2,
            name: curData.name,
            displayName: curData.displayName,
            sort: curData.sort,
            gameCodePc: curData.gameCodePc,
            gameCodeH5: curData.gameCodeH5,
            trialPlay: curData.trialPlay,
            recommendedSort: curData.recommendedSort ?? 0,
            isSlot: curData.isSlot,
            isReturn: curData.isReturn,
            status: curData.status,
            imageH5: curData.imageH5,
            imagePc: curData.imagePc,
            screenShotH5: curData.screenShotH5,
            screenShotPc: curData.screenShotPc,
            recommendedImageH5: curData.recommendedImageH5,
            tagIDs: curData.tagIDs
          };
          const { success } = isAdd
            ? await createGame(payload)
            : await putGame(payload);
          if (success) {
            message($t("common.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 批次修改狀態 */
  function openBatchDialog() {
    if (selectedIds.value.length === 0) {
      message($t("games.editGameStatus"), { type: "warning" });
      return;
    }
    const batchRef = ref();
    const formInline = {
      status: 0,
      isNewGame: 0,
      isHotGame: 0,
      isReturn: 0,
      isSlot: 0
    };
    addDialog({
      title: $t("games.editGameStatus"),
      props: { formInline },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(batchForm, { ref: batchRef }),
      beforeSure: async (done, { options }) => {
        const curData = (options.props as any).formInline;
        const params: Record<string, any> = {
          id: selectedIds.value.join(",")
        };
        Object.keys(curData).forEach(k => {
          if (curData[k]) params[k] = curData[k];
        });
        const { success } = await putGameBatchUpdate(params);
        if (success) {
          message($t("common.editSuccess"), { type: "success" });
          done();
          selectedIds.value = [];
          onSearch();
        }
      }
    });
  }

  /** 操作紀錄 */
  function openRecordDialog(row: GameListItem) {
    addDialog({
      title: $t("games.handleRecord"),
      props: { gameId: row.id },
      width: "1200px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(recordTable)
    });
  }

  function handleSelectionChange(rows: GameListItem[]) {
    selectedIds.value = rows.map(r => r.id);
  }

  onMounted(async () => {
    // 載入下拉選項
    const [typeRes, groupRes] = await Promise.all([
      getGameListType(),
      getGameGroupOption()
    ]);
    gameTypeOptions.value = (typeRes.data?.list ?? []).map(el => ({
      label: el.value,
      value: el.key
    }));
    gameGroupOptionsAll.value = (groupRes.data?.list ?? []).map(el => ({
      label: `${el.name} (${el.displayName})`,
      value: el.key,
      gameTypeID: el.gameTypeID
    }));
    gameGroupOptions.value = [...gameGroupOptionsAll.value];
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    gameTypeOptions,
    gameGroupOptions,
    statusOptions,
    trialPlayOptions,
    isSlotOptions,
    yesNoOptions,
    onSearch,
    resetForm,
    onGameTypeChange,
    openDialog,
    openBatchDialog,
    openRecordDialog,
    handleSelectionChange
  };
}
