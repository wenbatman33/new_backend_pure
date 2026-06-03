import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { ElTag, ElImage } from "element-plus";
import editForm from "../form.vue";
import configForm from "../configForm.vue";
import recordTable from "../recordTable.vue";
import {
  getGameGroups,
  getGameGroup,
  putGameGroup,
  getGameAgencyOption,
  getGameListType,
  getConfigSportEventRecommendGroupId,
  putConfigSportEventRecommendGroupId,
  type GameGroupItem,
  type GameGroupOptionItem
} from "@/api/games";
import type { FormItemProps, ConfigSportFormItemProps } from "./types";

// 狀態對應文案
const statusMap: Record<number, string> = {
  0: $t("games.all"),
  1: $t("games.open"),
  2: $t("games.closeText"),
  3: $t("games.inMaintenance"),
  4: $t("games.hidden"),
  99: $t("games.siteClosed")
};
// 狀態對應顏色
const statusColorMap: Record<number, "success" | "danger" | "warning"> = {
  0: "warning",
  1: "success",
  2: "danger",
  3: "danger",
  4: "danger",
  99: "danger"
};
// 錢包類型對應
const walletTypeMap: Record<number, string> = {
  0: $t("games.all"),
  1: $t("games.single"),
  2: $t("games.transferMoney")
};
// 開啟方式對應
const openWayMap: Record<number, string> = {
  1: $t("games.gamesLobby"),
  2: $t("games.gameList"),
  3: $t("games.enterTheGame"),
  4: $t("games.openSeparately"),
  5: $t("games.embedHtml"),
  101: "opus"
};

export function useGameGroup() {
  const imagPath = getImagPath();
  const searchForm = reactive({
    name: "",
    displayName: "",
    gameAgencyID: "",
    walletType: "",
    gameTypeID: "",
    status: 0
  });
  const dataList = ref<GameGroupItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 搜尋下拉選單資料
  const agencyOptions = ref<{ label: string; value: number | string }[]>([]);
  const gameTypeOptions = ref<{ label: string; value: number | string }[]>([]);

  const walletTypeOptions = [
    { label: $t("games.single"), value: 1 },
    { label: $t("games.transferMoney"), value: 2 },
    { label: $t("games.all"), value: 0 }
  ];
  const statusOptions = [
    { label: $t("games.all"), value: 0 },
    { label: $t("games.open"), value: 1 },
    { label: $t("games.closeText"), value: 2 },
    { label: $t("games.inMaintenance"), value: 3 },
    { label: $t("games.hidden"), value: 4 },
    { label: $t("games.siteClosed"), value: 99 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 廠商圖片欄位渲染
  const imageRenderer = (val: string) =>
    val
      ? h(ElImage, {
          src: imagPath + val,
          fit: "contain",
          style: "height: 50px; border-radius: 4px",
          previewSrcList: [imagPath + val],
          previewTeleported: true
        })
      : h("span", "-");

  const columns: TableColumnList = [
    { label: "ID", prop: "id", fixed: true, width: 60 },
    { label: $t("games.manufacturerDefaultName"), prop: "name", width: 150 },
    { label: $t("games.websiteDisplayName"), prop: "displayName", width: 150 },
    { label: $t("games.websiteSorting"), prop: "sort", width: 90 },
    { label: $t("games.affiliatedAgents"), prop: "gameAgencyName", width: 110 },
    {
      label: $t("games.walletType"),
      prop: "walletType",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{walletTypeMap[row.walletType] ?? row.walletType}</span>
      )
    },
    {
      label: $t("games.manufacturerGameType"),
      prop: "gameType",
      width: 120,
      cellRenderer: ({ row }) => <span>{row.gameType?.name ?? "-"}</span>
    },
    {
      label: $t("games.manufacturerOpeningMethodPC"),
      prop: "openWayPc",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{openWayMap[row.openWayPc] ?? row.openWayPc}</span>
      )
    },
    {
      label: $t("games.manufacturerOpeningMethodH5"),
      prop: "openWayH5",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{openWayMap[row.openWayH5] ?? row.openWayH5}</span>
      )
    },
    { label: $t("games.platformFeeRatio"), prop: "platformFeeRatio", width: 100 },
    {
      label: $t("games.manufacturerH5Picture"),
      prop: "imageH5",
      width: 100,
      cellRenderer: ({ row }) => imageRenderer(row.imageH5)
    },
    {
      label: $t("games.manufacturerPCDiagram"),
      prop: "imagePc",
      width: 100,
      cellRenderer: ({ row }) => imageRenderer(row.imagePc)
    },
    {
      label: $t("games.manufacturerLogo"),
      prop: "logoImage",
      width: 100,
      cellRenderer: ({ row }) => imageRenderer(row.logoImage)
    },
    {
      label: $t("games.manufacturerLogo2"),
      prop: "logoImage2",
      width: 100,
      cellRenderer: ({ row }) => imageRenderer(row.logoImage2)
    },
    {
      label: $t("games.imgRecommend1"),
      prop: "imgRecommend1",
      width: 100,
      cellRenderer: ({ row }) => imageRenderer(row.imgRecommend1)
    },
    {
      label: $t("games.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <ElTag type={statusColorMap[row.status] ?? "info"} effect="light">
          {statusMap[row.status] ?? row.status}
        </ElTag>
      )
    },
    { label: $t("games.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  // 清掉空字串條件
  function buildParams() {
    const query: Record<string, any> = { ...searchForm };
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === "") {
        delete query[key];
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameGroups(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 0;
    onSearch();
  }

  // 載入搜尋用下拉選單
  async function fetchOptions() {
    const [agencyRes, typeRes] = await Promise.all([
      getGameAgencyOption(),
      getGameListType()
    ]);
    agencyOptions.value = (agencyRes.data?.list ?? []).map(
      (e: GameGroupOptionItem) => ({ label: e.value, value: e.key })
    );
    gameTypeOptions.value = (typeRes.data?.list ?? []).map(
      (e: GameGroupOptionItem) => ({ label: e.value, value: e.key })
    );
  }

  // 開啟編輯對話框
  async function openEditDialog(row: GameGroupItem) {
    // 取得單筆細節（平台費率/維護時間等由細節 API 帶回）
    const { data: detail } = await getGameGroup({ id: row.id });
    const formInline: FormItemProps = {
      id: row.id,
      gameAgencyName: row.gameAgencyName,
      walletType: walletTypeMap[row.walletType] ?? String(row.walletType),
      name: row.name,
      displayName: row.displayName,
      gameTypeID: row.gameType?.id,
      openWayPc: row.openWayPc,
      openWayH5: row.openWayH5,
      sort: row.sort,
      status: row.status,
      platformFeeRatio: detail?.platformFeeRatio,
      gameListIDTurnover: detail?.gameListIDTurnover,
      maintainTime: detail?.maintainTime ?? "",
      imageH5: row.imageH5,
      imagePc: row.imagePc,
      logoImage: row.logoImage,
      logoImage2: row.logoImage2,
      imgRecommend1: row.imgRecommend1,
      ishow: row.ishow,
      gameResultType: detail?.gameResultType,
      showDetailLinkButton: detail?.showDetailLinkButton,
      gameTypeOptions: gameTypeOptions.value
    };
    addDialog({
      title: $t("games.edit"),
      props: { formInline },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await putGameGroup({
            id: curData.id,
            name: curData.name,
            displayName: curData.displayName,
            gameTypeID: curData.gameTypeID,
            sort: curData.sort,
            status: Number(curData.status),
            imageH5: curData.imageH5,
            imagePc: curData.imagePc,
            logoImage: curData.logoImage,
            logoImage2: curData.logoImage2,
            imgRecommend1: curData.imgRecommend1,
            maintainTime: curData.maintainTime,
            ishow: curData.ishow,
            openWayH5: curData.openWayH5,
            openWayPc: curData.openWayPc,
            gameListIDTurnover: curData.gameListIDTurnover,
            gameResultType: curData.gameResultType,
            showDetailLinkButton: curData.showDetailLinkButton
          });
          if (success) {
            message($t("games.updateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 開啟設定賽事推薦對話框
  async function openConfigDialog() {
    const { data } = await getConfigSportEventRecommendGroupId();
    const formInline: ConfigSportFormItemProps = {
      recommendGroupId: data?.recommendGroupId ?? "",
      luckysportGroupId: data?.luckysportGroupId ?? "",
      isVirtual: data?.isVirtual ?? 1,
      countRecord: data?.countRecord ?? "",
      countDay: data?.countDay ?? "",
      rankingGameGroupList: data?.rankingGameGroupList ?? []
    };
    // 全部廠商選單（供排行榜挑選）
    const { data: allGroups } = await getGameGroups();
    const groupOptions = (allGroups?.list ?? []).map((item: GameGroupItem) => ({
      label: item.name,
      value: item.id
    }));
    addDialog({
      title: $t("games.configSportEventRecommend"),
      props: { formInline, groupOptions },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(configForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as ConfigSportFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = await putConfigSportEventRecommendGroupId(curData);
          if (success) {
            message($t("games.updateSuccess"), { type: "success" });
            done();
          }
        });
      }
    });
  }

  // 開啟操作紀錄對話框
  function openRecordDialog(row: GameGroupItem) {
    addDialog({
      title: $t("games.handleRecord"),
      props: { gameGroupId: row.id },
      width: "1100px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(recordTable)
    });
  }

  onMounted(() => {
    fetchOptions();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    agencyOptions,
    gameTypeOptions,
    walletTypeOptions,
    statusOptions,
    onSearch,
    resetForm,
    openEditDialog,
    openConfigDialog,
    openRecordDialog
  };
}
