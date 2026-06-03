import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getPromotionTypeList,
  postPromotionTypeCreate,
  putPromotionTypeEdit,
  deletePromotionTypeDelete,
  type PromotionTypeItem
} from "@/api/promotion";
import type { FormItemProps } from "./types";

export function useDiscountCategoryList() {
  const dataList = ref<PromotionTypeItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("promotion.categoryId"), prop: "promotionTypeID", width: 120 },
    { label: $t("promotion.locale"), prop: "locale", width: 120 },
    { label: $t("promotion.typeName"), prop: "typeName", minWidth: 200 },
    {
      label: $t("promotion.sort"),
      prop: "sort",
      width: 100,
      sortable: true
    },
    { label: $t("promotion.lastUpdate"), prop: "updatedAt", width: 180 },
    { label: $t("promotion.updatedUser"), prop: "updatedUser", minWidth: 120 },
    {
      label: $t("promotion.operate"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPromotionTypeList();
      const list = data?.list ?? [];
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  function openDialog(status: "add" | "edit" = "add", row?: PromotionTypeItem) {
    const title =
      status === "add" ? $t("promotion.addGroup") : $t("promotion.editGroup");
    addDialog({
      title,
      props: {
        status,
        formInline: {
          id: row?.id,
          promotionTypeID: row?.promotionTypeID ?? "",
          locale: row?.locale ?? "",
          typeName: row?.typeName ?? "",
          sort: row?.sort ?? 0
        }
      },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (status === "add") {
            const { success } = await postPromotionTypeCreate({
              promotionTypeID: curData.promotionTypeID,
              locale: curData.locale,
              typeName: curData.typeName,
              sort: curData.sort
            });
            if (success) {
              message($t("promotion.addSuccess"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await putPromotionTypeEdit({
              id: curData.id,
              promotionTypeID: curData.promotionTypeID,
              locale: curData.locale,
              typeName: curData.typeName,
              sort: curData.sort
            });
            if (success) {
              message($t("promotion.editSuccess"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  function handleDelete(row: PromotionTypeItem) {
    ElMessageBox.confirm($t("promotion.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deletePromotionTypeDelete(row.id);
        if (success) {
          message($t("promotion.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
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
    resetForm,
    openDialog,
    handleDelete
  };
}
