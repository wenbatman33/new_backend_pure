import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getLaunchedList,
  getLaunched,
  updateLaunched,
  getPromotionList,
  type LaunchedListItem
} from "@/api/aiPromotion";
import type { FormItemProps } from "./types";

const imagePath = getImagPath();

// 類型對照（沿用舊碼，後端原以 launchedType dropdown 填入，此處以靜態對照避免 dropdown 依賴）
// TODO: 舊碼類型文案來自 promotionDropdownRes.launchedType（後端下拉），dropdown util 未移植，先以 key 原樣顯示
const typeMap: Record<string, string> = {};

export function useLaunchedList() {
  const searchForm = reactive({
    id: "",
    name: "",
    display: "",
    device: "",
    startTime: "",
    endTime: "",
    language: ""
  });
  const dataList = ref<LaunchedListItem[]>([]);
  const loading = ref(true);
  // 關聯優惠下拉選項
  const promotionOptions = ref<Array<{ label: string; value: number }>>([]);
  const formRef = ref();

  // 排序參數（沿用舊碼：orderBy 1=ID 2=startTime 3=endTime 4=updatedAt 5=orderNo；order 1升 2降）
  const orderParams = reactive({ orderBy: 1, order: 2 });

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 顯示選項
  const displayOptions = [
    { label: $t("aiPromotion.show"), value: 1 },
    { label: $t("aiPromotion.hidden"), value: 2 }
  ];

  // 裝置選項（沿用舊碼靜態對照）
  const deviceOptions = [
    { label: "WebPC", value: 1 },
    { label: "MobileWeb", value: 2 },
    { label: "AndroidPWA", value: 3 },
    { label: "iOSPWA", value: 4 }
  ];

  function filterType(key: string) {
    return typeMap[key] ?? key;
  }

  const columns: TableColumnList = [
    { label: $t("aiPromotion.sort"), prop: "orderNo", width: 60, sortable: true },
    { label: $t("aiPromotion.serialNumber"), prop: "ID", width: 80, sortable: true },
    {
      label: $t("aiPromotion.type"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => (
        <div>
          {String(row.type ?? "")
            .split(",")
            .filter(Boolean)
            .map((item: string) => (
              <p style="margin:0">{filterType(item)}</p>
            ))}
        </div>
      )
    },
    {
      label: $t("aiPromotion.listingName"),
      prop: "name",
      cellRenderer: ({ row }) => (
        <a
          style="cursor:pointer;color:var(--el-color-primary)"
          onClick={() => handleChecked(row)}
        >
          {Array.isArray(row.name)
            ? row.name.map((n: string) => <div>{n}</div>)
            : row.name}
        </a>
      )
    },
    {
      label: $t("aiPromotion.pinToTop"),
      prop: "top",
      width: 70,
      cellRenderer: ({ row }) => <span>{row.top === 1 ? "Y" : ""}</span>
    },
    {
      label: $t("aiPromotion.show"),
      prop: "display",
      width: 80,
      cellRenderer: ({ row }) => (
        <el-switch
          modelValue={row.display === 1}
          active-text={$t("aiPromotion.show")}
          inactive-text={$t("aiPromotion.hidden")}
          inline-prompt
          onChange={() => handleDisplay(row)}
        />
      )
    },
    {
      label: $t("aiPromotion.relatedOffers"),
      prop: "promotions",
      width: 160,
      cellRenderer: ({ row }) => (
        <div>
          {(row.promotions ?? []).map((p: any) => (
            <p style="margin:0">{typeof p === "string" ? p : p?.name}</p>
          ))}
        </div>
      )
    },
    {
      label: `WEB ${$t("aiPromotion.image")}`,
      prop: "imageWeb",
      width: 120,
      cellRenderer: ({ row }) =>
        row.imageWeb ? (
          <el-image
            style="width:80px;height:80px;border-radius:4px"
            src={imagePath + row.imageWeb}
            fit="cover"
            preview-teleported
            preview-src-list={[imagePath + row.imageWeb]}
          />
        ) : (
          <span>--</span>
        )
    },
    {
      label: `H5 ${$t("aiPromotion.image")}`,
      prop: "imageH5",
      width: 120,
      cellRenderer: ({ row }) =>
        row.imageH5 ? (
          <el-image
            style="width:80px;height:80px;border-radius:4px"
            src={imagePath + row.imageH5}
            fit="cover"
            preview-teleported
            preview-src-list={[imagePath + row.imageH5]}
          />
        ) : (
          <span>--</span>
        )
    },
    { label: $t("aiPromotion.addedTime"), prop: "startTime", width: 160, sortable: true },
    { label: $t("aiPromotion.removalTime"), prop: "endTime", width: 160, sortable: true },
    { label: $t("aiPromotion.lastUpdate"), prop: "updatedAt", width: 160, sortable: true },
    { label: $t("aiPromotion.executorName"), prop: "updatedUser", width: 120 },
    { label: $t("aiPromotion.action"), fixed: "right", width: 100, slot: "operation" }
  ];

  // 移除空查詢欄位
  function buildQuery() {
    const query: Record<string, any> = {
      ...searchForm,
      orderBy: orderParams.orderBy,
      order: orderParams.order,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === "") {
        delete query[key];
      } else {
        query[key] = String(query[key]);
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getLaunchedList(buildQuery());
      const list = data?.list ?? [];
      // 沿用舊碼：把 languageText 攤平成「語系 : 名稱」陣列供顯示
      list.forEach((item: any) => {
        item.name =
          item.languageText?.map(
            (l: any) => `${l.language} : ${l.name}`
          ) || item.name;
      });
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    Object.assign(searchForm, {
      id: "",
      name: "",
      display: "",
      device: "",
      startTime: "",
      endTime: "",
      language: ""
    });
    pagination.currentPage = 1;
    onSearch();
  }

  // 排序變更
  function onSortChange({ prop, order }) {
    const orderByMap: Record<string, number> = {
      ID: 1,
      startTime: 2,
      endTime: 3,
      updatedAt: 4,
      orderNo: 5
    };
    orderParams.orderBy = orderByMap[prop] ?? 1;
    orderParams.order = order === "ascending" ? 1 : 2;
    onSearch();
  }

  // 取得單筆並轉換成表單格式（沿用舊碼 transformRecord）
  async function transformRecord(row: any): Promise<FormItemProps> {
    const { data: res } = await getLaunched({ ID: row.ID });
    return {
      ...res,
      device: String(res.device ?? "")
        .split(",")
        .filter(Boolean)
        .map((item: string) => Number(item)),
      type: String(res.type ?? "")
        .split(",")
        .filter(Boolean)
        .map((item: string) => Number(item)),
      promotions: Array.isArray(res.promotions)
        ? res.promotions.map((p: any) => (typeof p === "object" ? p.id : Number(p)))
        : []
    } as FormItemProps;
  }

  function openDialog(title: string, formInline: FormItemProps, readonly = false) {
    addDialog({
      title,
      props: {
        formInline,
        readonly,
        promotionOptions: promotionOptions.value
      },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: readonly,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await updateLaunched(curData);
          if (success) {
            message($t("aiPromotion.updateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleEdit(row: any) {
    const formInline = await transformRecord(row);
    openDialog($t("aiPromotion.edit"), formInline, false);
  }

  async function handleChecked(row: any) {
    const formInline = await transformRecord(row);
    openDialog($t("aiPromotion.listingName"), formInline, true);
  }

  // 切換顯示/隱藏
  async function handleDisplay(row: any) {
    const payload = await transformRecord(row);
    payload.display = payload.display === 1 ? 2 : 1;
    const { success } = await updateLaunched(payload);
    if (success) {
      message($t("aiPromotion.updateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 載入關聯優惠下拉
  async function fetchPromotionOptions() {
    try {
      const { data } = await getPromotionList({ pageSize: 9999 });
      promotionOptions.value = (data?.list ?? []).map((item: any) => ({
        label: item.name,
        value: item.ID
      }));
    } catch {
      promotionOptions.value = [];
    }
  }

  onMounted(() => {
    fetchPromotionOptions();
    onSearch();
  });

  return {
    searchForm,
    displayOptions,
    deviceOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    onSortChange,
    handleEdit,
    handleChecked
  };
}
