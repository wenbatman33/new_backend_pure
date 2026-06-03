import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getLuckmoneyGameAgencyList,
  putLuckmoneyGameAgency,
  getGameListType,
  type LuckmoneyGameAgencyItem,
  type GameListTypeItem
} from "@/api/games";
import type { FormItemProps } from "./types";

// 狀態對應（值與舊碼一致）
const statusMap: Record<number, string> = {
  1: $t("games.statusOpen"),
  2: $t("games.statusClose"),
  3: $t("games.statusMaintenance"),
  4: $t("games.statusHidden")
};

// 狀態顯示顏色（el-tag type）
const statusTagType: Record<number, "success" | "danger" | "warning" | "info"> =
  {
    1: "success",
    2: "danger",
    3: "warning",
    4: "info"
  };

export function useLmGameAgency() {
  const searchForm = reactive({
    name: "",
    gameTypeID: "",
    status: 0
  });
  const dataList = ref<LuckmoneyGameAgencyItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 遊戲類型下拉（搜尋用）
  const gameTypeOptions = ref<{ label: string; value: string | number }[]>([]);

  // 狀態下拉（搜尋用，含全部）
  const statusOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.statusOpen"), value: 1 },
    { label: $t("games.statusClose"), value: 2 },
    { label: $t("games.statusMaintenance"), value: 3 },
    { label: $t("games.statusHidden"), value: 4 }
  ];

  // 狀態下拉（編輯用，不含全部）
  const editStatusOptions = [
    { label: $t("games.statusOpen"), value: 1 },
    { label: $t("games.statusClose"), value: 2 },
    { label: $t("games.statusMaintenance"), value: 3 },
    { label: $t("games.statusHidden"), value: 4 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 100 },
    { label: $t("games.agentName"), prop: "name" },
    {
      label: $t("games.subsidiaryManufacturers"),
      prop: "gameGroups",
      cellRenderer: ({ row }) => (
        <span>
          {Array.isArray(row.gameGroups)
            ? row.gameGroups.join(" ")
            : row.gameGroups}
        </span>
      )
    },
    {
      label: $t("games.agentGameType"),
      prop: "gameLists",
      cellRenderer: ({ row }) => (
        <span>
          {Array.isArray(row.gameLists)
            ? row.gameLists.join(" ")
            : row.gameLists}
        </span>
      )
    },
    {
      label: $t("games.status"),
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={statusTagType[row.status] ?? "info"} effect="plain">
          {statusMap[row.status] ?? row.status}
        </el-tag>
      )
    },
    { label: $t("games.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // 過濾空值
      const query: Record<string, any> = {
        name: searchForm.name,
        gameTypeID: searchForm.gameTypeID,
        status: searchForm.status
      };
      Object.keys(query).forEach(key => {
        if (query[key] === undefined || query[key] === "") {
          delete query[key];
        }
      });
      const { data } = await getLuckmoneyGameAgencyList(query);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 0;
    onSearch();
  }

  // 送出更新
  async function submitUpdate(curData: FormItemProps, done: () => void) {
    const { success } = await putLuckmoneyGameAgency({
      id: curData.id,
      status: curData.status
    });
    if (success) {
      message($t("games.operate"), { type: "success" });
      done();
      onSearch();
    }
  }

  function openDialog(row: LuckmoneyGameAgencyItem) {
    addDialog({
      title: $t("games.edit"),
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          gameGroups: row.gameGroups ?? [],
          gameLists: row.gameLists ?? [],
          status: row.status
        }
      },
      width: "960px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // 狀態為關閉時需二次確認（沿用舊邏輯）
          if (Number(curData.status) === 2) {
            ElMessageBox.confirm(
              $t("games.confirmCloseContent"),
              `${$t("games.confirmCloseTitle")} ${curData.name} ${$t("games.statusClose")}`,
              { type: "warning" }
            )
              .then(() => submitUpdate(curData, done))
              .catch(() => {});
          } else {
            submitUpdate(curData, done);
          }
        });
      }
    });
  }

  onMounted(async () => {
    // 載入遊戲類型下拉
    const { data } = await getGameListType();
    const list: GameListTypeItem[] = data?.list ?? [];
    gameTypeOptions.value = list.map(el => ({
      label: el.value,
      value: el.key
    }));
    onSearch();
  });

  return {
    searchForm,
    gameTypeOptions,
    statusOptions,
    editStatusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog
  };
}
