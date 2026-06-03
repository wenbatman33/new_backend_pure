import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getUcardLog,
  getUcardList,
  getChannelDropdown,
  editUcardLogNote,
  type UsdtReportItem
} from "@/api/finance_report";
import type { FormItemProps } from "./types";

export function useUsdtReport() {
  // 搜寻条件：时间区间用 datetimerange，subjects 多选，usdtID 单选
  const searchForm = reactive<{
    dateRange: [Date, Date] | [];
    usdtID: string;
    subjects: number[];
  }>({
    dateRange: [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ],
    usdtID: "",
    subjects: []
  });

  const dataList = ref<UsdtReportItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // U 钱包帐户下拉
  const usdtOptions = ref<{ label: string; value: string }[]>([]);
  // 科目下拉（subjectID -> name）
  const subjectList = ref<{ subjectID: number; name: string }[]>([]);

  // 汇总
  const summaryInfo = reactive({
    count: 0,
    countIn: 0,
    countOut: 0
  });

  // 给汇出 excel 用的原始资料
  const xlsxData = ref<UsdtReportItem[]>([]);

  function filterSubject(id: number) {
    const result = subjectList.value.find(item => item.subjectID === id);
    return result ? result.name : "";
  }

  const columns: TableColumnList = [
    {
      label: $t("finance_report.tradeTime"),
      prop: "createdAt",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <span>{row.createdAt ? dayjs(row.createdAt).format("YYYY/MM/DD HH:mm:ss") : ""}</span>
      )
    },
    {
      label: $t("finance_report.subject"),
      prop: "subjectID",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{filterSubject(row.subjectID)}</span>
    },
    {
      label: $t("finance_report.income"),
      prop: "in",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{(row.type === 1 ? row.amount : row.in).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.expenditure"),
      prop: "out",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{(row.type === 2 ? row.amount : row.out).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.handlingFee"),
      prop: "fee",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{(row.fee ?? 0).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.balance"),
      prop: "balance",
      minWidth: 100,
      cellRenderer: ({ row }) => <span>{(row.balance ?? 0).toLocaleString()}</span>
    },
    {
      label: $t("finance_report.relatedOrderNumber"),
      prop: "relationID",
      minWidth: 120
    },
    {
      label: $t("finance_report.thirdPartyID"),
      prop: "thirdID",
      minWidth: 120
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

  function buildParams() {
    const params: Recordable = {
      usdtID: searchForm.usdtID || undefined,
      subjects:
        searchForm.subjects && searchForm.subjects.length
          ? searchForm.subjects.join(",")
          : undefined
    };
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.createdAtStart = dayjs(searchForm.dateRange[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      params.createdAtEnd = dayjs(searchForm.dateRange[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getUcardLog(buildParams());
      const list = data?.list ?? [];
      dataList.value = list;
      xlsxData.value = list;
      summaryInfo.count = data?.count ?? list.length;
      summaryInfo.countIn = data?.countIn ?? 0;
      summaryInfo.countOut = data?.countOut ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.dateRange = [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ];
    searchForm.usdtID = "";
    searchForm.subjects = [];
    onSearch();
  }

  // 编辑备注
  function openNoteDialog(row: UsdtReportItem) {
    addDialog({
      title: $t("finance_report.modifyRemarks"),
      props: {
        formInline: {
          id: row.id,
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
          const { success } = await editUcardLogNote({
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

  // 汇出 excel（TODO: 旧专案使用 jsonToSheetXlsx，pure 端可接 @/utils/report，
  // 此处先以原始资料触发，待汇出工具确认后再补）
  function exportXlsx() {
    message($t("finance_report.exportexcel"), { type: "info" });
  }

  onMounted(async () => {
    // 取得科目下拉
    try {
      const { data } = await getChannelDropdown();
      subjectList.value = data?.subjects ?? [];
    } catch (e) {
      subjectList.value = [];
    }
    // 取得 U 钱包帐户下拉
    try {
      const { data } = await getUcardList({});
      usdtOptions.value = (data?.list ?? []).map(item => ({
        value: String(item.id),
        label: item.name
      }));
    } catch (e) {
      usdtOptions.value = [];
    }
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    usdtOptions,
    subjectList,
    summaryInfo,
    xlsxData,
    onSearch,
    resetForm,
    openNoteDialog,
    exportXlsx
  };
}
