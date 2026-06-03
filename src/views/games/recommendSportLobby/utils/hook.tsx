import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import { arrayToOptions } from "@/utils/options";
import {
  getRecommendSportList,
  createRecommendSport,
  editRecommendSport,
  deleteRecommendSport,
  getRecommendSportGameGroups,
  type RecommendSportItem
} from "@/api/games";
import type { FormItemProps } from "./types";

const statusMap: Record<number, string> = {
  0: $t("games.statusHide"),
  1: $t("games.statusShow")
};

export function useRecommendSportLobby() {
  const dataList = ref<RecommendSportItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  // 厂商下拉選項
  const gameGroupOptions = ref<Array<{ label: string; value: number | string }>>(
    []
  );

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("games.recommendedSort"), prop: "recommendedSort" },
    { label: $t("games.gameGroupName"), prop: "gameGroupDisplayName" },
    { label: $t("games.gameName"), prop: "displayName" },
    {
      label: $t("games.frontStatus"),
      prop: "showStatus",
      cellRenderer: ({ row }) => (
        <span>{statusMap[Number(row.showStatus)] ?? ""}</span>
      )
    },
    { label: $t("games.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRecommendSportList();
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  // 載入厂商下拉
  async function loadGameGroups() {
    const { data } = await getRecommendSportGameGroups({ gameTypeID: 1 });
    gameGroupOptions.value = arrayToOptions(
      data?.list ?? [],
      "id",
      "displayName"
    );
  }

  function openDialog(title = "add", row?: RecommendSportItem) {
    addDialog({
      title:
        title === "add"
          ? $t("games.addRecommendSport")
          : $t("games.editRecommendSport"),
      props: {
        formInline: {
          id: row?.id ?? undefined,
          recommendedSort: row?.recommendedSort ?? "",
          gameGroupID: row?.gameGroupID ?? "",
          gameID: row?.gameID ?? "",
          showStatus: row?.showStatus ?? ""
        },
        gameGroupOptions: gameGroupOptions.value
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
          const payload = {
            recommendedSort: curData.recommendedSort,
            gameGroupID: curData.gameGroupID,
            gameID: curData.gameID,
            showStatus: curData.showStatus
          };
          const { success } =
            title === "add"
              ? await createRecommendSport(payload)
              : await editRecommendSport({ id: curData.id, ...payload });
          if (success) {
            message(
              title === "add"
                ? $t("games.addSuccess")
                : $t("games.editSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: RecommendSportItem) {
    ElMessageBox.confirm($t("games.confirmDeleteRecommend"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteRecommendSport(row.id);
        if (success) {
          message($t("games.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    loadGameGroups();
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    gameGroupOptions,
    onSearch,
    openDialog,
    handleDelete
  };
}
