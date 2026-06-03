import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getBroadcastList,
  getBroadcastByID,
  addBroadcast,
  editBroadcast,
  deleteBroadcast,
  type BroadcastItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

/** 顯示方式 */
export const displayTypeOptions = [
  { label: $t("operator.popUp"), value: 1 },
  { label: "toast", value: 2 },
  { label: $t("operator.siteMessage"), value: 3 },
  { label: $t("operator.image"), value: 4 }
];

/** 廣播方式 */
export const startTypeOptions = [
  { label: $t("operator.immediately"), value: 1 },
  { label: $t("operator.reserve"), value: 2 }
];

export function useWebsocket() {
  const searchForm = reactive({
    title: "",
    startType: 0,
    sendStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    sendEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  });
  const dateRange = ref<[string, string] | []>([
    searchForm.sendStart,
    searchForm.sendEnd
  ]);
  const dataList = ref<BroadcastItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function displayTypeText(val: number) {
    return displayTypeOptions.find(o => o.value === val)?.label ?? "";
  }
  function startTypeText(val: number) {
    return startTypeOptions.find(o => o.value === Number(val))?.label ?? "";
  }

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("operator.title"), prop: "title", minWidth: 180 },
    {
      label: $t("operator.bootPosition"),
      prop: "deeplinkType",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span>{row.deeplinkLink ? `${row.deeplinkType}:${row.deeplinkLink}` : row.deeplinkType}</span>
      )
    },
    {
      label: $t("operator.showMethod"),
      prop: "displayType",
      width: 110,
      cellRenderer: ({ row }) => <span>{displayTypeText(row.displayType)}</span>
    },
    {
      label: $t("operator.broadcastMethod"),
      prop: "startType",
      width: 110,
      cellRenderer: ({ row }) => <span>{startTypeText(row.startType)}</span>
    },
    {
      label: `${$t("operator.duration")}m`,
      prop: "time",
      width: 100
    },
    { label: $t("operator.sendTime"), prop: "sendTime", width: 160 },
    { label: $t("operator.lastUpdate"), prop: "updatedAt", width: 160 },
    { label: $t("operator.executor"), prop: "updatedUser", minWidth: 140 },
    {
      label: $t("operator.operate"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getBroadcastList({
        title: searchForm.title,
        startType: searchForm.startType,
        sendStart: searchForm.sendStart,
        sendEnd: searchForm.sendEnd,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function onDateChange(val: [string, string] | null) {
    if (val && val.length === 2) {
      searchForm.sendStart = val[0];
      searchForm.sendEnd = val[1];
    } else {
      searchForm.sendStart = "";
      searchForm.sendEnd = "";
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.title = "";
    searchForm.startType = 0;
    searchForm.sendStart = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    searchForm.sendEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    dateRange.value = [searchForm.sendStart, searchForm.sendEnd];
    pagination.currentPage = 1;
    onSearch();
  }

  function defaultFormInline(): FormItemProps {
    return {
      memberType: "1",
      memberAccounts: [],
      startType: "1",
      startTime: "",
      time: 5,
      title: "",
      deeplinkType: 0,
      deeplinkLink: "",
      displayType: 1,
      imageWeb: "",
      imageH5: ""
    };
  }

  function openDialog(title = $t("operator.add"), row?: BroadcastItem) {
    addDialog({
      title: `${title}${$t("operator.broadcast")}`,
      props: {
        formInline: row
          ? {
              ...defaultFormInline(),
              ...row,
              memberType: String((row as any).memberType ?? 0) // 後端 0/1 -> 表單 1/2 由 form 內處理顯示
            }
          : defaultFormInline()
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // 立即廣播：startTime 設為當下 + 2 秒
          const payload: any = { ...curData };
          payload.memberType = Number(curData.memberType) - 1;
          if (Number(curData.startType) === 1) {
            payload.startTime = dayjs().add(2, "second").format("YYYY-MM-DD HH:mm:ss");
          }
          if (payload.memberType === 0) payload.memberAccounts = [];
          const fn = row?.id
            ? editBroadcast({ ...payload, id: row.id })
            : addBroadcast(payload);
          const { success } = await fn;
          if (success) {
            message(
              row?.id
                ? $t("operator.editBroadcastSuccess")
                : $t("operator.editBroadcastSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          } else {
            message($t("operator.editBroadcastError"), { type: "error" });
          }
        });
      }
    });
  }

  async function openEditDialog(row: BroadcastItem) {
    const { success, data } = await getBroadcastByID(row.id);
    if (success && data) {
      openDialog($t("operator.edit"), data);
    }
  }

  function handleDelete(row: BroadcastItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteBroadcast(row.id);
        if (success) {
          message($t("operator.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  function onSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  function onCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    startTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onDateChange,
    resetForm,
    openDialog,
    openEditDialog,
    handleDelete,
    onSizeChange,
    onCurrentChange
  };
}
