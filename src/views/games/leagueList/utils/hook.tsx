import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getGameLeagueList,
  editGameLeague,
  type GameLeagueItem
} from "@/api/games";
import type { FormItemProps } from "./types";

// logo 載入失敗時的佔位圖（透明小圖）
const errorImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export function useGameLeagueList() {
  const imagePath = getImagPath();
  const searchForm = reactive({
    leagueID: "",
    leagueName: ""
  });
  const dataList = ref<GameLeagueItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("games.leagueID"), prop: "leagueID", width: 120 },
    { label: $t("games.leagueName"), prop: "leagueName", minWidth: 140 },
    { label: $t("games.type"), prop: "sportName", minWidth: 120 },
    {
      label: `logo${$t("games.image")}`,
      prop: "logoImage",
      width: 140,
      cellRenderer: ({ row }) =>
        row.leagueLogo ? (
          <el-image
            style="width: 80px; height: 80px; border-radius: 4px"
            src={imagePath + row.leagueLogo}
            fit="contain"
            preview-teleported={true}
            preview-src-list={[imagePath + row.leagueLogo]}
          >
            {{ error: () => <img src={errorImg} style="width:80px" /> }}
          </el-image>
        ) : (
          <span>--</span>
        )
    },
    { label: $t("games.lastUpdate"), prop: "updatedAt", minWidth: 160 },
    { label: $t("games.executor"), prop: "updateUser", width: 120 },
    { label: $t("games.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameLeagueList({
        leagueID: searchForm.leagueID,
        leagueName: searchForm.leagueName,
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
    pagination.currentPage = 1;
    onSearch();
  }

  // 編輯 logo
  function openDialog(row: GameLeagueItem) {
    addDialog({
      title: `${$t("games.edit")}logo`,
      props: {
        formInline: {
          id: row.id,
          leagueID: row.leagueID,
          leagueName: row.leagueName,
          sportName: row.sportName,
          logoImage: row.leagueLogo ?? ""
        }
      },
      width: "420px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await editGameLeague({
            id: curData.id,
            logoImage: curData.logoImage
          });
          if (success) {
            message(`${$t("games.edit")}logo${$t("games.success")}`, {
              type: "success"
            });
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
    onSearch,
    resetForm,
    openDialog
  };
}
