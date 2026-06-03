import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getLeagueScheduleList,
  postLeagueSchedule,
  putLeagueSchedule,
  type LeagueScheduleItem
} from "@/api/activity";
import type { FormItemProps } from "./types";

export function useLeagueSettings() {
  const searchForm = reactive({
    league: "" as number | "",
    showInactive: false,
    year: ""
  });
  const dataList = ref<LeagueScheduleItem[]>([]);
  // 聯賽下拉選項（由列表資料 distinct 而來）
  const leagueOptions = ref<{ label: string; value: number }[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("activity.league"), prop: "name", width: 200 },
    { label: $t("activity.leagueID"), prop: "league", width: 100 },
    {
      label: $t("activity.matchTime"),
      prop: "eventTime",
      cellRenderer: ({ row }) => (
        <span>{`${row.startTime ?? ""} ~ ${row.endTime ?? ""}`}</span>
      )
    },
    {
      label: $t("activity.isActive"),
      prop: "isActive",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{row.isActive == 1 ? $t("activity.yes") : $t("activity.no")}</span>
      )
    },
    { label: $t("activity.operate"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getLeagueScheduleList({
        league: searchForm.league === "" ? undefined : searchForm.league,
        showInactive: searchForm.showInactive ? 1 : undefined,
        year: searchForm.year || undefined
      });
      const list = (data?.list ?? []).filter(
        item => searchForm.showInactive || item.isActive === 1
      );
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
      // 構建聯賽下拉選項
      const map = new Map<number, string>();
      (data?.list ?? []).forEach(item => map.set(item.league, item.name));
      leagueOptions.value = Array.from(map.entries()).map(([value, label]) => ({
        label,
        value
      }));
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.league = "";
    searchForm.showInactive = false;
    searchForm.year = "";
    onSearch();
  }

  function openDialog(title = "add", row?: LeagueScheduleItem) {
    const isAdd = title === "add";
    addDialog({
      title: `${$t("activity.menuLeagueSettings")}-${
        isAdd ? $t("activity.add") : $t("activity.edit")
      }`,
      props: {
        formInline: {
          id: row?.id ?? 0,
          name: row?.name ?? "",
          league: row?.league ?? null,
          isActive: row?.isActive ?? 1,
          startTime:
            row?.startTime ?? dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          endTime:
            row?.endTime ?? dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            name: curData.name,
            league: curData.league,
            isActive: curData.isActive,
            startTime: curData.startTime,
            endTime: curData.endTime
          };
          const { success } = isAdd
            ? await postLeagueSchedule(payload)
            : await putLeagueSchedule({ ...payload, id: curData.id });
          if (success) {
            message(isAdd ? $t("activity.add") : $t("activity.edit"), {
              type: "success"
            });
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
    searchForm,
    leagueOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog
  };
}
