import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import keywordForm from "../keywordForm.vue";
import {
  getCompetitionList,
  addCompetitionLeague,
  editCompetitionLeague,
  deleteCompetitionLeague
} from "@/api/promotion";
import type { FormItemProps } from "./types";

export function useCompetitionList() {
  const searchForm = reactive({
    keyword: "",
    name: "",
    status: 0
  });
  const dataList = ref([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("promotion.all"), value: 0 },
    { label: $t("promotion.enable"), value: 1 },
    { label: $t("promotion.disable"), value: 2 }
  ];

  const statusRenderer = (val: number) =>
    val === 1
      ? h("span", { style: "color:#00BB00" }, $t("promotion.enable"))
      : h("span", { style: "color:#F00" }, $t("promotion.disable"));

  const columns: TableColumnList = [
    { label: $t("promotion.leagueID"), prop: "ID", width: 100 },
    { label: $t("promotion.leagueName"), prop: "name", width: 130 },
    {
      label: $t("promotion.manufacturerAndLeagueKeySettings"),
      prop: "keyword"
    },
    {
      label: $t("promotion.leagueReportCalc"),
      prop: "leagueReportCalc",
      width: 130,
      cellRenderer: ({ row }) => statusRenderer(row.leagueReportCalc)
    },
    {
      label: $t("promotion.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => statusRenderer(row.status)
    },
    {
      label: $t("promotion.lastUpdate"),
      prop: "updatedAt",
      width: 160,
      sortable: true
    },
    { label: $t("promotion.updatedUser"), prop: "updatedUser", width: 120 },
    {
      label: $t("promotion.action"),
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  function removeEmpty(obj: Record<string, any>) {
    const query: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== "") {
        query[key] = String(obj[key]);
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getCompetitionList(removeEmpty(searchForm));
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

  /** 新增 / 編輯聯賽 */
  function openDialog(row?: FormItemProps) {
    const isEdit = !!row;
    addDialog({
      title: `${isEdit ? $t("promotion.edit") : $t("promotion.add")}${$t("promotion.league")}`,
      props: {
        formInline: {
          ID: row?.ID ?? 0,
          name: row?.name ?? "",
          status: row?.status ?? 1,
          leagueReportCalc: row?.leagueReportCalc ?? 1
        }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const fn = isEdit ? editCompetitionLeague : addCompetitionLeague;
          const { success } = await fn(curData);
          if (success) {
            message(
              `${isEdit ? $t("promotion.edit") : $t("promotion.add")}${$t("promotion.leagueSuccess")}`,
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 編輯廠商與聯賽關鍵字設定 */
  function openKeywordDialog(row: FormItemProps) {
    addDialog({
      title: $t("promotion.editVendorAndLeagueKeywordSettings"),
      props: {
        leagueID: row.ID,
        formInline: {
          gameTypeID: "",
          gameGroupID: "",
          keyword: "",
          exclude: ""
        }
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(keywordForm)
    });
  }

  function handleDelete(row: FormItemProps) {
    ElMessageBox.confirm($t("promotion.confirmDeleteEvent"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteCompetitionLeague(row.ID);
        if (success) {
          message($t("promotion.deleteEvent"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    openKeywordDialog,
    handleDelete
  };
}
