import dayjs from "dayjs";
import { h, ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import lockForm from "../lockForm.vue";
import transferForm from "../transferForm.vue";
import tradeForm from "../tradeForm.vue";
import {
  getPayBankCardList,
  getPayBankCardDropdown,
  createPayBankCard,
  putPayBankCard,
  lockPayBankCard,
  unlockPayBankCard,
  transferPayBankCard,
  createPayBankCardTrade
} from "@/api/payment";
import type {
  BankCardRow,
  BankItem,
  ProvinceItem,
  FormItemProps,
  LockFormItemProps,
  TransferFormItemProps,
  TradeFormItemProps
} from "./types";

// 用途標籤顏色
const typeTagMap: Record<number, string> = {
  1: "primary",
  2: "warning",
  3: "danger",
  4: "success"
};

// 後端 [{ "1": "label" }] => element 下拉
function dictToOptions(arr: Array<Record<string, string>> = []) {
  return arr.map(item => {
    const k = Object.keys(item)[0];
    return { label: item[k], value: Number(k) };
  });
}

// 重組省市：把扁平 city 列表收斂成 province -> city[]
function buildProvinceList(cityData: any[] = []): ProvinceItem[] {
  const result: ProvinceItem[] = [];
  cityData.forEach(item => {
    const exist = result.find(r => r.province_id === item.province_id);
    if (exist) {
      exist.city.push({ id: item.id, name: item.name });
    } else {
      result.push({
        province: item.province,
        province_id: item.province_id,
        city: [{ id: item.id, name: item.name }]
      });
    }
  });
  return result;
}

export function usePayBankCard() {
  const router = useRouter();

  const searchForm = reactive({
    cardNo: "",
    accountName: "",
    type: "",
    status: "1",
    payBankID: ""
  });
  const dataList = ref<BankCardRow[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 下拉資料
  const statusOptions = ref<{ label: string; value: number }[]>([]);
  const typeOptions = ref<{ label: string; value: number }[]>([]);
  const genderOptions = ref<{ label: string; value: number }[]>([]);
  const banks = ref<BankItem[]>([]);
  const provinces = ref<ProvinceItem[]>([]);
  const cardNoOptions = ref<{ label: string; value: string }[]>([]);
  // TODO: 資金異動科目下拉（舊碼來自 dropdown.bankcardLogType / subjects），
  // 後端若無回傳則以空陣列佔位，待 mock/後端補齊。
  const logTypeOptions = ref<{ label: string; value: string }[]>([]);
  const subjectsByType = ref<
    Record<string, { label: string; value: string | number }[]>
  >({});

  // 合計
  const summary = reactive({ balance: 0, dayIn: 0, dayOut: 0 });

  const columns: TableColumnList = [
    {
      label: $t("payment.cardNo"),
      prop: "cardNo",
      fixed: "left",
      width: 200,
      cellRenderer: ({ row }) => (
        <span class="flex items-center gap-[6px]">
          <el-link type="primary" onClick={() => showRowData(row)}>
            {row.cardNo}
          </el-link>
          <el-button
            link
            type="primary"
            onClick={() => handleCopy(String(row.cardNo))}
          >
            {$t("payment.copy")}
          </el-button>
        </span>
      )
    },
    {
      label: $t("payment.payBankID"),
      prop: "bankName",
      cellRenderer: ({ row }) => (
        <div>
          <div>{row.bankName}</div>
          <div>{row.bankCode}</div>
        </div>
      )
    },
    { label: $t("payment.accountName"), prop: "accountName", width: 110 },
    {
      label: $t("payment.type"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-tag type={typeTagMap[Number(row.type)] ?? "info"} size="small">
          {$t("payment.type" + row.type)}
        </el-tag>
      )
    },
    {
      label: $t("payment.dayIn"),
      prop: "dayIn",
      width: 110,
      cellRenderer: ({ row }) => <span>{(row.dayIn ?? 0).toLocaleString()}</span>
    },
    {
      label: $t("payment.dayOut"),
      prop: "dayOut",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{(row.dayOut ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.balance"),
      prop: "balance",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{(row.balance ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.limit"),
      width: 140,
      cellRenderer: ({ row }) => (
        <span>
          {(row.limitLower ?? 0).toLocaleString()}~
          {(row.limitUpper ?? 0).toLocaleString()}
        </span>
      )
    },
    {
      label: $t("payment.bankAccount"),
      prop: "bankAccount",
      width: 220,
      cellRenderer: ({ row }) => (
        <div>
          <div>
            {$t("payment.account")}: {row.bankAccount}
          </div>
          <div>
            {$t("payment.pass")}: {row.loginPw}
          </div>
          <div>
            {$t("payment.Upass")}: {row.uPw}
          </div>
        </div>
      )
    },
    {
      label: $t("payment.verifyDate"),
      prop: "verifyDate",
      width: 160,
      cellRenderer: ({ row }) =>
        row.verifyDate
          ? dayjs(row.verifyDate).format("YYYY/MM/DD HH:mm:ss")
          : "--"
    },
    {
      label: $t("payment.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span
          style={{
            color:
              String(row.status) === "1"
                ? "var(--el-color-success)"
                : "var(--el-color-danger)"
          }}
        >
          {String(row.status) === "1"
            ? $t("payment.enable")
            : $t("payment.disable")}
        </span>
      )
    },
    {
      label: $t("payment.operate"),
      fixed: "right",
      width: 90,
      slot: "operation"
    }
  ];

  async function fetchDropdown() {
    const { data } = await getPayBankCardDropdown();
    if (!data) return;
    statusOptions.value = dictToOptions(data.status);
    typeOptions.value = dictToOptions(data.type);
    genderOptions.value = dictToOptions(data.gender);
    banks.value = (data.banks ?? []) as BankItem[];
    provinces.value = buildProvinceList(data.city);
    cardNoOptions.value = (data.bankcards ?? []).map((el: any) => ({
      label: `${el.card_no}/${el.account_name}`,
      value: el.card_no
    }));
    // 資金異動下拉（若後端有回）
    if (data.bankcardLogType) {
      logTypeOptions.value = (data.bankcardLogType as any[]).map(item => {
        const k = Object.keys(item)[0];
        return { value: k, label: item[k] };
      });
    }
    if (data.subjects) {
      const map: Record<string, any[]> = {};
      (data.subjects as any[]).forEach(item => {
        if (item.id < 700) return;
        if (!map[item.type]) map[item.type] = [];
        map[item.type].push({ value: item.id, label: item.name });
      });
      subjectsByType.value = map;
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      // payBankID 搜尋以銀行名稱對應 id（沿用舊邏輯）
      const matched = banks.value.find(
        b => b.bankName === searchForm.payBankID
      );
      const { data } = await getPayBankCardList({
        cardNo: searchForm.cardNo,
        accountName: searchForm.accountName,
        type: searchForm.type,
        status: searchForm.status,
        payBankID: matched?.id ?? "",
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      const list = (data?.list ?? []) as BankCardRow[];
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
      summary.balance = list.reduce((s, r) => s + (r.balance ?? 0), 0);
      summary.dayIn = list.reduce((s, r) => s + (r.dayIn ?? 0), 0);
      summary.dayOut = list.reduce((s, r) => s + (r.dayOut ?? 0), 0);
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = "1";
    pagination.currentPage = 1;
    onSearch();
  }

  // 複製
  function handleCopy(str: string) {
    navigator.clipboard
      .writeText(str || "")
      .then(() => message($t("payment.success"), { type: "success" }))
      .catch(() => message($t("payment.fail"), { type: "error" }));
  }

  // payBankID 下拉（搜尋區用銀行名稱）
  const bankNameOptions = computed(() =>
    banks.value.map(b => ({ label: b.bankName, value: b.bankName }))
  );

  // 共用：把 row 轉成表單 model
  function rowToForm(row: BankCardRow, mode: string): FormItemProps {
    return {
      ID: row.ID,
      mode,
      cardNo: row.cardNo ?? "",
      accountName: row.accountName ?? "",
      bankCode: row.payBankID ?? "",
      province: row.province ?? "",
      city: row.city ?? "",
      branch: row.branch ?? "",
      broker: row.broker ?? "",
      verifyDate: row.verifyDate ?? "",
      limitLower: row.limitLower,
      limitUpper: row.limitUpper,
      dayUpper: row.dayUpper,
      type: Number(row.type),
      status: Number(row.status) || 2,
      originalAmount: row.originalAmount,
      note: row.note ?? "",
      showWebBankInfo: true,
      bankAccount: row.bankAccount ?? "",
      oriLoginPw: row.oriLoginPw ?? "",
      oriUPw: row.oriUPw ?? "",
      oriWithdrawalPw: row.oriWithdrawalPw ?? "",
      loginPw: row.loginPw ?? "",
      uPw: row.uPw ?? "",
      withdrawalPw: row.withdrawalPw ?? "",
      showPersonalInfo: true,
      identity: row.identity ?? "",
      gender: Number(row.gender) || undefined,
      phone: row.phone ?? ""
    };
  }

  // 新增 / 編輯 / 查看 銀行卡
  function openCardDialog(mode: "Create" | "Edit" | "ShowRowData", row?: BankCardRow) {
    const titleMap = {
      Create: $t("payment.addCard"),
      Edit: $t("payment.editCard"),
      ShowRowData: $t("payment.checkCard")
    };
    const formInline =
      mode === "Create"
        ? ({
            mode,
            cardNo: "",
            accountName: "",
            bankCode: "",
            province: "",
            city: "",
            branch: "",
            broker: "",
            verifyDate: "",
            limitLower: undefined,
            limitUpper: undefined,
            dayUpper: undefined,
            type: undefined,
            status: 2,
            originalAmount: undefined,
            note: "",
            showWebBankInfo: false,
            showPersonalInfo: false
          } as unknown as FormItemProps)
        : rowToForm(row!, mode === "ShowRowData" ? "ShowRowData" : "Edit");

    addDialog({
      title: titleMap[mode],
      props: {
        formInline,
        banks: banks.value,
        typeOptions: typeOptions.value,
        genderOptions: genderOptions.value,
        provinces: provinces.value,
        readonly: mode === "ShowRowData"
      },
      width: "80%",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: mode === "ShowRowData",
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // payBankID 來自 bankCode（已是銀行 id）
          const payload: any = { ...curData, payBankID: curData.bankCode };
          delete payload.bankCode;
          delete payload.showWebBankInfo;
          delete payload.showPersonalInfo;
          delete payload.mode;
          const fn = mode === "Create" ? createPayBankCard : putPayBankCard;
          const { success } = await fn(payload);
          if (success) {
            message(titleMap[mode] + $t("payment.success"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function showRowData(row: BankCardRow) {
    openCardDialog("ShowRowData", row);
  }
  function openDialog() {
    openCardDialog("Create");
  }
  function handleEdit(row: BankCardRow) {
    openCardDialog("Edit", row);
  }

  // 啟用 / 停用
  async function handleChangeStatus(row: BankCardRow) {
    const nextStatus = Number(row.status) === 1 ? 2 : 1;
    const { success } = await putPayBankCard({
      ...row,
      status: nextStatus
    } as any);
    if (success) {
      message(
        (nextStatus === 1 ? $t("payment.enable") : $t("payment.disable")) +
          $t("payment.success"),
        { type: "success" }
      );
      onSearch();
    }
  }

  // 凍結 / 解凍
  function openLockDialog(mode: "lock" | "unlock", row: BankCardRow) {
    const title =
      mode === "lock" ? $t("payment.freeze") : $t("payment.unFreeze");
    addDialog({
      title,
      props: { formInline: { amount: undefined, note: "" } },
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(lockForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as LockFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = mode === "lock" ? lockPayBankCard : unlockPayBankCard;
          const { success } = await fn({
            bankcardID: row.ID,
            amount: curData.amount,
            note: curData.note
          });
          if (success) {
            message(title + $t("payment.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }
  function handleLock(row: BankCardRow) {
    openLockDialog("lock", row);
  }
  function handleUnlock(row: BankCardRow) {
    openLockDialog("unlock", row);
  }

  // 轉帳
  function handleTransfer(row: BankCardRow) {
    addDialog({
      title: $t("payment.transfer"),
      props: {
        formInline: {
          amount: undefined,
          cardNo: "",
          fee: undefined,
          logTime: "",
          note: ""
        }
      },
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(transferForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as TransferFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await transferPayBankCard({
            bankcardID: row.ID,
            cardNo: curData.cardNo,
            amount: curData.amount,
            fee: curData.fee,
            logTime: dayjs(curData.logTime).format("YYYY/MM/DD"),
            note: curData.note
          });
          if (success) {
            message($t("payment.transfer") + $t("payment.success"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 資金異動
  function handleTrade(row: BankCardRow) {
    addDialog({
      title: $t("payment.bankChange"),
      props: {
        formInline: {
          cardNo: row.cardNo,
          bankcardLogType: "",
          subjectID: "",
          tradeTime: "",
          amount: undefined,
          fee: undefined,
          description: ""
        },
        logTypeOptions: logTypeOptions.value,
        subjectsByType: subjectsByType.value
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tradeForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as TradeFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await createPayBankCardTrade({
            id: row.ID,
            ...curData
          });
          if (success) {
            message($t("payment.bankChange") + $t("payment.success"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 另開銀行卡明細
  function openBankCardReport(row: BankCardRow) {
    const { href } = router.resolve({
      path: "/finance_report/bankcard_report",
      query: { cardNo: String(row.cardNo) }
    });
    window.open(href, "_blank");
  }

  onMounted(async () => {
    await fetchDropdown();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    statusOptions,
    typeOptions,
    bankNameOptions,
    summary,
    onSearch,
    resetForm,
    openDialog,
    handleEdit,
    handleChangeStatus,
    handleLock,
    handleUnlock,
    handleTransfer,
    handleTrade,
    openBankCardReport
  };
}
