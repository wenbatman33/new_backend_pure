import { ref, reactive, computed, onMounted } from "vue";
import { ElInput } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { isArray } from "@/utils/is";
import {
  getRecommendConfig,
  postRecommendSetevent,
  postRecommendSetevent1,
  postRecommendSetevent2,
  getGameType
} from "@/api/independentEvent";
import type {
  RecommendConfig,
  Event1BonusItem,
  GameTypeOption
} from "./types";

/** 反水阶层 key（活动二三个阶层） */
const REBATE_KEYS = ["event2Rebate1", "event2Rebate2", "event2Rebate3"] as const;

export function useRecommend() {
  const loading = ref(false);
  const formDataDisabled = ref(true);

  /** 游戏类型选项（活动二反水矩阵的栏位来源） */
  const gameTypeOptions = ref<GameTypeOption[]>([]);

  /** 设定区表单（开关 + 上限） */
  const formData = reactive({
    isRun: false,
    event2UpperLimit: 0,
    event1IsShow: true,
    event2IsShow: true
  });

  /** 后端原始资料，供取消还原与重置使用 */
  const originalData = ref<RecommendConfig>({
    isRun: false,
    event2UpperLimit: 0,
    event1BonusList: [{ people: "", bonus: "" }],
    event2Rebate1: [],
    event2Rebate2: [],
    event2Rebate3: [],
    event1IsShow: true,
    event2IsShow: true
  });

  /** 活动一奖金清单（可编辑） */
  const event1List = ref<Event1BonusItem[]>([]);

  /** 活动二反水矩阵：三列（阶层），每列为 { [gameType]: rebate } */
  const event2List = ref<Record<string | number, number | string>[]>([]);

  /** 活动一 columns：序号 / 推荐人数 / 奖金（人数与奖金可编辑） */
  const columns1 = computed<TableColumnList>(() => [
    {
      label: $t("independentEvent.recommendEvent1Column"),
      type: "index",
      width: 80
    },
    {
      label: $t("independentEvent.recommendEvent1Column1"),
      prop: "people",
      cellRenderer: ({ row }) => (
        <ElInput v-model={row.people} type="number" />
      )
    },
    {
      label: $t("independentEvent.recommendEvent1Column2"),
      prop: "bonus",
      cellRenderer: ({ row }) => (
        <ElInput v-model={row.bonus} type="number" />
      )
    }
  ]);

  /** 活动二 columns：序号 + 各游戏类型反水百分比（可编辑） */
  const columns2 = computed<TableColumnList>(() => [
    {
      label: $t("independentEvent.recommendTier"),
      type: "index",
      width: 80
    },
    ...gameTypeOptions.value.map(item => ({
      label:
        $t(`independentEvent.recommendGameType${item.value}`) +
        " " +
        $t("independentEvent.recommendTierRebatePercentage"),
      prop: String(item.value),
      cellRenderer: ({ row }) => (
        <ElInput v-model={row[item.value]} type="number" />
      )
    }))
  ]);

  /** 把后端反水阵列转成矩阵（三列，依 gameType 取值） */
  function buildRebateMatrix(res: RecommendConfig) {
    return REBATE_KEYS.map(key => {
      const arr = isArray(res[key]) ? res[key] : [];
      return gameTypeOptions.value.reduce(
        (acc, { value }) => {
          acc[value] =
            arr.find(item => item.gameType === value)?.rebate ?? 0;
          return acc;
        },
        {} as Record<string | number, number | string>
      );
    });
  }

  async function handleGetData() {
    loading.value = true;
    formDataDisabled.value = true;
    try {
      const { success, data } = await getRecommendConfig();
      if (!success) return;
      originalData.value = data;
      formData.isRun = data.isRun;
      formData.event2UpperLimit = data.event2UpperLimit;
      formData.event1IsShow = data.event1IsShow;
      formData.event2IsShow = data.event2IsShow;
      event1List.value = (data.event1BonusList ?? []).map(item => ({
        ...item
      }));
      event2List.value = buildRebateMatrix(data);
    } finally {
      loading.value = false;
    }
  }

  /** 储存设定区 */
  async function handleSubmitConfigure() {
    const { success } = await postRecommendSetevent({
      isRun: formData.isRun,
      event2UpperLimit: Number(formData.event2UpperLimit),
      event1IsShow: formData.event1IsShow,
      event2IsShow: formData.event2IsShow
    });
    if (success) {
      message($t("independentEvent.recommendSaveSuccess"), { type: "success" });
      handleGetData();
    } else {
      message($t("independentEvent.recommendError"), { type: "error" });
    }
  }

  /** 取消设定区编辑，还原 */
  function handleCancelConfigure() {
    formDataDisabled.value = true;
    formData.isRun = originalData.value.isRun;
    formData.event2UpperLimit = originalData.value.event2UpperLimit;
    formData.event1IsShow = originalData.value.event1IsShow;
    formData.event2IsShow = originalData.value.event2IsShow;
  }

  /** 活动一新增一列 */
  function handleAddEvent1() {
    event1List.value.push({ people: "", bonus: "" });
  }

  /** 活动一重置为原始资料 */
  function resetEvent1() {
    event1List.value = (originalData.value.event1BonusList ?? []).map(item => ({
      ...item
    }));
  }

  /** 活动一储存 */
  async function handleSubmit1() {
    loading.value = true;
    try {
      const { success } = await postRecommendSetevent1({
        event1BonusList: event1List.value.map(item => ({
          people: Number(item.people),
          bonus: Number(item.bonus)
        }))
      });
      if (success) {
        message($t("independentEvent.recommendSaveSuccess"), {
          type: "success"
        });
        handleGetData();
      } else {
        message($t("independentEvent.recommendError"), { type: "error" });
      }
    } finally {
      loading.value = false;
    }
  }

  /** 活动二重置为 0 */
  function resetEvent2() {
    event2List.value = REBATE_KEYS.map(() =>
      gameTypeOptions.value.reduce(
        (acc, { value }) => {
          acc[value] = 0;
          return acc;
        },
        {} as Record<string | number, number | string>
      )
    );
  }

  /** 活动二储存 */
  async function handleSubmit2() {
    loading.value = true;
    try {
      const params = REBATE_KEYS.reduce(
        (acc, key, index) => {
          acc[key] = Object.entries(event2List.value[index] ?? {}).map(
            ([gameType, rebate]) => ({ gameType, rebate: Number(rebate) })
          );
          return acc;
        },
        {} as Record<string, { gameType: string; rebate: number }[]>
      );
      const { success } = await postRecommendSetevent2(params);
      if (success) {
        message($t("independentEvent.recommendSaveSuccess"), {
          type: "success"
        });
        handleGetData();
      } else {
        message($t("independentEvent.recommendError"), { type: "error" });
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    const { success, data } = await getGameType();
    if (success && isArray(data?.list)) {
      gameTypeOptions.value = data.list.map(item => ({
        label: item.name,
        value: item.id
      }));
    }
    handleGetData();
  });

  return {
    loading,
    formData,
    formDataDisabled,
    columns1,
    columns2,
    event1List,
    event2List,
    handleSubmitConfigure,
    handleCancelConfigure,
    handleAddEvent1,
    resetEvent1,
    handleSubmit1,
    resetEvent2,
    handleSubmit2
  };
}
