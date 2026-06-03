import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import memberForm from "../member.vue";
import {
  getInboxList,
  addLetter,
  editLetter,
  cancelLetter,
  getLetterMember,
  type InboxListItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 類型對應：1 系統 / 2 人工
const typeMap: Record<number, string> = {
  1: $t("operator.system"),
  2: $t("operator.manual")
};

// 狀態對應：1 待發送 / 3 已發送 / 4 失敗 / 5 已回收
const statusMap: Record<number, string> = {
  1: $t("operator.toBeSent"),
  3: $t("operator.hadSent"),
  4: $t("operator.fail"),
  5: $t("operator.recycle")
};

export function useInboxList() {
  const searchForm = reactive({
    memberAccount: "",
    sendAtStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    sendAtEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    dateRange: [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ] as [string, string],
    status: 0,
    type: ""
  });
  const dataList = ref<InboxListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("operator.all"), value: 0 },
    { label: $t("operator.toBeSent"), value: 1 },
    { label: $t("operator.hadSent"), value: 3 },
    { label: $t("operator.fail"), value: 4 },
    { label: $t("operator.recycle"), value: 5 }
  ];

  const typeOptions = [
    { label: $t("operator.all"), value: "" },
    { label: $t("operator.system"), value: 1 },
    { label: $t("operator.manual"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "letterSettingId", width: 80 },
    {
      label: $t("operator.type"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    {
      label: $t("operator.title"),
      prop: "title",
      minWidth: 200,
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => openDialog("read", row)}>
          {row.title}
        </el-link>
      )
    },
    { label: $t("operator.titlePh"), prop: "titlePh", minWidth: 200 },
    {
      label: $t("operator.content"),
      prop: "content",
      minWidth: 300,
      cellRenderer: ({ row }) => (
        <span>{(row.content ?? "").replace(/<\/?[^>]+>/gi, " ")}</span>
      )
    },
    {
      label: $t("operator.object"),
      prop: "memberCount",
      width: 90,
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => openMemberDialog(row)}>
          {row.memberCount}
        </el-link>
      )
    },
    {
      label: $t("operator.status"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => <span>{statusMap[row.status] ?? row.status}</span>
    },
    {
      label: $t("operator.sendTime"),
      prop: "sendAt",
      width: 150,
      cellRenderer: ({ row }) =>
        <span>{row.sendAt ? dayjs(row.sendAt).format("YYYY-MM-DD HH:mm") : ""}</span>
    },
    {
      label: $t("operator.lastUpdate"),
      prop: "updatedAt",
      width: 150,
      cellRenderer: ({ row }) =>
        <span>{row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : ""}</span>
    },
    { label: $t("operator.executor"), prop: "updatedUser", width: 120 },
    { label: $t("operator.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  function buildParams() {
    const [start, end] = searchForm.dateRange || [];
    return {
      memberAccount: searchForm.memberAccount,
      sendAtStart: start,
      sendAtEnd: end,
      status: searchForm.status,
      type: searchForm.type,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getInboxList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.dateRange = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    searchForm.status = 0;
    searchForm.type = "";
    onSearch();
  }

  // mode：Create 新增 / Edit 編輯 / read 檢視
  function openDialog(mode = "Create", row?: InboxListItem) {
    const isCreate = mode === "Create";
    const titleMap: Record<string, string> = {
      Create: $t("operator.siteMessageManagementAdd"),
      Edit: $t("operator.siteMessageManagementEdit"),
      read: $t("operator.siteMessageManagementCheck")
    };
    addDialog({
      title: titleMap[mode],
      props: {
        formInline: {
          memberAccounts: [],
          sendTimeType: isCreate ? 1 : 2,
          sendAt: row?.sendAt ?? "",
          title: row?.title ?? "",
          titlePh: row?.titlePh ?? "",
          content: row?.content ?? "",
          mode,
          id: row?.letterSettingId
        }
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: mode === "read",
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // 立即發送：sendAt 設為當下；預約：用表單帶入時間
          const sendAt =
            curData.sendTimeType === 1
              ? dayjs().add(1, "second").format("YYYY-MM-DD HH:mm:ss")
              : dayjs(curData.sendAt).format("YYYY-MM-DD HH:mm:ss");
          if (
            curData.sendTimeType === 2 &&
            dayjs(curData.sendAt).isBefore(dayjs())
          ) {
            message($t("operator.reserveTimeCantLessNow"), { type: "error" });
            return;
          }
          const payload = {
            memberAccounts: curData.memberAccounts,
            sendTimeType: curData.sendTimeType,
            sendAt,
            title: curData.title,
            titlePh: curData.titlePh,
            content: curData.content
          };
          const { success } = isCreate
            ? await addLetter(payload)
            : await editLetter({ ...payload, id: curData.id });
          if (success) {
            message(
              isCreate
                ? $t("operator.siteMessageAddSuccess")
                : $t("operator.siteMessageEditSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 收件名單彈窗
  const memberFormRef = ref();
  function openMemberDialog(row: InboxListItem) {
    addDialog({
      title: `${row.title}${$t("operator.sendList")}`,
      props: { letterSettingId: row.letterSettingId },
      width: "600px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(memberForm, { ref: memberFormRef })
    });
  }

  // 回收站內信
  async function handleRecycle(row: InboxListItem) {
    const { success } = await cancelLetter({
      letterSettingId: row.letterSettingId
    });
    if (success) {
      message($t("operator.recycleSuccess"), { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    typeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleRecycle,
    getLetterMember
  };
}
