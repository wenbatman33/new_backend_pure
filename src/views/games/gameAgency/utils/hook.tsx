import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag } from "element-plus";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getGameAgencyList,
  putGameAgency,
  getGameListType,
  type GameAgencyItem
} from "@/api/games";
import type { FormItemProps } from "./types";

const statusMap: Record<number, string> = {
  1: $t("games.statusOpen"),
  2: $t("games.statusClose"),
  3: $t("games.statusMaintenance"),
  4: $t("games.statusHidden")
};
const statusTagType: Record<number, string> = {
  1: "success",
  2: "danger",
  3: "warning",
  4: "info"
};

export function useGameAgency() {
  const imagPath = getImagPath();
  const searchForm = reactive({
    name: "",
    gameTypeID: "",
    status: 0
  });
  const dataList = ref<GameAgencyItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  const gameTypeOptions = ref<{ label: string; value: any }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.statusOpen"), value: 1 },
    { label: $t("games.statusClose"), value: 2 },
    { label: $t("games.statusMaintenance"), value: 3 },
    { label: $t("games.statusHidden"), value: 4 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90 },
    { label: $t("games.agentName"), prop: "name" },
    {
      label: $t("games.subsidiaryManufacturers"),
      prop: "gameGroups",
      cellRenderer: ({ row }) => (
        <span>{(row.gameGroups ?? []).join(" ")}</span>
      )
    },
    {
      label: $t("games.agentGameType"),
      prop: "gameLists",
      cellRenderer: ({ row }) => <span>{(row.gameLists ?? []).join(" ")}</span>
    },
    {
      label: $t("games.agencyH5Diagram"),
      prop: "imageH5",
      cellRenderer: ({ row }) =>
        row.imageH5 ? (
          <img src={imagPath + row.imageH5} style="max-height:48px" />
        ) : (
          <span>-</span>
        )
    },
    {
      label: $t("games.agentPCDiagram"),
      prop: "imagePc",
      cellRenderer: ({ row }) =>
        row.imagePc ? (
          <img src={imagPath + row.imagePc} style="max-height:48px" />
        ) : (
          <span>-</span>
        )
    },
    {
      label: $t("games.status"),
      prop: "status",
      cellRenderer: ({ row }) => (
        <ElTag type={statusTagType[row.status] ?? "info"}>
          {statusMap[row.status] ?? row.status}
        </ElTag>
      )
    },
    { label: $t("games.operate"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function fetchGameTypeOptions() {
    const { success, data } = await getGameListType();
    if (success) {
      gameTypeOptions.value = (data?.list ?? []).map((el: any) => ({
        label: el.value,
        value: el.key
      }));
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const query: Record<string, any> = {
        name: searchForm.name,
        gameTypeID: searchForm.gameTypeID,
        status: searchForm.status
      };
      Object.keys(query).forEach(k => {
        if (query[k] === undefined || query[k] === "") delete query[k];
      });
      const { data } = await getGameAgencyList(query);
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

  function openDialog(row: GameAgencyItem) {
    addDialog({
      title: $t("games.edit"),
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          gameGroups: (row.gameGroups ?? []).join(", "),
          gameLists: (row.gameLists ?? []).join(", "),
          status: row.status,
          srcH5: row.imageH5 ? imagPath + row.imageH5 : "",
          srcPc: row.imagePc ? imagPath + row.imagePc : "",
          imageH5: row.imageH5,
          imagePc: row.imagePc
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
          const params = {
            id: curData.id,
            status: curData.status,
            imageH5: curData.imageH5,
            imagePc: curData.imagePc
          };
          const submit = async () => {
            const { success } = await putGameAgency(params);
            if (success) {
              message($t("games.editSuccess"), { type: "success" });
              done();
              onSearch();
            }
          };
          // 狀態關閉時二次確認
          if (Number(curData.status) === 2) {
            ElMessageBox.confirm(
              $t("games.confirmMessageContent"),
              `${$t("games.confirmMessageTilte")} ${curData.name} ${$t(
                "games.statusClose"
              )}`,
              { type: "warning" }
            )
              .then(submit)
              .catch(() => {});
          } else {
            submit();
          }
        });
      }
    });
  }

  onMounted(() => {
    fetchGameTypeOptions();
    onSearch();
  });

  return {
    searchForm,
    gameTypeOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog
  };
}
