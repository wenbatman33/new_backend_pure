import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 網站功能設定（單物件結構，1/2 表示開關）
const settings = {
  phone_edit: 1,
  phone_active: 1,
  child_account: 2,
  subagency_benefits: 1,
  modify_password_mode: 2,
  modify_withdraw_password_mode: 1,
  create_new_member: 1,
  create_new_member_black_list: "0912345678,0987654321"
};

export default defineFakeRoute([
  {
    url: "/backend/agency/config/page",
    method: "get",
    response: () => ({ success: true, data: settings })
  },
  {
    url: "/backend/agency/config/page",
    method: "put",
    response: ({ body }) => {
      Object.assign(settings, body ?? {});
      return { success: true, data: settings };
    }
  }
]);
