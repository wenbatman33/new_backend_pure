import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 銀行卡二元素廠商
const checkNameList = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  type: i + 1,
  status: i === 0 ? 1 : 2,
  name: `二元素廠商${i + 1}`,
  times: 10000 - i * 1234,
  url: `https://vendor-2el-${i + 1}.example.com`,
  check_name_url: `https://api-2el-${i + 1}.example.com/check`,
  params: {
    APPID: `appid_2el_${i + 1}`,
    APP_SECURITY: `sec_2el_${i + 1}`,
    KEY_CHECK_NAME: `key_check_${i + 1}`
  }
}));

// 銀行卡歸屬地廠商
const belongList = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  type: i + 1,
  status: i === 1 ? 1 : 2,
  name: `歸屬地廠商${i + 1}`,
  times: 5000 - i * 800,
  url: `https://vendor-belong-${i + 1}.example.com`,
  get_belong_url: `https://api-belong-${i + 1}.example.com/get`,
  params: {
    APP_ID: `app_id_belong_${i + 1}`,
    APP_KEY: `app_key_belong_${i + 1}`,
    KEY_GET_BELONG: `key_belong_${i + 1}`
  }
}));

// 手機二元素廠商
const phoneList = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  type: i + 1,
  status: i === 0 ? 1 : 2,
  name: `手機二元素廠商${i + 1}`,
  times: 8000 - i * 600,
  url: `https://vendor-phone-${i + 1}.example.com`,
  apiDomain: `https://api-phone-${i + 1}.example.com`,
  params: {
    OPEN_ID: `open_id_phone_${i + 1}`,
    APP_SECURITY: `sec_phone_${i + 1}`,
    URL_CHECK_QUOTA: `https://api-phone-${i + 1}.example.com/quota`
  }
}));

export default defineFakeRoute([
  {
    // 取得銀行卡二元素 / 歸屬地廠商列表
    url: "/backend/member/bankcard/check",
    method: "get",
    response: () => ({
      success: true,
      data: { checkNameList, getBelongList: belongList }
    })
  },
  {
    // 啟用銀行卡廠商（切換 status）
    url: "/backend/member/bankcard/check",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 取得手機二元素廠商列表
    url: "/backend/phone/check",
    method: "get",
    response: () => ({ success: true, data: { list: phoneList } })
  },
  {
    // 更新手機二元素廠商設定
    url: "/backend/phone/check",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 啟用手機二元素廠商（切換 status）
    url: "/backend/phone/check/switch",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 更新銀行卡廠商驗證設定
    url: "/backend/member/bankcard/verify",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
