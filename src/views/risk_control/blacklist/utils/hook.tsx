import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getBlackList,
  addBlackList,
  updateBlackList,
  deleteBlackList,
  type BlackListItem
} from "@/api/risk_control";
import type { FormItemProps } from "./types";

export function useBlacklist() {
  const searchForm = reactive({
    ip: "",
    ipPart: ""
  });
  const dataList = ref<BlackListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 100 },
    { label: "IP", prop: "ip", width: 140 },
    { label: $t("risk_control.reason"), prop: "reason", align: "left" },
    { label: $t("risk_control.createdAt"), prop: "createdAt", width: 180 },
    { label: $t("risk_control.createBy"), prop: "createUserAccount", width: 120 },
    { label: $t("risk_control.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // ip 精準與 ipPart 模糊互斥：有 ip 則忽略 ipPart（沿用舊邏輯）
      const params: Record<string, any> = {};
      if (searchForm.ip) {
        params.ip = searchForm.ip;
      } else if (searchForm.ipPart) {
        params.ipPart = searchForm.ipPart;
      }
      const { data } = await getBlackList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  function openDialog(isEdit = false, row?: BlackListItem) {
    addDialog({
      title: isEdit
        ? $t("risk_control.editBlacklist")
        : $t("risk_control.addIpBlackList"),
      props: {
        isEdit,
        formInline: {
          id: row?.id,
          ip: row?.ip ?? "",
          reason: row?.reason ?? ""
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
          if (isEdit) {
            const { success } = await updateBlackList({
              id: curData.id as string,
              reason: curData.reason
            });
            if (success) {
              message($t("risk_control.editBlacklist"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await addBlackList({
              ip: curData.ip,
              reason: curData.reason
            });
            if (success) {
              message($t("risk_control.addIpBlackList"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  function handleDelete(row: BlackListItem) {
    ElMessageBox.confirm($t("risk_control.doYouConfirmDeletion"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteBlackList(row.ip);
        if (success) {
          message($t("risk_control.delete"), { type: "success" });
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
