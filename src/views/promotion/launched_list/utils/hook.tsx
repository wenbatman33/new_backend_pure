import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { checkIsXinliCN } from "@/utils/country";
import editForm from "../form.vue";
import {
  getLaunchedList,
  getLaunched,
  createLaunched,
  updateLaunched,
  getPromotionDropdown,
  getPromotionList,
  type LaunchedListItem
} from "@/api/promotion";
import type { FormItemProps } from "./types";

export function usePromotionLaunchedList() {
  const imagePath = getImagPath();

  const searchForm = reactive({
    id: "",
    name: "",
    display: "",
    activity: "",
    device: "",
    startTime: "",
    endTime: "",
    language: ""
  });

  const dataList = ref<LaunchedListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 排序參數（沿用舊碼 orderBy/order）
  const orderParams = reactive({ orderBy: 1, order: 2 });

  // 下拉選項
  const displayOptions = ref<{ label: string; value: string }[]>([]);
  const activityOptions = ref<{ label: string; value: string }[]>([]);
  const deviceOptions = ref<{ label: string; value: number }[]>([]);
  const typeOptions = ref<{ label: string; value: number }[]>([]);
  // 類型 value->label 對照（表格渲染用）
  const typeMap = ref<Record<string, string>>({});
  // 關聯優惠選項
  const promotionOptions = ref<{ label: string; value: number }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 把後端「{key:label}」格式陣列轉成 options
  function toOptions(arr: any[]): { label: string; value: string }[] {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      const key = Object.keys(item)[0];
      return { label: String(Object.values(item)[0]), value: key };
    });
  }

  const columns: TableColumnList = [
    { label: $t("promotion.sort"), prop: "orderNo", width: 70 },
    { label: $t("promotion.serialNumber"), prop: "ID", width: 80 },
    {
      label: $t("promotion.type"),
      prop: "type",
      width: 90,
      cellRenderer: ({ row }) => (
        <div>
          {String(row.type ?? "")
            .split(",")
            .filter(Boolean)
            .map(t => (
              <p style="margin:0">{typeMap.value[t] ?? t}</p>
            ))}
        </div>
      )
    },
    {
      label: $t("promotion.listingName"),
      prop: "name",
      minWidth: 160,
      cellRenderer: ({ row }) => (
        <a
          style="cursor:pointer;color:var(--el-color-primary)"
          onClick={() => openDialog("checked", row)}
        >
          {(row.name ?? []).map((n: string) => (
            <div>{n}</div>
          ))}
        </a>
      )
    },
    {
      label: $t("promotion.pinToTop"),
      prop: "top",
      width: 70,
      cellRenderer: ({ row }) => <span>{row.top === 1 ? "Y" : ""}</span>
    },
    {
      label: $t("promotion.show"),
      prop: "display",
      width: 90,
      cellRenderer: ({ row }) => (
        <el-switch
          modelValue={row.display === 1}
          active-text={$t("promotion.show")}
          inactive-text={$t("promotion.hidden")}
          inline-prompt
          onClick={() => handleDisplay(row)}
        />
      )
    },
    {
      label: $t("promotion.relatedOffers"),
      prop: "promotions",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <div>
          {(row.promotions ?? []).map((p: any) => (
            <p style="margin:0">
              <a
                href={`/promotion/list?name=${p.name}`}
                target="_blank"
                style="color:var(--el-color-primary)"
              >
                {p.name}
              </a>
            </p>
          ))}
        </div>
      )
    },
    {
      label: `WEB ${$t("promotion.image")}`,
      prop: "imageWeb",
      width: 130,
      hide: () => !checkIsXinliCN(),
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
      label: checkIsXinliCN()
        ? `H5 ${$t("promotion.image")}`
        : $t("promotion.image"),
      prop: "imageH5",
      width: 130,
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
    { label: $t("promotion.addedTime"), prop: "startTime", width: 150 },
    { label: $t("promotion.removalTime"), prop: "endTime", width: 150 },
    { label: $t("promotion.lastUpdate"), prop: "updatedAt", width: 150 },
    { label: $t("promotion.executorName"), prop: "updatedUser", width: 110 },
    { label: $t("promotion.operate"), fixed: "right", width: 120, slot: "operation" }
  ];

  function buildParams() {
    const params: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      orderBy: orderParams.orderBy,
      order: orderParams.order
    };
    Object.keys(searchForm).forEach(k => {
      const v = (searchForm as any)[k];
      if (v !== "" && v !== undefined && v !== null) params[k] = v;
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getLaunchedList(buildParams());
      const list = (data?.list ?? []).map((item: any) => {
        // 後端回 languageText，組成 name 顯示陣列（沿用舊碼）
        if (Array.isArray(item.languageText)) {
          item.name = item.languageText.map(
            (l: any) => `${l.language} : ${l.name}`
          );
        } else if (typeof item.name === "string") {
          item.name = [item.name];
        }
        return item;
      });
      dataList.value = list;
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    Object.keys(searchForm).forEach(k => ((searchForm as any)[k] = ""));
    pagination.currentPage = 1;
    onSearch();
  }

  // 取得單一上架資料並轉成表單可用結構
  async function transformRecord(row: LaunchedListItem): Promise<FormItemProps> {
    const { data } = await getLaunched({ ID: row.ID });
    return {
      ...data,
      device: String(data.device ?? "")
        .split(",")
        .filter(Boolean)
        .map(Number),
      type: String(data.type ?? "")
        .split(",")
        .filter(Boolean)
        .map(Number),
      promotions: (data.promotions ?? []).map((p: any) =>
        typeof p === "object" ? p.id : Number(p)
      )
    };
  }

  function defaultForm(): FormItemProps {
    return {
      name: "",
      summary: "",
      type: [],
      device: [],
      content: "",
      orderNo: 0,
      top: 2,
      display: 1,
      startTime: "",
      endTime: "",
      imageWeb: "",
      imageH5: "",
      promotions: []
    };
  }

  async function openDialog(mode: "create" | "edit" | "checked", row?: LaunchedListItem) {
    let formInline = defaultForm();
    if (mode !== "create" && row) {
      formInline = await transformRecord(row);
    }
    const titleMap = {
      create: $t("promotion.newPromotionLaunch"),
      edit: $t("promotion.edit"),
      checked: $t("promotion.listingName")
    };
    addDialog({
      title: titleMap[mode],
      props: {
        formInline,
        typeOptions: typeOptions.value,
        deviceOptions: deviceOptions.value,
        promotionOptions: promotionOptions.value,
        readonly: mode === "checked"
      },
      width: "720px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: mode === "checked",
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const fn = mode === "create" ? createLaunched : updateLaunched;
          const { success } = await fn(curData);
          if (success) {
            message($t("promotion.updateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 顯示/隱藏切換
  async function handleDisplay(row: LaunchedListItem) {
    const payload = await transformRecord(row);
    payload.display = payload.display === 1 ? 2 : 1;
    const { success } = await updateLaunched(payload);
    if (success) {
      message($t("promotion.updateSuccess"), { type: "success" });
      onSearch();
    }
  }

  async function fetchDropdown() {
    const { data } = await getPromotionDropdown();
    displayOptions.value = toOptions(data?.display ?? []);
    activityOptions.value = toOptions(data?.activity ?? []);
    const dev = toOptions(data?.device ?? []);
    deviceOptions.value = dev.map(o => ({ label: o.label, value: Number(o.value) }));
    const ty = toOptions(data?.launchedType ?? []);
    typeOptions.value = ty.map(o => ({ label: o.label, value: Number(o.value) }));
    typeMap.value = ty.reduce(
      (acc, o) => {
        acc[o.value] = o.label;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  async function fetchPromotionOptions() {
    const { data } = await getPromotionList({ pageSize: 9999 });
    promotionOptions.value = (data?.list ?? []).map((item: any) => ({
      label: item.name,
      value: item.ID
    }));
  }

  onMounted(async () => {
    await Promise.all([fetchDropdown(), fetchPromotionOptions()]);
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    displayOptions,
    activityOptions,
    deviceOptions,
    onSearch,
    resetForm,
    openDialog
  };
}
