import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 登入開關設定 - 後端巢狀設定物件
function makeConfig(verifyType = 1) {
  return {
    login: {
      verifyType,
      smsVerify: true,
      verifyLine: verifyType,
      errorLimit: "5",
      lockTime: "30",
      lockLimit: "3",
      smsInterval: "60",
      smsLimit: "5",
      smsGapTime: "120",
      smsTimeLimit: "300",
      deviceIDTwoPhaseEnable: true,
      deviceIDTwoPhaseWhiteListLimit: 10,
      ipTwoPhaseEnable: false,
      ipTwoPhaseWhiteListLimit: 5,
      forceUpdatePassword: 2
    },
    register: {
      verifyType: 1,
      verifyLine: 1,
      phoneShow: true,
      phoneRequired: true,
      nameShow: true,
      nameRequired: false,
      emailShow: false,
      emailRequired: false,
      emailVerify: false,
      reconfirm: true
    }
  };
}

// 操作紀錄假資料 12 筆
const actions = ["PC登入设定", "H5登入设定", "白名单设定", "简讯设定"];
const cols = ["登入验证", "锁定时间", "简讯间隔", "白名单IP群组数"];
const logs = Array.from({ length: 12 }).map((_, i) => ({
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:${String(
    (i * 5) % 60
  ).padStart(2, "0")}:00`,
  account: i % 2 === 0 ? "admin" : "operator01",
  action: actions[i % actions.length],
  subData: [
    {
      column: cols[i % cols.length],
      oldValue: String(i),
      newValue: String(i + 1)
    },
    {
      column: cols[(i + 1) % cols.length],
      oldValue: "关闭",
      newValue: "开启"
    }
  ]
}));

export default defineFakeRoute([
  {
    url: "/backend/member/setting/config",
    method: "get",
    response: () => ({ success: true, data: makeConfig(1) })
  },
  {
    url: "/backend/member/setting/config",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/member/setting/h5config",
    method: "get",
    response: () => ({ success: true, data: makeConfig(2) })
  },
  {
    url: "/backend/member/setting/h5config",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/admin/operation/logs",
    method: "get",
    response: () => ({
      success: true,
      data: { list: logs, total: logs.length }
    })
  }
]);
