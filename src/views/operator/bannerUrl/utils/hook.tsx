import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag } from "element-plus";
import { findByValue } from "@/utils/options";
import editForm from "../form.vue";
import {
  getBannerUrlList,
  getBannerUrlByID,
  createBannerUrl,
  putBannerUrl,
  deleteBannerUrl,
  type BannerUrlItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

export function useBannerUrl() {
  const searchForm = reactive({
    keyword: "",
    name: "",
    status: ""
  });
  const dataList = ref<BannerUrlItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 推薦類型下拉：原 Vben 走 @/utils/dropdown 的 gameOptions().recommendType
  // dropdown 尚未移植，先以空陣列佔位（mock 端會回填，可由後端 dropdown 補上）
  // TODO: 待 @/utils/dropdown 移植後改為 gameOptions().recommendType
  const recommendTypeOptions = ref<Array<{ label: string; value: number }>>([]);

  const statusOptions = [
    { label: $t("operator.enable"), value: 1 },
    { label: $t("operator.disable"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "ID", width: 70 },
    { label: $t("operator.name"), prop: "name", minWidth: 120 },
    {
      label: $t("operator.keyword"),
      prop: "keyword",
      minWidth: 200,
      cellRenderer: ({ row }) => (
        <span>
          {(row.keyword ?? []).map((item: string) =>
            h(ElTag, { type: "primary", style: { margin: "2px" } }, () => item)
          )}
        </span>
      )
    },
    {
      label: $t("operator.recommendTypeSort"),
      prop: "recommendTypeSort",
      minWidth: 180,
      cellRenderer: ({ row }) => (
        <span>
          {(row.recommendTypeSort ?? []).map((item: number) =>
            h(ElTag, { type: "danger", style: { margin: "2px" } }, () =>
              findByValue(recommendTypeOptions.value, item)
            )
          )}
        </span>
      )
    },
    {
      label: $t("operator.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{findByValue(statusOptions, row.status)}</span>
      )
    },
    { label: $t("operator.lastUpdate"), prop: "updatedAt", minWidth: 150 },
    { label: $t("operator.executorName"), prop: "editor", width: 120 },
    {
      label: $t("operator.action"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getBannerUrlList({
        keyword: searchForm.keyword,
        name: searchForm.name,
        status: searchForm.status
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

  async function openDialog(row?: BannerUrlItem) {
    let formInline: FormItemProps = {
      name: "",
      status: 1,
      keyword: [],
      recommendTypeSort: []
    };
    const isEdit = row?.ID != null;
    if (isEdit) {
      const { data } = await getBannerUrlByID(row.ID);
      const record = data ?? row;
      formInline = {
        ID: record.ID,
        name: record.name,
        status: record.status,
        keyword: record.keyword ?? [],
        recommendTypeSort: record.recommendTypeSort ?? []
      };
    }

    addDialog({
      title: isEdit ? $t("operator.edit") : $t("operator.add"),
      props: {
        formInline,
        recommendTypeOptions: recommendTypeOptions.value
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            name: curData.name,
            status: curData.status,
            keyword: curData.keyword,
            recommendTypeSort: (curData.recommendTypeSort ?? []).filter(
              (el: number) => el != null
            )
          };
          const { success } = isEdit
            ? await putBannerUrl({ id: curData.ID, ...payload })
            : await createBannerUrl(payload);
          if (success) {
            message($t("operator.saveSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: BannerUrlItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteBannerUrl(row.ID);
        if (success) {
          message($t("operator.deleteSuccess"), { type: "success" });
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
    recommendTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete
  };
}
