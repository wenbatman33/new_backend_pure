import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 假存款單列表（10~20 筆）
const statuses = [1, 2, 3, 4, 5, 6];
const types = [1, 2, 4];
const list = Array.from({ length: 16 }).map((_, i) => {
  const status = statuses[i % statuses.length];
  const type = types[i % types.length];
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id: `D2026050${day}${1000 + i}`,
    type,
    status,
    memberAccount: `member${i + 1}`,
    memberName: `會員${i + 1}`,
    memberID: 100000 + i,
    amount: (i + 1) * 1500,
    fee: (i + 1) * 5,
    exchangeRate: 7.1,
    otherAmount: i % 3 === 0 ? (i + 1) * 200 : 0,
    currency: (i % 4) + 1,
    gatway: `線路${(i % 3) + 1}`,
    payGroupId: (i % 3) + 1,
    bankcardGroupId: (i % 2) + 1,
    payment: "alipay",
    depositName: `存款人${i + 1}`,
    thirdID: i % 2 === 0 ? `TX${20260500 + i}` : "",
    refNum: `REF${20260500 + i}`,
    userRemark: i % 4 === 0 ? "備註" : "",
    bankcard: i % 2 === 0 ? `6222****${1000 + i}` : "",
    device: [1, 2, 4, 8, 16][i % 5],
    balanceDate: `2026-05-${day}`,
    editorName: i % 3 === 0 ? "admin" : "operator01",
    agencyID: i % 5 === 0 ? 200 + i : 0,
    promotion: [{ value: i % 2 === 0 ? "首存優惠" : "" }],
    createdAt: `2026-05-${day} 09:${String((i * 3) % 60).padStart(2, "0")}:00`,
    updatedAt: `2026-05-${day} 10:${String((i * 3) % 60).padStart(2, "0")}:00`
  };
});

export default defineFakeRoute([
  // 存款單列表
  {
    url: "/backend/pay/deposit",
    method: "get",
    response: () => ({
      success: true,
      data: {
        count: list.length,
        amount: list.reduce((s, v) => s + v.amount, 0),
        fee: list.reduce((s, v) => s + v.fee, 0),
        erctotal: 5000,
        trctotal: 8000,
        list
      }
    })
  },
  // 新增存款單
  {
    url: "/backend/pay/deposit",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 訂單紀錄
  {
    url: "/backend/pay/deposit/note",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            note: "建立存款單",
            author: "admin",
            createdAt: "2026-05-01 09:00:00",
            action: "create"
          },
          {
            id: 2,
            note: "人工審核通過",
            author: "operator01",
            createdAt: "2026-05-01 09:10:00",
            action: "review"
          }
        ]
      }
    })
  },
  // 新增備註
  {
    url: "/backend/pay/deposit/note",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 修改入帳日
  {
    url: "/backend/pay/deposit/balancedate",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 三方回調查詢
  {
    url: "/backend/pay/deposit/callback",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 計算手續費
  {
    url: "/backend/pay/deposit/fee",
    method: "post",
    response: ({ body }) => ({
      success: true,
      data: { fee: Number(body?.amount || 0) * 0.01 }
    })
  },
  // 強制失敗
  {
    url: "/backend/pay/deposit/hardcancel",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 強制成功
  {
    url: "/backend/pay/deposit/hardsuccess",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 高權限強制成功（審核）
  {
    url: "/backend/pay/deposit/review",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 偵測新存款單（beep）
  {
    url: "/backend/payment/beep",
    method: "post",
    response: () => ({ success: true, data: { hasMemberDeposit: false } })
  },
  // 金流群組（三方 / 銀行卡 共用，依 type 區分）
  {
    url: "/backend/pay_group/groups",
    method: "get",
    response: ({ query }) => {
      const t = Number(query?.type) || 1;
      return {
        success: true,
        data: {
          list:
            t === 1
              ? [
                  { ID: 1, name: "三方群組A", type: 1 },
                  { ID: 2, name: "三方群組B", type: 1 },
                  { ID: 3, name: "三方群組C", type: 1 }
                ]
              : [
                  { ID: 1, name: "銀行卡群組甲", type: 2 },
                  { ID: 2, name: "銀行卡群組乙", type: 2 }
                ]
        }
      };
    }
  },
  // 線路下拉（存款方式）
  {
    url: "/backend/pay_channel_service/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        serviceCode: [{ alipay: "支付寶" }, { wechat: "微信" }, { bank: "網銀" }]
      }
    })
  },
  // 商戶號列表
  {
    url: "/backend/pay/pay_channel",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, sn: "MCH001" },
          { id: 2, sn: "MCH002" }
        ]
      }
    })
  },
  // 商戶列表
  {
    url: "/backend/pay/pay_channel_name",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, name: "商戶甲" },
          { id: 2, name: "商戶乙" }
        ]
      }
    })
  },
  // 線路列表（新增存款單用）
  {
    url: "/backend/pay_channel_service/",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, name: "支付寶線路", status: 1, show: 1 },
          { id: 2, name: "微信線路", status: 1, show: 1 },
          { id: 3, name: "網銀線路", status: 2, show: 1 }
        ]
      }
    })
  }
]);
