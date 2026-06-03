import { h, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { ElSwitch } from "element-plus";
import editForm from "../form.vue";
import {
  getBankcardCheck,
  getPhoneCheck,
  updateBankcardCheck,
  updatePhoneCheckSwitch,
  postBankcardVerify,
  updatePhoneCheck
} from "@/api/systemManage";
import type { EditType, VerifyRow, FormItemProps } from "./types";

export function useVerifyBankcard() {
  // 三組列表：1 銀行卡二元素 / 2 銀行卡歸屬地 / 3 手機二元素
  const checkNameList = ref<VerifyRow[]>([]);
  const belongList = ref<VerifyRow[]>([]);
  const phoneList = ref<VerifyRow[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 啟用廠商（切換 status）
  async function handleSwitch(row: VerifyRow, editType: EditType) {
    if (!hasAuth("__btn_switch_verify_bankcard")) return;
    if (row.status === 1) return;
    row.pendingStatus = true;
    try {
      if (editType === 3) {
        const { success } = await updatePhoneCheckSwitch({
          type: row.type,
          id: row.id
        });
        if (success) {
          message($t("systemManage.enablePhoneVendorSuccess"), { type: "success" });
          await onSearch();
        }
      } else {
        const { success } = await updateBankcardCheck({
          type: row.type,
          id: row.id
        });
        if (success) {
          message($t("systemManage.enableVendorSuccess"), { type: "success" });
          await onSearch();
        }
      }
    } finally {
      row.pendingStatus = false;
    }
  }

  // 產生各列表的 columns（依 editType 綁定切換與編輯）
  function buildColumns(editType: EditType): TableColumnList {
    return [
      { label: $t("systemManage.serialNumber"), prop: "id", width: 120 },
      {
        label: $t("systemManage.currentlyInUse"),
        prop: "status",
        width: 180,
        cellRenderer: ({ row }: { row: VerifyRow }) =>
          h(ElSwitch, {
            modelValue: row.status === 1,
            loading: row.pendingStatus,
            disabled: row.status === 1 || !hasAuth("__btn_switch_verify_bankcard"),
            activeText: $t("systemManage.enable"),
            inactiveText: $t("systemManage.disable"),
            inlinePrompt: true,
            "onChange": () => handleSwitch(row, editType)
          })
      },
      { label: $t("systemManage.tradeNames"), prop: "name", minWidth: 160 },
      { label: $t("systemManage.remainingQuota"), prop: "times", minWidth: 140 },
      {
        label: $t("systemManage.manufacturerBackendURL"),
        prop: "url",
        minWidth: 240,
        cellRenderer: ({ row }: { row: VerifyRow }) =>
          row.url
            ? h(
                "a",
                {
                  href: row.url,
                  target: "_blank",
                  style: "color: var(--el-color-primary)"
                },
                row.url
              )
            : h("span", "-")
      },
      {
        label: $t("systemManage.action"),
        fixed: "right",
        width: 120,
        slot: `operation${editType}`
      }
    ];
  }

  const checkNameColumns = buildColumns(1);
  const belongColumns = buildColumns(2);
  const phoneColumns = buildColumns(3);

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getBankcardCheck();
      checkNameList.value = data?.checkNameList ?? [];
      belongList.value = data?.getBelongList ?? [];
      const { data: phoneData } = await getPhoneCheck();
      phoneList.value = phoneData?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 開啟編輯對話框
  function openDialog(row: VerifyRow, editType: EditType) {
    const params = row.params ?? {};
    const formInline: FormItemProps = {
      id: row.id,
      record: row,
      editType,
      backendUrl: row.url ?? "",
      checkNameUrl: row.check_name_url ?? "",
      getBelongUrl: row.get_belong_url ?? "",
      boURL: row.boURL ?? "",
      apiDomain: row.apiDomain ?? row.api_domain ?? "",
      params: {
        APPID: params.APPID,
        APP_SECURITY: params.APP_SECURITY,
        KEY_CHECK_NAME: params.KEY_CHECK_NAME,
        KEY_GET_BELONG: params.KEY_GET_BELONG,
        OPEN_ID: params.OPEN_ID,
        APP_ID: params.APP_ID,
        APP_KEY: params.APP_KEY,
        URL_CHECK_QUOTA: params.URL_CHECK_QUOTA
      }
    };
    addDialog({
      title: $t("systemManage.edit"),
      props: { formInline },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as FormItemProps;
        const payload = {
          id: curData.id,
          backendUrl: curData.backendUrl,
          checkNameUrl: curData.checkNameUrl,
          getBelongUrl: curData.getBelongUrl,
          boURL: curData.boURL,
          apiDomain: curData.apiDomain,
          params: curData.params
        };
        const submit =
          editType === 3 ? updatePhoneCheck(payload) : postBankcardVerify(payload);
        submit
          .then(({ success }) => {
            if (success) {
              message($t("systemManage.editSuccess"), { type: "success" });
              done();
              onSearch();
            } else {
              message($t("systemManage.editFailed"), { type: "error" });
            }
          })
          .catch(() => {
            message($t("systemManage.editFailed"), { type: "error" });
          });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    checkNameList,
    belongList,
    phoneList,
    checkNameColumns,
    belongColumns,
    phoneColumns,
    onSearch,
    openDialog
  };
}
