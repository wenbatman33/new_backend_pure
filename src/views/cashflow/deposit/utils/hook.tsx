import "element-plus/dist/index.css";
import { h, ref, reactive, onMounted, onUnmounted, computed } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { commaDecimalFormat } from "@/utils/number";
import { currency, makeSound } from "@/utils/country";
import { exportExcel } from "@/utils/report";
import {
  getDepositList,
  postDeposit,
  getDepositNote,
  postDepositNote,
  putDepositBalanceDate,
  postDepositCallback,
  postDepositHaveNewList,
  putDepositForceFail,
  putDepositForceSuccess,
  putDepositReview,
  getPayGroupList,
  getPayChannelServiceDropdown,
  getPayChannelList,
  getPayChannelNameList,
  getPayChannelServiceList,
  type DepositItem
} from "@/api/cashflow";
import editForm from "../form.vue";
import forceForm from "../forceForm.vue";
import balanceForm from "../balanceForm.vue";
import noteForm from "../noteForm.vue";
import type {
  CreateFormItemProps,
  ForceFormItemProps,
  BalanceDateFormItemProps,
  NoteFormItemProps
} from "./types";

// 狀態文案對應
const statusMap: Record<number, string> = {
  1: $t("cashflow.status1"),
  2: $t("cashflow.status2"),
  3: $t("cashflow.status3"),
  4: $t("cashflow.status4"),
  5: $t("cashflow.status5"),
  6: $t("cashflow.status6")
};
// 狀態顏色
const statusColor: Record<number, string> = {
  1: "#e6a23c",
  2: "#f56c6c",
  3: "#67c23a",
  4: "#f56c6c"
};
// 到帳方式
const typeMap: Record<number, string> = {
  1: $t("cashflow.depositForm2"),
  2: $t("cashflow.depositForm3"),
  4: $t("cashflow.depositForm4")
};
// 裝置
const deviceMap: Record<number, string> = {
  1: "WEB",
  2: "H5_android",
  4: "H5_ios",
  8: "pwa_android",
  16: "pwa_ios"
};

export function useDeposit() {
  const searchForm = reactive({
    createdAtRange: [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ] as [string, string],
    status: 0,
    id: "",
    method: "",
    memberName: "",
    serviceName: "",
    payGroupID: "",
    bankcardGroupID: "",
    type: 0,
    payChannelID: "",
    payChannelNameID: "",
    device: "",
    bankcard: "",
    amountMin: "" as string | number,
    amountMax: "" as string | number,
    updateAtRange: [] as string[],
    balanceDate: ""
  });

  const dataList = ref<DepositItem[]>([]);
  const loading = ref(true);
  const showUTC = ref(false);

  // 表頭統計
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
  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  // 下拉選項資料
  const methods = ref<any[]>([]);
  const payGroups = ref<any[]>([]);
  const bankcardGroups = ref<any[]>([]);
  const payChannels = ref<any[]>([]);
  const payChannelNames = ref<any[]>([]);
  const payChannelServices = ref<any[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 搜尋下拉選項
  const statusOptions = [
    { label: $t("cashflow.all"), value: 0 },
    { label: $t("cashflow.status1"), value: 1 },
    { label: $t("cashflow.status2"), value: 2 },
    { label: $t("cashflow.status3"), value: 3 },
    { label: $t("cashflow.status4"), value: 4 },
    { label: $t("cashflow.status5"), value: 5 },
    { label: $t("cashflow.status6"), value: 6 }
  ];
  const typeOptions = [
    { label: $t("cashflow.all"), value: 0 },
    { label: $t("cashflow.depositForm2"), value: 1 },
    { label: $t("cashflow.depositForm3"), value: 2 },
    { label: $t("cashflow.depositForm4"), value: 4 }
  ];
  const deviceOptions = [
    { label: $t("cashflow.all"), value: "" },
    { label: "WEB", value: 1 },
    { label: "H5_android", value: 2 },
    { label: "H5_ios", value: 4 },
    { label: "pwa_android", value: 8 },
    { label: "pwa_ios", value: 16 }
  ];
  const methodOptions = computed(() => [
    { label: $t("cashflow.all"), value: "" },
    ...methods.value.map(el => {
      const key = Object.keys(el)[0];
      return { label: `${el[key]}`, value: `${key}` };
    })
  ]);
  const payGroupOptions = computed(() => [
    { label: $t("cashflow.all"), value: "" },
    ...payGroups.value.map(el => ({ label: el.name || "", value: el.ID }))
  ]);
  const bankcardGroupOptions = computed(() => [
    { label: $t("cashflow.all"), value: "" },
    ...bankcardGroups.value.map(el => ({ label: el.name || "", value: el.ID }))
  ]);
  const payChannelOptions = computed(() => [
    { label: $t("cashflow.all"), value: "" },
    ...payChannels.value.map(el => ({ label: el.sn || "", value: el.id }))
  ]);
  const payChannelNameOptions = computed(() => [
    { label: $t("cashflow.all"), value: "" },
    ...payChannelNames.value.map(el => ({ label: el.name || "", value: el.id }))
  ]);
  // 新增存款單線路選項（僅顯示 show===1，依狀態排序）
  const serviceOptions = computed(() =>
    [...payChannelServices.value]
      .sort((a, b) => (a.status < b.status ? 1 : a.status > b.status ? -1 : 0))
      .filter(item => item.show === 1)
      .map(el => ({ label: el.name, value: el.id }))
  );

  // 表頭統計文案
  const title = computed(
    () =>
      `${$t("cashflow.count")}：${summary.count}，${$t("cashflow.totalAmount")}：${summary.amount}、ERC：${summary.erctotal}、TRC：${summary.trctotal}；${$t("cashflow.fee")}：${summary.fee}`
  );

  const columns: TableColumnList = [
    {
      label: $t("cashflow.transactionID"),
      prop: "id",
      fixed: "left",
      width: 220,
      cellRenderer: ({ row }) => (
        <div class="flex items-center justify-center">
          <span>{row.id}</span>
          <el-button
            link
            type="primary"
            class="ml-1"
            onClick={() => handleCopy(row.id)}
          >
            {$t("cashflow.copy")}
          </el-button>
        </div>
      )
    },
    {
      label: $t("cashflow.transactionTime"),
      prop: "createdAt",
      width: 160,
      cellRenderer: ({ row }) =>
        row.createdAt
          ? dayjs(row.createdAt).format("YYYY/MM/DD HH:mm:ss")
          : "-"
    },
    {
      label: `${$t("cashflow.transactionTime")} UTC+8`,
      prop: "createdAtUTC",
      width: 160,
      hide: () => !showUTC.value
    },
    {
      label: $t("cashflow.tableAmount"),
      prop: "amount",
      width: 120,
      cellRenderer: ({ row }) => {
        try {
          const amt = commaDecimalFormat(row.amount, 2);
          return Number(row.amount) > 10000
            ? h("span", { style: "color:red" }, amt)
            : amt;
        } catch {
          return row.amount;
        }
      }
    },
    { label: $t("cashflow.exchangeRate"), prop: "exchangeRate", width: 100 },
    { label: $t("cashflow.USDTAmount"), prop: "otherAmount", width: 100 },
    {
      label: $t("cashflow.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) =>
        h(
          "span",
          { style: { color: statusColor[row.status] ?? "" } },
          statusMap[row.status] ?? row.status
        )
    },
    { label: $t("cashflow.gateway"), prop: "gatway", width: 150 },
    {
      label: $t("cashflow.thirdGroup"),
      prop: "payGroupId",
      width: 100,
      cellRenderer: ({ row }) =>
        payGroups.value.find(g => g.ID === row.payGroupId)?.name ?? ""
    },
    {
      label: $t("cashflow.bankGroup"),
      prop: "bankcardGroupId",
      width: 100,
      cellRenderer: ({ row }) =>
        bankcardGroups.value.find(g => g.ID === row.bankcardGroupId)?.name ?? ""
    },
    { label: $t("cashflow.memberAC"), prop: "memberAccount", width: 120 },
    { label: $t("cashflow.memberName"), prop: "memberName", width: 120 },
    { label: $t("cashflow.depositor"), prop: "depositName", width: 150 },
    {
      label: $t("cashflow.thirdPartyID"),
      prop: "thirdID",
      cellRenderer: ({ row }) =>
        row.thirdID === "" || row.thirdID === undefined
          ? row.userRemark
            ? `${row.refNum}(${row.userRemark})`
            : row.refNum
          : row.thirdID
    },
    {
      label: $t("cashflow.currency"),
      prop: "currency",
      width: 90,
      cellRenderer: ({ row }) => {
        if (row.currency === 2) return "USDT-ERC";
        if (row.currency === 3) return "USDT-TRC";
        if (row.currency === 4) return $t("cashflow.openEcnyModal");
        return currency();
      }
    },
    {
      label: $t("cashflow.lastUpdate"),
      prop: "updatedAt",
      width: 160,
      cellRenderer: ({ row }) =>
        row.updatedAt
          ? dayjs(row.updatedAt).format("YYYY/MM/DD HH:mm:ss")
          : "-"
    },
    {
      label: `${$t("cashflow.lastUpdate")} UTC+8`,
      prop: "updatedAtUTC",
      width: 160,
      hide: () => !showUTC.value
    },
    {
      label: $t("cashflow.bankCard"),
      prop: "bankcard",
      width: 150,
      cellRenderer: ({ row }) =>
        row.bankcard === "" || row.bankcard === undefined ? "-" : row.bankcard
    },
    {
      label: $t("cashflow.balanceType"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => typeMap[row.type] ?? row.type
    },
    {
      label: $t("cashflow.discount"),
      prop: "value",
      width: 120,
      cellRenderer: ({ row }) => row.promotion?.[0]?.value ?? ""
    },
    { label: $t("cashflow.person"), prop: "editorName", width: 100 },
    {
      label: $t("cashflow.balanceDate"),
      prop: "balanceDate",
      width: 110,
      cellRenderer: ({ row }) =>
        row.balanceDate ? dayjs(row.balanceDate).format("YYYY/MM/DD") : "-"
    },
    {
      label: $t("cashflow.platform"),
      prop: "device",
      width: 110,
      cellRenderer: ({ row }) => deviceMap[row.device] ?? row.device
    },
    { label: $t("cashflow.agencyID"), prop: "agencyID", width: 100 },
    {
      label: $t("cashflow.action"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  // 複製單號
  function handleCopy(id?: string) {
    if (!id) return;
    navigator.clipboard
      ?.writeText(id)
      .then(() =>
        message(`${id} ${$t("cashflow.copySuccess")}`, { type: "success" })
      )
      .catch(() => message(`${id} ${$t("cashflow.copyFail")}`, { type: "error" }));
  }

  // 組裝查詢參數
  function buildQuery() {
    const [createdAtStart, createdAtEnd] = searchForm.createdAtRange || [];
    const [updateAtStart, updateAtEnd] = searchForm.updateAtRange || [];
    const query: Record<string, any> = {
      createdAtStart,
      createdAtEnd,
      updateAtStart,
      updateAtEnd,
      status: searchForm.status,
      id: searchForm.id,
      method: searchForm.method,
      memberName: searchForm.memberName,
      serviceName: searchForm.serviceName,
      payGroupID: searchForm.payGroupID,
      bankcardGroupID: searchForm.bankcardGroupID,
      type: searchForm.type,
      payChannelID: searchForm.payChannelID,
      payChannelNameID: searchForm.payChannelNameID,
      device: searchForm.device,
      bankcard: searchForm.bankcard,
      amountMin: searchForm.amountMin,
      amountMax: searchForm.amountMax,
      balanceDate: searchForm.balanceDate
    };
    Object.keys(query).forEach(k => {
      if (query[k] === undefined || query[k] === "") delete query[k];
    });
    return query;
  }

  async function onSearch() {
    const [createdAtStart, createdAtEnd] = searchForm.createdAtRange || [];
    if (!createdAtStart || !createdAtEnd) {
      message($t("cashflow.plzKeyDate"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const { success, data } = await getDepositList(buildQuery());
      if (success) {
        const list = data?.list ?? [];
        list.forEach((item: any) => {
          item.createdAtUTC = item.createdAt
            ? dayjs(item.createdAt).add(8, "hour").format("YYYY-MM-DD HH:mm:ss")
            : "";
          item.updatedAtUTC = item.updatedAt
            ? dayjs(item.updatedAt).add(8, "hour").format("YYYY-MM-DD HH:mm:ss")
            : "";
        });
        dataList.value = list;
        summary.count = data?.count ?? 0;
        summary.amount = data?.amount ?? 0;
        summary.fee = data?.fee ?? 0;
        summary.erctotal = data?.erctotal ?? 0;
        summary.trctotal = data?.trctotal ?? 0;
        pagination.total = data?.count ?? list.length;
      }
      // 偵測新存款單發出提示音
      const { data: beep } = await postDepositHaveNewList();
      if (beep?.hasMemberDeposit) makeSound("member_deposit_beep");
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  // 自動刷新排程
  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    const ms = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, ms);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.createdAtRange = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    searchForm.updateAtRange = [];
    searchForm.status = 0;
    searchForm.type = 0;
    onSearch();
  }

  // 匯出
  function handleExport() {
    exportExcel("/backend/pay/deposit/export", { ...buildQuery(), source: 1 });
  }

  // 新增存款單
  const createFormRef = ref();
  function openDialog() {
    createFormRef.value = ref();
    addDialog({
      title: $t("cashflow.create"),
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          memberAccount: "",
          balanceDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          amount: "",
          thirdID: "",
          payChannelServiceID: "",
          fee: "",
          currency: 1,
          otherAmount: "",
          notePrefix: "",
          noteSuffix: ""
        },
        serviceOptions: serviceOptions.value
      },
      contentRenderer: () => h(editForm, { ref: createFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = createFormRef.value.getRef();
        const curData = options.props.formInline as CreateFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          if (dayjs(curData.balanceDate).isAfter(dayjs())) {
            message($t("cashflow.createModal5"), { type: "error" });
            return;
          }
          const { success } = await postDeposit({
            source: 1,
            memberAccount: curData.memberAccount,
            balanceDate: curData.balanceDate,
            amount: Number(curData.amount),
            payChannelServiceID: curData.payChannelServiceID,
            fee: Number(curData.fee),
            thirdID: curData.thirdID,
            currency: curData.currency,
            otherAmount: curData.otherAmount
              ? Number(curData.otherAmount)
              : undefined,
            note: `${curData.notePrefix} ${curData.noteSuffix}`
          });
          if (success) {
            message($t("cashflow.createOtpModal2"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 強制失敗 / 強制成功 / 高權限強制成功
  const forceFormRef = ref();
  function openForceDialog(
    row: DepositItem,
    kind: "fail" | "success" | "review"
  ) {
    forceFormRef.value = ref();
    const titleKey =
      kind === "fail"
        ? "cashflow.depositForceFail1"
        : "cashflow.depositForceSuccess1";
    addDialog({
      title: `${$t(titleKey)}：${row.id}`,
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: { note: "", thirdID: "" },
        needThirdID: kind === "success"
      },
      contentRenderer: () => h(forceForm, { ref: forceFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = forceFormRef.value.getRef();
        const curData = options.props.formInline as ForceFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const params = { orderSn: row.id, note: curData.note } as any;
          if (kind === "success") params.thirdID = curData.thirdID;
          let res: any;
          if (kind === "fail") res = await putDepositForceFail(params);
          else if (kind === "success")
            res = await putDepositForceSuccess(params);
          else res = await putDepositReview(params);
          if (res?.success) {
            message($t("cashflow.depositForceSuccess2"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 修改入帳日
  const balanceFormRef = ref();
  function openBalanceDialog(row: DepositItem) {
    balanceFormRef.value = ref();
    addDialog({
      title: $t("cashflow.balanceDateModal1"),
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: { balanceDate: dayjs().format("YYYY-MM-DD"), note: "" }
      },
      contentRenderer: () => h(balanceForm, { ref: balanceFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = balanceFormRef.value.getRef();
        const curData = options.props.formInline as BalanceDateFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await putDepositBalanceDate({
            id: row.id,
            balanceDate: curData.balanceDate,
            note: curData.note
          });
          if (success) {
            message($t("cashflow.balanceDateConfirmModal4"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 新增備註
  const noteFormRef = ref();
  function openNoteDialog(row: DepositItem) {
    noteFormRef.value = ref();
    addDialog({
      title: $t("cashflow.postNoteModal1"),
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      props: { formInline: { note: "" } },
      contentRenderer: () => h(noteForm, { ref: noteFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = noteFormRef.value.getRef();
        const curData = options.props.formInline as NoteFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await postDepositNote({
            id: row.id,
            note: curData.note
          });
          if (success) {
            message($t("cashflow.postNoteModal3"), { type: "success" });
            done();
          }
        });
      }
    });
  }

  // 查看訂單紀錄
  async function openGetNoteDialog(row: DepositItem) {
    const { success, data } = await getDepositNote({ id: row.id });
    const list = success ? data?.list ?? [] : [];
    addDialog({
      title: `${$t("cashflow.getNoteModal1")}：${row.id}`,
      width: "50%",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(
          "el-table" as any,
          { data: list, border: true, size: "small" },
          () => [
            h("el-table-column" as any, {
              label: $t("cashflow.time"),
              prop: "createdAt",
              width: 170
            }),
            h("el-table-column" as any, {
              label: $t("cashflow.updatedUser"),
              prop: "author",
              width: 140
            }),
            h("el-table-column" as any, {
              label: $t("cashflow.description"),
              prop: "note"
            })
          ]
        )
    });
  }

  // 三方回調查詢
  async function handleCallback(row: DepositItem) {
    if (row.status === 3) {
      message(`${row.id} ${$t("cashflow.depositAction2")}`, { type: "success" });
      return;
    }
    const { success } = await postDepositCallback({ id: row.id });
    if (success) {
      message(`${row.id} ${$t("cashflow.depositAction3")}`, { type: "success" });
      onSearch();
    } else {
      message(`${row.id} ${$t("cashflow.depositAction4")}`, { type: "warning" });
    }
  }

  // 依 type / status 計算可用操作（沿用舊邏輯）
  function getRowActions(row: DepositItem) {
    type Act = { key: string; label: string; type?: string; auth?: string };
    const list: Act[] = [];
    const push = (a: Act) => list.push(a);
    const callback = { key: "callback", label: $t("cashflow.depositAction1") };
    const forceFail = {
      key: "forceFail",
      label: $t("cashflow.depositAction8"),
      type: "danger",
      auth: "__btn_deposit_hard_reject"
    };
    const forceSuccess = {
      key: "forceSuccess",
      label: $t("cashflow.depositAction9"),
      type: "success",
      auth: "__btn_deposit_hard_success"
    };
    const forceSuccessHigh = {
      key: "forceSuccessHigh",
      label: $t("cashflow.depositAction9") + "1",
      type: "success",
      auth: "__btn_deposit_hard_success_high"
    };
    const balanceDate = {
      key: "balanceDate",
      label: $t("cashflow.depositAction5"),
      auth: "__btn_deposit_balancedate"
    };
    const getNote = {
      key: "getNote",
      label: $t("cashflow.record"),
      auth: "__btn_deposit_record"
    };
    const postNote = {
      key: "postNote",
      label: $t("cashflow.depositAction7"),
      auth: "__btn_deposit_remark"
    };

    if (row.type === 1 && row.status === 1) {
      push(callback);
      push(forceFail);
      push(forceSuccess);
      push(getNote);
      push(postNote);
    } else if (row.type === 1 && row.status === 2) {
      push(getNote);
      push(postNote);
      push(forceSuccess);
    } else if (row.status === 3) {
      push(balanceDate);
      push(getNote);
      push(postNote);
    } else if (row.type === 1 && row.status === 4) {
      push(forceSuccess);
      push(getNote);
    } else if ((row.type !== 1 && row.status === 4) || row.status === 5) {
      push(getNote);
    } else if (row.status === 6) {
      push(getNote);
      push(forceSuccessHigh);
      push(forceFail);
      push(postNote);
    }
    return list.filter(a => !a.auth || hasAuth(a.auth));
  }

  // 觸發各操作
  function runAction(key: string, row: DepositItem) {
    switch (key) {
      case "callback":
        return handleCallback(row);
      case "forceFail":
        return openForceDialog(row, "fail");
      case "forceSuccess":
        return openForceDialog(row, "success");
      case "forceSuccessHigh":
        return openForceDialog(row, "review");
      case "balanceDate":
        return openBalanceDialog(row);
      case "getNote":
        return openGetNoteDialog(row);
      case "postNote":
        return openNoteDialog(row);
    }
  }

  // 切換 UTC 欄位顯示
  function toggleUTC() {
    showUTC.value = !showUTC.value;
  }

  // 初始化下拉資料
  async function initOptions() {
    try {
      const { data } = await getPayChannelServiceDropdown();
      methods.value = data?.serviceCode ?? [];
    } catch {}
    try {
      const { data } = await getPayGroupList({ type: 1 });
      payGroups.value = data?.list ?? [];
    } catch {}
    try {
      const { data } = await getPayGroupList({ type: 2 });
      bankcardGroups.value = data?.list ?? [];
    } catch {}
    try {
      const { data } = await getPayChannelList();
      payChannels.value = data?.list ?? [];
    } catch {}
    try {
      const { data } = await getPayChannelNameList();
      payChannelNames.value = data?.list ?? [];
    } catch {}
    try {
      const { data } = await getPayChannelServiceList({
        status: 1,
        page: 1,
        pageSize: 99999
      });
      payChannelServices.value = data?.list ?? [];
    } catch {}
  }

  onMounted(async () => {
    await initOptions();
    onSearch();
  });

  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    title,
    showUTC,
    autoReload,
    intervalTime,
    statusOptions,
    typeOptions,
    deviceOptions,
    methodOptions,
    payGroupOptions,
    bankcardGroupOptions,
    payChannelOptions,
    payChannelNameOptions,
    onSearch,
    resetForm,
    handleExport,
    openDialog,
    toggleUTC,
    getRowActions,
    runAction
  };
}
