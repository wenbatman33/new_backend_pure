import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getPicsizeList,
  postPicsize,
  putPicsize,
  deletePicsize,
  type PicSizeItem
} from "@/api/systemManage";
import type { ContentItem, FormItemProps } from "./types";

export function usePICSizeMgt() {
  const searchForm = reactive({
    type: 0
  });
  const dataList = ref<PicSizeItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const typeOptions = [
    { label: $t("systemManage.all"), value: 0 },
    { label: $t("systemManage.advertise"), value: 1 },
    { label: $t("systemManage.sitePage"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 120, sortable: true, fixed: "left" },
    {
      label: $t("systemManage.dataSheet"),
      prop: "type",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>
          {row.type === 1
            ? $t("systemManage.advertise")
            : $t("systemManage.sitePage")}
        </span>
      )
    },
    { label: $t("systemManage.categoryName"), prop: "name", width: 150 },
    {
      label: $t("systemManage.content"),
      prop: "content",
      cellRenderer: ({ row }) => (
        <div>
          {(row.content ?? []).map((item: ContentItem, idx: number) => (
            <div key={idx}>
              <span>
                {item.column},{item.size}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      label: $t("systemManage.lastUpdated"),
      prop: "updatedAt",
      width: 170,
      sortable: true
    },
    { label: $t("systemManage.finalExecutor"), prop: "updatedUser" },
    { label: $t("systemManage.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getPicsizeList({
        type: searchForm.type
      });
      if (success) {
        dataList.value = data?.list ?? [];
        pagination.total = data?.total ?? dataList.value.length;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.type = 0;
    onSearch();
  }

  function openDialog(row?: PicSizeItem) {
    const isUpdate = !!row;
    addDialog({
      title: isUpdate ? $t("systemManage.edit") : $t("systemManage.add"),
      props: {
        formInline: {
          isUpdate,
          type: row?.type ?? 1,
          id: row?.id ?? "",
          name: row?.name ?? "",
          // 深拷貝避免直接改到列表資料
          content: row?.content
            ? row.content.map(c => ({ ...c }))
            : [{ column: "", size: 0 }],
          idOptions: []
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
          // 過濾掉沒有填欄位名稱的列
          const content = curData.content.filter(c => c.column);
          let res;
          if (isUpdate) {
            res = await putPicsize({ id: curData.id, content });
          } else {
            res = await postPicsize({
              type: curData.type,
              categoryID: curData.id,
              content
            });
          }
          if (res?.success) {
            message(
              isUpdate ? $t("systemManage.edit") : $t("systemManage.add"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: PicSizeItem) {
    ElMessageBox.confirm($t("systemManage.deleteCheck"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deletePicsize(row.id);
        if (success) {
          message($t("systemManage.delete"), { type: "success" });
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
    typeOptions,
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
