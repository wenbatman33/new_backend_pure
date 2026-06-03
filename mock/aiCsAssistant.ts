import { defineFakeRoute } from "vite-plugin-fake-server/client";

// AI 客服助理：依問題回傳一段 JSON 字串，內部結構為 { message }
export default defineFakeRoute([
  {
    url: "/backend/customer_service/",
    method: "post",
    response: ({ body }) => {
      const question = (body?.question ?? "").toString();
      const message =
        `关于「${question}」的解答：\n\n` +
        "您好，这里是 AI 客服助理。根据您的问题，建议您先核对账户信息与近期交易记录。" +
        "若涉及充值或提现异常，请提供订单编号，我们会尽快为您核实处理。\n\n" +
        "如需人工客服协助，可在工作时间联系在线客服。";
      return {
        success: true,
        // 後端實際回傳一段 JSON 字串
        data: JSON.stringify({ message })
      };
    }
  }
]);
