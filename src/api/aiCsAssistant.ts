import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};

export type AskAiCsAssistantParams = {
  question: string;
};

/** 詢問 AI 客服助理；後端回傳一段 JSON 字串（內部結構為 { message }） */
export const askAiCsAssistant = (data: AskAiCsAssistantParams) => {
  return http.request<Result<string>>(
    "post",
    "/backend/customer_service/",
    { data }
  );
};
