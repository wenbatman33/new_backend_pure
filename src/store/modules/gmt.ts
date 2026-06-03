import { defineStore } from "pinia";
import { store } from "../utils";

/**
 * 伺服器 GMT 校時資訊（移植自舊專案 store/modules/gmt）。
 * 真後端整合前用預設值；登入後由後端校時資料覆寫。
 */
export const useGMTStore = defineStore("pure-gmt", {
  state: () => ({
    // 使用者本機時間基準（ISO 字串）
    userTime: new Date().toISOString(),
    // 伺服器零點時間戳（秒）
    zeroTimeStamp: Math.floor(Date.now() / 1000),
    // 伺服器 GMT 時區偏移（小時）
    currentGMT: 0
  }),
  actions: {
    setGMT(
      payload: Partial<{
        userTime: string;
        zeroTimeStamp: number | string;
        currentGMT: number | string;
      }>
    ) {
      Object.assign(this, payload);
    }
  }
});

export function useGMTStoreHook() {
  return useGMTStore(store);
}
