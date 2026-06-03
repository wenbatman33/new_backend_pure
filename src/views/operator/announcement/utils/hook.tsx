import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getAnnouncementList,
  createAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
  type AnnouncementItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 可選語系清單（舊版讀 import.meta.env.VITE_GLOB_APP_lang，pure 專案無此 env，先固定常見語系並確保 en 置頂）
const LANGUAGE_LIST = (() => {
  const list = ["en", "zh-CN"];
  if (!list.includes("en")) list.unshift("en");
  return list;
})();

export function useAnnouncement() {
  const searchForm = reactive({
    title: "",
    hidden: "",
    startStatus: 0
  });
  const dataList = ref<AnnouncementItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const hiddenOptions = [
    { label: $t("operator.all"), value: "" },
    { label: $t("operator.hidden"), value: "true" },
    { label: $t("operator.show"), value: "false" }
  ];

  const startStatusOptions = [
    { label: $t("operator.all"), value: 0 },
    { label: $t("operator.notStarted"), value: 1 },
    { label: $t("operator.inProgress"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("operator.sort"), prop: "sort", width: 90 },
    { label: "ID", prop: "id", width: 90 },
    { label: $t("operator.title"), prop: "title" },
    {
      label: $t("operator.hiddenYesOrNo"),
      prop: "hidden",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{row.hidden ? $t("operator.hidden") : $t("operator.show")}</span>
      )
    },
    {
      label: $t("operator.pinToTop"),
      prop: "top",
      width: 90,
      cellRenderer: ({ row }) => <span>{row.top ? "Y" : ""}</span>
    },
    {
      label: $t("operator.content"),
      prop: "content",
      cellRenderer: ({ row }) => (
        <span>{(row.content || "").replace(/<\/?[^>]+>/gi, " ")}</span>
      )
    },
    {
      label: $t("operator.addedTime"),
      prop: "start",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>{row.start ? dayjs(row.start).format("YYYY-MM-DD HH:mm") : ""}</span>
      )
    },
    {
      label: $t("operator.lastUpdate"),
      prop: "updatedAt",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>
          {row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : ""}
        </span>
      )
    },
    { label: $t("operator.executorName"), prop: "editorName", width: 120 },
    { label: $t("operator.operate"), fixed: "right", width: 200, slot: "operation" }
  ];

  // 攤平多語系：優先取 en，否則取第一筆，把 title/content/showLanguage 提到列上
  function flatten(list: AnnouncementItem[]) {
    list.forEach(item => {
      const multiple = item.announcementMultiple || [];
      const correct = multiple.find(m => m.language === "en") || multiple[0];
      if (correct) {
        item.content = correct.context;
        item.title = correct.title;
        item.showLanguage = correct.language;
      }
    });
    return list;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        title: searchForm.title,
        startStatus: searchForm.startStatus,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      };
      // hidden 空字串表示全部，不送
      if (searchForm.hidden !== "") {
        params.hidden = searchForm.hidden === "true";
      }
      const { data } = await getAnnouncementList(params);
      dataList.value = flatten(data?.list ?? []);
      pagination.total = data?.count ?? data?.total ?? 0;
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

  // 切換顯示/隱藏
  async function handleToggleHidden(row: AnnouncementItem) {
    const payload = {
      id: row.id,
      sort: row.sort,
      hidden: !row.hidden,
      top: row.top,
      start: row.start,
      announcementMultiple: row.announcementMultiple
        ? [row.announcementMultiple[0]]
        : []
    };
    const { success } = await putAnnouncement(payload);
    if (success) {
      message($t("operator.editAnnouncementSuccess"), { type: "success" });
      onSearch();
    }
  }

  function openDialog(mode: "Create" | "Edit", row?: AnnouncementItem) {
    const isEdit = mode === "Edit";
    const formInline: FormItemProps = {
      id: isEdit ? row?.id : undefined,
      sort: isEdit ? (row?.sort ?? 999) : 999,
      hidden: isEdit ? !!row?.hidden : false,
      top: isEdit ? !!row?.top : false,
      start: isEdit
        ? row?.start || ""
        : dayjs().format("YYYY/MM/DD HH:mm:ss"),
      language: isEdit ? row?.showLanguage || "en" : "en",
      title: isEdit ? row?.title || "" : "",
      context: isEdit ? row?.content || "" : ""
    };

    addDialog({
      title: isEdit
        ? $t("operator.editAnnouncement")
        : $t("operator.addAnnouncement"),
      props: {
        formInline,
        mode,
        announcementMultiple: row?.announcementMultiple ?? [],
        languageList: LANGUAGE_LIST
      },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as any).formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload: any = {
            sort: curData.sort,
            hidden: curData.hidden,
            top: curData.top,
            start: curData.start,
            announcementMultiple: [
              {
                language: curData.language,
                title: curData.title,
                context: curData.context
              }
            ]
          };
          let res;
          if (isEdit) {
            payload.id = curData.id;
            res = await putAnnouncement(payload);
          } else {
            res = await createAnnouncement(payload);
          }
          if (res?.success) {
            message(
              isEdit
                ? $t("operator.editAnnouncementSuccess")
                : $t("operator.addAnnouncementSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: AnnouncementItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteAnnouncement(row.id);
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
    hiddenOptions,
    startStatusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleToggleHidden,
    handleDelete
  };
}
