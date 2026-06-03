import dayjs from "dayjs";
import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import accountForm from "../accountForm.vue";
import {
  getPayBankGroupList,
  createPayBankGroup,
  putPayBankGroup,
  postPayBankGroupMember,
  postPayBankGroupAgency,
  type PayBankGroupItem
} from "@/api/payment";
import type { FormItemProps, AccountFormItemProps } from "./types";

// 來源：1 會員 / 2 代理
const sourceMap: Record<number, string> = {
  1: $t("payment.member"),
  2: $t("payment.agency")
};

export function usePayBankGroup() {
  const searchForm = reactive({
    name: "",
    source: ""
  });
  const dataList = ref<PayBankGroupItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const sourceOptions = [
    { label: $t("payment.all"), value: "" },
    { label: $t("payment.member"), value: 1 },
    { label: $t("payment.agency"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("payment.name2"), prop: "name", minWidth: 130 },
    { label: "GroupName", prop: "nameEn", minWidth: 130 },
    {
      label: $t("payment.source"),
      prop: "source",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <span>{sourceMap[Number(row.source)] ?? ""}</span>
      )
    },
    {
      label: $t("payment.remark"),
      prop: "remark",
      minWidth: 130,
      showOverflowTooltip: true
    },
    {
      label: $t("payment.payChannelServiceName"),
      prop: "payChannelServiceName",
      minWidth: 130
    },
    {
      label: $t("payment.payChannelServiceCnt"),
      prop: "payChannelServiceCnt",
      minWidth: 130,
      cellRenderer: ({ row }) =>
        h(
          "a",
          {
            href: "/payment/pay_channel_service",
            target: "_blank",
            style: "color: var(--el-color-primary)"
          },
          row.payChannelServiceCnt
        )
    },
    {
      label: $t("payment.memberCnt"),
      prop: "memberCnt",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        if (Number(row.source) !== 1) return <span>{row.memberCnt}</span>;
        return h(
          "a",
          {
            href: "/member/list?bankcard_group=" + row.name,
            target: "_blank",
            style: "color: var(--el-color-primary)"
          },
          row.memberCnt
        );
      }
    },
    {
      label: $t("payment.depositLower"),
      prop: "depositLower",
      minWidth: 110,
      cellRenderer: ({ row }) => (
        <span>{Number(row.depositLower ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.depositUpper"),
      prop: "depositUpper",
      minWidth: 110,
      cellRenderer: ({ row }) => (
        <span>{Number(row.depositUpper ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.updatedAt"),
      prop: "updatedAt",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <span>
          {row.updatedAt
            ? dayjs(row.updatedAt).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    { label: $t("payment.executor"), prop: "updatedUserName", minWidth: 110 },
    { label: $t("payment.operate"), fixed: "right", width: 220, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPayBankGroupList({
        name: searchForm.name,
        source: searchForm.source,
        // type: [1三方 2銀行卡]，本模組固定銀行卡
        type: "2",
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
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  /** 新增 / 編輯 銀行卡金流組別 */
  function openDialog(row?: PayBankGroupItem) {
    const isUpdate = !!row;
    const title = isUpdate
      ? `${$t("payment.bank")}/ ${row?.name ?? ""} ${row?.nameEn ?? ""}${$t(
          "payment.edit"
        )}`
      : $t("payment.addBankGroup");
    addDialog({
      title,
      props: {
        isUpdate,
        formInline: {
          ID: row?.ID,
          name: row?.name ?? "",
          nameEn: row?.nameEn ?? "",
          source: row ? Number(row.source) : "",
          depositLower: row?.depositLower ?? "",
          depositUpper: row?.depositUpper ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "700px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (isUpdate) {
            const { success } = await putPayBankGroup({
              ID: curData.ID,
              name: curData.name,
              nameEn: curData.nameEn,
              source: curData.source,
              depositLower: curData.depositLower,
              depositUpper: curData.depositUpper,
              remark: curData.remark
            });
            if (success) {
              message(
                `${$t("payment.editSuccess")}${curData.name}${$t(
                  "payment.group"
                )}`,
                { type: "success" }
              );
              done();
              onSearch();
            }
          } else {
            const { success } = await createPayBankGroup({
              name: curData.name,
              nameEn: curData.nameEn,
              source: curData.source,
              depositLower: curData.depositLower,
              depositUpper: curData.depositUpper,
              remark: curData.remark,
              // 本模組固定為銀行卡金流
              type: 2
            });
            if (success) {
              message(
                `${$t("payment.createSuccess")}${curData.name}${$t(
                  "payment.group"
                )}`,
                { type: "success" }
              );
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  /** 加入會員 / 加入代理 */
  function openAccountDialog(row: PayBankGroupItem, mode: "member" | "agency") {
    const title = `${$t("payment.bank")}/${row.name} ${row.nameEn} / ${
      mode === "member" ? $t("payment.addMember") : $t("payment.addAgency")
    }`;
    addDialog({
      title,
      props: {
        mode,
        formInline: { accounts: "" }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(accountForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as AccountFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload =
            mode === "member"
              ? {
                  payGroupID: row.ID,
                  memberAccounts: curData.accounts
                }
              : {
                  payGroupID: row.ID,
                  agencyAccounts: curData.accounts
                };
          const { success } =
            mode === "member"
              ? await postPayBankGroupMember(payload)
              : await postPayBankGroupAgency(payload);
          if (success) {
            message($t("payment.createSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 檢視路由：開新視窗到 金流通道服務 */
  function handleCheckRoute(row: PayBankGroupItem) {
    const href = `/payment/pay_channel_service?status=1&bankGroupID=${row.ID}`;
    window.open(href, "_blank");
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    sourceOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    openAccountDialog,
    handleCheckRoute,
    handleSizeChange,
    handleCurrentChange
  };
}
