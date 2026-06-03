import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getGameTagList,
  createGameTag,
  updateGameTag,
  deleteGameTag,
  getGameTagTypeList,
  type GameTagItem,
  type GameTagTypeItem
} from "@/api/games";
import type { FormItemProps } from "./types";

export function useGamesTag() {
  // 遊戲類型下拉
  const gameTypeOptions = ref<{ label: string; value: string | number }[]>([]);
  // 目前選擇的遊戲類型
  const gameTypeID = ref<string | number>("");
  const gameTypeName = ref("");

  const dataList = ref<GameTagItem[]>([]);
  const loading = ref(false);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "Tag ID", prop: "id", width: 120 },
    { label: $t("games.tagName"), prop: "name" },
    { label: $t("games.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  // 載入遊戲類型下拉
  async function loadGameTypes() {
    const { data } = await getGameTagTypeList();
    gameTypeOptions.value = (data?.list ?? []).map(
      (item: GameTagTypeItem) => ({
        label: item.value,
        value: item.key
      })
    );
  }

  // 切換遊戲類型
  function handleTypeChange(val: string | number) {
    gameTypeID.value = val ?? "";
    const found = gameTypeOptions.value.find(item => item.value === val);
    gameTypeName.value = found ? found.label : "";
    if (gameTypeID.value !== "") {
      onSearch();
    } else {
      dataList.value = [];
      pagination.total = 0;
    }
  }

  async function onSearch() {
    if (gameTypeID.value === "") return;
    loading.value = true;
    try {
      const { data } = await getGameTagList({ gameTypeID: gameTypeID.value });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function openDialog(row?: GameTagItem) {
    const isEdit = !!row?.id;
    addDialog({
      title: `${isEdit ? $t("games.edit") : $t("games.add")} ${gameTypeName.value} Tag`,
      props: {
        formInline: {
          id: row?.id ?? "",
          name: row?.name ?? "",
          sort: row?.sort ?? "",
          isLeftShow: row?.isLeftShow ?? false,
          tagImg: row?.tagImg ?? "",
          tagIcon: row?.tagIcon ?? "",
          gameTypeID: gameTypeID.value,
          mode: isEdit ? "Edit" : "Create"
        }
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
          let success = false;
          if (isEdit) {
            const res = await updateGameTag({
              id: curData.id,
              name: curData.name,
              sort: curData.sort,
              isLeftShow: curData.isLeftShow,
              tagImg: curData.tagImg,
              tagIcon: curData.tagIcon
            });
            success = res.success;
          } else {
            const res = await createGameTag({
              gameTypeID: gameTypeID.value,
              name: curData.name,
              sort: curData.sort,
              isLeftShow: curData.isLeftShow,
              tagImg: curData.tagImg,
              tagIcon: curData.tagIcon
            });
            success = res.success;
          }
          if (success) {
            message($t("games.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: GameTagItem) {
    ElMessageBox.confirm($t("games.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteGameTag(row.id);
        if (success) {
          message($t("games.operateSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    loadGameTypes();
  });

  return {
    gameTypeOptions,
    gameTypeID,
    gameTypeName,
    loading,
    columns,
    dataList,
    pagination,
    handleTypeChange,
    onSearch,
    openDialog,
    handleDelete
  };
}
