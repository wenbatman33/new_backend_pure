import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import memberForm from "../member.vue";
import {
  getPayGroups,
  createPayGroup,
  putPayGroup,
  postPayGroupsMember,
  postPayGroupsAgency,
  type PayGroupItem
} from "@/api/payment";
import type { FormItemProps, MemberFormItemProps } from "./types";

/** 來源類型 [1會員 2代理] */
export const sourceType = [
  { label: $t("payment.member"), value: 1 },
  { label: $t("payment.agency"), value: 2 }
];

export function usePayGroup() {
  const searchForm = reactive({
    name: "",
    source: ""
  });
  const dataList = ref<PayGroupItem[]>([]);
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
    { label: $t("payment.name"), prop: "name", minWidth: 150 },
    { label: "GroupName", prop: "nameEn", minWidth: 150 },
    {
      label: $t("payment.source"),
      prop: "source",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        const found = sourceType.find(e => e.value === Number(row.source));
        return <span>{found ? found.label : ""}</span>;
      }
    },
    { label: $t("payment.remark"), prop: "remark", minWidth: 150 },
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
      minWidth: 110,
      sortable: true,
      cellRenderer: ({ row }) => {
        if (Number(row.source) !== 1) return <span>{row.memberCnt}</span>;
        return h(
          "a",
          {
            href: "/member/list?payment_group=" + row.name,
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
      minWidth: 130,
      cellRenderer: ({ row }) => (
        <span>{(row.depositLower ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.depositUpper"),
      prop: "depositUpper",
      minWidth: 130,
      cellRenderer: ({ row }) => (
        <span>{(row.depositUpper ?? 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("payment.updatedAt"),
      prop: "updatedAt",
      minWidth: 160,
      sortable: true,
      cellRenderer: ({ row }) => (
        <span>
          {row.updatedAt
            ? dayjs(row.updatedAt).format("YYYY/MM/DD HH:mm:ss")
            : ""}
        </span>
      )
    },
    { label: $t("payment.executor"), prop: "updatedUserName", minWidth: 130 },
    { label: $t("payment.operate"), fixed: "right", width: 200, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // type 類型 [1三方 2銀行卡]，本模組固定三方
      const { data } = await getPayGroups({
        type: "1",
        name: searchForm.name,
        source: searchForm.source
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  /** 新增 / 編輯金流組別 */
  function openDialog(row?: PayGroupItem) {
    const isUpdate = !!row;
    const title = isUpdate
      ? `${$t("payment.third")}/ ${row.name} ${row.nameEn ?? ""}${$t("payment.edit")}`
      : $t("payment.third2");
    addDialog({
      title,
      props: {
        formInline: {
          ID: row?.ID ?? 0,
          name: row?.name ?? "",
          nameEn: row?.nameEn ?? "",
          source: row?.source != null ? Number(row.source) : "",
          depositLower: row?.depositLower ?? "",
          depositUpper: row?.depositUpper ?? "",
          remark: row?.remark ?? "",
          isUpdate
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
          if (curData.isUpdate) {
            const { success } = await putPayGroup({
              ID: curData.ID,
              name: curData.name,
              nameEn: curData.nameEn,
              depositLower: Number(curData.depositLower),
              depositUpper: Number(curData.depositUpper),
              remark: curData.remark
            });
            if (success) {
              message(`${$t("payment.editSuccess")}${curData.name}`, {
                type: "success"
              });
              done();
              onSearch();
            }
          } else {
            const { success } = await createPayGroup({
              type: 1,
              name: curData.name,
              nameEn: curData.nameEn,
              source: Number(curData.source),
              depositLower: Number(curData.depositLower),
              depositUpper: Number(curData.depositUpper),
              remark: curData.remark
            });
            if (success) {
              message(`${$t("payment.createSuccess")}${curData.name}`, {
                type: "success"
              });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  /** 加入會員（source===1）或加入代理（source===2） */
  function openMemberDialog(row: PayGroupItem) {
    const isAgency = Number(row.source) === 2;
    const title = `${$t("payment.third")}/${row.name} ${row.nameEn ?? ""} / ${
      isAgency ? $t("payment.addAgency") : $t("payment.addMember")
    }`;
    addDialog({
      title,
      props: {
        formInline: {
          payGroupID: row.ID,
          name: row.name,
          nameEn: row.nameEn ?? "",
          accounts: ""
        },
        isAgency
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(memberForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as MemberFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = isAgency ? postPayGroupsAgency : postPayGroupsMember;
          const payload = isAgency
            ? { payGroupID: curData.payGroupID, agencyAccounts: curData.accounts }
            : { payGroupID: curData.payGroupID, memberAccounts: curData.accounts };
          const { success } = await fn(payload as any);
          if (success) {
            message($t("payment.createSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 查看線路（另開分頁） */
  function openRoute(row: PayGroupItem) {
    const url = `/payment/pay_channel_service?status=1&thirdGroupID=${row.ID}`;
    window.open(url, "_blank");
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
    openMemberDialog,
    openRoute
  };
}
