import { h, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { findByValue, arrayToOptions } from "@/utils/options";
import editForm from "../form.vue";
import {
  getRecommendHomeList,
  editRecommendHome,
  getRecommendHomeGameType,
  getRecommendHomeGameGroups,
  getRecommendHomeGameList
} from "@/api/games";
import type { FormItemProps } from "./types";

// 前台狀態文案：0 隱藏 / 1 顯示
const statusMap: Record<number, string> = {
  0: $t("games.statusHide"),
  1: $t("games.statusShow")
};

// 推薦標籤類型文案：1 Tag 推薦 / 2 主要推薦
const tagTypeMap: Record<number, string> = {
  1: $t("games.tagRecommend"),
  2: $t("games.mainRecommend")
};

export function useRecommendHome() {
  const loading = ref(false);
  // 多張表格（每組 gameTypeID + isTag 一張）
  const tableDataList = ref<any[]>([]);
  const gameTypeList = ref<Array<{ label: string; value: string | number }>>([]);

  const formRef = ref();
  const gameGroupOptions = ref<Array<{ label: string; value: string | number }>>([]);
  const gameOptions = ref<Array<{ label: string; value: string | number }>>([]);

  const columns: TableColumnList = [
    { label: $t("games.recommendedSort"), prop: "recommendedSort" },
    { label: $t("games.gameGroupName"), prop: "gameGroupDisplayName" },
    { label: $t("games.gameName"), prop: "displayName" },
    {
      label: $t("games.frontShowStatus"),
      prop: "showStatus",
      cellRenderer: ({ row }) => (
        <span>{statusMap[Number(row.showStatus)] ?? ""}</span>
      )
    },
    { label: $t("games.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  // 取得每個表格區塊的標題
  function getTableTitle(table: any) {
    const groupName = findByValue(gameTypeList.value, table.gameTypeID);
    return `${groupName ?? ""} ${tagTypeMap[Number(table.isTag)] ?? ""}`.trim();
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data: typeData } = await getRecommendHomeGameType();
      gameTypeList.value = arrayToOptions(typeData?.list ?? [], "key", "value");
      const { data } = await getRecommendHomeList();
      tableDataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 廠商切換 → 連動載入該廠商遊戲清單
  async function loadGameList(gameGroupID: string | number) {
    if (!gameGroupID) {
      gameOptions.value = [];
      return;
    }
    const { data } = await getRecommendHomeGameList({ gameGroupID });
    gameOptions.value = (data?.list ?? []).map((item: any) => ({
      label: item.displayName,
      value: item.id
    }));
  }

  async function openDialog(row: any, table: any) {
    // 載入該遊戲類型下的廠商清單
    const { data: groupData } = await getRecommendHomeGameGroups({
      gameTypeID: table.gameTypeID
    });
    gameGroupOptions.value = (groupData?.list ?? []).map((item: any) => ({
      label: item.displayName,
      value: item.id
    }));
    // 編輯：預先載入當前廠商的遊戲清單
    gameOptions.value = [];
    if (row.gameGroupID) {
      await loadGameList(row.gameGroupID);
    }

    const title = getTableTitle(table);
    addDialog({
      title: `${$t("games.edit")} ${title}`.trim(),
      props: {
        formInline: {
          id: row.id,
          recommendedSort: row.recommendedSort,
          gameGroupID: row.gameGroupID ?? "",
          gameID: row.gameID ?? "",
          showStatus: Number(row.showStatus ?? 1),
          gameTypeID: table.gameTypeID
        },
        gameGroupOptions: gameGroupOptions.value,
        gameOptions: gameOptions.value,
        onGameGroupChange: loadGameList
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
          const { success } = await editRecommendHome({
            id: curData.id,
            recommendedSort: Number(curData.recommendedSort),
            gameGroupID: curData.gameGroupID,
            gameID: curData.gameID,
            showStatus: curData.showStatus
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

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    tableDataList,
    gameTypeList,
    gameGroupOptions,
    gameOptions,
    getTableTitle,
    onSearch,
    openDialog
  };
}
