import { defineFakeRoute } from "vite-plugin-fake-server/client";

// TG 机器人通知设定（单物件设定页）
let config = {
  open: true,
  chatId: "-1001234567890",
  manual: "https://t.me/getidsbot 取得您的 Chat ID"
};

export default defineFakeRoute([
  {
    url: "/backend/config/telegramBot",
    method: "get",
    response: () => {
      return { success: true, data: config };
    }
  },
  {
    url: "/backend/config/telegramBot",
    method: "put",
    response: ({ body }) => {
      config = {
        ...config,
        open: body?.open ?? config.open,
        chatId: body?.chatId ?? config.chatId
      };
      return { success: true, data: config };
    }
  }
]);
