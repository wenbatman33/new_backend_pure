import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElSwitch } from "element-plus";
import { hasAuth } from "@/router/utils";
import editForm from "../form.vue";
import {
  getSmsVendorList,
  updateSmsVendorStatus,
  updateSmsVendorData
} from "@/api/systemManage";
import type { SmsVendorItem, FormItemProps } from "./types";

export function useSmsVendor() {
  const dataList = ref<SmsVendorItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 此頁無分頁，後端一次回傳全部
  const columns: TableColumnList = [
    {
      label: $t("systemManage.smsVendorStatus"),
      prop: "status",
      width: 150,
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          modelValue: row.status === 1,
          activeText: $t("systemManage.smsVendorEnable"),
          inactiveText: $t("systemManage.smsVendorDisable"),
          inlinePrompt: true,
          loading: row.pendingStatus,
          // 已啟用者不可再操作，且需權限
          disabled:
            row.status === 1 ||
            !hasAuth("__btn_system_management_switch_enable"),
          onChange: () => handleStatusChange(row)
        })
    },
    {
      label: $t("systemManage.smsVendorDisplayName"),
      prop: "displayName",
      width: 150
    },
    { label: $t("systemManage.smsVendorQuota"), prop: "quota", width: 100 },
    { label: $t("systemManage.smsVendorCredit"), prop: "credit", width: 100 },
    {
      label: $t("systemManage.smsVendorSuccessRate"),
      prop: "successRate",
      width: 100
    },
    {
      label: $t("systemManage.smsVendorBackendUrl"),
      prop: "backendUrl",
      cellRenderer: ({ row }) =>
        row.backendUrl ? (
          <a href={row.backendUrl} target="_blank" rel="noreferrer">
            {row.backendUrl}
          </a>
        ) : (
          <span>--</span>
        )
    },
    {
      label: $t("systemManage.smsVendorOperate"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getSmsVendorList();
      dataList.value = (data?.list ?? []).map(item => ({
        ...item,
        pendingStatus: false
      }));
    } finally {
      loading.value = false;
    }
  }

  // 啟用/停用切換
  function handleStatusChange(row: SmsVendorItem) {
    row.pendingStatus = true;
    const newStatus = row.status === 1 ? 2 : 1;
    updateSmsVendorStatus(row.id)
      .then(({ success }) => {
        if (success) {
          row.status = newStatus;
          message(
            `${$t("systemManage.smsVendorActivatedSuccess")}：${row.displayName}`,
            { type: "success" }
          );
          if (Number(row.quota) <= 100) {
            message($t("systemManage.smsVendorBalanceTooLow"), {
              type: "warning"
            });
          }
          onSearch();
        }
      })
      .finally(() => {
        row.pendingStatus = false;
      });
  }

  // 編輯供應商設定
  function openDialog(row: SmsVendorItem) {
    addDialog({
      title: $t("systemManage.smsVendorEdit"),
      props: {
        formInline: {
          id: row.id,
          displayName: row.displayName ?? "",
          username: row.username ?? "",
          password: row.password ?? "",
          key: row.key ?? "",
          secret: row.secret ?? "",
          apiUrl: row.apiUrl ?? "",
          backendUrl: row.backendUrl ?? "",
          template: row.template ?? "",
          param: row.param ?? "",
          apiParam: { ...(row.apiParam ?? {}) }
        }
      },
      width: "700px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await updateSmsVendorData(curData);
          if (success) {
            message($t("systemManage.smsVendorEditSuccess"), {
              type: "success"
            });
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
    onSearch,
    openDialog
  };
}
