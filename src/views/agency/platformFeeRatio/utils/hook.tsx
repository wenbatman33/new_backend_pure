import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getGameGroupFeeList,
  getGameGroupFeeDetail,
  getGameGroupFeeAgencyOptions,
  getGameGroupFeeTypeOptions,
  updateGameGroupPlatformFeeRatio,
  type GameGroupFeeItem
} from "@/api/agency";
import type { FormItemProps } from "./types";

/** 狀態文字對應 */
const statusMap: Record<number, string> = {
  0: $t("agency.statusAll"),
  1: $t("agency.statusOpen"),
  2: $t("agency.statusClose"),
  3: $t("agency.statusMaintenance"),
  4: $t("agency.statusHidden")
};

/** 狀態 tag 顏色對應 */
const statusTagType: Record<number, string> = {
  0: "warning",
  1: "success",
  2: "danger",
  3: "danger",
  4: "danger"
};

/** 錢包類型文字對應 */
const walletTypeMap: Record<number, string> = {
  0: $t("agency.statusAll"),
  1: $t("agency.walletSingle"),
  2: $t("agency.walletTransfer")
};

export function useGameGroupFee() {
  const searchForm = reactive({
    name: "",
    displayName: "",
    gameAgencyID: "",
    walletType: "",
    gameTypeID: "",
    status: 0
  });
  const dataList = ref<GameGroupFeeItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  /** 所屬代理下拉選項 */
  const agencyOptions = ref<Array<{ label: string; value: number | string }>>(
    []
  );
  /** 遊戲類型下拉選項 */
  const gameTypeOptions = ref<Array<{ label: string; value: number | string }>>(
    []
  );

  /** 錢包類型下拉選項 */
  const walletTypeOptions = [
    { label: $t("agency.walletSingle"), value: 1 },
    { label: $t("agency.walletTransfer"), value: 2 },
    { label: $t("agency.statusAll"), value: 0 }
  ];

  /** 狀態下拉選項 */
  const statusOptions = [
    { label: $t("agency.statusAll"), value: 0 },
    { label: $t("agency.statusOpen"), value: 1 },
    { label: $t("agency.statusClose"), value: 2 },
    { label: $t("agency.statusMaintenance"), value: 3 },
    { label: $t("agency.statusHidden"), value: 4 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("agency.manufacturerDefaultName"), prop: "name" },
    { label: $t("agency.websiteDisplayName"), prop: "displayName" },
    { label: $t("agency.websiteSorting"), prop: "sort", width: 100 },
    { label: $t("agency.affiliatedAgents"), prop: "gameAgencyName", width: 120 },
    {
      label: $t("agency.walletType"),
      prop: "walletType",
      cellRenderer: ({ row }) => (
        <span>{walletTypeMap[row.walletType] ?? row.walletType}</span>
      )
    },
    {
      label: $t("agency.manufacturerGameType"),
      prop: "gameType",
      cellRenderer: ({ row }) => <span>{row.gameType?.name ?? ""}</span>
    },
    {
      label: $t("agency.platformFeeRatio"),
      prop: "platformFeeRatio",
      width: 110
    },
    {
      label: $t("agency.status"),
      prop: "status",
      cellRenderer: ({ row }) => (
        <el-tag type={statusTagType[row.status] ?? "info"} effect="plain">
          {statusMap[row.status] ?? row.status}
        </el-tag>
      )
    },
    { label: $t("agency.operate"), fixed: "right", width: 120, slot: "operation" }
  ];

  /** 去除空字串/undefined 後送查詢 */
  function buildQuery() {
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
      const { data } = await getGameGroupFeeList(buildQuery());
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

  async function fetchOptions() {
    const [agencyRes, typeRes] = await Promise.all([
      getGameGroupFeeAgencyOptions(),
      getGameGroupFeeTypeOptions()
    ]);
    agencyOptions.value = (agencyRes.data?.list ?? []).map(item => ({
      label: item.value,
      value: item.key
    }));
    gameTypeOptions.value = (typeRes.data?.list ?? []).map(item => ({
      label: item.value,
      value: item.key
    }));
  }

  /** 開啟編輯（僅可編輯平台費率） */
  async function openDialog(row: GameGroupFeeItem) {
    // 取得詳細資料以取得最新平台費率
    const { data: detail } = await getGameGroupFeeDetail({ id: row.id });
    const formInline: FormItemProps = {
      id: row.id,
      gameAgencyName: row.gameAgencyName,
      walletType: walletTypeMap[row.walletType] ?? String(row.walletType),
      name: row.name,
      displayName: row.displayName,
      platformFeeRatio: detail?.platformFeeRatio ?? row.platformFeeRatio,
      gameTypeName: row.gameType?.name ?? "",
      status: row.status
    };
    addDialog({
      title: $t("agency.edit"),
      props: { formInline },
      width: "720px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await updateGameGroupPlatformFeeRatio({
            gameGroupID: curData.id,
            platformFeeRatio: curData.platformFeeRatio
          });
          if (success) {
            message($t("agency.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    fetchOptions();
    onSearch();
  });

  return {
    searchForm,
    agencyOptions,
    gameTypeOptions,
    walletTypeOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog
  };
}
