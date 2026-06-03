import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import logTable from "../log.vue";
import {
  getSmallGameLaunchedList,
  getSmallGameImageList,
  getSmallGameLaunched,
  updateSmallGameLaunched,
  getSmallGamePromotionLog,
  type SmallGameItem
} from "@/api/promotion";
import type { FormItemProps } from "./types";

const imagePath = getImagPath();

export function useSmallGame() {
  const searchForm = reactive({
    id: "",
    name: "",
    display: "",
    activity: "",
    startTime: "",
    endTime: ""
  });
  const dataList = ref<SmallGameItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 顯示狀態下拉（舊碼來自 dropdown.display，mock 提供固定值）
  const displayOptions = [
    { label: $t("promotion.show"), value: "1" },
    { label: $t("promotion.hidden"), value: "2" }
  ];
  // TODO: 上架類型(launchedType)對照表原由 dropdown 動態取得，此處改 mock 固定對照
  const typeMap = ref<Record<string, string>>({});

  const filterType = (key: string) => typeMap.value[key] ?? key;

  const columns: TableColumnList = [
    { label: $t("promotion.serialNumber"), prop: "ID", width: 80 },
    {
      label: $t("promotion.listingName"),
      prop: "name",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <div>
          {(row.languageText ?? []).map((item, idx) => (
            <div key={idx}>
              {item.language}: {item.name}
            </div>
          ))}
        </div>
      )
    },
    {
      label: $t("promotion.internalName"),
      prop: "internalName",
      cellRenderer: ({ row }) => <span>{row.promotions?.[0]?.internalName ?? "-"}</span>
    },
    {
      label: $t("promotion.show"),
      prop: "display",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>{row.display === 1 ? $t("promotion.show") : $t("promotion.hidden")}</span>
      )
    },
    {
      label: $t("promotion.type"),
      prop: "type",
      cellRenderer: ({ row }) => (
        <div>
          {String(row.type ?? "")
            .split(",")
            .filter(Boolean)
            .map((item, idx) => (
              <p key={idx} style="margin:0">
                {filterType(item)}
              </p>
            ))}
        </div>
      )
    },
    {
      label: `H5 ${$t("promotion.image")}`,
      prop: "imageH5",
      width: 120,
      cellRenderer: ({ row }) =>
        row.languageText?.[0]?.imageH5 ? (
          <el-image
            style="width:60px;height:60px"
            src={imagePath + row.languageText[0].imageH5}
            preview-teleported
            preview-src-list={[imagePath + row.languageText[0].imageH5]}
          />
        ) : (
          <span>--</span>
        )
    },
    {
      label: `${$t("promotion.smallGames")}${$t("promotion.image")}`,
      prop: "imageSmallGame",
      width: 120,
      cellRenderer: ({ row }) =>
        row.imageSmallGame ? (
          <el-image
            style="width:60px;height:60px"
            src={imagePath + row.imageSmallGame}
            preview-teleported
            preview-src-list={[imagePath + row.imageSmallGame]}
          />
        ) : (
          <span>--</span>
        )
    },
    {
      label: $t("promotion.addedTime"),
      prop: "startTime",
      width: 160,
      cellRenderer: ({ row }) => <span>{row.timeInterval?.[0]?.startTime ?? "-"}</span>
    },
    {
      label: $t("promotion.removalTime"),
      prop: "endTime",
      width: 160,
      cellRenderer: ({ row }) => (
        <span>{row.timeInterval?.[row.timeInterval.length - 1]?.endTime ?? "-"}</span>
      )
    },
    { label: $t("promotion.lastUpdate"), prop: "updatedAt", width: 160 },
    { label: $t("promotion.executorName"), prop: "updatedUser", width: 120 },
    { label: $t("promotion.operate"), fixed: "right", width: 180, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getSmallGameLaunchedList({
        id: searchForm.id,
        name: searchForm.name,
        display: searchForm.display,
        activity: searchForm.activity,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime,
        loginBonus: 5
      });
      const list = (data?.list ?? []).filter(
        item => (item.promotions?.length ?? 0) > 0
      );
      // 合併小遊戲圖片
      const imgRes = await getSmallGameImageList();
      (imgRes.data?.list ?? []).forEach(img => {
        const target = list.find(i => i.ID === img.id);
        if (target) target.imageSmallGame = img.url;
      });
      // 取上架類型對照（mock 提供）
      typeMap.value = imgRes.data?.typeMap ?? {};
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 切換上架/下架顯示狀態（舊碼原走 OTP 流程，此處改直接 updateLaunched）
  async function handleDisplay(row: SmallGameItem) {
    const { data } = await getSmallGameLaunched({ ID: row.ID });
    const payload: any = { ...data, ID: row.ID };
    // status 1 上架 => display 2 隱藏；反之 display 1 顯示
    payload.display = data?.promotions?.[0]?.status === 1 ? 2 : 1;
    const { success } = await updateSmallGameLaunched(payload);
    if (success) {
      message($t("promotion.updateSuccess"), { type: "success" });
      onSearch();
    }
  }

  function openDialog(title = $t("promotion.add"), row?: SmallGameItem) {
    addDialog({
      title,
      props: {
        formInline: {
          ID: row?.ID,
          internalName: row?.promotions?.[0]?.internalName ?? "",
          name: row?.languageText?.[0]?.name ?? "",
          display: row?.display ?? 1
        }
      },
      width: "560px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // TODO: 完整新增/編輯為多步驟表單(SmallGameModal 47KB，含多語系/條件/按鈕設定/OTP)
          // 此處先以基礎欄位呼叫 updateLaunched 佔位，需後續補完整步驟
          const { success } = await updateSmallGameLaunched(curData);
          if (success) {
            message($t("promotion.updateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 操作紀錄
  function openLogDialog(row: SmallGameItem) {
    addDialog({
      title: $t("promotion.log"),
      width: "800px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(logTable, { promotionLaunchedID: row.ID, name: row.languageText?.[0]?.name })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    displayOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDisplay,
    openLogDialog
  };
}
