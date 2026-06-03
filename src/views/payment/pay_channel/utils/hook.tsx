import { h, ref, reactive, onMounted, onUnmounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import editForm from "../form.vue";
import nameForm from "../nameForm.vue";
import gcashForm from "../gcashForm.vue";
import amountForm from "../amountForm.vue";
import {
  getPayChannelList,
  getPayChannelNameList,
  postPayChannel,
  putPayChannel,
  postPayChannelName,
  postPayChannelNameOfflineGcash,
  postPayChannelRemainAdd,
  postPayChannelRemainSub,
  postPayChannelAp,
  type PayChannelItem,
  type PayChannelNameItem
} from "@/api/payment";
import type { FormItemProps } from "./types";

export function usePayChannel() {
  const searchForm = reactive({
    sn: "",
    status: 1,
    name: "",
    supplyAp: ""
  });
  const dataList = ref<PayChannelItem[]>([]);
  const nameList = ref<PayChannelNameItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 自動刷新
  const autoReload = ref(false);
  const intervalTime = ref(20);
  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("payment.all"), value: 0 },
    { label: $t("payment.enable"), value: 1 },
    { label: $t("payment.disable"), value: 2 }
  ];
  const supplyApOptions = [
    { label: $t("payment.all"), value: "" },
    { label: $t("payment.yes"), value: "true" },
    { label: $t("payment.no"), value: "false" }
  ];

  // 狀態標籤渲染
  function renderStatus(status: number) {
    if (status === 1)
      return <el-tag type="success">{$t("payment.enable")}</el-tag>;
    return <el-tag type="info">{$t("payment.disable")}</el-tag>;
  }

  const columns: TableColumnList = [
    {
      label: $t("payment.merchant"),
      prop: "sn",
      fixed: "left",
      width: 200,
      cellRenderer: ({ row }) => (
        <div>
          <div class="font-bold">{row.sn}</div>
          <div class="text-gray-400 text-xs">{row.name}</div>
        </div>
      )
    },
    { label: $t("payment.merchant2"), prop: "name", width: 150 },
    {
      label: $t("payment.todayDepositTotal"),
      prop: "todayDepositTotal",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>{Number(row.todayDepositTotal || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.todayWithdrawalTotal"),
      prop: "todayWithdrawalTotal",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>{Number(row.todayWithdrawalTotal || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.outLimit"),
      prop: "apLimit",
      width: 150,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.apLowerLimit || 0).toLocaleString()}~
          {Number(row.apUpperLimit || 0).toLocaleString()}
        </span>
      )
    },
    {
      label: $t("payment.thirdBalance"),
      prop: "thirdBalance",
      width: 150,
      cellRenderer: ({ row }) => {
        const text = String(row.thirdBalance ?? "--");
        const parts = text.split(",");
        if (parts.length > 1)
          return <div>{parts.map(p => <div>{p}</div>)}</div>;
        return (
          <span>{parts[0] === "--" ? "--" : commaDecimalFormat(parts[0], 2)}</span>
        );
      }
    },
    {
      label: $t("payment.depositRatio"),
      prop: "depositRatio",
      width: 220,
      cellRenderer: ({ row }) => (
        <el-progress
          percentage={Math.min(Number(row.depositRatio || 0), 100)}
          stroke-width={14}
          text-inside
        />
      )
    },
    {
      label: $t("payment.thirdSecondBalance"),
      prop: "thirdSecondBalance",
      width: 150
    },
    {
      label: $t("payment.merchantStatus"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => renderStatus(row.status)
    },
    {
      label: $t("payment.operate"),
      fixed: "right",
      width: 320,
      slot: "operation"
    }
  ];

  function buildQuery() {
    const query: Record<string, any> = { ...searchForm };
    Object.keys(query).forEach(k => {
      if (query[k] === undefined || query[k] === "" || query[k] === 0) {
        delete query[k];
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPayChannelList(buildQuery());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    if (!autoReload.value) return;
    const ms = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, ms);
  }

  function onAutoReloadChange() {
    scheduleReload();
  }

  async function initNameList() {
    const { data } = await getPayChannelNameList();
    nameList.value = data?.list ?? [];
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 1;
    onSearch();
  }

  // 新增 / 編輯商戶號
  function openDialog(title = $t("payment.addMerchant"), row?: PayChannelItem) {
    const matched = nameList.value.find(n => n.name === row?.name);
    addDialog({
      title,
      props: {
        nameList: nameList.value,
        formInline: {
          id: row?.id,
          payChannelNameID: matched?.id ?? "",
          sn: row?.sn ?? "",
          method: row?.method ?? 0,
          supplyAp: row?.supplyAp === true,
          apLowerLimit: row?.apLowerLimit ?? 0,
          apUpperLimit: row?.apUpperLimit ?? 0,
          apDayLimit: row?.apDayLimit ?? 0,
          depositLimit: row?.depositLimit ?? "",
          note: row?.note ?? "",
          status: row?.status ?? 1
        }
      },
      width: "560px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = curData.id ? putPayChannel : postPayChannel;
          const { success } = await fn({ ...curData });
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 新增商戶名
  function openNameDialog() {
    addDialog({
      title: $t("payment.addMerchantName"),
      props: { formInline: { name: "" } },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(nameForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as { name: string };
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await postPayChannelName({ name: curData.name });
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            initNameList();
          }
        });
      }
    });
  }

  // 新增線下 Gcash 線路
  function openGcashDialog() {
    addDialog({
      title: $t("payment.addGcash"),
      props: { formInline: { name: "", phone: "", qrcode: "" } },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(gcashForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await postPayChannelNameOfflineGcash({
            ...curData
          });
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            initNameList();
          }
        });
      }
    });
  }

  // 充值 / 結算
  function openAmountDialog(type: "add" | "sub", row: PayChannelItem) {
    const title =
      type === "add" ? $t("payment.remainAdd") : $t("payment.remainSub");
    addDialog({
      title: `${title} - ${row.sn}`,
      props: { formInline: { amount: "", fee: "", thirdID: "", note: "" } },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(amountForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = type === "add" ? postPayChannelRemainAdd : postPayChannelRemainSub;
          const { success } = await fn({ id: row.id, ...curData });
          if (success) {
            message($t("payment.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 啟用 / 停用商戶號
  async function handleStatus(row: PayChannelItem) {
    const matched = nameList.value.find(n => n.name === row.name);
    const status = row.status === 1 ? 2 : 1;
    const { success } = await putPayChannel({
      ...row,
      status,
      payChannelNameID: matched?.id ?? 0
    });
    if (success) {
      message($t("payment.success"), { type: "success" });
      onSearch();
    } else {
      message($t("payment.fail"), { type: "error" });
    }
  }

  // 代付狀態切換
  async function handleApStatus(row: PayChannelItem) {
    const apStatus = row.apStatus === 1 ? 2 : 1;
    const { success } = await postPayChannelAp({ id: row.id, apStatus });
    if (success) {
      message($t("payment.success"), { type: "success" });
      onSearch();
    }
  }

  onMounted(async () => {
    await initNameList();
    onSearch();
  });

  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    searchForm,
    statusOptions,
    supplyApOptions,
    nameList,
    autoReload,
    intervalTime,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onAutoReloadChange,
    resetForm,
    openDialog,
    openNameDialog,
    openGcashDialog,
    openAmountDialog,
    handleStatus,
    handleApStatus
  };
}
