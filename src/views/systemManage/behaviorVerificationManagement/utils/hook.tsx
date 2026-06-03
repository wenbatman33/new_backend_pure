import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElSwitch } from "element-plus";
import { hasAuth } from "@/router/utils";
import editForm from "../form.vue";
import {
  getActionVerifyLineList,
  getActionVerifyLine,
  putActionVerifyLine,
  putActionVerifyLineTurnOff,
  putActionVerifyLineTurnOn,
  type ActionVerifyLineItem
} from "@/api/systemManage";
import type { FormItemProps } from "./types";

export function useBehaviorVerificationManagement() {
  const dataList = ref<ActionVerifyLineItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const columns: TableColumnList = [
    {
      label: $t("systemManage.serialNumber"),
      prop: "id",
      width: 100
    },
    {
      label: $t("systemManage.status"),
      prop: "status",
      width: 150,
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          // 1 是啟用 2 是關閉
          modelValue: row.status === 1,
          activeText: $t("systemManage.enable"),
          inactiveText: $t("systemManage.disable"),
          inlinePrompt: true,
          loading: row.pendingStatus,
          disabled: !hasAuth("__btn_switch_captcha_vendor"),
          onChange: (checked: boolean) => handleStatusChange(row, checked)
        })
    },
    {
      label: $t("systemManage.displayName"),
      prop: "name",
      width: 150
    },
    {
      label: $t("systemManage.manufacturerBackendURL"),
      prop: "boUrl",
      minWidth: 200
    },
    {
      label: $t("systemManage.operate"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getActionVerifyLineList();
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 狀態切換：行為驗證線路為互斥（同時只能啟用一條）。
   * 開啟某條 -> 呼叫 turnOn，並把其餘已啟用的關閉；關閉 -> 呼叫 turnOff。
   */
  async function handleStatusChange(
    row: ActionVerifyLineItem,
    checked: boolean
  ) {
    row.pendingStatus = true;
    const newStatus = checked ? 1 : 2;
    try {
      if (row.status === 2) {
        // 由關閉切換為啟用
        const others = dataList.value.filter(item => item.id !== row.id);
        await putActionVerifyLineTurnOn({ id: row.id });
        row.status = newStatus;
        // 其餘原本啟用的線路全部關閉，維持互斥
        for (const item of others) {
          if (item.status === 1) {
            await putActionVerifyLineTurnOff({ id: item.id });
          }
        }
      } else {
        await putActionVerifyLineTurnOff({ id: row.id });
        row.status = newStatus;
      }
    } finally {
      row.pendingStatus = false;
      onSearch();
    }
  }

  function openDialog(id: number) {
    getActionVerifyLine({ id }).then(({ data }) => {
      const detail = data ?? ({} as ActionVerifyLineItem);
      addDialog({
        title: $t("systemManage.edit"),
        props: {
          formInline: {
            id: detail.id,
            name: detail.name ?? "",
            pcAppID: detail.pcAppID ?? "",
            pcAppSecret: detail.pcAppSecret ?? "",
            h5AppID: detail.h5AppID ?? "",
            h5AppSecret: detail.h5AppSecret ?? "",
            captchaUrl: detail.captchaUrl ?? "",
            boUrl: detail.boUrl ?? "",
            secretID: detail.secretID ?? "",
            secretKey: detail.secretKey ?? ""
          }
        },
        width: "500px",
        draggable: true,
        closeOnClickModal: false,
        contentRenderer: () => h(editForm, { ref: formRef }),
        beforeSure: (done, { options }) => {
          const FormRef = formRef.value.getRef();
          const curData = options.props.formInline as FormItemProps;
          FormRef.validate(async (valid: boolean) => {
            if (!valid) return;
            const { success } = await putActionVerifyLine({ ...curData });
            if (success) {
              message($t("systemManage.editSuccess"), { type: "success" });
              done();
              onSearch();
            }
          });
        }
      });
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
