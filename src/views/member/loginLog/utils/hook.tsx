import { reactive, ref, onMounted } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { getMemberLoginLog } from "@/api/member";
import type { LoginLogItem, SearchFormProps } from "./types";

/** 失敗原因代碼對應文案 */
const failReasonMap: Record<number, string> = {
  2: $t("member.loginLogFail2"),
  3: $t("member.loginLogFail3"),
  4: $t("member.loginLogFail4"),
  5: $t("member.loginLogFail5"),
  6: $t("member.loginLogFail6"),
  7: $t("member.loginLogFail7")
};

export function useLoginLog() {
  const route = useRoute();

  const searchForm = reactive<SearchFormProps>({
    account: "",
    exactlyMatching: 2,
    loginIP: "",
    loginDeviceID: "",
    // 預設：昨日 00:00:00 ~ 今日 23:59:59
    loginStartTime: dayjs()
      .subtract(1, "day")
      .hour(0)
      .minute(0)
      .second(0)
      .format("YYYY-MM-DD HH:mm:ss"),
    loginEndTime: dayjs()
      .hour(23)
      .minute(59)
      .second(59)
      .format("YYYY-MM-DD HH:mm:ss"),
    registerStartTime: "",
    registerEndTime: "",
    loginType: ""
  });

  // 搜尋列日期區間（el-date-picker 用陣列綁定）
  const loginTimeRange = ref<[string, string] | []>([
    searchForm.loginStartTime,
    searchForm.loginEndTime
  ]);
  const registerTimeRange = ref<[string, string] | []>([]);

  const dataList = ref<LoginLogItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const loginTypeOptions = [
    { label: $t("member.register"), value: 1 },
    { label: $t("member.login"), value: 2 }
  ];

  const matchingOptions = [
    { label: $t("member.exactMatch"), value: 1 },
    { label: $t("member.fuzzyMatch"), value: 2 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("member.memberAccount"),
      prop: "account",
      width: 160,
      slot: "account"
    },
    { label: $t("member.name"), prop: "name", width: 120 },
    { label: $t("member.createdAt"), prop: "registeredAt", width: 170, sortable: true },
    {
      label: $t("member.loginLogType"),
      prop: "loginType",
      width: 110,
      cellRenderer: ({ row }) => {
        switch (Number(row.loginType)) {
          case 1:
            return <span style="color:#F00">{$t("member.loginLogRegister")}</span>;
          case 2:
            return <span>{$t("member.loginLogLogin")}</span>;
          default:
            return <span>{row.loginType}</span>;
        }
      }
    },
    { label: $t("member.loginArea"), prop: "loginArea", width: 110 },
    { label: $t("member.loginIP"), prop: "loginIP", width: 130 },
    { label: $t("member.loginDeviceID"), prop: "loginDeviceID", width: 130 },
    { label: $t("member.loginDeviceType"), prop: "loginDeviceType", width: 120 },
    { label: $t("member.appVersion"), prop: "appVersion", width: 110, hide: true },
    { label: "User Agent", prop: "loginUserAgent", width: 160, hide: true },
    { label: $t("member.loginTime"), prop: "createdAt", width: 170, sortable: true },
    {
      label: $t("member.loginResult"),
      prop: "success",
      width: 100,
      cellRenderer: ({ row }) =>
        row.success === 1 ? (
          <span style="color:#00BB00">{$t("member.success")}</span>
        ) : (
          <span style="color:#F00">{$t("member.fail")}</span>
        )
    },
    {
      label: $t("member.failReason"),
      prop: "failReason",
      width: 140,
      cellRenderer: ({ row }) => <span>{failReasonMap[row.failReason] ?? "-"}</span>
    }
  ];

  /** 組合查詢參數，依登入型別過濾不需要的時間欄位 */
  function buildParams() {
    const params: Recordable = {
      account: searchForm.account || undefined,
      exactlyMatching: searchForm.exactlyMatching,
      loginIP: searchForm.loginIP || undefined,
      loginDeviceID: searchForm.loginDeviceID || undefined,
      loginType: searchForm.loginType || undefined,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };

    if (loginTimeRange.value && loginTimeRange.value.length === 2) {
      params.loginStartTime = loginTimeRange.value[0];
      params.loginEndTime = loginTimeRange.value[1];
    }
    if (registerTimeRange.value && registerTimeRange.value.length === 2) {
      params.registerStartTime = registerTimeRange.value[0];
      params.registerEndTime = registerTimeRange.value[1];
    }

    // 依舊邏輯：loginType=1 不帶登入時間，loginType=2 不帶註冊時間
    if (Number(searchForm.loginType) === 1) {
      delete params.loginStartTime;
      delete params.loginEndTime;
    }
    if (Number(searchForm.loginType) === 2) {
      delete params.registerStartTime;
      delete params.registerEndTime;
    }

    for (const key in params) {
      if (params[key] === undefined || params[key] === "") {
        delete params[key];
      }
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getMemberLoginLog(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    loginTimeRange.value = [];
    registerTimeRange.value = [];
    searchForm.loginType = "";
    searchForm.exactlyMatching = 2;
    pagination.currentPage = 1;
    onSearch();
  }

  // TODO: 匯出原依賴 @/components/Excel(jsonToSheetXlsx) 與 @/utils/report，
  // 該共用層尚未移植到 pure-admin，先以 CSV 簡易匯出佔位，移植後再替換。
  async function handleExport() {
    loading.value = true;
    try {
      const params = { ...buildParams(), page: 1, pageSize: 5000 };
      const { data } = await getMemberLoginLog(params);
      const rows = data?.list ?? [];
      const header = [
        "account",
        "name",
        "registeredAt",
        "loginType",
        "loginArea",
        "loginIP",
        "loginDeviceID",
        "loginDeviceType",
        "createdAt",
        "success",
        "failReason"
      ];
      const csv = [
        header.join(","),
        ...rows.map((r: LoginLogItem) =>
          header.map(k => `"${(r as Recordable)[k] ?? ""}"`).join(",")
        )
      ].join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "MemberLoginLog.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      loading.value = false;
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  /** 點帳號開新視窗看會員明細 */
  function handleView(row: LoginLogItem) {
    window.open(`/memberDetail/detail/${row.memberID}`);
  }

  onMounted(() => {
    // 支援 URL 帶 loginIP 直接查詢
    const loginIP = route.query.loginIP as string;
    if (loginIP) {
      searchForm.loginIP = loginIP;
    }
    onSearch();
  });

  return {
    searchForm,
    loginTimeRange,
    registerTimeRange,
    loginTypeOptions,
    matchingOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleExport,
    handleSizeChange,
    handleCurrentChange,
    handleView
  };
}
