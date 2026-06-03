import { h, ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import approveForm from "../form.vue";
import {
  getPromotionBatchList,
  type PromotionBatchItem
} from "@/api/promotion";
import type { SearchFormProps } from "./types";

export function usePromotionBatch() {
  const route = useRoute();
  const router = useRouter();

  const searchForm = reactive<SearchFormProps>({
    promotionID: "",
    promotionName: "",
    batchID: "",
    sendAtStart: "",
    sendAtEnd: "",
    send_way: "",
    internalName: ""
  });

  const dataList = ref<PromotionBatchItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 派發方式選項：1 自動 / 2 手動
  const sendWayOptions = [
    { label: $t("promotion.all"), value: "" },
    { label: $t("promotion.auto"), value: 1 },
    { label: $t("promotion.self"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("promotion.batchID"), prop: "batchID", width: 90 },
    { label: $t("promotion.promotionID"), prop: "promotionID", width: 90 },
    {
      label: $t("promotion.promotionName"),
      prop: "promotionName",
      cellRenderer: ({ row }) => (
        <a
          class="cursor-pointer text-primary"
          onClick={() =>
            router.push({
              path: "/promotion/list",
              query: { ID: row.promotionID }
            })
          }
        >
          {row.promotionName}
        </a>
      )
    },
    { label: $t("promotion.internalName"), prop: "internalName" },
    { label: $t("promotion.batchCycle"), prop: "batchCycle", width: 120 },
    {
      label: $t("promotion.sendWay"),
      prop: "sendWay",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.sendWay) === 1
            ? $t("promotion.auto")
            : $t("promotion.manual")}
        </span>
      )
    },
    {
      label: $t("promotion.totalAmount"),
      prop: "totalAmount",
      width: 110,
      cellRenderer: ({ row }) => <span>{row.totalAmount?.toLocaleString()}</span>
    },
    {
      label: $t("promotion.memberNumber"),
      prop: "memberNumber",
      width: 120,
      cellRenderer: ({ row }) =>
        row.memberNumber ? (
          <div>
            <span style="color:#3bb5b1">{row.memberNumber}</span>
            <span> / </span>
            <span style="color:#f66154">{row.memberFailNumber}</span>
          </div>
        ) : (
          <span>-</span>
        )
    },
    { label: $t("promotion.sendAt"), prop: "sendAt", width: 170 },
    { label: $t("promotion.updatedUser"), prop: "updatedUser", width: 120 },
    {
      label: $t("promotion.action"),
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPromotionBatchList({
        promotionID: searchForm.promotionID,
        promotionName: searchForm.promotionName,
        batchID: searchForm.batchID,
        sendAtStart: searchForm.sendAtStart,
        sendAtEnd: searchForm.sendAtEnd,
        send_way: searchForm.send_way,
        internalName: searchForm.internalName,
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

  // 開啟「批次申請清單」分頁（取代舊 openWindow）
  function openApplyList(row: PromotionBatchItem) {
    window.open(`/promotion/apply?promotionID=${row.promotionID}`);
  }

  // 開啟審核對話框（全螢幕）
  function handleVerify(row: PromotionBatchItem) {
    addDialog({
      title: `${row.promotionName} ${$t("promotion.cycle")}${row.batchCycle} ${$t(
        "promotion.verifyList"
      )}`,
      width: "90%",
      fullscreen: true,
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(approveForm, {
          promotionID: row.promotionID,
          batchID: row.batchID
        })
    });
  }

  onMounted(() => {
    // 由其他頁帶 promotionID 進來時自動帶入搜尋條件
    if (route.query?.promotionID) {
      searchForm.promotionID = String(route.query.promotionID);
    }
    onSearch();
  });

  return {
    searchForm,
    sendWayOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openApplyList,
    handleVerify
  };
}
