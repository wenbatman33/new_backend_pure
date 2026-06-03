import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElInput, ElButton } from "element-plus";
import editForm from "../form.vue";
import {
  getRankList,
  createRank,
  editRank,
  getRankMemberList,
  editRankMember,
  getRankOperateLog,
  type RankListItem,
  type RankMember
} from "@/api/promotion";
import type { FormItemProps } from "./types";

export function useWinnerRank() {
  const searchForm = reactive({
    keyword: "",
    name: "",
    status: ""
  });
  const dataList = ref<RankListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("promotion.all"), value: "" },
    { label: $t("promotion.enable"), value: 1 },
    { label: $t("promotion.disable"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("promotion.no"), prop: "id", width: 90 },
    { label: $t("promotion.activityParameters"), prop: "eventCode", width: 140 },
    { label: $t("promotion.rankingName"), prop: "name" },
    { label: $t("promotion.rankingStartTimeCol"), prop: "startTime" },
    { label: $t("promotion.rankingEndTimeCol"), prop: "endTime" },
    {
      label: $t("promotion.status"),
      prop: "status",
      width: 80,
      cellRenderer: ({ row }) =>
        row.status === 1 ? (
          <span style="color:#00BB00">{$t("promotion.enable")}</span>
        ) : (
          <span style="color:#F00">{$t("promotion.disable")}</span>
        )
    },
    { label: $t("promotion.lastUpdateTime"), prop: "updatedAt", width: 150 },
    { label: $t("promotion.operator"), prop: "updatedUser", width: 110 },
    {
      label: $t("promotion.action"),
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  // 操作記錄表格欄位
  const logColumns: TableColumnList = [
    { label: $t("promotion.time"), prop: "updatedAt", width: 160 },
    { label: $t("promotion.operator"), prop: "updatedUser", width: 120 },
    { label: $t("promotion.changeItem"), prop: "item", width: 120 },
    { label: $t("promotion.changeResult"), prop: "content" }
  ];

  function removeEmpty(obj: Record<string, any>) {
    const query: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== "") {
        query[key] = String(obj[key]);
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRankList(removeEmpty(searchForm));
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 新增 / 設定 排行榜
  function openDialog(mode: "create" | "edit", row?: RankListItem) {
    const isEdit = mode === "edit";
    const formInline: FormItemProps = {
      id: isEdit ? row?.id : undefined,
      status: (row as any)?.status ?? 1,
      name: (row as any)?.name ?? "",
      cycleType: (row as any)?.cycleType ?? 2,
      startTime: (row as any)?.startTime ?? "",
      endTime: (row as any)?.endTime ?? "",
      finalEndTime: (row as any)?.finalEndTime ?? "",
      rankAmount: (row as any)?.rankAmount ?? null,
      type: (row as any)?.type ?? 1,
      gameItem: (row as any)?.gameItem ?? [],
      tag: (row as any)?.tag ?? [],
      eventCode: (row as any)?.eventCode ?? "",
      displayStartTime: (row as any)?.displayStartTime ?? "",
      displayEndTime: (row as any)?.displayEndTime ?? "",
      bonusShow: (row as any)?.bonusShow ?? 1,
      typeShow: (row as any)?.typeShow ?? 1,
      imgUrl: (row as any)?.imgUrl ?? "",
      announcement: (row as any)?.announcement ?? ""
    };

    addDialog({
      title: isEdit ? $t("promotion.editRanking") : $t("promotion.addRanking"),
      props: { formInline, mode },
      width: "900px",
      draggable: true,
      fullscreen: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = (options.props as any).formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const fn = isEdit
            ? editRank({ ...curData, id: formInline.id })
            : createRank(curData);
          const { success } = await fn;
          if (success) {
            message($t("promotion.actionSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 編輯排行（會員名次清單）
  function openMemberDialog(row: RankListItem) {
    const memberList = ref<RankMember[]>([]);
    getRankMemberList({ id: row.id }).then(({ data }) => {
      memberList.value = (data?.list ?? []).map((m: RankMember) => ({
        memberAccount: m.memberAccount,
        eventBetAmount: m.eventBetAmount
      }));
    });

    const add = (index: number) =>
      memberList.value.splice(index + 1, 0, {
        memberAccount: "",
        eventBetAmount: ""
      });
    const del = (index: number) => memberList.value.splice(index, 1);

    addDialog({
      title: $t("promotion.editRanking"),
      width: "700px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <div>
          {memberList.value.map((item, index) => (
            <div
              key={index}
              style="display:flex;align-items:center;gap:8px;margin-bottom:8px"
            >
              <span style="width:30px;text-align:center">{index + 1}</span>
              <ElInput
                modelValue={item.memberAccount}
                onUpdate:modelValue={(v: string) =>
                  (item.memberAccount = v)
                }
                placeholder={$t("promotion.memberAccount")}
              />
              <ElInput
                modelValue={item.eventBetAmount}
                onUpdate:modelValue={(v: string) =>
                  (item.eventBetAmount = v)
                }
                placeholder={$t("promotion.eventBetAmount")}
              />
              <ElButton onClick={() => add(index)}>+</ElButton>
              <ElButton onClick={() => del(index)}>-</ElButton>
            </div>
          ))}
        </div>
      ),
      beforeSure: async done => {
        const list = memberList.value.map((item, index) => ({
          order: index + 1,
          memberAccount: item.memberAccount,
          eventBetAmount: item.eventBetAmount
        }));
        const { success } = await editRankMember({ list, id: row.id });
        if (success) {
          message($t("promotion.actionSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  // 操作記錄
  function openLogDialog(row: RankListItem) {
    const logList = ref<any[]>([]);
    getRankOperateLog({ id: row.id }).then(({ data }) => {
      logList.value = data?.list ?? [];
    });

    const cellStyle =
      "border:1px solid var(--el-border-color);padding:6px 10px";
    const headStyle = `${cellStyle};background:var(--el-fill-color-light);font-weight:600`;

    addDialog({
      title: $t("promotion.operateLog"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => (
        <table style="width:100%;border-collapse:collapse;text-align:center">
          <thead>
            <tr>
              {logColumns.map(col => (
                <th
                  key={col.prop as string}
                  style={headStyle + (col.width ? `;width:${col.width}px` : "")}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logList.value.map((row2, idx) => (
              <tr key={idx}>
                {logColumns.map(col => (
                  <td key={col.prop as string} style={cellStyle}>
                    {row2[col.prop as string]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    openMemberDialog,
    openLogDialog
  };
}
