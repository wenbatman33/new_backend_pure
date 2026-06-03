import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getNewsList,
  getNewsDetail,
  postNews,
  putNews,
  deleteNews,
  type NewsItem
} from "@/api/activity";
import type { FormItemProps } from "./types";

export function useNews() {
  const searchForm = reactive({
    title: "",
    category: 0,
    status: "",
    hot: "",
    top: "",
    betSetting: "",
    startTime: "",
    endTime: ""
  });
  // 上架/下架時間區間
  const dateRange = ref<[Date, Date] | []>([]);

  const dataList = ref<NewsItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const categoryOptions = [
    { label: $t("activity.category1"), value: 1 },
    { label: $t("activity.category2"), value: 2 }
  ];
  const statusOptions = [
    { label: $t("activity.hidden"), value: 0 },
    { label: $t("activity.show"), value: 1 }
  ];
  const trueOrFalseOptions = [
    { label: $t("activity.yes"), value: true },
    { label: $t("activity.no"), value: false }
  ];

  const findLabel = (opts: { label: string; value: any }[], val: any) =>
    opts.find(o => o.value === val)?.label ?? val;

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90 },
    { label: $t("activity.title"), prop: "title", minWidth: 160 },
    {
      label: $t("activity.category"),
      prop: "category",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{findLabel(categoryOptions, row.category)}</span>
      )
    },
    {
      label: $t("activity.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{findLabel(statusOptions, row.status)}</span>
      )
    },
    { label: $t("activity.releaseDate"), prop: "startTime", width: 160 },
    { label: $t("activity.expirationDate"), prop: "endTime", width: 160 },
    {
      label: $t("activity.hot"),
      prop: "hot",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>{findLabel(trueOrFalseOptions, row.hot)}</span>
      )
    },
    {
      label: $t("activity.top"),
      prop: "top",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>{findLabel(trueOrFalseOptions, row.top)}</span>
      )
    },
    {
      label: $t("activity.betSetting"),
      prop: "betSetting",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{findLabel(trueOrFalseOptions, row.betSetting)}</span>
      )
    },
    { label: $t("activity.updatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("activity.updatedUser"), prop: "updatedUser", width: 110 },
    { label: $t("activity.action"), fixed: "right", width: 200, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    // 同步日期區間到查詢條件
    searchForm.startTime = dateRange.value?.[0]
      ? String(dateRange.value[0])
      : "";
    searchForm.endTime = dateRange.value?.[1]
      ? String(dateRange.value[1])
      : "";
    try {
      const params: Record<string, any> = {
        title: searchForm.title,
        category: searchForm.category,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime
      };
      // 舊碼：status 以布林傳給後端；非空才帶
      if (searchForm.status !== "") params.status = searchForm.status === 1;
      if (searchForm.hot !== "") params.hot = searchForm.hot;
      if (searchForm.top !== "") params.top = searchForm.top;
      if (searchForm.betSetting !== "") params.betSetting = searchForm.betSetting;

      const { data } = await getNewsList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dateRange.value = [];
    searchForm.category = 0;
    onSearch();
  }

  function openDialog(mode: "create" | "edit" | "review", row?: NewsItem) {
    const isView = mode === "review";
    const titleMap = {
      create: $t("activity.add"),
      edit: $t("activity.edit"),
      review: $t("activity.review")
    };

    const baseInline: FormItemProps = {
      id: row?.id,
      title: row?.title ?? "",
      startTime: row?.startTime ?? "",
      endTime: row?.endTime ?? "",
      category: row?.category ?? 1,
      status: typeof row?.status === "boolean" ? (row.status ? 1 : 0) : row?.status ?? 1,
      hot: row?.hot ?? false,
      top: row?.top ?? false,
      betSetting: row?.betSetting ?? false,
      eventId: row?.eventId ?? 0,
      image: row?.image ?? "",
      context: row?.context ?? "",
      isView
    };

    addDialog({
      title: titleMap[mode],
      props: { formInline: baseInline },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: isView,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // status 以布林送後端（沿用舊邏輯）
          const payload: Record<string, any> = {
            title: curData.title,
            startTime: curData.startTime,
            endTime: curData.endTime,
            category: curData.category,
            status: curData.status === 1,
            hot: curData.hot,
            top: curData.top,
            betSetting: curData.betSetting,
            eventId: curData.betSetting ? curData.eventId : 0,
            image: curData.image,
            context: curData.context
          };
          let res;
          if (mode === "edit" && curData.id) {
            res = await putNews({ id: curData.id, ...payload });
          } else {
            res = await postNews(payload);
          }
          if (res?.success) {
            message($t("activity.actionSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 查看/編輯前先抓詳情 */
  async function handleOpen(mode: "create" | "edit" | "review", row?: NewsItem) {
    if (mode === "create") {
      openDialog(mode);
      return;
    }
    const { data } = await getNewsDetail(row!.id);
    openDialog(mode, data ?? row);
  }

  function handleDelete(row: NewsItem) {
    ElMessageBox.confirm($t("activity.deleteMessage"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteNews(row.id);
        if (success) {
          message($t("activity.actionSuccess"), { type: "success" });
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
    dateRange,
    categoryOptions,
    statusOptions,
    trueOrFalseOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleOpen,
    handleDelete
  };
}
