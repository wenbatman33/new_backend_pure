import { h, ref, reactive, onMounted, onUnmounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import { hasAuth } from "@/router/utils";
import dayjs from "dayjs";
import createForm from "../form.vue";
import balanceDateForm from "../balanceDate.vue";
import {
  getAgencyDepositList,
  postAgencyDepositCallback,
  putAgencyDepositReview,
  putAgencyDepositForceFail,
  putAgencyDepositForceSuccess,
  putAgencyDepositBalanceDate,
  getAgencyDepositNote,
  postAgencyDepositNote,
  postAgencyDepositFee,
  postAgencyDeposit,
  getAgencyDepositBeep,
  getPayChannelServiceDropdown,
  getPayChannelDropdown,
  getPayChannelNameDropdown,
  getPayChannelServiceList,
  type AgencyDepositItem,
  type PayChannelServiceItem
} from "@/api/agency";
import type { FormItemProps, BalanceDateFormItemProps } from "./types";

// 狀態 1 處理中 2 取消 3 完成 4 逾時 5 失敗 6 審核中
const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: $t("agency.depositProcessing"), type: "warning" },
  2: { text: $t("agency.depositCancel"), type: "info" },
  3: { text: $t("agency.depositComplete"), type: "success" },
  4: { text: $t("agency.depositTimeout"), type: "info" },
  5: { text: $t("agency.depositFail"), type: "danger" },
  6: { text: $t("agency.depositReviewing"), type: "warning" }
};

// 到帳方式 1 系統 2 手動 4 代理
const typeMap: Record<number, string> = {
  1: $t("agency.depositTypeSystem"),
  2: $t("agency.depositTypeManual"),
  4: $t("agency.depositTypeAgency")
};

export function useAgencyDeposit() {
  const searchForm = reactive({
    createdAtStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    createdAtEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    status: 0,
    id: "",
    method: "",
    memberName: "",
    serviceName: "",
    type: 0,
    payChannelID: "",
    payChannelNameID: "",
    bankcard: "",
    updateAtStart: "",
    updateAtEnd: "",
    balanceDate: ""
  });

  // 搜尋用日期範圍（el-date-picker v-model）
  const createdAtRange = ref<[Date, Date] | null>([
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ]);
  const updateAtRange = ref<[Date, Date] | null>(null);

  const dataList = ref<AgencyDepositItem[]>([]);
  const loading = ref(true);
  // 統計列（標題列顯示）
  const summary = reactive({
    count: 0,
    amount: 0,
    fee: 0,
    erctotal: 0,
    trctotal: 0
  });
  // 自動刷新
  const autoReload = ref(false);
  const intervalTime = ref(20);
  let reloadTimer: any = null;

  // 下拉資料
  const methodOptions = ref<Array<{ label: string; value: string }>>([]);
  const payChannelOptions = ref<Array<{ label: string; value: number }>>([]);
  const payChannelNameOptions = ref<Array<{ label: string; value: number }>>(
    []
  );
  const serviceList = ref<PayChannelServiceItem[]>([]);

  const statusOptions = [
    { label: $t("agency.depositAll"), value: 0 },
    { label: $t("agency.depositProcessing"), value: 1 },
    { label: $t("agency.depositCancel"), value: 2 },
    { label: $t("agency.depositComplete"), value: 3 },
    { label: $t("agency.depositTimeout"), value: 4 },
    { label: $t("agency.depositFail"), value: 5 },
    { label: $t("agency.depositReviewing"), value: 6 }
  ];

  const balanceTypeOptions = [
    { label: $t("agency.depositAll"), value: 0 },
    { label: $t("agency.depositTypeSystem"), value: 1 },
    { label: $t("agency.depositTypeManual"), value: 2 },
    { label: $t("agency.depositTypeAgency"), value: 4 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("agency.refIds"), prop: "id", fixed: "left", width: 250 },
    {
      label: $t("agency.transactionTime"),
      prop: "createdAt",
      width: 180,
      sortable: true
    },
    {
      label: $t("agency.amountOfDepositCertificate"),
      prop: "amount",
      width: 150,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>{Number(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("agency.status"),
      prop: "status",
      width: 110,
      cellRenderer: ({ row }) => (
        <el-tag type={statusMap[row.status]?.type ?? "info"} effect="plain">
          {statusMap[row.status]?.text ?? row.status}
        </el-tag>
      )
    },
    { label: $t("agency.agencyAccount"), prop: "memberAccount", width: 150 },
    { label: $t("agency.memberName"), prop: "memberName", width: 150 },
    { label: $t("agency.depositor"), prop: "depositName", width: 150 },
    { label: $t("agency.payment"), prop: "payment", width: 150 },
    { label: $t("agency.depositLine"), prop: "gatway", width: 150 },
    {
      label: $t("agency.bankCard"),
      prop: "bankcard",
      width: 150,
      cellRenderer: ({ row }) => <span>{row.bankcard || "-"}</span>
    },
    { label: $t("agency.thirdPartyID"), prop: "thirdID", width: 150 },
    {
      label: $t("agency.balanceType"),
      prop: "type",
      width: 120,
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    {
      label: $t("agency.lastUpdate"),
      prop: "updatedAt",
      width: 180,
      sortable: true
    },
    { label: $t("agency.executor"), prop: "editorName", width: 150 },
    { label: $t("agency.balanceDate"), prop: "balanceDate", width: 150 },
    { label: $t("agency.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  function buildQuery() {
    const query: Record<string, any> = { source: 2 };
    const src: Record<string, any> = { ...searchForm };
    Object.keys(src).forEach(key => {
      const v = src[key];
      if (v !== undefined && v !== "" && v !== Number.MIN_VALUE) {
        query[key] = v;
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    // 同步日期範圍到查詢欄位
    if (createdAtRange.value?.length === 2) {
      searchForm.createdAtStart = dayjs(createdAtRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.createdAtEnd = dayjs(createdAtRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      searchForm.createdAtStart = "";
      searchForm.createdAtEnd = "";
    }
    if (updateAtRange.value?.length === 2) {
      searchForm.updateAtStart = dayjs(updateAtRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.updateAtEnd = dayjs(updateAtRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      searchForm.updateAtStart = "";
      searchForm.updateAtEnd = "";
    }
    try {
      const { success, data } = await getAgencyDepositList(buildQuery());
      if (success) {
        dataList.value = data?.list ?? [];
        pagination.total = data?.count ?? 0;
        summary.count = data?.count ?? 0;
        summary.amount = data?.amount ?? 0;
        summary.fee = data?.fee ?? 0;
        summary.erctotal = data?.erctotal ?? 0;
        summary.trctotal = data?.trctotal ?? 0;
      }
      // 新單提示音
      const beep = await getAgencyDepositBeep();
      if (beep?.data?.hasAgencyDeposit) {
        // TODO: makeSound 依賴 @/utils/country（已移植可用），此處保留提示音掛點
      }
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  function scheduleReload() {
    clearTimeout(reloadTimer);
    const t = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, t);
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    createdAtRange.value = [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ];
    updateAtRange.value = null;
    searchForm.status = 0;
    searchForm.type = 0;
    searchForm.id = "";
    searchForm.method = "";
    searchForm.memberName = "";
    searchForm.serviceName = "";
    searchForm.payChannelID = "";
    searchForm.payChannelNameID = "";
    searchForm.bankcard = "";
    searchForm.balanceDate = "";
    onSearch();
  }

  // 新增存款單
  function openCreateDialog() {
    const formRef = ref();
    addDialog({
      title: $t("agency.addDepositSlip"),
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          memberAccount: "",
          balanceDate: "",
          amount: "",
          thirdID: "",
          payChannelServiceID: "",
          payChannelServiceIDIsEnable: 1,
          fee: "",
          currency: 1,
          otherAmount: "",
          notePrefix: "",
          noteSuffix: ""
        },
        serviceOptions: serviceList.value
      },
      contentRenderer: () => h(createForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (dayjs(curData.balanceDate).isAfter(dayjs())) {
            message($t("agency.balanceDateNotFuture"), { type: "error" });
            return;
          }
          const { success } = await postAgencyDeposit({
            source: 2,
            memberAccount: curData.memberAccount,
            balanceDate: curData.balanceDate,
            amount: curData.amount,
            payChannelServiceID: curData.payChannelServiceID,
            fee: curData.fee,
            thirdID: curData.thirdID,
            note: `${curData.notePrefix} ${curData.noteSuffix}`,
            currency: curData.currency,
            otherAmount: curData.otherAmount
          });
          if (success) {
            message($t("agency.createSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 修改入帳日期
  function openBalanceDateDialog(row: AgencyDepositItem) {
    const formRef = ref();
    addDialog({
      title: $t("agency.depositAction5"),
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          id: row.id,
          memberAccount: row.memberAccount,
          createdAt: row.createdAt,
          amount: row.amount,
          thirdID: row.thirdID,
          gatway:
            serviceList.value.find(s => String(s.id) === String(row.gatway))
              ?.name ||
            row.gatway ||
            "",
          balanceDate: dayjs().format("YYYY-MM-DD"),
          note: ""
        } as BalanceDateFormItemProps
      },
      contentRenderer: () => h(balanceDateForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as BalanceDateFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await putAgencyDepositBalanceDate({
            id: curData.id,
            balanceDate: curData.balanceDate,
            note: curData.note
          });
          if (success) {
            message($t("agency.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 查看操作記錄
  async function openNoteDialog(row: AgencyDepositItem) {
    const { success, data } = await getAgencyDepositNote({ id: row.id });
    if (!success) return;
    const list = data?.list ?? [];
    addDialog({
      title: $t("agency.record"),
      width: "720px",
      hideFooter: true,
      contentRenderer: () =>
        h(
          "div",
          { class: "max-h-[420px] overflow-auto" },
          list.length
            ? list.map((n: any) =>
                h("div", { class: "py-2 border-b border-[var(--el-border-color-lighter)]" }, [
                  h("div", { class: "text-sm text-[var(--el-text-color-secondary)]" }, `${n.createdAt} ${n.author || ""}`),
                  h("div", n.note)
                ])
              )
            : h("el-empty", { description: $t("agency.depositAll") })
        )
    });
  }

  // 新增備註
  function openPostNoteDialog(row: AgencyDepositItem) {
    const noteVal = ref("");
    addDialog({
      title: $t("agency.depositAction7"),
      width: "560px",
      draggable: true,
      contentRenderer: () =>
        h("el-input", {
          modelValue: noteVal.value,
          "onUpdate:modelValue": (v: string) => (noteVal.value = v),
          type: "textarea",
          rows: 5,
          placeholder: $t("agency.description")
        }),
      beforeSure: async done => {
        if (!noteVal.value) {
          message($t("agency.description"), { type: "warning" });
          return;
        }
        const { success } = await postAgencyDepositNote({
          id: row.id,
          note: noteVal.value
        });
        if (success) {
          message($t("agency.createSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  // 訂單查詢（三方回調）
  async function handleCallback(row: AgencyDepositItem) {
    if (row.status === 3) {
      message(`${row.id} ${$t("agency.depositAction2")}`, { type: "success" });
      return;
    }
    const { success } = await postAgencyDepositCallback({ id: row.id });
    if (success) {
      message(`${row.id} ${$t("agency.depositAction3")}`, { type: "success" });
    } else {
      message(`${row.id} ${$t("agency.depositAction4")}`, { type: "warning" });
    }
  }

  // 強制失敗（彈出備註）
  function handleForceFail(row: AgencyDepositItem) {
    ElMessageBox.prompt($t("agency.description"), $t("agency.depositAction8"), {
      inputType: "textarea"
    })
      .then(async ({ value }) => {
        const { success } = await putAgencyDepositForceFail({
          orderSn: row.id,
          note: value || ""
        });
        if (success) {
          message($t("agency.editSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 強制成功（彈出備註）
  function handleForceSuccess(row: AgencyDepositItem) {
    ElMessageBox.prompt($t("agency.description"), $t("agency.depositAction9"), {
      inputType: "textarea"
    })
      .then(async ({ value }) => {
        const { success } = await putAgencyDepositForceSuccess({
          orderSn: row.id,
          note: value || ""
        });
        if (success) {
          message($t("agency.editSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 審核中 強制成功（review）
  function handleReviewSuccess(row: AgencyDepositItem) {
    ElMessageBox.confirm(
      `${$t("agency.depositForceSuccess1")}：${row.id}`,
      "",
      { type: "warning" }
    )
      .then(async () => {
        const { success } = await putAgencyDepositReview({
          orderSn: row.id,
          note: ""
        });
        if (success) {
          message($t("agency.depositForceSuccess2"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 依 status/type 計算可用操作（沿用舊邏輯）
  function getRowActions(row: AgencyDepositItem) {
    const acts: Array<{ key: string; label: string; auth?: string; type?: string }> = [];
    const push = (key: string, label: string, auth?: string, type?: string) =>
      acts.push({ key, label, auth, type });
    if (row.type === 1 && row.status === 1) {
      push("callback", $t("agency.depositAction1"));
      push("forceFail", $t("agency.depositAction8"), "__btn_deposit_hard_reject", "danger");
      push("forceSuccess", $t("agency.depositAction9"), "__btn_deposit_hard_success", "success");
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
      push("postNote", $t("agency.depositAction7"), "__btn_agency_deposit_remark");
    } else if (row.type === 1 && row.status === 2) {
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
      push("postNote", $t("agency.depositAction7"), "__btn_agency_deposit_remark");
      push("forceSuccess", $t("agency.depositAction9"), "__btn_deposit_hard_success", "success");
    } else if (row.status === 3) {
      push("balanceDate", $t("agency.depositAction5"), "__btn_deposit_balancedate");
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
      push("postNote", $t("agency.depositAction7"), "__btn_agency_deposit_remark");
    } else if (row.type === 1 && row.status === 4) {
      push("forceSuccess", $t("agency.depositAction9"), "__btn_deposit_hard_success", "success");
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
    } else if ((row.type !== 1 && row.status === 4) || row.status === 5) {
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
    } else if (row.status === 6) {
      push("getNote", $t("agency.record"), "__btn_agency_deposit_record");
      push("reviewSuccess", $t("agency.depositAction9"), "__btn_deposit_hard_success_high", "success");
      push("forceFail", $t("agency.depositAction8"), "__btn_deposit_hard_reject", "danger");
      push("postNote", $t("agency.depositAction7"), "__btn_agency_deposit_remark");
    }
    return acts.filter(a => !a.auth || hasAuth(a.auth));
  }

  function onActionClick(key: string, row: AgencyDepositItem) {
    switch (key) {
      case "callback":
        return handleCallback(row);
      case "forceFail":
        return handleForceFail(row);
      case "forceSuccess":
        return handleForceSuccess(row);
      case "reviewSuccess":
        return handleReviewSuccess(row);
      case "balanceDate":
        return openBalanceDateDialog(row);
      case "getNote":
        return openNoteDialog(row);
      case "postNote":
        return openPostNoteDialog(row);
    }
  }

  // 計算手續費（給新增表單呼叫）
  async function computeFee(payChannelServiceID: string, amount: string) {
    const { success, data } = await postAgencyDepositFee({
      payChannelServiceID,
      amount
    });
    return success ? data?.fee : undefined;
  }

  async function loadOptions() {
    const [dropdown, channel, channelName, service] = await Promise.all([
      getPayChannelServiceDropdown(),
      getPayChannelDropdown(),
      getPayChannelNameDropdown(),
      getPayChannelServiceList({ pageSize: 9999 })
    ]);
    if (dropdown?.success) {
      const sc = dropdown.data?.serviceCode ?? [];
      methodOptions.value = sc.map((el: any) => {
        const key = Object.keys(el)[0];
        return { label: String(el[key]), value: String(key) };
      });
    }
    if (channel?.success) {
      payChannelOptions.value = (channel.data?.list ?? []).map((el: any) => ({
        label: el.sn || "",
        value: el.id || 0
      }));
    }
    if (channelName?.success) {
      payChannelNameOptions.value = (channelName.data?.list ?? []).map(
        (el: any) => ({ label: el.name || "", value: el.id || 0 })
      );
    }
    if (service?.success) {
      serviceList.value = service.data?.list ?? [];
    }
  }

  onMounted(() => {
    loadOptions();
    onSearch();
  });

  onUnmounted(() => clearTimeout(reloadTimer));

  return {
    searchForm,
    createdAtRange,
    updateAtRange,
    loading,
    columns,
    dataList,
    pagination,
    summary,
    autoReload,
    intervalTime,
    statusOptions,
    balanceTypeOptions,
    methodOptions,
    payChannelOptions,
    payChannelNameOptions,
    serviceList,
    onSearch,
    resetForm,
    scheduleReload,
    openCreateDialog,
    getRowActions,
    onActionClick,
    computeFee
  };
}
