import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getAgencyAnnouncementList,
  addAgencyAnnouncement,
  editAgencyAnnouncement,
  getAgencyActivityList,
  addAgencyActivity,
  editAgencyActivity,
  type AgencyManagementItem
} from "@/api/agency";
import type { FormItemProps } from "./types";

export function useAgencyManagement() {
  const imagePath = getImagPath();
  // 1 公告 / 2 活動
  const pageType = ref(1);
  const dataList = ref<AgencyManagementItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const searchForm = reactive({
    periodBeginning: dayjs().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
    periodEnd: dayjs().add(1, "month").format("YYYY-MM-DD HH:mm:ss")
  });

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const fmt = (val: string) =>
    val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "--";

  const statusRenderer = ({ row }) =>
    h(
      "span",
      { style: row.status === 1 ? "color:#67C23A" : "color:#F56C6C" },
      row.status === 1
        ? $t("agency.commissionChildTable9")
        : $t("agency.commissionChildTable10")
    );

  const imageRenderer = (field: "imagePc" | "imageH5") => ({ row }) =>
    row[field]
      ? h("img", {
          src: imagePath + row[field],
          style: "width:80px;height:80px;object-fit:contain;border-radius:4px"
        })
      : h("span", "--");

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80, sortable: true },
    { label: $t("agency.managementTable2"), prop: "title", minWidth: 120 },
    { label: $t("agency.managementTable3"), prop: "sort", width: 90, sortable: true },
    {
      label: $t("agency.managementTable4"),
      prop: "contents",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span>{(row.contents || "").replace(/<\/?[^>]+>/gi, " ")}</span>
      )
    },
    {
      label: $t("agency.managementTable5"),
      prop: "imageH5",
      width: 110,
      cellRenderer: imageRenderer("imageH5")
    },
    {
      label: $t("agency.managementTable6"),
      prop: "imagePc",
      width: 110,
      cellRenderer: imageRenderer("imagePc")
    },
    {
      label: $t("agency.managementTable7"),
      prop: "startTime",
      width: 170,
      sortable: true,
      formatter: ({ startTime }) => fmt(startTime)
    },
    {
      label: $t("agency.managementTable8"),
      prop: "endTime",
      width: 170,
      sortable: true,
      formatter: ({ endTime }) => fmt(endTime)
    },
    {
      label: $t("agency.withdrawal15"),
      prop: "status",
      width: 90,
      cellRenderer: statusRenderer
    },
    {
      label: $t("agency.performanceReport6"),
      prop: "updatedAt",
      width: 170,
      sortable: true,
      formatter: ({ updatedAt }) => fmt(updatedAt)
    },
    { label: $t("agency.managementTable9"), prop: "lastEditor", width: 110 },
    { label: $t("agency.depositTable3"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const fn =
        pageType.value === 1 ? getAgencyAnnouncementList : getAgencyActivityList;
      const { data } = await fn({
        periodBeginning: searchForm.periodBeginning,
        periodEnd: searchForm.periodEnd
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    searchForm.periodBeginning = dayjs()
      .subtract(1, "month")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.periodEnd = dayjs().add(1, "month").format("YYYY-MM-DD HH:mm:ss");
    onSearch();
  }

  function changePage(val: number) {
    pageType.value = val;
    onSearch();
  }

  /** 目前頁籤名稱：公告 / 活動 */
  function typeName() {
    return pageType.value === 1
      ? $t("agency.managementModal1")
      : $t("agency.managementModal2");
  }

  function openDialog(isEdit = false, row?: AgencyManagementItem) {
    const title = isEdit
      ? $t("agency.managementModal4") + typeName()
      : $t("agency.managementModal3") + typeName();
    addDialog({
      title,
      props: {
        formInline: {
          id: row?.id,
          title: row?.title ?? "",
          sort: row?.sort ?? 0,
          // 編輯時不立即上架，沿用既有起始時間
          online: !isEdit,
          startTime: row?.startTime ?? "",
          endTime: row?.endTime ?? "",
          imagePc: row?.imagePc ?? "",
          imageH5: row?.imageH5 ?? "",
          status: row?.status ?? 1,
          contents: row?.contents ?? ""
        }
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload: any = {
            title: curData.title,
            sort: curData.sort,
            endTime: curData.endTime,
            imagePc: curData.imagePc,
            imageH5: curData.imageH5,
            status: curData.status === 1 ? 1 : 2,
            contents: curData.contents
          };
          // online 為 true 表示立即上架，起始時間設為當下
          payload.startTime = curData.online
            ? dayjs().format("YYYY-MM-DD HH:mm:ss")
            : curData.startTime;

          let success = false;
          if (isEdit) {
            payload.id = curData.id;
            const res =
              pageType.value === 1
                ? await editAgencyAnnouncement(payload)
                : await editAgencyActivity(payload);
            success = res.success;
          } else {
            const res =
              pageType.value === 1
                ? await addAgencyAnnouncement(payload)
                : await addAgencyActivity(payload);
            success = res.success;
          }
          if (success) {
            message($t("agency.managementModal18"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    pageType,
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    changePage,
    openDialog
  };
}
