import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getNavigationList,
  postNavigation,
  putNavigation,
  deleteNavigation,
  putNavigationSort,
  putNavigationStatus,
  getGameDropdownList,
  type NavigationItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 可選語系（舊碼讀 VITE_GLOB_APP_lang，pure 內以 import.meta.env 取得，無則預設 cn,en）
const langEnv = (import.meta.env.VITE_GLOB_APP_lang as string) || "cn,en";
const languageList = langEnv.split(",");

const lobbyTypeMap: Record<number, string> = {
  1: $t("operator.naviGameCategory"),
  2: $t("operator.naviStartTheGame"),
  3: $t("operator.naviGoToSpecifiedPage")
};

export function useNavManagement() {
  const searchForm = reactive({
    lobbyType: "",
    status: ""
  });
  const dataList = ref<NavigationItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 廠商與遊戲下拉資料
  const gameGroupOptions = ref<{ label: string; value: number }[]>([]);
  const gameList = ref<
    { id: number; displayName: string; gameGroup: number }[]
  >([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const lobbyTypeOptions = [
    { label: $t("operator.naviGameCategory"), value: 1 },
    { label: $t("operator.naviStartTheGame"), value: 2 },
    { label: $t("operator.naviGoToSpecifiedPage"), value: 3 }
  ];

  const statusOptions = [
    { label: $t("operator.noShow"), value: false },
    { label: $t("operator.show"), value: true }
  ];

  const columns: TableColumnList = [
    {
      label: $t("operator.sort"),
      prop: "sort",
      width: 130,
      sortable: true,
      slot: "sort"
    },
    { label: $t("operator.serialNumber"), prop: "id", width: 100 },
    {
      label: $t("operator.type"),
      prop: "lobbyType",
      width: 160,
      cellRenderer: ({ row }) => (
        <span>{lobbyTypeMap[row.lobbyType] ?? row.lobbyType}</span>
      )
    },
    {
      label: $t("operator.showOrHidden"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.status === 0 || row.status === false
            ? $t("operator.noShow")
            : $t("operator.show")}
        </span>
      )
    },
    { label: $t("operator.naviContent"), prop: "content", minWidth: 160 },
    { label: $t("operator.naviNote"), prop: "note", width: 160 },
    { label: $t("operator.lastUpdate"), prop: "updatedAt", width: 170 },
    { label: $t("operator.executor"), prop: "updatedUser", width: 140 },
    { label: $t("operator.action"), fixed: "right", width: 220, slot: "operation" }
  ];

  // 載入廠商/遊戲下拉，並回傳遊戲清單供 content 名稱對應
  async function loadGameDropdown() {
    const { data } = await getGameDropdownList();
    const groups = data?.gameGroup ?? [];
    const games = data?.gameList ?? [];
    gameGroupOptions.value = groups
      .filter(item => item.status === 1)
      .map(item => ({ label: item.displayName, value: item.id }));
    gameList.value = games.filter(item => item.status === 1);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getNavigationList({
        lobbyType: searchForm.lobbyType,
        status: searchForm.status
      });
      const list: NavigationItem[] = data?.list ?? [];
      // lobbyType=2 時，content 存的是遊戲 id，轉成顯示名稱
      dataList.value = list.map(item => {
        if (item.lobbyType === 2) {
          const matched = gameList.value.find(
            g => String(g.id) === String(item.content)
          );
          if (matched) item.content = matched.displayName;
        }
        return item;
      });
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 切換顯示/隱藏
  async function handleStatus(row: NavigationItem) {
    const { success } = await putNavigationStatus({
      id: row.id,
      status: !row.status
    });
    if (success) {
      message($t("operator.naviUpdateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 排序欄編輯後送出
  async function handleSortChange(row: NavigationItem, value: number) {
    const { success } = await putNavigationSort({ id: row.id, sort: value });
    if (success) {
      message($t("operator.naviUpdateSuccess"), { type: "success" });
      onSearch();
    }
  }

  function openDialog(title = $t("operator.add"), row?: NavigationItem) {
    const isEdit = !!row;
    // 預設各語系名稱
    const defaultNames = languageList.map(language => ({
      language,
      name: ""
    }));
    let formInline: FormItemProps = {
      id: undefined,
      lobbyType: 1,
      navigationName: defaultNames,
      sort: 0,
      status: false,
      dynamic: false,
      icon: "",
      iconColor: "",
      iconColor2: "",
      content: "",
      note: "",
      gameGroup: gameGroupOptions.value[0]?.value,
      gameListId: undefined
    };

    if (isEdit) {
      const r: any = row;
      formInline = {
        id: r.id,
        lobbyType: r.lobbyType,
        navigationName:
          Array.isArray(r.name) && r.name.length
            ? JSON.parse(JSON.stringify(r.name))
            : defaultNames,
        sort: r.sort,
        status: r.status === 0 || r.status === false ? false : true,
        dynamic: r.dynamic === 2 || r.dynamic === false ? false : true,
        icon: r.icon ?? "",
        iconColor: r.iconColor ?? "",
        iconColor2: r.iconColor2 ?? "",
        content: r.content ?? "",
        note: r.note ?? "",
        gameGroup: gameGroupOptions.value[0]?.value,
        gameListId: undefined
      };
      // lobbyType=2 時，依 content(顯示名稱) 反查廠商與遊戲 id
      if (r.lobbyType === 2) {
        const matched = gameList.value.find(g => g.displayName === r.content);
        if (matched) {
          formInline.gameGroup = matched.gameGroup;
          formInline.gameListId = matched.id;
        }
      }
    }

    addDialog({
      title,
      props: {
        formInline,
        languageList,
        gameGroupOptions: gameGroupOptions.value,
        gameList: gameList.value
      },
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // 組裝送出 payload（沿用舊碼欄位轉換）
          const payload: any = {
            lobbyType: curData.lobbyType,
            navigationName: curData.navigationName,
            sort: curData.sort,
            status: curData.status ? 1 : 0,
            dynamic: curData.dynamic ? 1 : 2,
            icon: curData.icon,
            iconColor: curData.iconColor,
            iconColor2: curData.iconColor2,
            note: curData.note,
            content:
              curData.lobbyType === 2 ? curData.gameListId : curData.content
          };
          const { success } = isEdit
            ? await putNavigation({ id: curData.id, ...payload })
            : await postNavigation(payload);
          if (success) {
            message(
              isEdit
                ? $t("operator.naviUpdateSuccess")
                : $t("operator.naviAddSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: NavigationItem) {
    ElMessageBox.confirm($t("operator.naviConfirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteNavigation(row.id);
        if (success) {
          message($t("operator.naviDeleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(async () => {
    await loadGameDropdown();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    lobbyTypeOptions,
    statusOptions,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleStatus,
    handleSortChange
  };
}
