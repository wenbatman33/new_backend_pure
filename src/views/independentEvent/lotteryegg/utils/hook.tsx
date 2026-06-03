import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import { findByValue } from "@/utils/options";
import editForm from "../form.vue";
import {
  getEggList,
  getEggByID,
  createEgg,
  updateEgg,
  updateEggStatusByID,
  getEggLog,
  type EggItem
} from "@/api/independentEvent";
import type { FormItemProps } from "./types";

export function useLotteryEgg() {
  const searchForm = reactive({
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    name: "",
    roundTime: ""
  });
  const dataList = ref<EggItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 狀態：1 進行中 / 2 已結束
  const statusOptions = [
    { label: $t("independentEvent.lotteryeggStatus1"), value: 1 },
    { label: $t("independentEvent.lotteryeggStatus2"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    {
      label: $t("independentEvent.lotteryeggTblName"),
      prop: "name",
      minWidth: 200,
      cellRenderer: ({ row }) => (
        <span
          style="color:#fe647c;cursor:pointer;text-decoration:underline"
          onClick={() => openDialog("review", row)}
        >
          {row.name}
        </span>
      )
    },
    { label: $t("independentEvent.lotteryeggStartDate"), prop: "startDate", width: 120 },
    { label: $t("independentEvent.lotteryeggEndDate"), prop: "endDate", width: 120 },
    { label: $t("independentEvent.lotteryeggTblStartTime"), prop: "startTime", width: 160 },
    { label: $t("independentEvent.lotteryeggRoundTime"), prop: "roundTime", width: 90 },
    {
      label: $t("independentEvent.lotteryeggStatus"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{findByValue(statusOptions, row.status)}</span>
      )
    },
    { label: $t("independentEvent.lotteryeggUpdatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("independentEvent.lotteryeggUpdatedUser"), prop: "updatedUser", width: 100 },
    { label: $t("independentEvent.action"), fixed: "right", width: 260, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getEggList({
        startTime: searchForm.startTime,
        endTime: searchForm.endTime,
        startDate: searchForm.startDate,
        endDate: searchForm.endDate,
        name: searchForm.name,
        roundTime: searchForm.roundTime,
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
    searchForm.startTime = "";
    searchForm.endTime = "";
    searchForm.startDate = "";
    searchForm.endDate = "";
    onSearch();
  }

  // mode: create / edit / review
  async function openDialog(mode = "create", row?: EggItem) {
    let record: Partial<FormItemProps> = {
      name: "",
      promotionCode: "",
      startDate: "",
      endDate: "",
      startTime: "",
      roundTime: "",
      roundTotal: "",
      eventTurnover: "",
      game: [],
      withdrawLimit: "",
      memberMax: "",
      bonus: [{ amount: "", num: "" }],
      bonusLessNum: "",
      bonusLessAmount: ""
    };

    // edit / review / copy 需先抓單筆詳情
    if (row?.id && mode !== "create") {
      const { data } = await getEggByID(row.id);
      const detail: any = data ?? {};
      const bonusLess = detail.bonusLess?.[0] ?? { amount: "", num: "" };
      record = {
        ...record,
        ...detail,
        // startTime 後端回傳完整時間，取小時
        startTime: detail.startTime
          ? new Date(detail.startTime).getHours().toString().padStart(2, "0")
          : "",
        bonus:
          detail.bonus && detail.bonus.length > 0
            ? detail.bonus
            : [{ amount: "", num: "" }],
        bonusLessAmount: bonusLess.amount,
        bonusLessNum: bonusLess.num,
        game: (detail.game ?? []).filter((g: any) => g.gameTypeID > 0)
      };
      // copy 視為新增，移除 id
      if (mode === "copy") {
        delete record.id;
      }
    }

    const isReview = mode === "review";
    const titleMap: Record<string, string> = {
      create: $t("independentEvent.lotteryeggCreate"),
      edit: $t("independentEvent.lotteryeggEdit"),
      review: $t("independentEvent.lotteryeggReview"),
      copy: $t("independentEvent.lotteryeggCreate")
    };

    addDialog({
      title: `${$t("independentEvent.lotteryeggTitle")}/${titleMap[mode]}`,
      props: {
        formInline: record,
        disabled: isReview
      },
      width: "960px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: isReview,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;

          // 整理加碼獎勵：過濾空白、檢核數值
          const bonus = (curData.bonus ?? []).filter(
            b => !(b.amount === "" && b.num === "")
          );
          if (bonus.length === 0) {
            message($t("independentEvent.lotteryeggBonusEmpty"), { type: "error" });
            return;
          }
          const bonusInvalid = bonus.some(
            b => Number(b.amount) <= 0 || Number(b.num) <= 0
          );
          if (bonusInvalid) {
            message($t("independentEvent.lotteryeggBonusInvalid"), { type: "error" });
            return;
          }

          // 組合 startTime 為完整時間字串
          const startTimeStr = `${String(curData.startDate).substring(0, 10)} ${curData.startTime}:00:00`;

          const payload: any = {
            ...curData,
            startTime: startTimeStr,
            bonus,
            bonusLess: [
              { amount: curData.bonusLessAmount, num: curData.bonusLessNum }
            ]
          };

          const isEdit = mode === "edit" && curData.id;
          if (isEdit) {
            payload.id = curData.id;
          } else {
            delete payload.id;
          }

          const { success } = isEdit
            ? await updateEgg(payload)
            : await createEgg(payload);
          if (success) {
            message($t("independentEvent.lotteryeggSaveSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 查看異動紀錄
  async function openLog(row: EggItem) {
    const { data } = await getEggLog({ id: row.id });
    const logList = data?.list ?? [];
    const logColumns: TableColumnList = [
      { label: $t("independentEvent.lotteryeggLogUpdatedAt"), prop: "updatedAt", width: 160 },
      { label: $t("independentEvent.lotteryeggLogUpdatedUser"), prop: "updatedUser", width: 120 },
      { label: $t("independentEvent.lotteryeggLogItem"), prop: "item", width: 120 },
      { label: $t("independentEvent.lotteryeggLogContent"), prop: "content" }
    ];
    addDialog({
      title: $t("independentEvent.lotteryeggLog"),
      width: "1000px",
      hideFooter: true,
      contentRenderer: () =>
        h(
          "div",
          { class: "p-2" },
          logList.length
            ? logList.map((item: any) =>
                h("div", { class: "border-b py-1 text-sm" }, [
                  h("span", { class: "mr-4" }, item.updatedAt),
                  h("span", { class: "mr-4" }, item.updatedUser),
                  h("span", { class: "mr-4" }, item.item),
                  h("span", item.content)
                ])
              )
            : h("div", { class: "text-center py-4" }, "-")
        ),
      props: { logColumns }
    });
  }

  // 停用活動
  function handleStop(row: EggItem) {
    ElMessageBox.confirm($t("independentEvent.lotteryeggStopConfirm"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await updateEggStatusByID(row.id);
        if (success) {
          message($t("independentEvent.lotteryeggSaveSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    openLog,
    handleStop
  };
}
