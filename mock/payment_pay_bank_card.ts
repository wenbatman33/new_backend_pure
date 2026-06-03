import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 銀行清單
const banks = [
  { id: 1, bankCode: "ICBC", bankName: "工商銀行" },
  { id: 2, bankCode: "ABC", bankName: "農業銀行" },
  { id: 3, bankCode: "BOC", bankName: "中國銀行" },
  { id: 4, bankCode: "CCB", bankName: "建設銀行" },
  { id: 5, bankCode: "CMB", bankName: "招商銀行" }
];

// 銀行卡假資料 15 筆
const all = Array.from({ length: 15 }).map((_, i) => {
  const bank = banks[i % banks.length];
  return {
    ID: i + 1,
    cardNo: 6222000000000000 + i,
    payBankID: bank.id,
    bankName: bank.bankName,
    bankCode: bank.bankCode,
    accountName: `戶名${i + 1}`,
    type: (i % 4) + 1,
    dayUpper: 500000,
    dayIn: (i + 1) * 1234,
    dayOut: (i + 1) * 567,
    balance: (i + 1) * 100000,
    limitLower: 100,
    limitUpper: 50000,
    originalAmount: 100000,
    broker: `卡商${(i % 3) + 1}`,
    province: String(11 + (i % 3)),
    city: String(1101 + (i % 3)),
    branch: `分行${i + 1}`,
    status: String((i % 2) + 1),
    note: "備註內容",
    bankAccount: `webuser${i + 1}`,
    oriLoginPw: "ori123456",
    oriUPw: "oriU123456",
    oriWithdrawalPw: "oriW123456",
    loginPw: "login123",
    uPw: "u123",
    withdrawalPw: "w123",
    identity: `3201${String(i).padStart(14, "0")}`,
    gender: String((i % 2) + 1),
    verifyDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    phone: `1380000${String(1000 + i)}`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
  };
});

// 省市扁平資料（dropdown.city）
const city = [
  { id: "1101", name: "北京市", province: "北京", province_id: "11" },
  { id: "1102", name: "海淀區", province: "北京", province_id: "11" },
  { id: "1201", name: "天津市", province: "天津", province_id: "12" },
  { id: "1301", name: "石家莊市", province: "河北", province_id: "13" }
];

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/pay_bankcard/bankcards",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.cardNo) {
        list = list.filter(v => String(v.cardNo).includes(query.cardNo));
      }
      if (query.accountName) {
        list = list.filter(v => v.accountName.includes(query.accountName));
      }
      if (query.type) {
        list = list.filter(v => String(v.type) === String(query.type));
      }
      if (query.status) {
        list = list.filter(v => String(v.status) === String(query.status));
      }
      if (query.payBankID) {
        list = list.filter(v => String(v.payBankID) === String(query.payBankID));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 下拉
  {
    url: "/backend/pay_bankcard/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        status: [{ "1": "啟用" }, { "2": "停用" }],
        type: [
          { "1": "出款" },
          { "2": "結算" },
          { "3": "中轉" },
          { "4": "倉庫" }
        ],
        gender: [{ "1": "女" }, { "2": "男" }],
        banks,
        city,
        bankcards: all.map(v => ({
          id: v.ID,
          card_no: v.cardNo,
          account_name: v.accountName,
          pay_bank_id: v.payBankID,
          type: v.type,
          status: v.status
        })),
        bankcardLogType: [{ "1": "收入" }, { "2": "支出" }],
        subjects: [
          { id: 701, type: "1", name: "存款" },
          { id: 702, type: "1", name: "轉入" },
          { id: 703, type: "2", name: "取款" },
          { id: 704, type: "2", name: "轉出" }
        ]
      }
    })
  },
  // 新增
  {
    url: "/backend/pay_bankcard",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 修改
  {
    url: "/backend/pay_bankcard",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 凍結
  {
    url: "/backend/pay_bankcard/lock",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 解凍
  {
    url: "/backend/pay_bankcard/unlock",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 轉帳
  {
    url: "/backend/pay_bankcard/transfer",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 資金異動
  {
    url: "/backend/pay_bankcard/trade",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  }
]);
