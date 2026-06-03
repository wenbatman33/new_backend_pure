import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import domainTable from "../domainTable.vue";
import {
  getEventTracking,
  postEventTracking,
  putEventTracking,
  deleteEventTracking,
  getDomainGetEventTrackingUrlList,
  type EventTrackingItem
} from "@/api/operator";
import type { PointFormItemProps } from "./types";

export function useBurialPointSettings() {
  const dataList = ref<EventTrackingItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  const domainTableRef = ref();
  // 埋点表单的网址多选选项
  const urlOptions = ref<{ label: string; value: string }[]>([]);

  const columns: TableColumnList = [
    { label: $t("operator.serialNumber"), prop: "id", width: 80 },
    { label: $t("operator.name"), prop: "name", width: 120 },
    {
      label: $t("operator.link"),
      prop: "url",
      cellRenderer: ({ row }) => (
        <div>
          {(Array.isArray(row.url) ? row.url : []).map((item: string) => (
            <div>{item}</div>
          ))}
        </div>
      )
    },
    { label: $t("operator.code"), prop: "eventCode" },
    {
      label: $t("operator.supportEvent"),
      prop: "event",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{row.event === 1 ? $t("operator.yes") : $t("operator.no")}</span>
      )
    },
    { label: $t("operator.lastUpdate"), prop: "updatedAt", width: 200 },
    {
      label: $t("operator.operate"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  async function loadUrlOptions() {
    const { data } = await getDomainGetEventTrackingUrlList();
    const list = data?.eventTrackingUrlList ?? [];
    urlOptions.value = list.map((item: string) => ({
      label: item,
      value: item
    }));
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getEventTracking();
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 新增/编辑埋点
  function openDialog(mode: "add" | "edit", row?: EventTrackingItem) {
    const isAdd = mode === "add";
    addDialog({
      title: isAdd ? $t("operator.add") : $t("operator.edit"),
      props: {
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          eventType: row?.eventType ?? "",
          eventCode: row?.eventCode ?? "",
          event: row?.event ?? 1,
          url: Array.isArray(row?.url) ? row.url : []
        },
        urlOptions: urlOptions.value
      },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as PointFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            name: curData.name,
            eventType: curData.eventType,
            eventCode: curData.eventCode,
            event: curData.event,
            url: curData.url
          };
          const { success } = isAdd
            ? await postEventTracking(payload)
            : await putEventTracking({ ...payload, id: curData.id });
          if (success) {
            message($t("operator.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 域名设置（弹窗内嵌网域管理表格）
  function openDomainSetting() {
    addDialog({
      title: $t("operator.domainSetting"),
      width: "800px",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(domainTable, { ref: domainTableRef })
    });
  }

  function handleDelete(row: EventTrackingItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteEventTracking(row.id);
        if (success) {
          message($t("operator.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    loadUrlOptions();
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openDialog,
    openDomainSetting,
    handleDelete
  };
}
