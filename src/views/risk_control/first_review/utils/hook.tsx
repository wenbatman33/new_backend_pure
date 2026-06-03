import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import IpDeviceList from "../IpDeviceList.vue";
import ReviewConfirm from "../ReviewConfirm.vue";
import {
  GetCheckList,
  SetCheck,
  type CheckListResult,
  type IpDeviceListResult
} from "@/api/risk_control";
import type { CheckItem } from "./types";

export function useFirstReview() {
  const searchForm = reactive({
    memberID: "",
    account: "",
    agent: ""
  });
  const dataList = ref<CheckItem[]>([]);
  const loading = ref(true);
  const selectedRows = ref<CheckItem[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 標籤顏色：舊碼透過 getTagGroup 取得色盤；此處暫以預設色呈現
  // TODO 待 tag api/共用元件移植後補回顏色對應
  const columns: TableColumnList = [
    { type: "selection", width: 55, align: "left" },
    { label: "ID", prop: "memberID", width: 80, sortable: true },
    {
      label: $t("risk_control.memberAccount"),
      prop: "account",
      width: 150,
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => handleAccountView(row)}>
          {row.account}
        </el-link>
      )
    },
    { label: $t("risk_control.name"), prop: "name", width: 150 },
    {
      label: $t("risk_control.agent"),
      prop: "agent",
      width: 150,
      sortable: true,
      cellRenderer: ({ row }) => <span>{row.agent === "0" ? "" : row.agent}</span>
    },
    { label: $t("risk_control.phoneNumber"), prop: "phone", width: 150 },
    {
      label: $t("risk_control.registerIp"),
      prop: "registerIp",
      width: 180,
      cellRenderer: ({ row }) => (
        <span>
          <el-link type="primary" onClick={() => handleIPView(row)}>
            {row.registerIp}
          </el-link>{" "}
          {row.ipLocation}
        </span>
      )
    },
    {
      label: $t("risk_control.registerDevice"),
      prop: "registerDevice",
      width: 150,
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => handleDeviceView(row)}>
          {row.registerDevice}
        </el-link>
      )
    },
    { label: $t("risk_control.phoneArea"), prop: "phoneLocation", width: 100 },
    {
      label: $t("risk_control.bankCardArea"),
      prop: "bankCardLocation",
      width: 100
    },
    {
      label: $t("risk_control.createdAt"),
      prop: "registerDate",
      width: 180,
      sortable: true
    },
    {
      label: $t("risk_control.tagWord"),
      prop: "tags",
      width: 350,
      align: "left",
      cellRenderer: ({ row }) => (
        <span>
          {(row.tags ?? []).map(tag => (
            <el-tag key={tag.id} class="mr-1 mb-1" type="info">
              {tag.name}
              <br />
              {tag.updatedAt}
            </el-tag>
          ))}
        </span>
      )
    },
    {
      label: $t("risk_control.operate"),
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await GetCheckList({
        memberID: searchForm.memberID,
        account: searchForm.account,
        agent: searchForm.agent,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
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
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSelectionChange(rows: CheckItem[]) {
    selectedRows.value = rows;
  }

  function handleAccountView(row: CheckItem) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // IP 名單彈窗
  function handleIPView(row: CheckItem) {
    addDialog({
      title: $t("risk_control.membersWhoHaveUsedThisIP"),
      width: "1000px",
      fullscreen: true,
      hideFooter: true,
      contentRenderer: () =>
        h(IpDeviceList, { mode: "ip", keyword: row.registerIp })
    });
  }

  // 裝置名單彈窗
  function handleDeviceView(row: CheckItem) {
    addDialog({
      title: $t("risk_control.membersWhoHaveUsedThisDevice"),
      width: "1000px",
      fullscreen: true,
      hideFooter: true,
      contentRenderer: () =>
        h(IpDeviceList, { mode: "device", keyword: row.registerDevice })
    });
  }

  // 單筆 / 批次 審核確認
  function openReviewDialog(rows: CheckItem[]) {
    addDialog({
      title: $t("risk_control.memberReview"),
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ReviewConfirm, { records: rows }),
      beforeSure: async done => {
        const { success } = await SetCheck({
          memberIDs: rows.map(r => r.memberID)
        });
        if (success) {
          message($t("risk_control.operateSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  function handleReview(row: CheckItem) {
    openReviewDialog([row]);
  }

  function handleBatchReview() {
    if (selectedRows.value.length === 0) {
      message($t("risk_control.atLeast1"), { type: "error" });
      return;
    }
    openReviewDialog(selectedRows.value);
  }

  // 加備註：舊碼用共用 views/common/comment 元件，未移植
  // TODO 共用備註彈窗待移植，暫以提示佔位
  function handleComment(_row?: CheckItem) {
    message($t("risk_control.featurePending"), { type: "warning" });
  }
  function handleBatchComment() {
    if (selectedRows.value.length === 0) {
      message($t("risk_control.atLeast1"), { type: "error" });
      return;
    }
    handleComment();
  }

  // 加標籤：舊碼用共用 tag 彈窗，未移植
  // TODO 共用標籤彈窗待移植，暫以提示佔位
  function handleTag(_row?: CheckItem) {
    message($t("risk_control.featurePending"), { type: "warning" });
  }
  function handleBatchTag() {
    if (selectedRows.value.length === 0) {
      message($t("risk_control.atLeast1"), { type: "error" });
      return;
    }
    handleTag();
  }

  function handleConfirm(row: CheckItem) {
    ElMessageBox.confirm(
      $t("risk_control.reviewTheFollowingMembers") + "?",
      "",
      { type: "warning" }
    )
      .then(() => openReviewDialog([row]))
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
    selectedRows,
    onSearch,
    resetForm,
    handleSelectionChange,
    handleReview,
    handleBatchReview,
    handleComment,
    handleBatchComment,
    handleTag,
    handleBatchTag,
    handleConfirm
  };
}
