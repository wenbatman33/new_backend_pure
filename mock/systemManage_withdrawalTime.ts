import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提款时间设定（单一设定物件，非列表）
const withdrawalTimeData = {
  withdrawalTimeEnable: true,
  withdrawalTimeMondayStart: "09:00:00",
  withdrawalTimeMondayEnd: "23:00:59",
  withdrawalTimeTuesdayStart: "09:00:00",
  withdrawalTimeTuesdayEnd: "23:00:59",
  withdrawalTimeWednesdayStart: "09:00:00",
  withdrawalTimeWednesdayEnd: "23:00:59",
  withdrawalTimeThursdayStart: "09:00:00",
  withdrawalTimeThursdayEnd: "23:00:59",
  withdrawalTimeFridayStart: "09:00:00",
  withdrawalTimeFridayEnd: "23:00:59",
  withdrawalTimeSaturdayStart: "10:00:00",
  withdrawalTimeSaturdayEnd: "22:00:59",
  withdrawalTimeSundayStart: "22:00:00",
  withdrawalTimeSundayEnd: "02:00:59" // 跨日范例
};

export default defineFakeRoute([
  {
    url: "/backend/withdrawalTime",
    method: "get",
    response: () => ({ success: true, data: { ...withdrawalTimeData } })
  },
  {
    url: "/backend/withdrawalTime",
    method: "put",
    response: ({ body }) => {
      // 回写以模拟保存成功
      Object.assign(withdrawalTimeData, body ?? {});
      return { success: true, data: { ...withdrawalTimeData } };
    }
  }
]);
