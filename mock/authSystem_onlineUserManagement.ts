import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 在線管理者清單假資料
const roles = ["超级管理员", "客服主管", "财务专员", "风控专员", "运营专员"];
const depts = ["总部", "客服部", "财务部", "风控部", "运营部"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  adminID: 1001 + i,
  account: `admin${String(i + 1).padStart(2, "0")}`,
  online: 1,
  status: i % 5 === 0 ? 0 : 1,
  roleName: roles[i % roles.length],
  deptName: depts[i % depts.length],
  lastLoginAt: `2026-06-0${(i % 3) + 1} ${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00`
}));

export default defineFakeRoute([
  {
    // 在線管理者清單（舊後端不带查询参数）
    url: "/backend/admin/user/onlineadmins",
    method: "get",
    response: () => {
      return { success: true, data: { list: all, total: all.length } };
    }
  },
  {
    // 强制登出（踢出在线账号）
    url: "/backend/admin/user/kickadminuser",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
