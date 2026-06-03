import { h, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog, closeAllDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { ElButton, ElInput, ElText } from "element-plus";
import groupForm from "../groupForm.vue";
import domainForm from "../domainForm.vue";
import replaceForm from "../replaceForm.vue";
import {
  getDomainList,
  createDomainGroup,
  updateDomainGroup,
  createDomain,
  updateDomain,
  deleteDomain,
  manualUpdateDomainJson,
  replaceDomainConfirm
} from "@/api/systemManage";
import type {
  DomainItem,
  GroupFormItemProps,
  DomainFormItemProps,
  ReplaceFormItemProps
} from "./types";

const SERVICE = 2;

export function useDomainManage() {
  const dataList = ref<DomainItem[]>([]);
  const loading = ref(true);
  const groupFormRef = ref();
  const domainFormRef = ref();
  const replaceFormRef = ref();

  const columns: TableColumnList = [
    { label: $t("systemManage.domainName"), prop: "name", width: 200, align: "left" },
    {
      label: $t("systemManage.sort"),
      prop: "sort",
      width: 140,
      // 子域名 + 有編輯權限時可行內編輯排序
      cellRenderer: ({ row }) => {
        if (row.groupID && hasAuth("__btn_system_management_edit_domain")) {
          return h(ElInput, {
            modelValue: row.sort,
            "onUpdate:modelValue": (val: any) => (row.sort = val),
            size: "small",
            style: "width:90px",
            onBlur: () => handleSortEdit(row)
          });
        }
        return h("span", row.sort);
      }
    },
    { label: $t("systemManage.setNameAndDisplayName"), prop: "displayName", width: 200 },
    { label: $t("systemManage.domain"), prop: "domain", minWidth: 250 },
    { label: $t("systemManage.note"), prop: "note", width: 180 },
    { label: $t("systemManage.operation"), fixed: "right", width: 220, slot: "operation" }
  ];

  // 取得群組下拉選項（僅頂層群組）
  function getGroupOptions() {
    return dataList.value.map(item => ({
      label: item.name,
      value: item.id
    }));
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getDomainList({ service: SERVICE });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 行內排序編輯
  async function handleSortEdit(row: DomainItem) {
    if (!/^[0-9]\d*$/.test(String(row.sort))) {
      message($t("systemManage.pleaseInputPositiveInt"), { type: "error" });
      onSearch();
      return;
    }
    const { success } = await updateDomain({
      id: row.id,
      groupID: row.groupID,
      name: row.name,
      sort: row.sort,
      displayName: row.displayName,
      domain: row.domain,
      note: row.note
    });
    if (success) {
      message($t("systemManage.updateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 新增/編輯群組
  function openGroupDialog(row?: DomainItem) {
    const isUpdate = !!row;
    addDialog({
      title: isUpdate
        ? $t("systemManage.editDomainGroup")
        : $t("systemManage.addDomainGroup"),
      props: {
        isUpdate,
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          sort: row?.sort ?? 99,
          setName: row?.displayName ?? ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(groupForm, { ref: groupFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = groupFormRef.value.getRef();
        const curData = options.props.formInline as GroupFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const params = {
            name: curData.name,
            sort: curData.sort,
            setName: curData.setName,
            service: SERVICE
          };
          let res;
          if (isUpdate) {
            res = await updateDomainGroup({ ...params, id: Number(curData.id) });
          } else {
            res = await createDomainGroup(params);
          }
          if (res?.success) {
            message($t("systemManage.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 新增/編輯域名；limited=true 僅可改 domain
  function openDomainDialog(row?: DomainItem, limited = false) {
    const isUpdate = !!row;
    addDialog({
      title: isUpdate
        ? $t("systemManage.editDomain")
        : $t("systemManage.addDomain"),
      props: {
        limited,
        groupList: getGroupOptions(),
        formInline: {
          id: row?.id,
          groupID: row?.groupID ?? "",
          name: row?.name ?? "",
          displayName: row?.displayName ?? "",
          domain: row?.domain ?? "",
          sort: row?.sort ?? 1,
          note: row?.note ?? ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(domainForm, { ref: domainFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = domainFormRef.value.getRef();
        const curData = options.props.formInline as DomainFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const params = {
            groupID: curData.groupID,
            name: curData.name,
            sort: curData.sort,
            displayName: curData.displayName,
            domain: curData.domain,
            note: curData.note
          };
          let res;
          if (isUpdate) {
            res = await updateDomain({ ...params, id: Number(curData.id) });
          } else {
            res = await createDomain(params);
          }
          if (res?.success) {
            message($t("systemManage.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 刪除（群組/域名），含 7 秒倒數確認按鈕
  function handleDelete(row: DomainItem) {
    const isGroup = !row.groupID;
    const sec = ref(7);
    let timer: any = null;

    const startCountdown = () => {
      timer = setInterval(() => {
        sec.value--;
        if (sec.value <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, 1000);
    };
    const stopCountdown = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const doDelete = async () => {
      let res;
      if (isGroup) {
        // 群組以 status=2 軟刪除
        res = await updateDomainGroup({
          id: row.id,
          name: row.name,
          sort: row.sort,
          setName: row.displayName,
          status: 2,
          service: SERVICE
        });
      } else {
        res = await deleteDomain(row.id);
      }
      if (res?.success) {
        stopCountdown();
        message($t("systemManage.deleteSuccess"), { type: "success" });
        closeAllDialog();
        onSearch();
      }
    };

    addDialog({
      title: isGroup
        ? $t("systemManage.deleteDomainGroup")
        : $t("systemManage.deleteDomain"),
      width: "420px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      open: startCountdown,
      closeCallBack: stopCountdown,
      contentRenderer: () =>
        h("div", { style: "text-align:center" }, [
          h(
            "p",
            { style: "font-size:1.2rem;margin:1rem auto" },
            isGroup
              ? `${$t("systemManage.confirmDeleteGroup")}『${row.name}』?`
              : `${$t("systemManage.confirmDeleteDomain")}『${row.name}』?`
          ),
          isGroup
            ? h(
                ElText,
                { type: "danger", style: "display:block;margin-bottom:1rem" },
                () => $t("systemManage.deleteGroupWarning")
              )
            : null,
          h("div", { style: "display:flex;gap:8px;justify-content:center" }, [
            h(
              ElButton,
              {
                onClick: () => {
                  stopCountdown();
                  closeAllDialog();
                }
              },
              () => $t("systemManage.cancel")
            ),
            h(
              ElButton,
              {
                type: "primary",
                disabled: sec.value > 0,
                onClick: doDelete
              },
              () =>
                sec.value > 0
                  ? `${sec.value}${$t("systemManage.secondsToClick")}`
                  : $t("systemManage.confirmDelete")
            )
          ])
        ])
    });
  }

  // 快速置換 domain
  function openReplaceDialog() {
    addDialog({
      title: $t("systemManage.quickReplace"),
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(replaceForm, { ref: replaceFormRef }),
      beforeSure: done => {
        const FormRef = replaceFormRef.value.getRef();
        const model: ReplaceFormItemProps = replaceFormRef.value.getModel();
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await replaceDomainConfirm({ ...model });
          if (success) {
            message($t("systemManage.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 手動更新
  async function handleManualUpdate() {
    const { success } = await manualUpdateDomainJson({ service: SERVICE });
    if (success) {
      message($t("systemManage.updateSuccess"), { type: "success" });
    }
  }

  // 操作紀錄（舊碼僅有按鈕、實際導頁邏輯未在本模組，留 TODO）
  function handleOperationRecord() {
    // TODO: 操作紀錄導頁/開窗邏輯舊碼未在本模組實作，待主程式補
    message($t("systemManage.operationRecord"), { type: "info" });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openGroupDialog,
    openDomainDialog,
    handleDelete,
    openReplaceDialog,
    handleManualUpdate,
    handleOperationRecord
  };
}
