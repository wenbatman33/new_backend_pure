import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 角色清單
const roles = Array.from({ length: 6 }).map((_, i) => ({
  roleID: i + 1,
  roleName: `角色${i + 1}`
}));

// 樹狀功能列表（父 -> children）
function buildTree() {
  const parents = Array.from({ length: 5 }).map((_, i) => {
    const fnID = (i + 1) * 100;
    const children = Array.from({ length: 3 }).map((__, j) => ({
      fnID: fnID + j + 1,
      fnName: `子功能${i + 1}-${j + 1}`,
      displayFnName: `SubFunction${i + 1}-${j + 1}`,
      fnKey: `__fn_sub_${i + 1}_${j + 1}`,
      parentID: fnID,
      hide: (i + j) % 4 === 0 ? 2 : 1,
      roleList: [],
      createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
      updatedAt: `2026-05-${String((i % 28) + 2).padStart(2, "0")} 12:00:00`
    }));
    return {
      fnID,
      fnName: `主功能${i + 1}`,
      displayFnName: `MainFunction${i + 1}`,
      fnKey: `__fn_main_${i + 1}`,
      parentID: 0,
      hide: 1,
      roleList: [],
      createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
      updatedAt: `2026-05-${String((i % 28) + 3).padStart(2, "0")} 11:00:00`,
      children
    };
  });
  return parents;
}

// 隱藏權限清單
const hideList = Array.from({ length: 8 }).map((_, i) => ({
  fnID: 200 + i,
  fnName: `隐藏功能${i + 1}`,
  fnKey: `__fn_hide_${i + 1}`,
  exceptRole: i % 2 === 0 ? [1, 2] : [3]
}));

export default defineFakeRoute([
  // 樹狀功能列表（hook 用 getFnList，已在 api 內整理成樹）
  // 後端原始結構為 { list: { all, parent } }，但此 mock 直接回前端可用樹，
  // 並同時提供 all/parent 以兼容 api 內整理邏輯。
  {
    url: "/backend/admin/function/functions",
    method: "get",
    response: () => {
      const tree = buildTree();
      const all: any[] = [];
      tree.forEach(p => {
        const { children, ...rest } = p;
        all.push(rest);
        (children ?? []).forEach(c => all.push(c));
      });
      const parent = tree.map(({ children, ...rest }) => rest);
      return { success: true, data: { list: { all, parent } } };
    }
  },
  // 新增功能
  {
    url: "/backend/admin/function/function",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯功能
  {
    url: "/backend/admin/function/function",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除功能
  {
    url: "/backend/admin/function/function",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 角色清單
  {
    url: "/backend/admin/role/adminroles",
    method: "get",
    response: () => ({
      success: true,
      data: { list: roles, total: roles.length }
    })
  },
  // 功能所屬角色群組
  {
    url: "/backend/admin/function/function/role",
    method: "get",
    response: () => ({
      success: true,
      data: { list: ["角色1", "角色2", "角色3"] }
    })
  },
  // 隱藏權限清單
  {
    url: "/backend/admin/function/function/hide",
    method: "get",
    response: () => ({
      success: true,
      data: { list: hideList, total: hideList.length }
    })
  },
  // 新增隱藏權限
  {
    url: "/backend/admin/function/function/hide",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 刪除隱藏權限
  {
    url: "/backend/admin/function/function/hide",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 新增角色例外隱藏
  {
    url: "/backend/admin/function/function/rolehide",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 刪除角色例外隱藏
  {
    url: "/backend/admin/function/function/rolehide",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
