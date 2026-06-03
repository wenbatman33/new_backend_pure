import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getBankCardLog,
  postBankCardLogNote,
  getBankCardDropdown,
  getChannelDropdown
} from "@/api/finance_report";
import type { BankCardLogItem, FormItemProps } from "./types";

export function useBankcardReport() {
  // 預設交易時間：今日 00:00 ~ 23:59
  const defaultStart = dayjs().hour(0).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
  const defaultEnd = dayjs().hour(23).minute(59).second(59).format("YYYY-MM-DD HH:mm:ss");

  const searchForm = reactive({
    // el-date-picker datetimerange 綁定的陣列
    dateRange: [defaultStart, defaultEnd] as [string, string] | null,
    cardNo: "",
    // 顯示停用銀行卡
    showDisabledCardNo: false,
    // 科目（多選）
    subjects: [] as number[]
  });

  const dataList = ref<BankCardLogItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 統計
  const total = reactive({
    count: 0,
    countIn: 0,
    countOut: 0,
    totalFee: 0
  });

  // 下拉：銀行卡（啟用）/ 全部
  const allCardOptions = ref<{ label: string; value: string; status: number }[]>([]);
  const cardNoOptions = ref<{ label: string; value: string; status?: number }[]>([]);
  // 科目下拉
  const subjectOptions = ref<{ label: string; value: number }[]>([]);

  // 依「顯示停用」切換可選的銀行卡清單
  function refreshCardOptions() {
    const base = searchForm.showDisabledCardNo
      ? allCardOptions.value
      : allCardOptions.value.filter(c => c.status === 1);
    cardNoOptions.value = [{ label: $t("finance_report.all"), value: "" }, ...base];
  }

  function filterSubject(id: number) {
    const found = subjectOptions.value.find(s => s.value === id);
    return found ? found.label : "";
  }

  const columns: TableColumnList = [
    {
      label: $t("finance_report.tradeTime"),
      prop: "logTime",
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{row.logTime ? dayjs(row.logTime).format("YYYY/MM/DD HH:mm:ss") : ""}</span>
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
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <span>{row.type === 1 ? Number(row.amount).toLocaleString() : ""}</span>
      )
    },
    {
      label: $t("finance_report.expenditure"),
      prop: "out",
      minWidth: 90,
      cellRenderer: ({ row }) => (
        <span>{row.type === 2 ? Number(row.amount).toLocaleString() : ""}</span>
      )
    },
    {
      label: $t("finance_report.handlingFee"),
      prop: "fee",
      minWidth: 90,
      cellRenderer: ({ row }) => <span>{Number(row.fee).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.balance"),
      prop: "balance",
      minWidth: 90,
      cellRenderer: ({ row }) => <span>{Number(row.balance).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.relatedOrderNumber"),
      prop: "tradeID",
      minWidth: 100
    },
    {
      label: $t("finance_report.thirdPartyID"),
      prop: "thirdParty",
      minWidth: 100
    },
    {
      label: $t("finance_report.tradingPartners"),
      prop: "tradeObject",
      minWidth: 150
    },
    {
      label: $t("finance_report.executor"),
      prop: "updatedUser",
      minWidth: 90
    },
    {
      label: $t("finance_report.remark"),
      prop: "note",
      minWidth: 140,
      slot: "note"
    }
  ];

  async function onSearch() {
    // 若有填日期區間才送，未填則不帶
    const params: Record<string, any> = {
      cardNo: searchForm.cardNo,
      subjects: searchForm.subjects.length ? searchForm.subjects.join(",") : undefined
    };
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.logTimeStart = searchForm.dateRange[0];
      params.logTimeEnd = searchForm.dateRange[1];
    }
    // 移除空值
    Object.keys(params).forEach(k => {
      if (params[k] === undefined || params[k] === "") delete params[k];
    });

    loading.value = true;
    try {
      const { data } = await getBankCardLog(params);
      const list = data?.list ?? [];
      dataList.value = list;
      total.count = data?.count ?? 0;
      total.countIn = data?.countIn ?? 0;
      total.countOut = data?.countOut ?? 0;
      total.totalFee = list.reduce((prev, next) => prev + (next.fee || 0), 0);
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.dateRange = [defaultStart, defaultEnd];
    searchForm.cardNo = "";
    searchForm.showDisabledCardNo = false;
    searchForm.subjects = [];
    refreshCardOptions();
    onSearch();
  }

  // 匯出 Excel：pure-admin 未移植舊 jsonToSheetXlsx，先以 TODO 佔位
  function exportXlsx() {
    // TODO: 待移植 @/components/Excel 後補上匯出邏輯
    message($t("finance_report.exportNotReady"), { type: "warning" });
  }

  // 編輯備註
  function handleEditNote(row: BankCardLogItem) {
    addDialog({
      title: $t("finance_report.modifyRemarks"),
      props: {
        formInline: {
          bankcardLogID: row.ID,
          note: row.note ?? ""
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
          const { success } = await postBankCardLogNote({
            bankcardLogID: curData.bankcardLogID,
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

  onMounted(async () => {
    // 科目下拉
    const { data: channel } = await getChannelDropdown();
    subjectOptions.value = (channel?.subjects ?? []).map(item => ({
      label: item.name,
      value: item.subjectID
    }));
    // 銀行卡下拉
    const { data: card } = await getBankCardDropdown();
    allCardOptions.value = (card?.bankcards ?? []).map(b => ({
      value: b.card_no,
      status: b.status,
      label: `${b.card_no}/${b.account_name}`
    }));
    refreshCardOptions();

    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    total,
    cardNoOptions,
    subjectOptions,
    onSearch,
    resetForm,
    refreshCardOptions,
    exportXlsx,
    handleEditNote
  };
}
