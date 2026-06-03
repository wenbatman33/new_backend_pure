import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { countryCheck, checkWhichCountry } from "@/utils/country";
import editForm from "../form.vue";
import {
  getInboxSetting,
  addInboxSetting,
  editInboxSetting,
  cancelLetter,
  type InboxSettingItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 去除 HTML 標籤，純文字呈現於表格
function stripHtml(text?: string) {
  return text ? text.replace(/<\/?[^>]+>/gi, " ") : text;
}

export function useSystemLetter() {
  const dataList = ref<InboxSettingItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 非 CN 站點才顯示當地語系欄位
  const showPh = !countryCheck("CN");
  const countrySuffix = checkWhichCountry();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("operator.title"), prop: "title", width: 200 },
    {
      label: `${$t("operator.title")}${countrySuffix}`,
      prop: "titlePh",
      width: 200,
      hide: !showPh
    },
    {
      label: $t("operator.content"),
      prop: "content",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => <span>{stripHtml(row.content)}</span>
    },
    {
      label: `${$t("operator.content")}${countrySuffix}`,
      prop: "contentPh",
      showOverflowTooltip: true,
      hide: !showPh,
      cellRenderer: ({ row }) => <span>{stripHtml(row.contentPh)}</span>
    },
    { label: $t("operator.startTime"), prop: "startTime", width: 180 },
    { label: $t("operator.endTime"), prop: "endTime", width: 180 },
    { label: $t("operator.lastUpdate"), prop: "updatedAt", width: 180 },
    { label: $t("operator.finalExecutor"), prop: "updatedUser", width: 120 },
    { label: $t("operator.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getInboxSetting();
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function openDialog(row?: InboxSettingItem) {
    const isEdit = !!row?.id;
    addDialog({
      title: `${isEdit ? $t("operator.edit") : $t("operator.add")}${$t("operator.systemLetter")}`,
      props: {
        formInline: {
          id: row?.id ?? 0,
          startTime: row?.startTime ?? "",
          endTime: row?.endTime ?? "",
          title: row?.title ?? "",
          titlePh: row?.titlePh ?? "",
          content: row?.content ?? "",
          contentPh: row?.contentPh ?? ""
        }
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = { ...curData };
          const { success } = curData.id
            ? await editInboxSetting(payload)
            : await addInboxSetting(payload);
          if (success) {
            message($t("operator.siteMessageEditSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleCancel(row: InboxSettingItem) {
    const { success } = await cancelLetter({ letterSettingId: row.id });
    if (success) {
      message($t("operator.recycleSuccess"), { type: "success" });
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
    handleCancel
  };
}
