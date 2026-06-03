import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getVipBlackList,
  postVipBlack,
  deleteVipBlack,
  type VipBlackItem
} from "@/api/vip";
import type { FormItemProps } from "./types";

const typeMap: Record<number, string> = {
  1: $t("vip.giftMoneyBlacklist"),
  2: $t("vip.rebateBlacklist")
};

export function useVipBlock() {
  const searchForm = reactive({
    memberID: "",
    memberAccount: "",
    type: ""
  });
  const dataList = ref<VipBlackItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const typeOptions = [
    { label: $t("vip.giftMoneyBlacklist"), value: 1 },
    { label: $t("vip.rebateBlacklist"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("vip.memberID"), prop: "memberID" },
    { label: $t("vip.memberAccount"), prop: "memberAccount" },
    {
      label: $t("vip.blacklistType"),
      prop: "type",
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    { label: $t("vip.blacklistReason"), prop: "reason" },
    { label: $t("vip.time"), prop: "createdAt" },
    { label: $t("vip.operator"), prop: "editorName", width: 120 },
    { label: $t("vip.action"), fixed: "right", width: 140, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getVipBlackList({
        memberID: searchForm.memberID,
        memberAccount: searchForm.memberAccount,
        type: searchForm.type
      });
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

  function openDialog() {
    addDialog({
      title: $t("vip.blacklistSetting"),
      props: {
        formInline: {
          memberAccounts: "",
          types: [],
          reason: ""
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
          const { success } = await postVipBlack({
            memberAccounts: curData.memberAccounts,
            types: curData.types,
            reason: curData.reason
          });
          if (success) {
            message($t("vip.blacklistSetting"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: VipBlackItem) {
    ElMessageBox.confirm($t("vip.confirmRemoveBlacklist"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteVipBlack(row.id);
        if (success) {
          message($t("vip.removeBlacklist"), { type: "success" });
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
