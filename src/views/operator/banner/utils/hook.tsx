import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag, ElImage } from "element-plus";
import dayjs from "dayjs";
import { getImagPath } from "@/utils/imgUrl";
import { getLanguageOption } from "@/utils/country";
import { findByValue } from "@/utils/options";
import editForm from "../form.vue";
import {
  getBanner,
  createBanner,
  putBanner,
  deleteBanner,
  getBannerCategoryDropdown,
  getBannerDeviceDropdown,
  type BannerListItem,
  type BannerCategoryItem
} from "@/api/operator";
import type { FormItemProps } from "./types";

// 推薦類型選項（舊碼來自 gameOptions()，dropdown util 未移植，先以靜態選項佔位）
const recommendTypeOptions = [
  { label: $t("operator.recommendType1"), value: 1 },
  { label: $t("operator.recommendType2"), value: 2 },
  { label: $t("operator.recommendType3"), value: 3 },
  { label: $t("operator.recommendType4"), value: 4 },
  { label: $t("operator.recommendType5"), value: 5 },
  { label: $t("operator.recommendType6"), value: 6 },
  { label: $t("operator.recommendType7"), value: 7 },
  { label: "VIP", value: 8 }
];

export function useBanner() {
  const imagePath = getImagPath();
  const searchForm = reactive({
    title: "",
    bannerCategoryID: "",
    hidden: "",
    device: "",
    start: "",
    statusSearch: 0,
    language: ""
  });
  const dataList = ref<BannerListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 分類下拉
  const categoryOptions = ref<BannerCategoryItem[]>([]);
  // 上架平台下拉（{ "1": "WEB" } → { label, value }）
  const deviceOptions = ref<{ label: string; value: number }[]>([]);
  // 語系下拉
  const languageOptions = ref(
    getLanguageOption().map(i => ({ label: i.label, value: i.value }))
  );

  const statusOptions = [
    { label: $t("operator.all"), value: 0 },
    { label: $t("operator.deactivate"), value: 1 },
    { label: $t("operator.comingSoon"), value: 2 },
    { label: $t("operator.removedSoon"), value: 3 }
  ];

  const hiddenOptions = [
    { label: $t("operator.all"), value: "" },
    { label: $t("operator.hidden"), value: "true" },
    { label: $t("operator.show"), value: "false" }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 分類名稱解析
  function filterCategory(id: number) {
    const res = categoryOptions.value.find(item => item.bannerCategoryID === id);
    return res ? res.name : "";
  }

  const columns: TableColumnList = [
    { label: $t("operator.sort"), prop: "sort", width: 90 },
    { label: "ID", prop: "id", width: 90 },
    {
      label: $t("operator.typeName"),
      prop: "bannerCategoryID",
      cellRenderer: ({ row }) => <span>{filterCategory(row.bannerCategoryID)}</span>
    },
    { label: $t("operator.name"), prop: "title", minWidth: 140 },
    { label: $t("operator.language"), prop: "language", width: 90 },
    {
      label: $t("operator.hiddenYesOrNo"),
      prop: "hidden",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{String(row.hidden) === "true" ? $t("operator.hidden") : $t("operator.show")}</span>
      )
    },
    {
      label: $t("operator.status"),
      prop: "statusStr",
      width: 100,
      cellRenderer: ({ row }) => (
        <span style={{ color: row.statusStr === $t("operator.onShelf") ? "#01A39D" : "#D0C9D6" }}>
          {row.statusStr}
        </span>
      )
    },
    {
      label: $t("operator.recommendType"),
      prop: "recommendType",
      width: 140,
      cellRenderer: ({ row }) => (
        <div>
          {(Array.isArray(row.recommendType) ? row.recommendType : []).map(item => (
            <ElTag key={item} style={{ marginRight: "4px" }}>
              {findByValue(recommendTypeOptions, item)}
            </ElTag>
          ))}
        </div>
      )
    },
    {
      label: $t("operator.webImage"),
      prop: "imageWeb",
      width: 120,
      cellRenderer: ({ row }) =>
        row.imageWeb ? (
          <ElImage
            style={{ width: "80px", height: "80px", borderRadius: "4px" }}
            src={imagePath + row.imageWeb}
            fit="cover"
          />
        ) : (
          <span>--</span>
        )
    },
    {
      label: $t("operator.h5Image"),
      prop: "imageH5",
      width: 120,
      cellRenderer: ({ row }) =>
        row.imageH5 ? (
          <ElImage
            style={{ width: "80px", height: "80px", borderRadius: "4px" }}
            src={imagePath + row.imageH5}
            fit="cover"
          />
        ) : (
          <span>--</span>
        )
    },
    {
      label: $t("operator.addedTime"),
      prop: "start",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{row.start ? dayjs(row.start).format("YYYY-MM-DD HH:mm") : "--"}</span>
      )
    },
    {
      label: $t("operator.removeTime"),
      prop: "end",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{row.end ? dayjs(row.end).format("YYYY-MM-DD HH:mm") : "--"}</span>
      )
    },
    {
      label: $t("operator.lastUpdate"),
      prop: "updatedAt",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{row.updatedAt ? dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm") : "--"}</span>
      )
    },
    { label: $t("operator.executorName"), prop: "editorName", width: 110 },
    { label: $t("operator.operate"), fixed: "right", width: 180, slot: "operation" }
  ];

  function removeEmptyQuery(obj: Record<string, any>) {
    const query: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== "") {
        query[key] = String(obj[key]);
      }
    });
    return query;
  }

  async function fetchDropdown() {
    const [cate, dev] = await Promise.all([
      getBannerCategoryDropdown(),
      getBannerDeviceDropdown()
    ]);
    if (cate?.success) {
      categoryOptions.value = (cate.data?.list ?? []).filter(item => !item.hidden);
    }
    if (dev?.success) {
      deviceOptions.value = (dev.data?.device ?? []).map(item => ({
        label: Object.values(item)[0] as string,
        value: Number(Object.keys(item)[0])
      }));
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getBanner(removeEmptyQuery(searchForm));
      if (success) {
        dataList.value = data?.list ?? [];
        pagination.total = data?.total ?? dataList.value.length;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.statusSearch = 0;
    onSearch();
  }

  // 切換隱藏/顯示
  async function toggleHidden(row: BannerListItem) {
    const { success } = await putBanner({
      id: row.id,
      bannerCategoryID: row.bannerCategoryID,
      description: row.description,
      title: row.title,
      start: row.start,
      hidden: !row.hidden
    });
    if (success) {
      message($t("operator.editAdSuccess"), { type: "success" });
      onSearch();
    }
  }

  function openDialog(mode = "Create", row?: BannerListItem) {
    const isEdit = mode === "Edit";
    addDialog({
      title: isEdit ? $t("operator.editAd") : $t("operator.addAd"),
      props: {
        mode,
        categoryOptions: categoryOptions.value,
        deviceOptions: deviceOptions.value,
        recommendTypeOptions,
        languageOptions: languageOptions.value,
        formInline: {
          id: row?.id,
          bannerCategoryID: row ? String(row.bannerCategoryID) : "",
          title: row?.title ?? "",
          description: row?.description ?? "",
          sort: row?.sort ?? 0,
          language: row?.language ?? languageOptions.value[0]?.value ?? "",
          hidden: row?.hidden ?? false,
          imageWeb: row?.imageWeb ?? "",
          imageH5: row?.imageH5 ?? "",
          logo: row?.logo ?? "",
          device: row?.device ? row.device.map(d => Number(d)) : [1, 2, 3, 4],
          start: row?.start ?? "",
          end: row?.end ?? "",
          recommendType: Array.isArray(row?.recommendType)
            ? row!.recommendType.map(d => Number(d))
            : [],
          context: row?.context ?? "",
          note: row?.note ?? ""
        }
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            ...curData,
            sort: Number(curData.sort),
            recommendType: curData.recommendType.join(",")
          };
          const { success } = isEdit
            ? await putBanner(payload)
            : await createBanner(payload);
          if (success) {
            message(isEdit ? $t("operator.editAdSuccess") : $t("operator.addAdSuccess"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: BannerListItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteBanner(row.id);
        if (success) {
          message($t("operator.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
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
    categoryOptions,
    deviceOptions,
    languageOptions,
    statusOptions,
    hiddenOptions,
    onSearch,
    resetForm,
    openDialog,
    toggleHidden,
    handleDelete
  };
}
