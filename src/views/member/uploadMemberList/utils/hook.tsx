import { ref } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { getUploadMemberList } from "@/api/member";
import type { MemberItem } from "./types";

export function useUploadMemberList() {
  // 会员账号搜寻字串（可逗号分隔多笔，或由 Excel 汇入带入）
  const memberName = ref("");
  const dataList = ref<MemberItem[]>([]);
  const loading = ref(false);
  // 表格多选结果
  const selectedRows = ref<MemberItem[]>([]);

  const atLeast1 = $t("member.atLeast1");

  // 登入状态渲染：1 启用(绿) / 2 停用(红) / 其他 锁定(橙)
  const renderLoginStatus = (text: number) => {
    if (text === 1) return <span style="color:#00BB00">{$t("member.enable")}</span>;
    if (text === 2) return <span style="color:#F00">{$t("member.disable")}</span>;
    return <span style="color:#FF9224">{$t("member.locked")}</span>;
  };
  // 存/提款状态：1 启用(绿) / 其他 停用(红)
  const renderOnOff = (text: number) =>
    text === 1 ? (
      <span style="color:#00BB00">{$t("member.enable")}</span>
    ) : (
      <span style="color:#F00">{$t("member.disable")}</span>
    );

  const columns: TableColumnList = [
    { type: "selection", align: "left", width: 50, reserveSelection: true },
    { label: "ID", prop: "memberID", width: 80 },
    {
      label: $t("member.memberAccount"),
      prop: "memberAccount",
      width: 150,
      slot: "memberAccount"
    },
    { label: $t("member.memberName"), prop: "memberName", width: 150 },
    { label: $t("member.phone"), prop: "phone", width: 110 },
    {
      label: $t("member.phoneCert"),
      prop: "phoneCert",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{row.phoneCert === 1 ? $t("member.yes") : $t("member.no")}</span>
      )
    },
    { label: $t("member.vipLevel"), prop: "vipLevel", width: 140 },
    {
      label: $t("member.loginStatus"),
      prop: "loginStatus",
      width: 130,
      cellRenderer: ({ row }) => renderLoginStatus(row.loginStatus)
    },
    {
      label: $t("member.depositLimit"),
      prop: "depositStatus",
      width: 130,
      cellRenderer: ({ row }) => renderOnOff(row.depositStatus)
    },
    {
      label: $t("member.withdrawLimit"),
      prop: "withdrawalStatus",
      width: 130,
      cellRenderer: ({ row }) => renderOnOff(row.withdrawalStatus)
    },
    { label: $t("member.topAgencyID"), prop: "topAgencyAccount", width: 120 },
    { label: $t("member.agency"), prop: "agencyAccount", width: 150 },
    {
      label: $t("member.recommenderAccount"),
      prop: "recommenderAccount",
      width: 150
    },
    {
      label: $t("member.balance"),
      prop: "totalMoney",
      width: 120,
      sortable: true,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalMoney)}</span>
    },
    { label: $t("member.firstDepositTime"), prop: "firstDepositTime", width: 160 },
    {
      label: $t("member.firstDepositAmount"),
      prop: "firstDepositAmount",
      width: 120,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.firstDepositAmount)}</span>
      )
    },
    {
      label: $t("member.totalDepositAmount"),
      prop: "totalDepositAmount",
      width: 120,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalDepositAmount)}</span>
      )
    },
    {
      label: $t("member.totalDepositCount"),
      prop: "totalDepositCount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalDepositCount)}</span>
      )
    },
    {
      label: $t("member.firstWithdrawalAmount"),
      prop: "firstWithdrawalAmount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.firstWithdrawalAmount)}</span>
      )
    },
    {
      label: $t("member.firstWithdrawalCount"),
      prop: "firstWithdrawalCount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.firstWithdrawalCount)}</span>
      )
    },
    {
      label: $t("member.totalReward"),
      prop: "totalReward",
      width: 120,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalReward)}</span>
    },
    {
      label: $t("member.totalBetAmount"),
      prop: "totalBetAmount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalBetAmount)}</span>
      )
    },
    {
      label: $t("member.totalValidBetAmount"),
      prop: "totalValidBetAmount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalValidBetAmount)}</span>
      )
    },
    {
      label: $t("member.totalWinAmount"),
      prop: "totalWinAmount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalWinAmount)}</span>
      )
    },
    {
      label: $t("member.totalProfitAndLoss"),
      prop: "totalProfitAndLoss",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.totalProfitAndLoss)}</span>
      )
    },
    { label: $t("member.createdAt"), prop: "registerAt", width: 160 },
    { label: $t("member.registerLocation"), prop: "registerLocation", width: 120 },
    {
      label: $t("member.registerDeviceType"),
      prop: "registerDeviceTypeStr",
      width: 120
    },
    { label: $t("member.lastLoginTime"), prop: "lastLoginAt", width: 160 },
    { label: $t("member.lastLoginLocation"), prop: "lastLoginLocation", width: 120 },
    {
      label: $t("member.lastLoginDeviceType"),
      prop: "lastLoginDeviceTypeStr",
      width: 120
    },
    { label: $t("member.lastDepositAt"), prop: "lastDepositAt", width: 160 },
    { label: $t("member.lastWithdrawalAt"), prop: "lastWithdrawalAt", width: 160 },
    { label: $t("member.operate"), fixed: "right", width: 220, slot: "operation" }
  ];

  // 依账号查询会员清单（旧逻辑 pageSize 极大、一次抓全部）
  async function onSearch() {
    if (!memberName.value) {
      message($t("member.atLeast1"), { type: "warning" });
      return;
    }
    loading.value = true;
    dataList.value = [];
    try {
      const { data } = await getUploadMemberList({
        account: memberName.value,
        pageSize: 99999
      });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 多选变更
  function handleSelectionChange(rows: MemberItem[]) {
    selectedRows.value = rows;
  }

  // 取得多选；为空则提示
  function getSelected(): MemberItem[] | null {
    if (selectedRows.value.length === 0) {
      message(atLeast1, { type: "error" });
      return null;
    }
    return selectedRows.value;
  }

  // 点击账号 → 开新页面看会员明细
  function handleView(row: MemberItem) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // 汇出：旧码用前端 xlsx 把列表写出，pure 专案改提示由后端汇出端点处理
  // TODO 待 report/excel 汇出层与旧 jsonToSheetXlsx 行为对齐后接上 /backend/member/by-upload/export
  async function handleExport() {
    message($t("member.exportTodo"), { type: "info" });
  }

  // 下载汇入范本（旧码用 aoaToSheetXlsx 产生 example.xlsx）
  // TODO 待 Excel 模板产生工具移植后补上
  function downloadTemplate() {
    message($t("member.exportTodo"), { type: "info" });
  }

  // 以下批次动作（加标签 / 加备注 / 存提款 / 登入状态 / 单笔状态切换）原依赖
  // 跨模组对话框（TagModal / NoteModal / MoneyModal / LoginModal / DoubleCheckModal），
  // 这些模组尚未迁移至 pure-admin。先以提示佔位，待相依模组完成后接回。
  // TODO 待 member 其他模组迁移完成后接回对应 addDialog
  function handleTagBatch() {
    if (!getSelected()) return;
    message($t("member.dialogTodo"), { type: "info" });
  }
  function handleAddNote() {
    if (!getSelected()) return;
    message($t("member.dialogTodo"), { type: "info" });
  }
  function handleMoneyBatch(_type: "deposit" | "withdraw") {
    if (!getSelected()) return;
    message($t("member.dialogTodo"), { type: "info" });
  }
  function handleLoginBatch() {
    if (!getSelected()) return;
    message($t("member.dialogTodo"), { type: "info" });
  }
  // 单笔行内状态切换（登入 / 存款 / 提款）
  function handleCheckEvent(_row: MemberItem, _type: string) {
    message($t("member.dialogTodo"), { type: "info" });
  }

  // 由 Excel 汇入成功后把会员账号填回搜寻框（逗号分隔）
  function loadDataSuccess(accounts: string[]) {
    memberName.value = accounts.join(",");
  }

  return {
    memberName,
    loading,
    columns,
    dataList,
    selectedRows,
    onSearch,
    handleSelectionChange,
    handleView,
    handleExport,
    downloadTemplate,
    handleTagBatch,
    handleAddNote,
    handleMoneyBatch,
    handleLoginBatch,
    handleCheckEvent,
    loadDataSuccess
  };
}
