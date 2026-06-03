import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 異動類型 1 系統上分 / 2 系統下分 / 3 會員下分 / 4 會員上分
// 狀態 1 通過 / 2 不通過 / 3 未審核 / 4 失敗
const all = Array.from({ length: 16 }).map((_, i) => {
  const type = (i % 4) + 1;
  const status = (i % 4) + 1;
  const amount = (i + 1) * 1000;
  const balanceBefore = 50000 + i * 1234;
  return {
    id: 2000 + i,
    agencyID: 6000 + i,
    agencyAccount: `agency${i + 1}`,
    type,
    amount,
    balanceBefore,
    balanceAfter: type <= 2 || type === 4 ? balanceBefore + amount : balanceBefore - amount,
    turnoverLimit: (i % 3) + 1,
    status,
    date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    applyAdminAccount: i % 2 === 0 ? "admin" : "operator01",
    reviewDate:
      status === 3 ? "" : `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:00`,
    reviewAdminAccount: status === 3 ? "" : "reviewer01",
    refMemberAccount: type === 3 ? `member${i + 1}` : "",
    remark: `备注说明 ${i + 1}`
  };
});

export default defineFakeRoute([
  // 人工操作列表
  {
    url: "/backend/agencywallet/manualoperation/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyID) {
        list = list.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      if (query.type && Number(query.type) !== 0) {
        list = list.filter(v => v.type === Number(query.type));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 取得單筆操作明細（含 isBelong）
  {
    url: "/backend/agencywallet/manualoperation",
    method: "get",
    response: ({ query }) => {
      const row = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return {
        success: true,
        data: {
          ...row,
          refMemberAccount: row.refMemberAccount || "member999",
          // 1 直屬 / 2 非直屬
          isBelong: row.type === 3 ? (row.id % 2 === 0 ? 1 : 2) : 1
        }
      };
    }
  },
  // 新增人工操作
  {
    url: "/backend/agencywallet/manualoperation",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 審核通過
  {
    url: "/backend/agencywallet/manualoperation/permit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 審核拒絕
  {
    url: "/backend/agencywallet/manualoperation/deny",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 失敗退回
  {
    url: "/backend/agencyWallet/manualOperation/failedReturn",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 失敗扣回
  {
    url: "/backend/agencyWallet/manualOperation/failedDecrease",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 檢查會員是否直屬代理
  {
    url: "/backend/agencywallet/manualoperation/checkmemberbelongagency",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: { isBelong: query.memberAccount?.includes("9") ? 2 : 1 }
    })
  },
  // 代理列表（新增調整時查代理）
  {
    url: "/backend/agency/list",
    method: "get",
    response: ({ query }) => {
      const hit =
        query.agencyID || query.agencyAccount
          ? [
              {
                id: 6001,
                account: query.agencyAccount || "agency1",
                agencyID: query.agencyID || 6001,
                agencyWallet: 88888
              }
            ]
          : [];
      return { success: true, data: { list: hit, total: hit.length } };
    }
  },
  // 代理明細（沿用舊 endpoint /backend/agency GET）
  {
    url: "/backend/agency",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: {
        id: Number(query.id) || 6001,
        account: "agency1",
        name: "华南区总代",
        reivewAgencyTime: "2026-04-01 10:00:00"
      }
    })
  }
]);
