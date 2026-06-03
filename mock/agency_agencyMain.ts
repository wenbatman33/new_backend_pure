import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 分層群組選項
const rankGroups = [
  { label: "VIP 分層", value: 1 },
  { label: "一般分層", value: 2 },
  { label: "高佣分層", value: 3 }
];

const businessTypes = [1, 2];
const netProfitKeys = ["total_bonus", "platform_charge", "total_charge"];

// 產生 15 筆代理假資料
const all = Array.from({ length: 15 }).map((_, i) => ({
  id: 10000 + i,
  account: `agency${i + 1}`,
  phone: `0912${String(100000 + i).slice(-6)}`,
  businessType: businessTypes[i % 2],
  isCredit: (i % 2) + 1,
  billingCycle: (i % 2) + 1,
  name: `代理商${i + 1}`,
  parentAgencyAccount: i % 3 === 0 ? "" : `agency${(i % 3) + 1}`,
  childAgencyCount: i % 4,
  memberCount: (i + 1) * 7,
  giveOffer: (i % 3) + 1 > 2 ? 2 : (i % 3) + 1,
  offerPercent: (i % 5) + 1,
  rankGroupName: rankGroups[i % rankGroups.length].label,
  netProfitOption: netProfitKeys.map((key, k) => ({
    key,
    value: (i + k) % 2
  })),
  netProfitBase: (i % 3) + 1,
  agencyWallet: Number(((i + 1) * 1234.56).toFixed(2)),
  agencyReturnProportion: (i % 10) + 1,
  promotionLinks: [{ promotionLink: `https://promo.example.com/a${i + 1}` }],
  memberReturnProportion: (i % 8) + 1,
  activeStatus: (i % 2) + 1,
  reviewTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00`,
  lastLoginTime: `2026-06-0${(i % 9) + 1} 18:30:00`,
  adminRemark: i % 2 === 0 ? "正常" : ""
}));

export default defineFakeRoute([
  {
    url: "/backend/agency/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyAccount) {
        list = list.filter(v => v.account.includes(query.agencyAccount));
      }
      if (query.parentAgencyAccount) {
        list = list.filter(v =>
          v.parentAgencyAccount.includes(query.parentAgencyAccount)
        );
      }
      if (query.businessType && Number(query.businessType) !== 0) {
        list = list.filter(v => v.businessType === Number(query.businessType));
      }
      return {
        success: true,
        data: {
          list,
          total: list.length,
          // 上層代理麵包屑（物件結構，hook 用 Object.values 轉陣列）
          parentAgencyData: {
            "0": { parentAgencyID: 1, parentAgencyAccount: "agency1" },
            "1": { parentAgencyID: 2, parentAgencyAccount: "agency2" }
          }
        }
      };
    }
  },
  {
    url: "/backend/agency/ranksetting/all",
    method: "get",
    response: () => ({ success: true, data: { list: rankGroups } })
  },
  {
    // 匯出（實際為檔案下載，mock 回成功即可）
    url: "/backend/agency/list/export",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
