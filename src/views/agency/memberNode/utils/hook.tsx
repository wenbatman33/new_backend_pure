import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getAgencyNodeList,
  updateAgencyNode,
  type MemberNodeItem
} from "@/api/agency";
import type { FormItemProps } from "./types";

export function useMemberNode() {
  const searchForm = reactive({
    memberID: "",
    agencyID: "",
    agencyAccount: "",
    // 1 精確 / 2 模糊
    exactlyMatching: 2,
    startTime: "",
    endTime: ""
  });
  // 時間範圍（el-date-picker daterange 綁定）
  const timeRange = ref<[Date, Date] | []>([]);

  const dataList = ref<MemberNodeItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const matchOptions = [
    { label: $t("agency.exactMatch"), value: 1 },
    { label: $t("agency.fuzzyMatch"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "memberID", width: 80 },
    {
      label: $t("agency.memberAccount"),
      prop: "memberAccount",
      cellRenderer: ({ row }) =>
        h(
          "a",
          {
            href: "javascript:void(0)",
            style: "color: var(--el-color-primary)",
            onClick: () => handleView(row)
          },
          row.memberAccount
        )
    },
    { label: $t("agency.memberName"), prop: "memberName" },
    { label: $t("agency.orgAgencyID"), prop: "orgAgencyID" },
    { label: $t("agency.orgAgencyAccount"), prop: "orgAgencyAccount" },
    { label: $t("agency.newAgencyID"), prop: "newAgencyID" },
    { label: $t("agency.newAgencyAccount"), prop: "newAgencyAccount" },
    { label: $t("agency.transferTime"), prop: "date" },
    { label: $t("agency.remark"), prop: "remark" }
  ];

  async function onSearch() {
    loading.value = true;
    // 同步時間範圍
    if (timeRange.value && timeRange.value.length === 2) {
      searchForm.startTime = dayjs(timeRange.value[0]).format(
        "YYYY-MM-DD HH:mm"
      );
      searchForm.endTime = dayjs(timeRange.value[1]).format("YYYY-MM-DD HH:mm");
    } else {
      searchForm.startTime = "";
      searchForm.endTime = "";
    }
    try {
      const query: Record<string, any> = {
        memberID: searchForm.memberID,
        agencyID: searchForm.agencyID,
        agencyAccount: searchForm.agencyAccount,
        exactlyMatching: searchForm.exactlyMatching,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime
      };
      Object.keys(query).forEach(k => {
        if (query[k] === undefined || query[k] === "") delete query[k];
      });
      const { data } = await getAgencyNodeList(query);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    timeRange.value = [];
    searchForm.exactlyMatching = 2;
    onSearch();
  }

  // 點擊會員帳號開新視窗看詳情
  function handleView(row: MemberNodeItem) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // 開啟「會員換線」對話框
  function openDialog() {
    addDialog({
      title: $t("agency.memberTransfer"),
      props: {
        formInline: {
          memberAccount: "",
          agencyID: "",
          remark: ""
        }
      },
      width: "50%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const inst = formRef.value;
        // 必須先完成會員與代理查詢
        if (!inst.showMemberOK || !inst.showAgencyOK) {
          message($t("agency.transferFail"), { type: "warning" });
          return;
        }
        const FormRef = inst.getRef();
        const curData = inst.getFormData() as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await updateAgencyNode({
            memberID: inst.memberID,
            toParentAgencyID: inst.toParentAgencyID,
            remark: curData.remark
          });
          if (success) {
            message($t("agency.transferSuccess"), { type: "success" });
            done();
            onSearch();
          } else {
            message($t("agency.transferFail"), { type: "error" });
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    timeRange,
    matchOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleView
  };
}
