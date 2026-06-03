import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getEmailVendor,
  putEmailVendor,
  enableEmailVendor,
  type EmailVendorItem
} from "@/api/systemManage";
import type { FormItemProps } from "./types";

export function useEmailVendor() {
  const dataList = ref<EmailVendorItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("systemManage.name"), prop: "name" },
    { label: $t("systemManage.domain"), prop: "domain" },
    { label: $t("systemManage.key"), prop: "key", showOverflowTooltip: true },
    { label: $t("systemManage.from"), prop: "from" },
    { label: $t("systemManage.subject"), prop: "subject" },
    {
      label: $t("systemManage.templet"),
      prop: "templet",
      showOverflowTooltip: true
    },
    {
      label: $t("systemManage.operate"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getEmailVendor();
      dataList.value = data?.list ?? [];
      pagination.total = dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  /** 啟用廠商 */
  async function handleActive(row: EmailVendorItem) {
    const { success } = await enableEmailVendor({ id: row.id });
    if (success) {
      message($t("systemManage.enable"), { type: "success" });
      onSearch();
    }
  }

  /** 編輯廠商 */
  function openDialog(row: EmailVendorItem) {
    addDialog({
      title: $t("systemManage.edit"),
      props: {
        formInline: {
          id: row.id,
          name: row.name ?? "",
          domain: row.domain ?? "",
          key: row.key ?? "",
          from: row.from ?? "",
          subject: row.subject ?? "",
          templet: row.templet ?? ""
        }
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
          const { success } = await putEmailVendor({
            id: curData.id,
            name: curData.name,
            domain: curData.domain,
            key: curData.key,
            from: curData.from,
            subject: curData.subject,
            templet: curData.templet
          });
          if (success) {
            message($t("systemManage.edit"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
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
    handleActive
  };
}
