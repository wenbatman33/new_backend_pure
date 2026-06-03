import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import { exportExcel } from "@/utils/report";
import {
  getPayChannelLog,
  putPayChannelLogNote,
  getChannelDropdown,
  getSearchCheckbox
} from "@/api/finance_report";
import type { PayChannelLogItem, FormItemProps } from "./types";

export function usePaychannelReport() {
  // 搜尋條件
  const searchForm = reactive({
    createdAtStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    createdAtEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    payChannelID: 0,
    payChannelService: "",
    subjects: [] as number[]
  });

  // 顯示停用商戶號 / 線路
  const showDisabledPayChannelID = ref(false);
  const showDisabledService = ref(false);

  const dataList = ref<PayChannelLogItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 下拉選項來源
  const subjectList = ref<any[]>([]); // 科目原始清單（含 subjectID/name）
  const subjectOptions = ref<{ label: string; value: number }[]>([]);
  const payChannelsAll = ref<any[]>([]); // 商戶號全部（含 status）
  const payChannelOptions = ref<{ label: string; value: number }[]>([]);
  const serviceAll = ref<any[]>([]); // 線路全部（含 status）
  const serviceOptions = ref<{ label: string; value: string }[]>([]);

  // 合計
  const total = reactive({ in: 0, out: 0, fee: 0 });

  // 無分頁報表
  const pagination = reactive({
    total: 0,
    pageSize: 9999,
    currentPage: 1,
    background: true
  });

  // 科目 ID -> 名稱
  function filterSubject(id: number) {
    const result = subjectList.value.find(item => item.subjectID == id);
    return result ? result.name : "";
  }

  const columns: TableColumnList = [
    {
      label: $t("finance_report.tradeTime"),
      prop: "createdAt",
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>
          {row.createdAt
            ? dayjs(row.createdAt).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    {
      label: $t("finance_report.subject"),
      prop: "subjectID",
      minWidth: 90,
      cellRenderer: ({ row }) => <span>{filterSubject(row.subjectID)}</span>
    },
    {
      label: $t("finance_report.income"),
      prop: "in",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{Number(row.in).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.expenditure"),
      prop: "out",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{Number(row.out).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.handlingFee"),
      prop: "fee",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{Number(row.fee).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.balance"),
      prop: "remainBalance",
      minWidth: 110,
      cellRenderer: ({ row }) => (
        <span>{Number(row.remainBalance).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.freezeBalance"),
      prop: "frozenBalance",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{Number(row.frozenBalance).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.relatedOrderNumber"),
      prop: "relationID",
      minWidth: 110
    },
    {
      label: $t("finance_report.thirdPartyID"),
      prop: "thirdID",
      minWidth: 110
    },
    {
      label: $t("finance_report.tradingPartners"),
      prop: "targetName",
      minWidth: 150
    },
    {
      label: $t("finance_report.executor"),
      prop: "editorName",
      minWidth: 100
    },
    {
      label: $t("finance_report.remark"),
      prop: "note",
      minWidth: 140,
      slot: "note"
    }
  ];

  // 合計列（pure-table show-summary 用）
  function summaryMethod({ columns }) {
    return columns.map((col, index) => {
      if (index === 0) return `${$t("finance_report.total")} :`;
      if (col.property === "in") return Number(total.in).toLocaleString();
      if (col.property === "out") return Number(total.out).toLocaleString();
      if (col.property === "fee") return Number(total.fee).toLocaleString();
      return "";
    });
  }

  // 組查詢參數
  function buildParams() {
    const params: Record<string, any> = {
      createdAtStart: searchForm.createdAtStart,
      createdAtEnd: searchForm.createdAtEnd,
      payChannelID: searchForm.payChannelID || "",
      payChannelService: searchForm.payChannelService,
      subjects: searchForm.subjects
    };
    // 清掉空字串
    Object.keys(params).forEach(k => {
      if (params[k] === "" || params[k] === undefined || params[k] === null) {
        delete params[k];
      }
    });
    return params;
  }

  async function onSearch() {
    // 有填時間卻沒填日期時提醒
    if (
      (searchForm.createdAtStart || searchForm.createdAtEnd) &&
      (!searchForm.createdAtStart || !searchForm.createdAtEnd)
    ) {
      message($t("finance_report.plzKeyDate"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const { data } = await getPayChannelLog(buildParams());
      dataList.value = data?.list ?? [];
      total.in = data?.in ?? 0;
      total.out = data?.out ?? 0;
      total.fee = data?.fee ?? 0;
      pagination.total = dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    searchForm.createdAtStart = dayjs()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.createdAtEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    searchForm.payChannelID = 0;
    searchForm.payChannelService = "";
    searchForm.subjects = [];
    onSearch();
  }

  // 匯出 Excel（沿用舊 endpoint）
  function exportXlsx() {
    exportExcel(
      "/backend/pay/pay_channel/log",
      { ...buildParams(), export: 1 },
      `${$t("finance_report.merchantNumberAndLineDetails")}.xlsx`
    );
  }

  // 編輯備註
  function handleEditNote(row: PayChannelLogItem) {
    addDialog({
      title: $t("finance_report.modifyRemarks"),
      props: {
        formInline: {
          id: row.id,
          note: row.note
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
          const { success } = await putPayChannelLogNote({
            id: curData.id,
            note: curData.note
          });
          if (success) {
            message($t("finance_report.editRemarkSuccessfully"), {
              type: "success"
            });
            done();
            onSearch();
          } else {
            message($t("finance_report.editRemarkFailed"), { type: "error" });
          }
        });
      }
    });
  }

  // 顯示/隱藏停用線路
  function buildServiceOptions() {
    serviceOptions.value = serviceAll.value
      .filter(item => showDisabledService.value || item.status === 1)
      .map(item => ({ label: item.value, value: item.key }));
  }

  // 顯示/隱藏停用商戶號
  function buildPayChannelOptions() {
    payChannelOptions.value = payChannelsAll.value
      .filter(item => showDisabledPayChannelID.value || item.status == 1)
      .map(item => ({ label: item.name, value: item.id }));
  }

  function handleShowDisabledService() {
    buildServiceOptions();
  }
  function handleShowDisabledPayChannelID() {
    buildPayChannelOptions();
  }

  async function loadDropdowns() {
    // 科目 + 線路
    const { data: dropdown } = await getChannelDropdown();
    subjectList.value = dropdown?.subjects ?? [];
    subjectOptions.value = subjectList.value.map(item => ({
      label: item.name,
      value: item.subjectID
    }));
    serviceAll.value = dropdown?.payChannelService ?? [];
    buildServiceOptions();

    // 商戶號清單
    const { data: cb } = await getSearchCheckbox();
    payChannelsAll.value = cb?.list ?? [];
    buildPayChannelOptions();
  }

  onMounted(async () => {
    await loadDropdowns();
    onSearch();
  });

  return {
    searchForm,
    showDisabledPayChannelID,
    showDisabledService,
    loading,
    columns,
    dataList,
    pagination,
    total,
    subjectOptions,
    payChannelOptions,
    serviceOptions,
    summaryMethod,
    onSearch,
    resetForm,
    exportXlsx,
    handleEditNote,
    handleShowDisabledService,
    handleShowDisabledPayChannelID
  };
}
