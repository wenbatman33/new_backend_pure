import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 部門
const depts = [
  { deptID: 1, deptName: "运营部" },
  { deptID: 2, deptName: "客服部" },
  { deptID: 3, deptName: "财务部" },
  { deptID: 4, deptName: "风控部" }
];

// 功能角色
const roles = [
  { roleID: 1, roleName: "超级管理员" },
  { roleID: 2, roleName: "运营管理" },
  { roleID: 3, roleName: "客服专员" },
  { roleID: 4, roleName: "财务专员" }
];

// 标签群组
const tags = [
  { id: 1, name: "VIP 客服" },
  { id: 2, name: "夜班组" },
  { id: 3, name: "稽核组" }
];

const titles = ["主管", "组长", "专员", "助理"];

// 帐号列表假资料
const accounts = Array.from({ length: 16 }).map((_, i) => {
  const role = roles[i % roles.length];
  return {
    adminID: i + 1,
    id: i + 1,
    account: `admin${String(i + 1).padStart(3, "0")}`,
    name: `操作员${i + 1}`,
    email: `admin${i + 1}@example.com`,
    status: i % 4 === 0 ? 2 : 1,
    deptID: depts[i % depts.length].deptID,
    title: titles[i % titles.length],
    vpnIP: `10.0.${i}.${100 + i}`,
    commentCategory: "",
    tagID: i % 3 === 0 ? tags[i % tags.length].id : null,
    roles: [{ roleID: role.roleID, roleName: role.roleName }],
    lastLoginAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:${String(
      (i * 3) % 60
    ).padStart(2, "0")}:00`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:${String(
      (i * 7) % 60
    ).padStart(2, "0")}:00`
  };
});

export default defineFakeRoute([
  // 帐号列表
  {
    url: "/backend/admin/user/admins",
    method: "get",
    response: ({ query }) => {
      let list = accounts.slice();
      if (query.account) {
        list = list.filter(v => v.account.includes(query.account));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.roleID) {
        list = list.filter(v =>
          v.roles.some(r => r.roleID === Number(query.roleID))
        );
      }
      if (query.deptID) {
        list = list.filter(v => v.deptID === Number(query.deptID));
      }
      if (query.title) {
        list = list.filter(v => v.title.includes(query.title));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 部門清單
  {
    url: "/backend/admin/user/depts",
    method: "get",
    response: () => ({ success: true, data: { list: depts, total: depts.length } })
  },
  // 角色清單
  {
    url: "/backend/admin/role/adminroles",
    method: "get",
    response: () => ({ success: true, data: { list: roles, total: roles.length } })
  },
  // 標籤群組
  {
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({ success: true, data: { list: tags, total: tags.length } })
  },
  // 新增帳號
  {
    url: "/backend/admin/user/admin",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯帳號
  {
    url: "/backend/admin/user/info",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 重置密碼
  {
    url: "/backend/admin/user/resetpassword",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 重置 OTP
  {
    url: "/backend/admin/user/resetotp",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 批次新增 VPN IP
  {
    url: "/backend/admin/user/batchAddVpnIp",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 批次移除 VPN IP
  {
    url: "/backend/admin/user/batchremovevpnip",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
