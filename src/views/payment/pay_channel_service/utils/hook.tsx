import { h, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import groupForm from "../groupForm.vue";
import {
  getPayChannelServiceList,
  getPayChannelServiceById,
  createPayChannelService,
  putEditPayChannelService,
  putPayChannelServiceSort,
  getPayChannelServiceGroupsExclude,
  putPayChannelServiceGroups,
  getPayChannelServiceChannelDropdown,
  type ServiceItem
} from "@/api/payment";
import type { FormItemProps, GroupTransferItem } from "./types";

export function usePayChannelService() {
  const router = useRouter();

  const searchForm = reactive({
    name: "",
    status: "1",
    serviceCode: "",
    method: "",
    payChannelID: "",
    bankGroupID: "",
    thirdGroupID: ""
  });

  const dataList = ref<ServiceItem[]>([]);
  const loading = ref(true);
  // 下拉清單
  const dropdown = reactive({
    serviceCode: [] as Array<{ label: any; value: any }>,
    method: [] as Array<{ label: any; value: any }>,
    payChannel: [] as Array<{ label: any; value: any }>,
    bankGroups: [] as Array<{ label: any; value: any }>,
    thirdGroups: [] as Array<{ label: any; value: any }>
  });
  // serviceCode 下拉是 [{ key:value }] 結構，編輯/新增表單用
  const serviceCodeRaw = ref<any[]>([]);

  const statusOptions = [
    { label: $t("payment.all"), value: "3" },
    { label: $t("payment.enable"), value: "1" },
    { label: $t("payment.disable"), value: "0" }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 60 },
    {
      label: $t("payment.lineName"),
      prop: "name",
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => showRowData(row)}>
          {row.name}
        </el-link>
      )
    },
    {
      label: $t("payment.cashGroup"),
      prop: "groups",
      cellRenderer: ({ row }) => (
        <span>
          {(row.groups || []).map((item: any, idx: number) => (
            <el-tag key={idx} type="success" class="m-1">
              {(item.type === 1
                ? `${$t("payment.tripartite")}/`
                : `${$t("payment.bankCard")}/`) + item.value}
            </el-tag>
          ))}
        </span>
      )
    },
    { label: $t("payment.proportion"), prop: "weight", width: 60 },
    { label: $t("payment.totalProportion"), prop: "weighted", width: 110 },
    {
      label: $t("payment.rate"),
      prop: "rate",
      width: 100,
      cellRenderer: ({ row }) => <span>{row.rate}%</span>
    },
    { label: $t("payment.amount"), prop: "amount", width: 120 },
    {
      label: $t("payment.lowerLimit"),
      prop: "lowerLimit",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.lowerLimit ?? 0).toLocaleString()} ~{" "}
          {Number(row.upperLimit ?? 0).toLocaleString()}
        </span>
      )
    },
    {
      label: $t("payment.handlingFee"),
      prop: "fee",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.fee}‰ + {row.perFee}
        </span>
      )
    },
    {
      label: $t("payment.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) =>
        String(row.status) === "1" ? (
          <span style="color: var(--el-color-success)">
            {$t("payment.enable")}
          </span>
        ) : (
          <span style="color: var(--el-color-danger)">
            {$t("payment.disable")}
          </span>
        )
    },
    { label: $t("payment.remark"), prop: "note", width: 130 },
    { label: $t("payment.operate"), fixed: "right", width: 220, slot: "operation" }
  ];

  // 移除空查詢
  function buildQuery() {
    const query: Record<string, any> = { ...searchForm };
    Object.keys(query).forEach(k => {
      if (query[k] === undefined || query[k] === "") delete query[k];
      else query[k] = String(query[k]);
    });
    // status 為 3（全部）時不送
    if (Number(query.status) === 3) delete query.status;
    return query;
  }

  async function fetchDropdown() {
    const { data } = await getPayChannelServiceChannelDropdown();
    const toOpts = (arr: any[]) =>
      (arr || []).map(item => ({
        label: String(item.value),
        value: String(item.key)
      }));
    serviceCodeRaw.value = data?.serviceCode || [];
    // serviceCode / method 是 [{ key: value }] 物件陣列
    const kvToOpts = (arr: any[]) =>
      (arr || []).map(item => ({
        label: Object.values(item)[0],
        value: Object.keys(item)[0]
      }));
    dropdown.serviceCode = kvToOpts(data?.serviceCode || []);
    dropdown.method = kvToOpts(data?.method || []);
    dropdown.payChannel = toOpts(data?.payChannel || []);
    dropdown.bankGroups = toOpts(data?.bankGroups || []);
    dropdown.thirdGroups = toOpts(data?.thirdGroups || []);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPayChannelServiceList(buildQuery());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? data?.list?.length ?? 0;
      await fetchDropdown();
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 開啟新增/編輯/查看對話框
  function openServiceDialog(
    mode: string,
    record?: ServiceItem,
    showFrontDeskName = false
  ) {
    const formRef = ref();
    const titleMap: Record<string, string> = {
      Create: $t("payment.addRoute"),
      Edit: $t("payment.editRoute"),
      ShowRowData: $t("payment.checkRoute")
    };
    const formInline: FormItemProps =
      mode === "Create"
        ? {
            id: "",
            payChannelID: "",
            status: 0,
            show: 1,
            name: "",
            device: "",
            weight: "",
            serviceCode: [],
            qrcodeImage: "",
            displayName: "",
            note: "",
            lowerLimit: "",
            upperLimit: "",
            dayLimit: "",
            fee: "",
            perFee: ""
          }
        : {
            ...record,
            serviceCode: record?.serviceCode
              ? [String(record.serviceCode)]
              : []
          };

    addDialog({
      title: titleMap[mode],
      width: "75%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        mode,
        showFrontDeskName,
        serviceCodeOptions: dropdown.serviceCode,
        payChannelOptions: dropdown.payChannel,
        formInline
      },
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        // 查看模式按確認不送出
        if (mode === "ShowRowData") {
          done();
          return;
        }
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload: any = {
            ...curData,
            type: 2,
            device: curData.device ? String(curData.device) : undefined,
            serviceCode: Array.isArray(curData.serviceCode)
              ? curData.serviceCode.join("")
              : curData.serviceCode
          };
          const fn =
            mode === "Create"
              ? createPayChannelService
              : putEditPayChannelService;
          const { success } = await fn(payload);
          if (success) {
            message(
              mode === "Create"
                ? $t("payment.addSuccess")
                : $t("payment.editSuccess"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleCreate() {
    openServiceDialog("Create");
  }

  async function handleEdit(row: ServiceItem) {
    const { data } = await getPayChannelServiceById({
      id: row.id,
      type: row.type
    });
    openServiceDialog(
      "Edit",
      { ...row, ...data },
      data?.depositAllowChoosePayChannelService ?? false
    );
  }

  async function showRowData(row: ServiceItem) {
    const { data } = await getPayChannelServiceById({
      id: row.id,
      type: row.type
    });
    openServiceDialog(
      "ShowRowData",
      { ...row, ...data },
      data?.depositAllowChoosePayChannelService ?? false
    );
  }

  // 啟用/停用
  async function handleToggleStatus(row: ServiceItem) {
    const payload: any = {
      id: row.id,
      status: String(row.status) === "1" ? "0" : "1",
      name: row.name,
      payChannelID: row.payChannelID,
      device: row.device,
      serviceCode: row.serviceCode,
      note: row.note,
      upperLimit: row.upperLimit,
      lowerLimit: row.lowerLimit,
      dayLimit: row.dayLimit,
      fee: row.fee,
      perFee: row.perFee,
      qrcodeImage: row.qrcodeImage
    };
    const { success } = await putEditPayChannelService(payload);
    if (success) {
      message(
        payload.status === "1"
          ? $t("payment.activated")
          : $t("payment.terminated"),
        { type: "success" }
      );
      onSearch();
    }
  }

  // 金流群組設定（穿梭框）
  async function handleGroupSetting(row: ServiceItem) {
    const type = row.serviceCode === "gw" ? 2 : 1;
    const { data } = await getPayChannelServiceGroupsExclude({
      id: row.id,
      type
    });
    const toItem = (item: any, keyField: string): GroupTransferItem => ({
      key: String(item[keyField]),
      label: `${
        item.type === 1 ? $t("payment.tripartite") : $t("payment.bankCard")
      }/${item.value}`,
      value: item.value,
      type: item.type
    });
    // 已選（當前線路的群組）
    const rowGroups = (row.groups || [])
      .map((item: any) => toItem(item, "key"))
      .sort((a, b) => a.type - b.type);
    // 全部可選群組 = 已選 + exclude 回傳
    const excludeGroups = (data?.groups || []).map((item: any) =>
      toItem(item, "id")
    );
    const allGroups = [...rowGroups, ...excludeGroups].sort(
      (a, b) => a.type - b.type
    );
    const targetKeys = rowGroups.map(g => g.key);

    const groupRef = ref();
    addDialog({
      title: $t("payment.groupSettings"),
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      props: {
        allGroups,
        targetKeys
      },
      contentRenderer: () => h(groupForm, { ref: groupRef }),
      beforeSure: async done => {
        const ids = groupRef.value.getTargetKeys().map((k: string) => Number(k));
        const { success } = await putPayChannelServiceGroups({
          id: Number(row.id),
          ids
        });
        if (success) {
          message($t("payment.groupSettingSuccessful"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  // 帳單明細：另開視窗
  function openBillDetail(row: ServiceItem) {
    const newUrl = router.resolve({
      path: "/finance_report/paychannel_report",
      query: { payChannelService: String(row.name) }
    });
    window.open(newUrl.href, "_blank");
  }

  // 拖曳排序（保留邏輯，pure-table 無內建拖曳，後續以 sortablejs 接入）
  async function handleSort(id: number, sort: number) {
    await putPayChannelServiceSort({ id, sort });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    dropdown,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleCreate,
    handleEdit,
    handleToggleStatus,
    handleGroupSetting,
    openBillDetail,
    handleSort
  };
}
