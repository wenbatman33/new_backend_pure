import { ref, reactive } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getVipGameInfo } from "@/api/sys";
import type {
  GameGroupItem,
  GameAgencyItem,
  GameListItem
} from "./types";

export function useVip1() {
  // 搜尋條件：以遊戲 ID 查詢
  const searchForm = reactive({
    id: ""
  });

  const loading = ref(false);
  // 三張表的資料來源（單筆物件包成陣列顯示）
  const groupList = ref<GameGroupItem[]>([]);
  const agencyList = ref<GameAgencyItem[]>([]);
  const listList = ref<GameListItem[]>([]);
  // 查詢成功後才顯示 agency / list 兩張子表
  const showSubTable = ref(false);

  const groupColumns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("sys.gameName"), prop: "name" },
    { label: $t("sys.displayName"), prop: "display_name" },
    { label: $t("sys.maintainTime"), prop: "maintain_time" },
    { label: $t("sys.walletType"), prop: "wallet_type" },
    { label: $t("sys.platformFeeRatio"), prop: "platform_fee_ratio" },
    { label: $t("sys.gameAgencyId"), prop: "game_agency_id" },
    { label: $t("sys.gameTypeId"), prop: "game_type_id" },
    { label: $t("sys.gameUrl"), prop: "game_url" },
    { label: $t("sys.gameWalletId"), prop: "game_wallet_id" },
    { label: $t("sys.openGameListId"), prop: "open_game_list_id" },
    { label: $t("sys.openWay"), prop: "open_way" },
    { label: $t("sys.sort"), prop: "sort" },
    { label: $t("sys.status"), prop: "status" },
    { label: $t("sys.createdAt"), prop: "created_at" },
    { label: $t("sys.updatedAt"), prop: "updated_at" },
    { label: $t("sys.imageH5"), prop: "image_h5" },
    { label: $t("sys.imagePc"), prop: "image_pc" },
    { label: $t("sys.logoImage"), prop: "logo_image" }
  ];

  const agencyColumns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("sys.gameName"), prop: "name" },
    { label: $t("sys.status"), prop: "status" },
    { label: $t("sys.createdAt"), prop: "created_at" },
    { label: $t("sys.updatedAt"), prop: "updated_at" },
    { label: $t("sys.imagePc"), prop: "image_pc" },
    { label: $t("sys.imageH5"), prop: "image_h5" }
  ];

  const listColumns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("sys.gameName"), prop: "name" },
    { label: $t("sys.displayName"), prop: "display_name" },
    { label: $t("sys.gameGroupId"), prop: "game_group_id", width: 90 },
    { label: $t("sys.gameTypeId"), prop: "game_type_id", width: 90 },
    { label: $t("sys.isHotGame"), prop: "is_hot_game", width: 90 },
    { label: $t("sys.isSlot"), prop: "is_slot", width: 90 },
    { label: $t("sys.isSpecial"), prop: "is_special", width: 90 },
    { label: $t("sys.roomUrl"), prop: "room_url" },
    { label: $t("sys.demoUrl"), prop: "demo_url" },
    { label: $t("sys.trialPlay"), prop: "trial_play" },
    { label: $t("sys.bettingCode"), prop: "betting_code" },
    { label: $t("sys.gameCodeH5"), prop: "game_code_h5" },
    { label: $t("sys.gameCodePc"), prop: "game_code_pc" },
    { label: $t("sys.sort"), prop: "sort" },
    { label: $t("sys.status"), prop: "status" },
    { label: $t("sys.createdAt"), prop: "created_at" },
    { label: $t("sys.updatedAt"), prop: "updated_at" },
    { label: $t("sys.imageH5"), prop: "image_h5" },
    { label: $t("sys.imagePc"), prop: "image_pc" },
    { label: $t("sys.recommendedImageH5"), prop: "recommended_image_h5" },
    { label: $t("sys.recommendedImagePc"), prop: "recommended_image_pc" },
    { label: $t("sys.recommendedSort"), prop: "recommended_sort" },
    { label: $t("sys.screenShotH5"), prop: "screen_shot_h5" },
    { label: $t("sys.screenShotPc"), prop: "screen_shot_pc" }
  ];

  async function onSearch() {
    loading.value = true;
    showSubTable.value = false;
    try {
      const { success, data } = await getVipGameInfo({ id: searchForm.id });
      if (success && data) {
        // 後端回傳單筆物件，包成陣列供 pure-table 渲染
        groupList.value = data.group ? [data.group] : [];
        agencyList.value = data.agency ? [data.agency] : [];
        listList.value = data.list ? [data.list] : [];
        showSubTable.value = true;
      } else {
        groupList.value = [];
        agencyList.value = [];
        listList.value = [];
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    groupList.value = [];
    agencyList.value = [];
    listList.value = [];
    showSubTable.value = false;
  }

  return {
    searchForm,
    loading,
    showSubTable,
    groupColumns,
    agencyColumns,
    listColumns,
    groupList,
    agencyList,
    listList,
    onSearch,
    resetForm
  };
}
