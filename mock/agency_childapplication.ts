import { defineFakeRoute } from "vite-plugin-fake-server/client";

// auditStatus: 1 待审核 / 2 通过 / 3 拒绝
const all = Array.from({ length: 16 }).map((_, i) => {
  const status = (i % 3) + 1;
  return {
    id: i + 1,
    agencyID: 200000 + i,
    agencyAccount: `agency${i + 1}`,
    childAgencyID: 300000 + i,
    childAgencyAccount: `child${i + 1}`,
    applyTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    reviewTime:
      status === 1 ? "" : `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
    auditStatus: status,
    adminAccount: status === 1 ? "" : i % 2 === 0 ? "admin" : "operator01"
  };
});

// 详情/审核共用资料
function buildDetail(id: number) {
  const row = all.find(v => v.id === id) ?? all[0];
  return {
    id: row.id,
    agencyAccount: row.agencyAccount,
    agencyName: `代理${row.id}`,
    applyTime: row.applyTime,
    childAgencyAccount: row.childAgencyAccount,
    childAgencyName: `子代理${row.id}`,
    reviewTime: row.reviewTime,
    auditStatus: row.auditStatus,
    agencyRemark: "代理申请备注内容",
    remark: row.auditStatus === 1 ? "" : "管理员审核备注",
    childAgencyApplyTime: row.applyTime,
    childAgencyReviewTime: row.reviewTime
  };
}

export default defineFakeRoute([
  {
    url: "/backend/agency/childapplication/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.agencyID) {
        list = list.filter(v => String(v.agencyID).includes(query.agencyID));
      }
      if (query.childAgencyID) {
        list = list.filter(v =>
          String(v.childAgencyID).includes(query.childAgencyID)
        );
      }
      if (query.agencyAccount) {
        list = list.filter(v => v.agencyAccount.includes(query.agencyAccount));
      }
      if (query.childAgencyAccount) {
        list = list.filter(v =>
          v.childAgencyAccount.includes(query.childAgencyAccount)
        );
      }
      if (query.auditStatus && Number(query.auditStatus) !== 0) {
        list = list.filter(v => v.auditStatus === Number(query.auditStatus));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 详情（GET 带 id）
    url: "/backend/agency/childapplication",
    method: "get",
    response: ({ query }) => {
      return { success: true, data: buildDetail(Number(query.id) || 1) };
    }
  },
  {
    url: "/backend/agency/childapplication/permit",
    method: "put",
    response: ({ body }) => ({ success: true, data: { id: body?.id ?? 1 } })
  },
  {
    url: "/backend/agency/childapplication/deny",
    method: "put",
    response: ({ body }) => ({ success: true, data: { id: body?.id ?? 1 } })
  },
  {
    url: "/backend/agency/childapplication/batchReview",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
