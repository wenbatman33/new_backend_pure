import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import editForm from "../form.vue";
import {
  getAgencyWalletOperationList,
  getAgencyWalletOperate,
  permitAgencyWalletOperation,
  denyAgencyWalletOperation,
  failReturnAgencyWalletOperation,
  failDecreaseAgencyWalletOperation,
  addAgencyWalletOperation,
  checkAgencyWalletBelong,
  getAgencyList,
  getAgencyDetail,
  type AgencyWalletOperationItem
} from "@/api/agency";
import type { FormItemProps } from "./types";

/** 異動類型對照 */
const typeMap: Record<number, { label: string; color?: string }> = {
  1: { label: $t("agency.walletLogTable8"), color: "red" },
  2: { label: $t("agency.walletLogTable10"), color: "red" },
  3: { label: $t("agency.walletTable5") },
  4: { label: $t("agency.walletLogTable9") }
};

/** 狀態對照 */
const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: $t("agency.walletTable1"), color: "#00EC00" },
  2: { label: $t("agency.walletTable2"), color: "#FF0000" },
  3: { label: $t("agency.walletTable3"), color: "#FFD306" },
  4: { label: $t("agency.walletTable4"), color: "#0000C6" }
};

export const adjustTypeOptions = [
  { label: $t("agency.walletData1"), value: 1 },
  { label: $t("agency.walletData2"), value: 2 },
  { label: $t("agency.walletData3"), value: 3 },
  { label: $t("agency.walletData4"), value: 4 }
];

export function useAgencyWallet() {
  const searchForm = reactive({
    agencyID: "",
    agencyAccount: "",
    exactlyMatching: 2,
    type: 0,
    status: 0,
    applyTime: [] as string[],
    reviewTime: [] as string[]
  });
  const dataList = ref<AgencyWalletOperationItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const typeOptions = [
    { label: $t("agency.depositForm1"), value: 0 },
    ...adjustTypeOptions
  ];

  const statusOptions = [
    { label: $t("agency.depositForm1"), value: 0 },
    { label: $t("agency.walletTable1"), value: 1 },
    { label: $t("agency.walletTable2"), value: 2 },
    { label: $t("agency.walletTable3"), value: 3 },
    { label: $t("agency.walletTable4"), value: 4 }
  ];

  const exactlyOptions = [
    { label: $t("agency.agencyMainForm5"), value: 1 },
    { label: $t("agency.agencyMainForm6"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("agency.phDailyReportTable2"), prop: "agencyAccount" },
    { label: $t("agency.phDailyReportTable1"), prop: "agencyID" },
    {
      label: $t("agency.walletLogTable5"),
      prop: "type",
      cellRenderer: ({ row }) => {
        const t = typeMap[row.type];
        return <span style={{ color: t?.color }}>{t?.label ?? row.type}</span>;
      }
    },
    {
      label: $t("agency.walletLogTable19"),
      prop: "amount",
      cellRenderer: ({ row }) => <span>{Number(row.amount).toLocaleString()}</span>
    },
    {
      label: $t("agency.walletTable6"),
      prop: "balanceBefore",
      cellRenderer: ({ row }) => (
        <span>{Number(row.balanceBefore).toLocaleString()}</span>
      )
    },
    {
      label: $t("agency.walletTable7"),
      prop: "balanceAfter",
      cellRenderer: ({ row }) => (
        <span>{Number(row.balanceAfter).toLocaleString()}</span>
      )
    },
    {
      label: $t("agency.walletData7"),
      prop: "turnoverLimit",
      cellRenderer: ({ row }) => (
        <span>{Number(row.turnoverLimit).toLocaleString()}</span>
      )
    },
    {
      label: $t("agency.agencyApplicationTable9"),
      prop: "status",
      cellRenderer: ({ row }) => {
        const s = statusMap[row.status] ?? statusMap[3];
        return <span style={{ color: s.color }}>{s.label}</span>;
      }
    },
    { label: $t("agency.walletTable8"), prop: "date", width: 160 },
    { label: $t("agency.walletTable9"), prop: "applyAdminAccount" },
    { label: $t("agency.walletTable10"), prop: "reviewDate", width: 160 },
    { label: $t("agency.walletTable11"), prop: "reviewAdminAccount" },
    { label: $t("agency.agencyMainTable9"), prop: "remark" },
    { label: $t("agency.withdrawalTable3"), fixed: "right", width: 200, slot: "operation" }
  ];

  /** 組裝送出參數（過濾空值，並展開日期區間） */
  function buildParams(extra: object = {}) {
    const params: Record<string, any> = {
      agencyID: searchForm.agencyID,
      agencyAccount: searchForm.agencyAccount,
      exactlyMatching: searchForm.exactlyMatching,
      type: searchForm.type,
      status: searchForm.status,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...extra
    };
    if (searchForm.applyTime?.length === 2) {
      params.applyStartTime = searchForm.applyTime[0];
      params.applyEndTime = searchForm.applyTime[1];
    }
    if (searchForm.reviewTime?.length === 2) {
      params.reviewStartTime = searchForm.reviewTime[0];
      params.reviewEndTime = searchForm.reviewTime[1];
    }
    // 過濾空字串
    Object.keys(params).forEach(k => {
      if (params[k] === "" || params[k] === undefined) delete params[k];
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyWalletOperationList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function onSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.applyTime = [];
    searchForm.reviewTime = [];
    pagination.currentPage = 1;
    onSearch();
  }

  /** 匯出（取大量資料） */
  async function handleExport() {
    const { data } = await getAgencyWalletOperationList(
      buildParams({ page: 1, pageSize: 5000 })
    );
    const list = data?.list ?? [];
    message(`${$t("agency.handleExport")}: ${list.length}`, { type: "success" });
    // TODO: 匯出 Excel（舊碼用 jsonToSheetXlsx，pure 端待接 @/utils/report）
  }

  /** 開啟「新增調整」對話框：先查代理、再填調整、最後送出 */
  function openAdjustDialog() {
    const formInline: FormItemProps = {
      type: "",
      refMemberAccount: "",
      amount: 0,
      turnoverLimit: 0,
      remark: ""
    };
    // 查到的代理明細（form.vue 內透過 agencyDetail 顯示）
    const agencyDetail = reactive<Record<string, any>>({});

    /** 依搜尋條件查代理並回填明細 */
    async function searchAgency(cond: { agencyID: string; agencyAccount: string }) {
      if (!cond.agencyID && !cond.agencyAccount) {
        message($t("agency.walletAdjustModal3"), { type: "error" });
        return;
      }
      const { data } = await getAgencyList({
        agencyID: cond.agencyID,
        agencyAccount: cond.agencyAccount,
        exactlyMatching: 2
      });
      const listResult = data?.list ?? [];
      if (listResult.length === 0) {
        message($t("agency.walletAdjustModal4"), { type: "error" });
        return;
      }
      const detailRes = await getAgencyDetail({ id: listResult[0].id });
      Object.assign(agencyDetail, detailRes.data ?? {});
      agencyDetail.agencyWallet = listResult[0].agencyWallet;
    }

    addDialog({
      title: $t("agency.wallet1"),
      props: { formInline, agencyDetail, searchAgency },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as any).formInline as FormItemProps;
        if (!agencyDetail.id) {
          message($t("agency.walletAdjustModal4"), { type: "error" });
          return;
        }
        FormRef.validate(async valid => {
          if (!valid) return;
          // 會員下分需檢查直屬
          if (curData.type === 3) {
            const res = await checkAgencyWalletBelong({
              agencyID: agencyDetail.id,
              memberAccount: curData.refMemberAccount
            });
            if (res.data?.isBelong !== 1) {
              await ElMessageBox.confirm(
                $t("agency.walletDoubleCheckModal1"),
                "",
                { type: "warning" }
              ).catch(() => Promise.reject());
            }
          }
          const { success } = await addAgencyWalletOperation({
            agencyID: agencyDetail.id,
            amount: curData.amount,
            turnoverLimit: curData.turnoverLimit,
            remark: curData.remark,
            type: curData.type,
            refMemberAccount: curData.refMemberAccount
          });
          if (success) {
            message($t("agency.walletReviewModal8"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 開啟審核/查看對話框 */
  async function openReviewDialog(row: AgencyWalletOperationItem, auditStatus = 0) {
    const detail = reactive<Record<string, any>>({ ...row });
    let warning = false;
    if (row.type === 3) {
      const res = await getAgencyWalletOperate({ id: row.id });
      detail.refMemberAccount = res.data?.refMemberAccount;
      warning = res.data?.isBelong === 2;
    }

    const review = async (action: number, done: () => void) => {
      const id = detail.id;
      let res: any;
      if (action === 0) res = await denyAgencyWalletOperation({ id });
      else if (action === 1) res = await permitAgencyWalletOperation({ id });
      else if (action === 2) res = await failReturnAgencyWalletOperation({ id });
      else if (action === 3) res = await failDecreaseAgencyWalletOperation({ id });
      if (res?.success) {
        message($t("agency.walletReviewModal8"), { type: "success" });
        done();
        onSearch();
      }
    };

    addDialog({
      title:
        Number(detail.type) <= 2
          ? $t("agency.walletReviewModal6")
          : $t("agency.walletReviewModal7"),
      width: "640px",
      draggable: true,
      hideFooter: true,
      contentRenderer: ({ options }) => {
        const close = () => (options as any).visible && ((options as any).visible = false);
        const rows: [string, any][] = [
          [$t("agency.phDailyReportTable1"), detail.agencyID],
          [$t("agency.phDailyReportTable2"), detail.agencyAccount],
          [$t("agency.commissionTable3"), detail.balanceAfter],
          [$t("agency.walletLogTable5"), typeMap[detail.type]?.label],
          [$t("agency.walletLogTable19"), detail.amount],
          ...(detail.type === 3
            ? ([[$t("agency.agencyApplicationForm4"), detail.refMemberAccount]] as [
                string,
                any
              ][])
            : []),
          [$t("agency.walletData7"), detail.turnoverLimit],
          [$t("agency.agencyMainTable9"), detail.remark]
        ];
        return (
          <div>
            <el-descriptions border column={2}>
              {rows.map(([label, val]) => (
                <el-descriptions-item label={label}>{val}</el-descriptions-item>
              ))}
            </el-descriptions>
            {warning && (
              <h3 style="color:#f00;text-align:center;margin-top:16px">
                {$t("agency.walletReviewModal1")}
              </h3>
            )}
            {auditStatus === 3 && (
              <div style="text-align:center;margin-top:16px">
                <el-button onClick={() => review(0, close)}>
                  {$t("agency.agencyApplication5")}
                </el-button>
                <el-button type="primary" onClick={() => review(1, close)}>
                  {$t("agency.walletReviewModal2")}
                </el-button>
              </div>
            )}
            {auditStatus === 4 && (
              <div style="text-align:center;margin-top:16px">
                <h3 style="color:#f00;text-align:center">
                  {$t("agency.walletReviewModal3")}
                </h3>
                <el-button type="primary" onClick={() => review(2, close)}>
                  {$t("agency.walletReviewModal4")}
                </el-button>
                <el-button type="primary" onClick={() => review(3, close)}>
                  {$t("agency.walletReviewModal5")}
                </el-button>
              </div>
            )}
          </div>
        );
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    typeOptions,
    statusOptions,
    exactlyOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onSizeChange,
    onCurrentChange,
    resetForm,
    handleExport,
    openAdjustDialog,
    openReviewDialog
  };
}
