import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { commaDecimalFormat } from "@/utils/number";
import Sortable from "sortablejs";
import dayjs from "dayjs";
import {
  getPayoutNavi,
  putPayoutNaviSort,
  putPayoutNaviStatus,
  postPayChannelBalance,
  updatePayChannelAp18limit
} from "@/api/cashflow";
import type { PayoutNaviItem } from "./types";

export function usePayoutNavi() {
  const dataList = ref<PayoutNaviItem[]>([]);
  const loading = ref(true);
  const updateAt = ref<string>("");
  const availableCount = ref(0);

  // 自動刷新設定
  const autoReload = ref(false);
  const intervalTime = ref(20);
  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  // 18 單筆限額行內編輯狀態：以 row.id 為 key
  const editing = reactive<Record<number, boolean>>({});
  const lowerLimit = reactive<Record<number, number>>({});
  const upperLimit = reactive<Record<number, number>>({});

  const title = computed(() =>
    updateAt.value
      ? `${$t("cashflow.payoutNaviLastUpdate")}：${updateAt.value}`
      : `${$t("cashflow.payoutNaviLastUpdate")}：`
  );
  const subtitle = computed(
    () => `${$t("cashflow.payoutNaviAvailableCount")}: ${availableCount.value}`
  );

  // 刷新單列三方餘額
  async function handleRefreshBalance(row: PayoutNaviItem) {
    loading.value = true;
    try {
      const { success, data } = await postPayChannelBalance({ id: row.id });
      if (success && data) {
        const idx = dataList.value.findIndex(item => item.id === row.id);
        if (idx > -1) dataList.value[idx] = { ...dataList.value[idx], ...data };
      } else {
        onSearch();
      }
    } finally {
      loading.value = false;
    }
  }

  // 狀態開關（1 開 / 2 關）
  async function handleStatusChange(row: PayoutNaviItem) {
    const next = row.status === 1 ? 2 : 1;
    const { success } = await putPayoutNaviStatus({ id: row.id, status: next });
    if (success) {
      message($t("cashflow.payoutNaviUpdateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 進入 18 限額編輯
  function startEdit(row: PayoutNaviItem) {
    lowerLimit[row.id] = Number(row.eighteenApLowerLimit) || 0;
    upperLimit[row.id] = Number(row.eighteenApUpperLimit) || 0;
    editing[row.id] = true;
  }
  function cancelEdit(row: PayoutNaviItem) {
    editing[row.id] = false;
  }
  async function submitEdit(row: PayoutNaviItem) {
    const { success } = await updatePayChannelAp18limit({
      id: row.id,
      eighteenApLowerLimit: String(lowerLimit[row.id]),
      eighteenApUpperLimit: String(upperLimit[row.id])
    });
    if (success) {
      message($t("cashflow.payoutNaviUpdateSuccess"), { type: "success" });
      editing[row.id] = false;
      onSearch();
    }
  }

  const columns: TableColumnList = [
    {
      label: "",
      prop: "handle",
      width: 50,
      cellRenderer: () => (
        <iconify-icon-online
          icon="ep:rank"
          class="handle"
          style="cursor: move;"
        />
      )
    },
    { label: $t("cashflow.payoutNaviMerchantNumber"), prop: "name", width: 150 },
    {
      label: $t("cashflow.payoutNaviTableData0"),
      prop: "thirdBalance",
      width: 170,
      cellRenderer: ({ row }) => (
        <span class="flex items-center justify-center">
          <span>
            {(row.thirdBalance ?? "")
              .toString()
              .split(",")
              .map((line: string) => (
                <div>{line}</div>
              ))}
          </span>
          <iconify-icon-online
            icon="ep:refresh"
            class="ml-1 cursor-pointer"
            onClick={() => handleRefreshBalance(row)}
          />
        </span>
      )
    },
    {
      label: $t("cashflow.payoutNaviStatusLabel"),
      prop: "paying",
      width: 100,
      cellRenderer: ({ row }) => (
        <span style={{ color: row.paying ? "#e6a23c" : "#67c23a" }}>
          {row.paying
            ? $t("cashflow.payoutNaviPaying0")
            : $t("cashflow.payoutNaviPaying1")}
        </span>
      )
    },
    {
      label: $t("cashflow.payoutNaviTableData1"),
      prop: "range",
      width: 230,
      cellRenderer: ({ row }) =>
        editing[row.id] ? (
          <span class="flex items-center justify-center gap-1">
            <el-input-number
              modelValue={lowerLimit[row.id]}
              onUpdate:modelValue={(v: number) => (lowerLimit[row.id] = v)}
              size="small"
              controls={false}
              class="!w-[80px]"
            />
            <span>~</span>
            <el-input-number
              modelValue={upperLimit[row.id]}
              onUpdate:modelValue={(v: number) => (upperLimit[row.id] = v)}
              size="small"
              controls={false}
              class="!w-[80px]"
            />
            <iconify-icon-online
              icon="ep:check"
              class="cursor-pointer"
              onClick={() => submitEdit(row)}
            />
            <iconify-icon-online
              icon="ep:close"
              class="cursor-pointer"
              onClick={() => cancelEdit(row)}
            />
          </span>
        ) : (
          <span class="flex items-center justify-center">
            {commaDecimalFormat(row.eighteenApLowerLimit, 2)} ~{" "}
            {commaDecimalFormat(row.eighteenApUpperLimit, 2)}
            {hasAuth("__btn_pay_channel_edit") ? (
              <iconify-icon-online
                icon="ep:edit"
                class="ml-1 cursor-pointer"
                onClick={() => startEdit(row)}
              />
            ) : null}
          </span>
        )
    },
    {
      label: $t("cashflow.payoutNaviTableData2"),
      prop: "thirdSecondBalance",
      width: 150
    },
    {
      label: $t("cashflow.payoutNaviStatusSwitch"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <el-switch
          modelValue={row.status === 1}
          disabled={!hasAuth("__menu_payout")}
          onClick={() => handleStatusChange(row)}
        />
      )
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPayoutNavi();
      const list = (data?.list ?? []) as PayoutNaviItem[];
      dataList.value = list;
      updateAt.value = dayjs().format("HH:mm:ss");
      availableCount.value = list.reduce(
        (pre, curr) => (curr.paying ? pre : pre + 1),
        0
      );
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  // 自動刷新排程
  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    const ms = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, ms);
  }
  function onAutoReloadChange() {
    if (reloadTimer) clearTimeout(reloadTimer);
    onSearch();
  }

  // 拖曳排序初始化
  function initSortable() {
    nextTick(() => {
      const tbody = document.querySelector(
        ".payout-navi-table .el-table__body-wrapper tbody"
      ) as HTMLElement | null;
      if (!tbody) return;
      Sortable.create(tbody, {
        handle: ".handle",
        animation: 150,
        onEnd: ({ oldIndex, newIndex }) => {
          if (oldIndex == null || newIndex == null || oldIndex === newIndex)
            return;
          const arr = dataList.value;
          const oldSort = arr[oldIndex].sort;
          const newSort = arr[newIndex].sort;
          arr[oldIndex].sort = newSort;
          arr[newIndex].sort = oldSort;
          const moved = arr[oldIndex];
          arr.splice(oldIndex, 1);
          arr.splice(newIndex, 0, moved);
          dataList.value = [...arr];
          putPayoutNaviSort({ id: moved.id, sort: newSort });
          updateAt.value = dayjs().format("HH:mm:ss");
        }
      });
    });
  }

  onMounted(async () => {
    await onSearch();
    initSortable();
  });
  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    dataList,
    loading,
    columns,
    title,
    subtitle,
    autoReload,
    intervalTime,
    onSearch,
    onAutoReloadChange
  };
}
