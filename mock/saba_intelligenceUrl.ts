import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    // 取得 SABA 情報網址（POST body：{ lang, provider }）
    url: "/game/bo/saba/getsabaintelligenceurl",
    method: "post",
    response: ({ body }) => {
      const provider = body?.provider ?? "SABA";
      const lang = body?.lang ?? "cs";
      return {
        success: true,
        data: {
          url: `https://example.com/saba/intelligence?provider=${provider}&lang=${lang}`
        }
      };
    }
  }
]);
