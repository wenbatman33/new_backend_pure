import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getHourReport } from "@/api/dashboard";
import type { HourReport } from "./types";

export function useWebsite() {
  const loading = ref(false);
  // 選擇日期（格式 YYYY/MM/DD）
  const date = ref<string | undefined>(undefined);
  // 報表資料
  const reportData = ref<HourReport>({});

  // x 軸：1~23 小時
  const xAxisData: string[] = [];
  for (let n = 0; n < 23; n++) xAxisData.push(`${n + 1}`);

  let timer: ReturnType<typeof setInterval> | null = null;

  function dateHandler(val: any) {
    date.value = val ? dayjs(val).format("YYYY/MM/DD") : undefined;
  }

  // 取得報表資料；帶日期表示為查詢，不帶為初始/輪詢
  async function fetchData(params?: { reportDate: string }) {
    // 先清空，避免殘留舊資料
    reportData.value = {
      winAmount: [],
      totalWinAmount: [],
      registerMember: [],
      totalRegisterMember: [],
      firstDepositMember: [],
      totalFirstDepositMember: [],
      gameMember: [],
      rechargeMember: [],
      withdrawMember: [],
      rechargeAmount: [],
      withdrawAmount: [],
      rechargeCount: [],
      withdrawCount: []
    };
    loading.value = true;
    try {
      const { success, data } = await getHourReport(params);
      if (success) reportData.value = data ?? {};
    } finally {
      loading.value = false;
    }
  }

  // 點擊查詢
  async function onSearch() {
    if (date.value == undefined) {
      message($t("dashboard.selectDate"), { type: "error" });
      return;
    }
    await fetchData({ reportDate: date.value });
  }

  // 啟動 10 分鐘輪詢
  function startPolling() {
    timer = setInterval(() => fetchData(), 600000);
  }

  function stopPolling() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return {
    loading,
    date,
    reportData,
    xAxisData,
    dateHandler,
    fetchData,
    onSearch,
    startPolling,
    stopPolling
  };
}
