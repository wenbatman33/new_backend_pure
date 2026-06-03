import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import { formatNumber } from "@/utils/number";
import editForm from "../form.vue";
import {
  getAgencyRankSettingList,
  getAgencyRankSettingOption,
  createAgencyRankSetting,
  updateAgencyRankSetting,
  type AgencyGroupItem,
  type RankContent
} from "@/api/agency";
import type { FormItemProps } from "./types";

// TODO: 旧码使用 @/utils/country 的 countryCheck(['IN','PH','CN']) 判断周报/月报国别，
// pure 专案尚未移植 country 工具，暂以 false 占位（一律显示「周净利」文案）。
const isReportDateTypeWeek = false;

// 7 阶字母与表头颜色
const RANK_LABELS = ["S", "A", "B", "C", "D", "E", "F"];
const RANK_COLORS = [
  "#ce2a2a",
  "#ff8219",
  "#fb0",
  "#a22db9",
  "#6e3fe7",
  "#2577e0",
  "#00b1a3"
];

export function useAgencyGroup() {
  const dataList = ref<AgencyGroupItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 子栏位：依栏位 key 渲染各阶数值
  function rankChildren(
    field: "minProfit" | "activeMemberCount" | "commissionPercent"
  ): TableColumnList {
    return RANK_LABELS.map((label, i) => ({
      label,
      prop: `rankContent.${i}.${field}`,
      headerRenderer: () =>
        h("span", { style: { color: RANK_COLORS[i] } }, label),
      cellRenderer: ({ row }) => {
        const val = row?.rankContent?.[i]?.[field];
        if (val === undefined || val === null) return <span>-</span>;
        if (field === "commissionPercent") return <span>{`${val}%`}</span>;
        return <span>{formatNumber(val)}</span>;
      }
    }));
  }

  const columns: TableColumnList = [
    { label: $t("agency.agencyGroupId"), prop: "id", width: 100 },
    { label: $t("agency.agencyGroupName"), prop: "groupName", width: 150 },
    {
      label: $t("agency.agencyGroupActiveMemberHeader"),
      children: rankChildren("activeMemberCount")
    },
    {
      label: isReportDateTypeWeek
        ? $t("agency.agencyGroupNetProfitMonth")
        : $t("agency.agencyGroupNetProfitWeek"),
      children: rankChildren("minProfit")
    },
    {
      label: $t("agency.agencyGroupCommissionHeader"),
      children: rankChildren("commissionPercent")
    },
    {
      label: $t("agency.agencyGroupAction"),
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyRankSettingList({});
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 选项目前仅旧码 fetch 但未直接用于渲染；保留呼叫以对齐后端行为
  async function fetchOption() {
    try {
      await getAgencyRankSettingOption();
    } catch {
      // 忽略选项载入失败
    }
  }

  // 把列表行的 rankContent 拍平成表单栏位
  function rowToForm(row?: AgencyGroupItem): FormItemProps {
    const rc: RankContent[] = row?.rankContent ?? [];
    const form: any = {
      id: row?.id,
      groupName: row?.groupName ?? "",
      type: row?.type ?? 1
    };
    for (let i = 0; i < 7; i++) {
      form[`rank${i + 1}MinProfit`] = rc[i]?.minProfit ?? "";
      form[`rank${i + 1}ActiveMemberCount`] = rc[i]?.activeMemberCount ?? "";
      form[`rank${i + 1}CommissionPercent`] = rc[i]?.commissionPercent ?? "";
    }
    return form as FormItemProps;
  }

  // 把表单栏位组回送出 payload
  function formToPayload(curData: FormItemProps) {
    const payload: any = {
      groupName: curData.groupName,
      type: curData.type
    };
    for (let i = 1; i <= 7; i++) {
      payload[`rank${i}MinProfit`] = curData[`rank${i}MinProfit`];
      payload[`rank${i}ActiveMemberCount`] =
        curData[`rank${i}ActiveMemberCount`];
      payload[`rank${i}CommissionPercent`] =
        curData[`rank${i}CommissionPercent`];
    }
    return payload;
  }

  function openDialog(mode: "Create" | "Edit", row?: AgencyGroupItem) {
    const title =
      mode === "Create"
        ? $t("agency.agencyGroupAdd")
        : $t("agency.agencyGroupEdit");
    addDialog({
      title,
      props: {
        mode,
        isReportDateTypeWeek,
        formInline: rowToForm(row)
      },
      width: "1280px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          // 二次确认（对齐旧码 Modal.confirm）
          ElMessageBox.confirm(
            $t("agency.agencyGroupConfirm"),
            "",
            { type: "warning" }
          )
            .then(async () => {
              const payload = formToPayload(curData);
              if (mode === "Create") {
                const { success } = await createAgencyRankSetting(payload);
                if (success) {
                  message($t("agency.agencyGroupAddSuccess"), {
                    type: "success"
                  });
                  done();
                  onSearch();
                } else {
                  message($t("agency.agencyGroupAddFail"), { type: "error" });
                }
              } else {
                const { success } = await updateAgencyRankSetting({
                  groupID: row?.id,
                  ...payload
                });
                if (success) {
                  message($t("agency.agencyGroupEditSuccess"), {
                    type: "success"
                  });
                  done();
                  onSearch();
                } else {
                  message($t("agency.agencyGroupEditFail"), { type: "error" });
                }
              }
            })
            .catch(() => {});
        });
      }
    });
  }

  onMounted(() => {
    fetchOption();
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openDialog
  };
}
