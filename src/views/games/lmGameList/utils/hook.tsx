import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import addForm from "../addForm.vue";
import editForm from "../editForm.vue";
import statusForm from "../statusForm.vue";
import {
  getLmGameList,
  getLmGameTypeList,
  getLmGameGroupOption,
  getLmGame,
  createLmGame,
  putLmGame,
  putLmGameBatchUpdate,
  type LmGameListItem,
  type LmGameOptionItem
} from "@/api/games";
import type {
  OptionItem,
  AddFormItemProps,
  EditFormItemProps,
  StatusFormItemProps
} from "./types";

// 狀態對應與顏色（el-tag type）
const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: $t("games.open"), type: "success" },
  2: { text: $t("games.close"), type: "danger" },
  3: { text: $t("games.maintain"), type: "warning" },
  4: { text: $t("games.hide"), type: "info" }
};

export function useLmGameList() {
  const searchForm = reactive({
    gameTypeID: 1,
    gameGroupID: "",
    name: "",
    displayName: "",
    status: 0
  });
  const dataList = ref<LmGameListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 選項
  const gameTypeOptions = ref<OptionItem[]>([]);
  const gameGroupOptions = ref<OptionItem[]>([]);

  // 多選列表 id（給批次修改狀態用）
  const selectedIds = ref<number[]>([]);

  const statusOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.open"), value: 1 },
    { label: $t("games.close"), value: 2 },
    { label: $t("games.maintain"), value: 3 },
    { label: $t("games.hide"), value: 4 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { type: "selection", align: "left", width: 50 },
    { label: "ID", prop: "id", width: 70 },
    { label: $t("games.sort"), prop: "sort", width: 90, sortable: true },
    { label: $t("games.group"), prop: "gameGroupDisplayName", minWidth: 140 },
    { label: $t("games.name"), prop: "name", minWidth: 140 },
    { label: $t("games.displayName"), prop: "displayName", minWidth: 140 },
    { label: $t("games.type"), prop: "gameTypeName", width: 100 },
    {
      label: $t("games.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => {
        const item = statusMap[row.status];
        return item ? (
          <el-tag type={item.type} effect="plain">
            {item.text}
          </el-tag>
        ) : (
          <span>{row.status}</span>
        );
      }
    },
    { label: $t("games.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  // 載入遊戲類型下拉
  async function fetchGameTypeOptions() {
    const { data } = await getLmGameTypeList();
    const list: LmGameOptionItem[] = data?.list ?? [];
    // 預設含「體育返水」(key=1)，其餘排除 key===1 後接上
    gameTypeOptions.value = [
      { label: $t("games.sportRefund"), value: 1 }
    ].concat(
      list
        .filter(el => el.key !== 1)
        .map(el => ({ label: el.value, value: el.key }))
    );
  }

  // 載入遊戲廠商下拉
  async function fetchGameGroupOptions() {
    const { data } = await getLmGameGroupOption();
    const list: LmGameOptionItem[] = data?.list ?? [];
    gameGroupOptions.value = list.map(el => ({
      label: el.displayName,
      value: el.key
    }));
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getLmGameList({
        gameTypeID: searchForm.gameTypeID,
        gameGroupID: searchForm.gameGroupID,
        name: searchForm.name,
        displayName: searchForm.displayName,
        status: searchForm.status,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
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
    onSearch();
  }

  function handleSelectionChange(rows: LmGameListItem[]) {
    selectedIds.value = rows.map(r => r.id);
  }

  // 新增遊戲
  function openAddDialog() {
    addDialog({
      title: $t("games.newGame"),
      props: {
        formInline: {
          gameGroupID: undefined,
          gameTypeID: undefined,
          name: "",
          displayName: "",
          sort: "",
          gameCodePc: "",
          gameCodeH5: "",
          isNewGame: false,
          isHotGame: false,
          status: 1,
          trialPlay: undefined
        },
        gameTypeOptions: gameTypeOptions.value,
        gameGroupOptions: gameGroupOptions.value
      },
      width: "880px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as AddFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await createLmGame({
            gameGroupID: curData.gameGroupID,
            gameTypeID: curData.gameTypeID,
            name: curData.name,
            displayName: curData.displayName,
            sort: curData.sort,
            gameCodePc: curData.gameCodePc,
            gameCodeH5: curData.gameCodeH5,
            isNewGame: curData.isNewGame ? 1 : 2,
            isHotGame: curData.isHotGame ? 1 : 2,
            status: curData.status,
            trialPlay: curData.trialPlay,
            recommendedSort: 0
          });
          if (success) {
            message($t("games.newGame"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 編輯遊戲
  async function openEditDialog(row: LmGameListItem) {
    // 先抓單筆完整資料
    const { data } = await getLmGame({ id: row.id });
    const detail = data ?? ({} as any);
    addDialog({
      title: $t("games.edit"),
      props: {
        formInline: {
          id: row.id,
          gameGroupID: row.gameGroupID,
          gameTypeID: row.gameTypeID,
          name: detail.name ?? row.name,
          displayName: detail.displayName ?? row.displayName,
          sort: detail.sort ?? row.sort,
          bettingCode: detail.bettingCode ?? "",
          gameCodePc: detail.gameCodePc ?? row.gameCodePc ?? "",
          gameCodeH5: detail.gameCodeH5 ?? row.gameCodeH5 ?? "",
          isNewGame: detail.isNewGame === 1,
          isHotGame: detail.isHotGame === 1,
          status: detail.status ?? row.status
        },
        gameTypeOptions: gameTypeOptions.value,
        gameGroupOptions: gameGroupOptions.value
      },
      width: "880px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as EditFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await putLmGame({
            id: curData.id,
            gameGroupID: curData.gameGroupID,
            gameTypeID: curData.gameTypeID,
            name: curData.name,
            displayName: curData.displayName,
            sort: curData.sort,
            bettingCode: curData.bettingCode,
            gameCodePc: curData.gameCodePc,
            gameCodeH5: curData.gameCodeH5,
            isNewGame: curData.isNewGame ? 1 : 2,
            isHotGame: curData.isHotGame ? 1 : 2,
            status: curData.status
          });
          if (success) {
            message($t("games.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 批次修改遊戲狀態
  function openStatusDialog() {
    if (selectedIds.value.length === 0) {
      message($t("games.editGameStatus"), { type: "warning" });
      return;
    }
    addDialog({
      title: $t("games.editGameStatus"),
      props: {
        formInline: {
          status: 0,
          isNewGame: 0,
          isHotGame: 0,
          isReturn: 0,
          isSlot: 0
        }
      },
      width: "560px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(statusForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline as StatusFormItemProps;
        // 僅送出非「維持不變」(0) 的欄位
        const params: Record<string, any> = {
          id: selectedIds.value.join(",")
        };
        Object.keys(curData).forEach(key => {
          if (curData[key]) params[key] = curData[key];
        });
        const { success } = await putLmGameBatchUpdate(params);
        if (success) {
          message($t("games.editSuccess"), { type: "success" });
          done();
          selectedIds.value = [];
          onSearch();
        }
      }
    });
  }

  // 操作紀錄：舊碼依賴未移植的 systemManage api（getLuckMoneyLog）。
  // TODO: systemManage api 移植後補上操作紀錄對話框，暫以提示佔位。
  function handleOperationRecord(_row: LmGameListItem) {
    message("TODO: operationRecord (systemManage api 未移植)", {
      type: "info"
    });
  }

  onMounted(async () => {
    await Promise.all([fetchGameTypeOptions(), fetchGameGroupOptions()]);
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    gameTypeOptions,
    gameGroupOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSelectionChange,
    openAddDialog,
    openEditDialog,
    openStatusDialog,
    handleOperationRecord
  };
}
