import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 角色（權限群組）假資料
const roles = Array.from({ length: 14 }).map((_, i) => ({
  roleID: i + 1,
  roleName: i === 0 ? "超级管理员" : `角色群组${i + 1}`,
  note: `这是角色群组${i + 1}的备注说明文字`,
  status: (i % 5 === 0 ? 2 : 1) as number,
  hide: (i % 4 === 0 ? 2 : 1) as number,
  financeWithdrawalBeep: i % 2 === 0,
  riskWithdrawalBeep: i % 3 === 0,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  activeUsers: (i * 2) % 7,
  totalUsers: (i * 2) % 7 + 3
}));

// 功能權限清單（含父子層）：父層 parentID=0，__menu 開頭為選單
const allFns = [
  { fnID: 1, fnKey: "member", fnName: "会员管理", parentID: 0 },
  { fnID: 2, fnKey: "__btn_member_add", fnName: "新增会员", parentID: 1 },
  { fnID: 3, fnKey: "__btn_member_edit", fnName: "编辑会员", parentID: 1 },
  { fnID: 4, fnKey: "finance", fnName: "财务管理", parentID: 0 },
  { fnID: 5, fnKey: "__btn_finance_audit", fnName: "财务审核", parentID: 4 },
  { fnID: 6, fnKey: "__menu_member", fnName: "会员选单", parentID: 0 },
  { fnID: 7, fnKey: "__menu_member_list", fnName: "会员列表选单", parentID: 6 },
  { fnID: 8, fnKey: "__menu_finance", fnName: "财务选单", parentID: 0 }
];

// 各角色目前已勾選的功能 ID
const roleFnMap: Record<number, number[]> = {};
roles.forEach(r => {
  roleFnMap[r.roleID] = [2, 6, 7];
});

// 角色帳號
const roleUsers = (roleID: number) =>
  Array.from({ length: 3 }).map((_, i) => ({
    adminID: roleID * 10 + i,
    account: `admin_${roleID}_${i + 1}`
  }));

// 支付額度上限
const paymentRoles = roles.slice(0, 6).map(r => ({
  roleID: r.roleID,
  roleName: r.roleName,
  manualDepositAmount: (r.roleID + 1) * 1000,
  manualDepositAmountStatus: r.roleID % 2 === 0 ? 1 : 2
}));

// 隱藏群組 / 例外群組
const roleHideList = roles.slice(0, 5).map(r => ({
  roleID: r.roleID,
  roleName: r.roleName,
  exceptRoles: [
    { roleID: 99, roleName: "例外群组A" },
    { roleID: 98, roleName: "例外群组B" }
  ]
}));

export default defineFakeRoute([
  // 角色列表
  {
    url: "/backend/admin/role/adminroles",
    method: "get",
    response: ({ query }) => {
      let list = roles;
      if (query.roleName) {
        list = list.filter(v => v.roleName.includes(query.roleName));
      }
      if (query.note) {
        list = list.filter(v => v.note.includes(query.note));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增角色
  {
    url: "/backend/admin/role/adminrole",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯角色
  {
    url: "/backend/admin/role/adminroleinfo",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 原始功能清單
  {
    url: "/backend/admin/function/functions",
    method: "get",
    response: () => ({
      success: true,
      data: { list: { all: allFns, parent: allFns.filter(f => f.parentID === 0) } }
    })
  },
  // 角色已有功能
  {
    url: "/backend/admin/role/roles",
    method: "get",
    response: ({ query }) => {
      const roleID = Number(query.roleID);
      const ids = roleFnMap[roleID] ?? [];
      const list = allFns.filter(f => ids.includes(f.fnID));
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 設定角色功能
  {
    url: "/backend/admin/role/fns",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 批次設定功能
  {
    url: "/backend/admin/role/fns/action",
    method: "put",
    response: () => ({ success: true, data: { successMsg: "批量操作成功" } })
  },
  // 角色帳號
  {
    url: "/backend/admin/role/adminusers",
    method: "get",
    response: ({ query }) => ({
      success: true,
      data: { list: roleUsers(Number(query.roleID)) }
    })
  },
  // 支付額度上限
  {
    url: "/backend/payment/role",
    method: "get",
    response: () => ({
      success: true,
      data: { list: paymentRoles, total: paymentRoles.length }
    })
  },
  {
    url: "/backend/payment/role",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/payment/role",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 隱藏群組（例外群組）
  {
    url: "/backend/admin/role/roleHide",
    method: "get",
    response: () => ({ success: true, data: roleHideList })
  },
  {
    url: "/backend/admin/role/hide",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/admin/role/hide",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/admin/role/except",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/admin/role/except",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
