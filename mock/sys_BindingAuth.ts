import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * sys / BindingAuth（綁定 Google 驗證器）mock。
 *
 * 說明：此頁原生流程不直接呼叫 API——登入流程會把 otpauth URI 暫存於
 * sessionStorage 的 "qrcode"，本頁讀取後即時渲染 QR Code。
 * 為配合「每模組需 mock 所有可能 endpoint」之規範，仍提供一支查詢綁定
 * 狀態 / 取得 otpauth secret 的假 endpoint，回傳合理結構供日後擴充驗證。
 */

// 模擬一個 Google Authenticator 的 otpauth URI 與綁定狀態
const buildOtpAuthUri = (account: string, secret: string) =>
  `otpauth://totp/LuckGame:${account}?secret=${secret}&issuer=LuckGame&algorithm=SHA1&digits=6&period=30`;

export default defineFakeRoute([
  {
    // 取得當前帳號的綁定狀態與 QR Code 內容
    url: "/backend/sys/binding/auth",
    method: "get",
    response: () => {
      const account = "admin";
      const secret = "JBSWY3DPEHPK3PXP";
      return {
        success: true,
        data: {
          // 是否已綁定
          bound: false,
          // 密鑰是否過期（前端據此顯示「請重新登入索取」）
          expired: false,
          // 帳號
          account,
          // otpauth secret（給驗證器手動輸入用）
          secret,
          // QR Code 內容（otpauth URI），前端據此渲染圖形
          qrcode: buildOtpAuthUri(account, secret),
          createdAt: "2026-06-03 10:30:00"
        }
      };
    }
  }
]);
