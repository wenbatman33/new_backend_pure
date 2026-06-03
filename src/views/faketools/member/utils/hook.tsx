import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  fakeMemberCreate,
  fakeMemberSearch,
  fakeMemberEdit,
  fakeMemberPassword
} from "@/api/faketools";
import type { MemberRow, CreateFormState } from "./types";

export function useFakeMember() {
  const loading = ref(false);
  const dataList = ref<MemberRow[]>([]);
  // 被勾選的列
  const selectedRows = ref<MemberRow[]>([]);

  // ===== 新增會員 =====
  const createForm = reactive<CreateFormState>({
    accountPrefix: "",
    startNumber: "",
    endNumber: ""
  });

  // ===== 搜尋會員 =====
  const searchForm = reactive({
    account: ""
  });

  // ===== 批次操作欄位 =====
  const resetPassword = ref("");
  const bulkVipLevel = ref<string | number>("");
  const bulkRegisDate = ref("");

  const columns: TableColumnList = [
    { type: "selection", align: "left", reserveSelection: true },
    {
      label: $t("faketools.memberAccount"),
      prop: "account",
      cellRenderer: ({ row }) => (
        <a
          href="javascript:void(0)"
          onClick={() => handleView(row)}
          style="color: var(--el-color-primary)"
        >
          {row.account}
        </a>
      )
    },
    { label: $t("faketools.memberId"), prop: "id" },
    {
      label: $t("faketools.nameCert"),
      prop: "name_cert",
      cellRenderer: ({ row }) => (
        <el-switch
          v-model={row.name_cert}
          active-value={1}
          inactive-value={0}
        />
      )
    },
    {
      label: $t("faketools.phoneCert"),
      prop: "phone_cert",
      cellRenderer: ({ row }) => (
        <el-switch
          v-model={row.phone_cert}
          active-value={1}
          inactive-value={0}
        />
      )
    },
    {
      label: $t("faketools.hasBankCard"),
      prop: "has_bank_card",
      cellRenderer: ({ row }) => (
        <el-switch
          v-model={row.has_bank_card}
          active-value={1}
          inactive-value={0}
        />
      )
    },
    {
      label: $t("faketools.vipLevel"),
      prop: "vip_level",
      cellRenderer: ({ row }) => (
        <el-input v-model={row.vip_level} class="!w-[90px]" />
      )
    },
    {
      label: $t("faketools.registerTime"),
      prop: "created_date",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.created_date}
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          class="!w-[150px]"
        />
      )
    },
    {
      label: $t("faketools.operation"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  // 開新分頁查看會員明細
  function handleView(row: MemberRow) {
    window.open(`/memberDetail/detail/${row.id}`);
  }

  // 勾選變更
  function handleSelectionChange(rows: MemberRow[]) {
    selectedRows.value = rows;
  }

  // 建立會員帳號
  async function submitCreateMember() {
    loading.value = true;
    try {
      const { success } = await fakeMemberCreate({
        accountPrefix: createForm.accountPrefix,
        startNumber: Number(createForm.startNumber),
        endNumber: Number(createForm.endNumber)
      });
      if (success) {
        message($t("faketools.createSuccess"), { type: "success" });
        // 新增完直接以前綴搜尋
        searchForm.account = createForm.accountPrefix;
        await onSearch();
      }
    } finally {
      loading.value = false;
      createForm.accountPrefix = "";
      createForm.startNumber = "";
      createForm.endNumber = "";
    }
  }

  // 取得會員資料
  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await fakeMemberSearch({
        account: searchForm.account
      });
      if (success) {
        const list = (data?.list ?? []).map((item: MemberRow) => {
          item.phone_cert = Number(item.phone_cert) === 1 ? 1 : 0;
          return item;
        });
        dataList.value = list;
      }
    } finally {
      loading.value = false;
    }
  }

  // 儲存單筆
  async function handleSave(row: MemberRow) {
    try {
      const { success } = await fakeMemberEdit({
        id: row.id,
        name_cert: row.name_cert ? 1 : 0,
        phone_cert: row.phone_cert ? 1 : 2,
        has_bank_card: row.has_bank_card ? 1 : 0,
        vip_level: row.vip_level,
        created_date: row.created_date
      });
      if (success) {
        message($t("faketools.saveSuccess"), { type: "success" });
      }
    } catch (e) {
      message($t("faketools.saveFailed"), { type: "error" });
    }
  }

  // 批次修改密碼（針對勾選的帳號）
  async function handleResetPassword() {
    if (!selectedRows.value.length) {
      message($t("faketools.pleaseSelectRow"), { type: "warning" });
      return;
    }
    const account = selectedRows.value.map(i => i.account);
    try {
      const { success } = await fakeMemberPassword({
        account,
        password: resetPassword.value
      });
      if (success) {
        resetPassword.value = "";
        message($t("faketools.passwordChanged"), { type: "success" });
      }
    } catch (e) {
      message($t("faketools.saveFailed"), { type: "error" });
    }
  }

  // 批次套用 VIP 等級到勾選列（僅前端更新，等批次保存才送出）
  function handleSetVip() {
    if (!selectedRows.value.length) {
      message($t("faketools.pleaseSelectRow"), { type: "warning" });
      return;
    }
    selectedRows.value.forEach(row => {
      row.vip_level = bulkVipLevel.value;
    });
  }

  // 批次套用註冊時間到勾選列
  function handleSetDate() {
    if (!selectedRows.value.length) {
      message($t("faketools.pleaseSelectRow"), { type: "warning" });
      return;
    }
    selectedRows.value.forEach(row => {
      row.created_date = bulkRegisDate.value;
    });
  }

  // 批次操作保存（把勾選列逐筆送出）
  async function handleBulkSave() {
    if (!selectedRows.value.length) {
      message($t("faketools.pleaseSelectRow"), { type: "warning" });
      return;
    }
    const rows = [...selectedRows.value];
    for (const row of rows) {
      try {
        await fakeMemberEdit({
          id: row.id,
          name_cert: row.name_cert ? 1 : 0,
          phone_cert: row.phone_cert ? 1 : 2,
          has_bank_card: row.has_bank_card ? 1 : 0,
          vip_level: row.vip_level,
          created_date: row.created_date
        });
      } catch (e) {
        message($t("faketools.saveFailed"), { type: "error" });
      }
    }
    message($t("faketools.saveSuccess"), { type: "success" });
    bulkVipLevel.value = "";
    bulkRegisDate.value = "";
    await onSearch();
  }

  return {
    loading,
    columns,
    dataList,
    createForm,
    searchForm,
    resetPassword,
    bulkVipLevel,
    bulkRegisDate,
    submitCreateMember,
    onSearch,
    handleSave,
    handleResetPassword,
    handleSetVip,
    handleSetDate,
    handleBulkSave,
    handleSelectionChange
  };
}
