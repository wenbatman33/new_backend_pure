import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { findByValue, arrayToOptions } from "@/utils/options";
import editForm from "../form.vue";
import operationRecord from "../operationRecord.vue";
import {
  getLuckmoneyGameGroups,
  getLuckmoneyGameAgencyOption,
  putLuckmoneyGameGroup,
  getGameListType,
  getLuckmoneyGameList,
  getLuckMoneyLog,
  type LmGameGroupRow
} from "@/api/games";
import type { FormItemProps } from "./types";

/** 狀態選項 */
export const statusOptions = [
  { label: $t("games.lmGameGroupOpen"), value: 1 },
  { label: $t("games.lmGameGroupClosed"), value: 2 },
  { label: $t("games.lmGameGroupInMaintenance"), value: 3 },
  { label: $t("games.lmGameGroupHidden"), value: 4 }
];

/** 錢包類型選項 */
export const walletOptions = [
  { label: $t("games.lmGameGroupSingleWallet"), value: 1 },
  { label: $t("games.lmGameGroupTransferWallet"), value: 2 }
];

/** 開啟方式選項（搜尋與表格顯示用） */
export const openWayOptions = [
  { label: $t("games.lmGameGroupOpenGameLobby"), value: 1 },
  { label: $t("games.lmGameGroupGameList"), value: 2 },
  { label: $t("games.lmGameGroupEnterTheGame"), value: 3 }
];

/** 編輯彈窗用的完整開啟方式選項 */
export const openWayFullOptions = [
  { label: $t("games.lmGameGroupGamesLobby"), value: 1 },
  { label: $t("games.lmGameGroupGameList"), value: 2 },
  { label: $t("games.lmGameGroupEnterTheGame"), value: 3 },
  { label: $t("games.lmGameGroupOpenSeparately"), value: 4 },
  { label: $t("games.lmGameGroupEmbedHtml"), value: 5 },
  { label: "opus", value: 101 }
];

/** 狀態標籤顏色 */
const statusTagType: Record<number, string> = {
  1: "success",
  2: "danger",
  3: "warning",
  4: "info"
};

export function useLmGameGroup() {
  const searchForm = reactive({
    name: "",
    displayName: "",
    gameAgencyID: "",
    walletType: 0,
    gameTypeID: "",
    status: 0
  });
  const dataList = ref<LmGameGroupRow[]>([]);
  const loading = ref(true);
  const formRef = ref();

  /** 下拉選項（搜尋列用） */
  const gameAgencyOptions = ref<{ label: string; value: any }[]>([]);
  const gameTypeListOption = ref<{ label: string; value: any }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("games.lmGameGroupManufacturerDefaultName"), prop: "name" },
    { label: $t("games.lmGameGroupWebsiteDisplayName"), prop: "displayName" },
    { label: $t("games.lmGameGroupWebsiteSorting"), prop: "sort", width: 100 },
    {
      label: $t("games.lmGameGroupAffiliatedAgents"),
      prop: "gameAgencyName",
      width: 110
    },
    {
      label: $t("games.lmGameGroupWalletType"),
      prop: "walletType",
      cellRenderer: ({ row }) => (
        <span>{findByValue(walletOptions, row.walletType)}</span>
      )
    },
    {
      label: $t("games.lmGameGroupManufacturerGameType"),
      prop: "gameType",
      cellRenderer: ({ row }) => <span>{row.gameType?.name}</span>
    },
    {
      label: $t("games.lmGameGroupManufacturerOpeningMethod"),
      prop: "openWay",
      cellRenderer: ({ row }) => (
        <span>
          PC：{findByValue(openWayOptions, row.openWayPc)}
          <br />
          H5：{findByValue(openWayOptions, row.openWayH5)}
        </span>
      )
    },
    {
      label: $t("games.lmGameGroupPlatformFeeRatio"),
      prop: "platformFeeRatio",
      width: 100
    },
    {
      label: $t("games.lmGameGroupStatus"),
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={statusTagType[row.status] ?? "info"} effect="plain">
          {findByValue(statusOptions, row.status)}
        </el-tag>
      )
    },
    {
      label: $t("games.lmGameGroupOperate"),
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const query: Record<string, any> = { ...searchForm };
      Object.keys(query).forEach(key => {
        if (query[key] === undefined || query[key] === "") {
          delete query[key];
        }
      });
      const { data } = await getLuckmoneyGameGroups(query);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? data?.list?.length ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.walletType = 0;
    searchForm.status = 0;
    onSearch();
  }

  /** 載入搜尋列下拉選單 */
  async function fetchOptions() {
    const [agencyRes, typeRes] = await Promise.all([
      getLuckmoneyGameAgencyOption(),
      getGameListType()
    ]);
    gameAgencyOptions.value = arrayToOptions(
      agencyRes?.data?.list ?? [],
      "key",
      "value"
    );
    gameTypeListOption.value = arrayToOptions(
      typeRes?.data?.list ?? [],
      "key",
      "value"
    );
  }

  /** 開啟編輯彈窗 */
  async function openDialog(row: LmGameGroupRow) {
    // 取得該廠商底下遊戲列表（流水下拉用）
    let gameListOption: { label: string; value: any }[] = [];
    const { data } = await getLuckmoneyGameList({ gameGroupID: row.id });
    gameListOption = (data?.list ?? []).map((el: any) => ({
      label: el.name,
      value: el.id
    }));

    addDialog({
      title: $t("games.lmGameGroupEdit"),
      width: "960px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          id: row.id,
          gameAgencyName: row.gameAgencyName,
          walletTypeText: findByValue(walletOptions, row.walletType),
          openWayPc: row.openWayPc,
          openWayH5: row.openWayH5,
          name: row.name,
          displayName: row.displayName,
          gameTypeID: row.gameType?.id,
          maintainTime: row.maintainTime ?? "",
          sort: row.sort,
          platformFeeRatio: row.platformFeeRatio,
          gameListIDTurnover: row.gameListIDTurnover,
          status: row.status,
          gameListID: row.gameListID ?? ""
        },
        gameTypeListOption: gameTypeListOption.value,
        gameListOption
      },
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await putLuckmoneyGameGroup({
            id: curData.id,
            name: curData.name,
            displayName: curData.displayName,
            gameTypeID: curData.gameTypeID,
            sort: curData.sort,
            status: curData.status,
            maintainTime: curData.maintainTime,
            openWayPc: curData.openWayPc,
            openWayH5: curData.openWayH5
          });
          if (success) {
            message($t("games.lmGameGroupOperateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 開啟操作紀錄彈窗 */
  async function openRecordDialog(row: LmGameGroupRow) {
    const { data } = await getLuckMoneyLog({ type: 1, ID: row.id });
    const records = data?.list ?? (Array.isArray(data) ? data : []);
    addDialog({
      title: $t("games.lmGameGroupHandleRecord"),
      width: "1200px",
      hideFooter: true,
      contentRenderer: () => h(operationRecord, { records })
    });
  }

  onMounted(async () => {
    await fetchOptions();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    gameAgencyOptions,
    gameTypeListOption,
    statusOptions,
    walletOptions,
    onSearch,
    resetForm,
    openDialog,
    openRecordDialog
  };
}
