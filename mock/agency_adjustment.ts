import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 異動類型 1~4、狀態 1通過 2部份通過 3未審核 4不通過
const subjects = ["五月份特殊上分", "傭金派發-华南区", "会员上分批次", "特殊扣款-异常"];
const all = Array.from({ length: 16 }).map((_, i) => {
  const type = (i % 4) + 1;
  const status = (i % 4) + 1;
  return {
    id: 1000 + i,
    subject: `${subjects[i % subjects.length]}-${i + 1}`,
    type,
    status,
    applyAdminAccount: i % 2 === 0 ? "admin" : "operator01",
    applyDate: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
    reviewAdminAccount: status === 3 ? "" : "reviewer01",
    reviewDate: status === 3 ? "" : `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:00`,
    desc: `备注说明 ${i + 1}`,
    applyCount: (i % 5) + 1,
    auditCount: status === 3 ? 0 : (i % 4) + 1,
    turnoverTimes: i % 3
  };
});

// 產生詳情明細
function genDetail(id: number) {
  const base = all.find(v => v.id === id) ?? all[0];
  const listLen = base.applyCount || 3;
  const list = Array.from({ length: listLen }).map((_, j) => ({
    id: id * 10 + j,
    agencyID: 5000 + j,
    agencyAccount: `agency${j + 1}`,
    memberID: 8000 + j,
    memberAccount: `member${j + 1}`,
    // 已審核時帶實際狀態，未審核(3)時皆為待審核
    status: base.status === 3 ? 3 : (j % 2 === 0 ? 1 : 2),
    amount: (j + 1) * 100,
    remark: base.status === 3 ? "" : (j % 2 === 0 ? "" : "金额异常")
  }));
  return { ...base, list };
}

export default defineFakeRoute([
  {
    url: "/backend/agencyWallet/manualOperationBatch/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.type && Number(query.type) !== 0) {
        list = list.filter(v => v.type === Number(query.type));
      }
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/agencyWallet/manualOperationBatch/detail",
    method: "get",
    response: ({ query }) => {
      return { success: true, data: genDetail(Number(query.id)) };
    }
  },
  {
    url: "/backend/agencyWallet/manualOperationBatch/create",
    method: "post",
    response: () => ({ success: true, data: { id: 9999 } })
  },
  {
    url: "/backend/agencyWallet/manualOperationBatch/review",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
