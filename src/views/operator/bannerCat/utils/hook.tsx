import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getBannerCategory,
  postBannerCategory,
  putBannerCategory,
  type BannerCategoryItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

export function useBannerCat() {
  const dataList = ref<BannerCategoryItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90, sortable: true },
    { label: $t("operator.categoryName"), prop: "name", minWidth: 160 },
    { label: $t("operator.description"), prop: "description", minWidth: 200 },
    {
      label: $t("operator.showOrHidden"),
      prop: "hidden",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{row.hidden ? $t("operator.hidden") : $t("operator.show")}</span>
      )
    },
    { label: $t("operator.executorName"), prop: "editorName", width: 140 },
    {
      label: $t("operator.lastUpdate"),
      prop: "updatedAt",
      width: 180,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>
          {row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : ""}
        </span>
      )
    },
    { label: $t("operator.operate"), fixed: "right", width: 220, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getBannerCategory({
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.count ?? data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function openDialog(title = "add", row?: BannerCategoryItem) {
    addDialog({
      title:
        title === "add"
          ? $t("operator.addAdClassification")
          : $t("operator.editAdClassification"),
      props: {
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          description: row?.description ?? "",
          hidden: row?.hidden ?? false
        }
      },
      width: "500px",
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
            description: curData.description,
            hidden: curData.hidden
          };
          const { success } =
            title === "add"
              ? await postBannerCategory(payload)
              : await putBannerCategory({ ...payload, id: curData.id });
          if (success) {
            message(
              title === "add"
                ? $t("operator.addAdCategorySuccess")
                : $t("operator.editAdCategorySuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 顯示／隱藏切換 */
  async function handleToggleHidden(row: BannerCategoryItem) {
    const { success } = await putBannerCategory({
      id: row.id,
      name: row.name,
      description: row.description,
      hidden: !row.hidden
    });
    if (success) {
      message($t("operator.editAdCategorySuccess"), { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    openDialog,
    handleToggleHidden
  };
}
