import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import { getGameTypeList, putGameType, type GameTypeItem } from "@/api/games";
import type { FormItemProps } from "./types";

export function useGameType() {
  const imagPath = getImagPath();
  const dataList = ref<GameTypeItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是 / 否 渲染
  const yesNo = (v: number) => (v == 1 ? $t("games.yes") : $t("games.no"));

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      width: 80,
      sortable: true
    },
    { label: $t("games.name"), prop: "name" },
    { label: $t("games.gameTypeSecondName"), prop: "second_name" },
    { label: $t("games.sort"), prop: "sort", width: 90, sortable: true },
    {
      label: $t("games.gameTypeIsShow"),
      prop: "is_show",
      cellRenderer: ({ row }) => <span>{yesNo(row.is_show)}</span>
    },
    {
      label: $t("games.gameTypeDynamic"),
      prop: "dynamic",
      cellRenderer: ({ row }) => <span>{yesNo(row.dynamic)}</span>
    },
    {
      label: $t("games.gameTypeIcon"),
      prop: "icon",
      cellRenderer: ({ row }) =>
        row.icon ? (
          <img src={`${imagPath}${row.icon}`} style="max-height:40px" />
        ) : (
          <span>-</span>
        )
    },
    {
      label: $t("games.gameTypeIconColor"),
      prop: "icon_color",
      cellRenderer: ({ row }) =>
        row.icon_color ? (
          <img src={`${imagPath}${row.icon_color}`} style="max-height:40px" />
        ) : (
          <span>-</span>
        )
    },
    {
      label: $t("games.gameTypeIconColor2"),
      prop: "icon_color2",
      cellRenderer: ({ row }) =>
        row.icon_color2 ? (
          <img src={`${imagPath}${row.icon_color2}`} style="max-height:40px" />
        ) : (
          <span>-</span>
        )
    },
    { label: $t("games.gameTypeRefund"), prop: "refund" },
    {
      label: $t("games.operation"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameTypeList();
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function openDialog(row: GameTypeItem) {
    addDialog({
      title: $t("games.edit"),
      props: {
        formInline: {
          id: row.id,
          name: row.name,
          secondName: row.second_name,
          sort: row.sort,
          refund: row.refund,
          isRecommended: row.is_recommended ?? 2,
          isTagRecommended: row.is_tag_recommended ?? 2,
          isShow: row.is_show ?? 1,
          dynamic: row.dynamic ?? 2,
          display: row.display ?? "",
          icon: row.icon ?? "",
          iconColor: row.icon_color ?? "",
          iconColor2: row.icon_color2 ?? "",
          srcIcon: "",
          srcIconColor: "",
          srcIconColor2: ""
        }
      },
      width: "960px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          // 沿用舊邏輯：put 整筆，欄位名稱對應後端
          const { success } = await putGameType({
            id: curData.id,
            display: curData.display,
            name: curData.name,
            secondName: curData.secondName,
            sort: curData.sort,
            refund: curData.refund,
            isRecommended: curData.isRecommended,
            isTagRecommended: curData.isTagRecommended,
            isShow: curData.isShow,
            dynamic: curData.dynamic,
            icon: curData.icon,
            iconColor: curData.iconColor,
            iconColor2: curData.iconColor2
          });
          if (success) {
            message($t("games.editSuccess"), { type: "success" });
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
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    openDialog
  };
}
