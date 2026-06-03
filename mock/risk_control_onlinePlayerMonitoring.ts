import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 多帳號登入監控設定的記憶體狀態（PUT 後可保留）
const config = {
  online_count: 1287,
  same_ip_enable: true,
  same_ip_limit: 3,
  same_device_enable: true,
  same_device_limit: 2
};

export default defineFakeRoute([
  {
    // 取得設定
    url: "/backend/member/login_kickout/config",
    method: "get",
    response: () => ({ success: true, data: { ...config } })
  },
  {
    // 更新設定
    url: "/backend/member/login_kickout/config",
    method: "put",
    response: ({ body }) => {
      if (body) {
        if (typeof body.same_ip_enable !== "undefined")
          config.same_ip_enable = body.same_ip_enable;
        if (typeof body.same_ip_limit !== "undefined")
          config.same_ip_limit = Number(body.same_ip_limit);
        if (typeof body.same_device_enable !== "undefined")
          config.same_device_enable = body.same_device_enable;
        if (typeof body.same_device_limit !== "undefined")
          config.same_device_limit = Number(body.same_device_limit);
      }
      return { success: true, data: { ...config } };
    }
  }
]);
