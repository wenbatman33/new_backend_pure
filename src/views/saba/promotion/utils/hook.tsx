import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { findByValue } from "@/utils/options";
import editForm from "../form.vue";
import {
  getSabaPromotionList,
  postSabaPromotion,
  putSabaPromotion,
  postGetSelector,
  postGetSportList,
  type PromotionListItem
} from "@/api/saba";
import type { FormItemProps } from "./types";

// 活動狀態：0 全部 1 停用 2 上架中 3 下架中
export const statusOptions = [
  { label: $t("saba.promotionStatus0"), value: 0 },
  { label: $t("saba.promotionStatus1"), value: 1 },
  { label: $t("saba.promotionStatus2"), value: 2 },
  { label: $t("saba.promotionStatus3"), value: 3 }
];

export function usePromotion() {
  const searchForm = reactive({
    sportId: 0,
    status: 0,
    name: "",
    id: ""
  });
  const dataList = ref<PromotionListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 體育類型下拉（含「全部」），由 saba 後台 selector + sportList 組出
  const sportIdOptions = ref<
    Array<{ label: string; value: number; ProductId?: number }>
  >([{ label: $t("saba.all"), value: 0 }]);

  // 語系：簡化為固定 cs（簡中），舊碼依 countryCheck('CN') 決定
  const Language = "cs";

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("saba.tableId"), prop: "id", width: 100 },
    { label: $t("saba.tableName"), prop: "name", minWidth: 200 },
    { label: $t("saba.promotionRoute"), prop: "route", width: 150 },
    {
      label: $t("saba.status"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{findByValue(statusOptions, row.status)}</span>
      )
    },
    {
      label: $t("saba.searchSportId"),
      prop: "sportId",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{findByValue(sportIdOptions.value, row.sportId)}</span>
      )
    },
    { label: $t("saba.tableStart"), prop: "start", width: 170 },
    { label: $t("saba.tableEnd"), prop: "end", width: 170 },
    { label: $t("saba.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function loadSportOptions() {
    try {
      const { data: selector } = await postGetSelector({ Language });
      const productList = selector?.productList ?? [];
      for (const item of productList) {
        const { data: sportRes } = await postGetSportList({
          Language,
          ProductId: item.value
        });
        const sportList = (sportRes?.sportList ?? [])
          .filter((s: any) => s.value > 0)
          .map((s: any) => ({
            label: s.label,
            value: s.value,
            ProductId: item.value
          }));
        sportIdOptions.value = sportIdOptions.value.concat(sportList);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getSabaPromotionList({
        sportId: searchForm.sportId,
        status: searchForm.status,
        name: searchForm.name,
        id: searchForm.id,
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
    searchForm.sportId = 0;
    searchForm.status = 0;
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

  // 建立/編輯活動主檔（step1）
  // TODO: 舊模組為四步驟精靈（活動→Banner→賽事→新聞），此處先實作主檔表單，
  //       Banner/Event/News 子步驟與其列表 endpoint 待後續補上。
  function openDialog(type: "add" | "edit" | "review" = "add", row?: any) {
    const isReview = type === "review";
    addDialog({
      title:
        type === "add"
          ? $t("saba.promotionAdd")
          : isReview
            ? $t("saba.check")
            : $t("saba.edit"),
      props: {
        sportIdOptions: sportIdOptions.value,
        formInline: {
          id: row?.id,
          name: row?.name ?? "",
          sportId: row?.sportId ?? "",
          specificCompetition: row?.specificCompetition ?? false,
          competitionId: row?.competitionId ?? [],
          start: row?.start ?? "",
          end: row?.end ?? "",
          route: row?.route ?? "",
          hidden: row?.hidden ?? false,
          isReview
        }
      },
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        if (isReview) {
          done();
          return;
        }
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const api = type === "add" ? postSabaPromotion : putSabaPromotion;
          const { success } = await api({ ...curData });
          if (success) {
            message($t("saba.operationSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(async () => {
    await loadSportOptions();
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    sportIdOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleSizeChange,
    handleCurrentChange
  };
}
