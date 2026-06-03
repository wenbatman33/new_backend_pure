import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import { hasAuth } from "@/router/utils";
import editForm from "../form.vue";
import logTable from "../log.vue";
import {
  getLotteryList,
  getLotteryById,
  createLottery,
  updateLottery,
  deleteLotteryById,
  updateLotteryStatus,
  type LotteryListResult
} from "@/api/promotion";
import type { FormItemProps, LotteryItem, BonusItem } from "./types";

// 状态对应文案
const statusMap: Record<number, string> = {
  1: $t("promotion.lotteryStatusRunning"),
  2: $t("promotion.lotteryStatusPending"),
  3: $t("promotion.lotteryStatusEnded"),
  4: $t("promotion.lotteryStatusComing")
};

// 抢红包时长选项
export const durationOptions = [
  { label: $t("promotion.lotteryDuration5"), value: 5 },
  { label: $t("promotion.lotteryDuration10"), value: 10 },
  { label: $t("promotion.lotteryDuration15"), value: 15 },
  { label: $t("promotion.lotteryDuration20"), value: 20 },
  { label: $t("promotion.lotteryDuration30"), value: 30 }
];

export function useLottery() {
  const searchForm = reactive({
    startTime: "",
    endTime: "",
    name: "",
    time: ""
  });
  const dataList = ref<LotteryItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80, sortable: true },
    { label: $t("promotion.lotteryName"), prop: "name", minWidth: 160 },
    {
      label: $t("promotion.lotteryEventTime"),
      prop: "eventTime",
      minWidth: 160,
      cellRenderer: ({ row }) => <span>{row.eventTime || "-"}</span>
    },
    {
      label: $t("promotion.lotteryStatus"),
      prop: "status",
      width: 110,
      cellRenderer: ({ row }) => <span>{statusMap[row.status] ?? row.status}</span>
    },
    { label: $t("promotion.lotteryDuration"), prop: "time", width: 120 },
    { label: $t("promotion.lotteryPeople"), prop: "people", width: 110 },
    {
      label: $t("promotion.lotterySendTime"),
      prop: "sendTime",
      minWidth: 160,
      cellRenderer: ({ row }) => <span>{row.sendTime || "-"}</span>
    },
    {
      label: $t("promotion.lotteryUpdatedUser"),
      prop: "updatedUser",
      minWidth: 140,
      cellRenderer: ({ row }) => <span>{row.updatedUser || "-"}</span>
    },
    { label: $t("promotion.action"), fixed: "right", width: 320, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = (await getLotteryList({
        startTime: searchForm.startTime,
        endTime: searchForm.endTime,
        name: searchForm.name,
        time: searchForm.time,
        page: pagination.currentPage,
        size: pagination.pageSize
      })) as LotteryListResult;
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
    onSearch();
  }

  // 把后端返回的资料(verifyData/bonus 等)转回表单结构
  function toFormInline(record: any, mode: string): FormItemProps {
    const verifyType: number[] = [];
    let verifyAmount = "";
    let verifyAmount2 = "";
    let leagueID: string[] = [];

    if (record?.verifyData && Array.isArray(record.verifyData)) {
      record.verifyData.forEach((item: any) => {
        verifyType.push(item.verifyType);
        if (item.verifyType === 1) verifyAmount = item.verifyAmount;
        if (item.verifyType === 2) verifyAmount2 = item.verifyAmount;
        if (item.verifyType === 3)
          leagueID = item.leagueID ? String(item.leagueID).split(",") : [];
      });
    }

    const bonusList: BonusItem[] =
      record?.bonus && record.bonus.length > 0
        ? record.bonus.map((b: any) => ({ amount: b.amount, percent: b.percent }))
        : [{ amount: "", percent: "" }];

    return {
      id: record?.id,
      name: record?.name ?? "",
      eventTime:
        record?.eventTime && record.eventTime !== "0000-00-00 00:00:00"
          ? record.eventTime
          : "",
      time: record?.time ?? "",
      amountMax: !record?.amountMax || record.amountMax === 0 ? "" : record.amountMax,
      peopleMax: !record?.peopleMax || record.peopleMax === 0 ? "" : record.peopleMax,
      verifyType,
      verifyAmount,
      verifyAmount2,
      leagueID,
      withdrawLimit: record?.withdrawLimit ?? "",
      bonusList,
      matchScheduleTimesEnabled:
        record?.matchScheduleTimes !== undefined && record?.matchScheduleTimes >= 0,
      matchScheduleTimes:
        record?.matchScheduleTimes >= 0 ? record.matchScheduleTimes : "",
      matchScheduleId: record?.matchScheduleId ?? "",
      websocketDeeplinkLink: record?.websocketDeeplinkLink ?? "1",
      websocketTitle: record?.websocketTitle ?? "",
      websocketImaage: record?.websocketImaage ?? "",
      mode
    };
  }

  // 把表单结构组回后端 payload
  function toPayload(form: FormItemProps) {
    const bonusList = (form.bonusList || []).filter(
      b => !(b.amount === "" && b.percent === "")
    );
    const totalPercent = bonusList.reduce((a, b) => a + Number(b.percent || 0), 0);
    const bonus = bonusList.map(b => {
      let percent = Number(b.percent);
      if (totalPercent > 100) percent = Number(((percent / totalPercent) * 100).toFixed(2));
      return { amount: b.amount, percent };
    });

    const verifyData: any[] = [];
    if (form.verifyType.includes(1))
      verifyData.push({ verifyType: 1, verifyAmount: +form.verifyAmount });
    if (form.verifyType.includes(2))
      verifyData.push({ verifyType: 2, verifyAmount: +form.verifyAmount2 });
    if (form.verifyType.includes(3))
      verifyData.push({
        verifyType: 3,
        verifyAmount: 0,
        leagueID: form.leagueID.join(",")
      });

    const payload: any = {
      name: form.name,
      eventTime: form.eventTime,
      time: form.time,
      amountMax: form.amountMax === "" ? 0 : Number(form.amountMax),
      peopleMax: form.peopleMax === "" ? 0 : Number(form.peopleMax),
      withdrawLimit: form.withdrawLimit,
      bonus,
      verifyData,
      websocketDeeplinkLink: form.websocketDeeplinkLink,
      websocketTitle: form.websocketTitle,
      websocketImaage: form.websocketImaage
    };

    if (form.matchScheduleTimesEnabled) {
      payload.matchScheduleTimes = +form.matchScheduleTimes;
    }
    if (form.matchScheduleId) {
      payload.matchScheduleId = +form.matchScheduleId;
    }
    return payload;
  }

  // 开启新增/编辑/查看对话框
  // type: create / update / copy / read
  async function openDialog(type: string, row?: LotteryItem) {
    let record: any = {};
    if (type === "create") {
      record = {};
    } else {
      // update / copy / read 皆先取得明细
      const { data } = await getLotteryById(row.id);
      record = data ?? {};
    }
    // copy 视为新增(沿用旧逻辑：复制内容但走 create)
    const dialogMode = type === "update" ? "update" : type === "read" ? "read" : "create";
    const isRead = dialogMode === "read";

    const titleMap: Record<string, string> = {
      create: $t("promotion.lotteryTitleCreate"),
      update: $t("promotion.lotteryTitleUpdate"),
      read: $t("promotion.lotteryTitleRead")
    };

    addDialog({
      title: titleMap[type] ?? titleMap.create,
      props: {
        formInline: toFormInline(record, dialogMode),
        readonly: isRead
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: isRead,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as any).formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          // 检查条件需至少满足填值
          if (curData.verifyType.includes(1) && curData.verifyAmount === "") {
            message($t("promotion.lotteryVerifyTypeRequired"), { type: "warning" });
            return;
          }
          if (curData.verifyType.includes(2) && curData.verifyAmount2 === "") {
            message($t("promotion.lotteryVerifyTypeRequired"), { type: "warning" });
            return;
          }
          if (curData.verifyType.includes(3) && curData.leagueID.length === 0) {
            message($t("promotion.lotteryVerifyTypeRequired"), { type: "warning" });
            return;
          }
          if (!curData.withdrawLimit) {
            message($t("promotion.lotteryWithdrawLimit"), { type: "warning" });
            return;
          }
          const payload = toPayload(curData);
          if (dialogMode === "update") {
            payload.id = curData.id;
            const { success } = await updateLottery(payload);
            if (success) {
              message($t("promotion.lotteryTitleUpdate"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await createLottery(payload);
            if (success) {
              message($t("promotion.lotteryTitleCreate"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  // 状态变更确认(启用/即将启用/待启用/停止)
  // mode: start(1) / coming(4) / pending(2) / stop(3)
  function handleStatusChange(mode: string, row: LotteryItem) {
    const confirmMap: Record<string, { msg: string; status: number }> = {
      start: { msg: $t("promotion.lotteryConfirmStart"), status: 1 },
      coming: { msg: $t("promotion.lotteryConfirmComing"), status: 4 },
      pending: { msg: $t("promotion.lotteryConfirmPending"), status: 2 },
      stop: { msg: $t("promotion.lotteryConfirmStop"), status: 3 }
    };
    const conf = confirmMap[mode];
    ElMessageBox.confirm(conf.msg, "", { type: "warning" })
      .then(async () => {
        const { success } = await updateLotteryStatus({
          id: row.id,
          status: conf.status
        });
        if (success) {
          message($t("promotion.operateSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  function handleDelete(row: LotteryItem) {
    ElMessageBox.confirm($t("promotion.lotteryConfirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteLotteryById(row.id);
        if (success) {
          message($t("promotion.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 操作记录对话框
  function openLog(row: LotteryItem) {
    addDialog({
      title: $t("promotion.lotteryOperateLog"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(logTable, { logId: row.id })
    });
  }

  // 依状态回传可用操作清单(沿用旧逻辑)
  function rowActions(row: LotteryItem) {
    const read = { key: "read", label: $t("promotion.lotteryActionRead"), auth: "__btn_page_visible" };
    const update = { key: "update", label: $t("promotion.lotteryActionEdit"), auth: "__btn_lottery_edit" };
    const copy = { key: "copy", label: $t("promotion.lotteryActionCopy"), auth: "__btn_lottery_create" };
    const start = { key: "start", label: $t("promotion.lotteryActionStart"), auth: "__btn_lottery_active" };
    const coming = { key: "coming", label: $t("promotion.lotteryActionComing"), auth: "__btn_lottery_active" };
    const pending = { key: "pending", label: $t("promotion.lotteryActionPending"), auth: "__btn_lottery_active" };
    const stop = { key: "stop", label: $t("promotion.lotteryActionStop"), auth: "__btn_lottery_active" };
    const del = { key: "delete", label: $t("promotion.lotteryActionDelete"), auth: "__btn_lottery_copy" };
    const log = { key: "log", label: $t("promotion.lotteryActionLog"), auth: "__btn_lottery_record" };

    let list: any[] = [];
    switch (row.status) {
      case 1:
        list = [read, stop, copy, log];
        break;
      case 2:
        list = [read, coming, update, del, copy, log];
        break;
      case 3:
        list = [read, copy, log];
        break;
      case 4:
        list = [read, pending, start, update, copy, log];
        break;
    }
    return list.filter(a => hasAuth(a.auth));
  }

  // 分派操作
  function dispatchAction(key: string, row: LotteryItem) {
    switch (key) {
      case "read":
        openDialog("read", row);
        break;
      case "update":
        openDialog("update", row);
        break;
      case "copy":
        openDialog("copy", row);
        break;
      case "log":
        openLog(row);
        break;
      case "delete":
        handleDelete(row);
        break;
      case "start":
      case "coming":
      case "pending":
      case "stop":
        handleStatusChange(key, row);
        break;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    durationOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    rowActions,
    dispatchAction
  };
}
