import { ref, onMounted } from "vue";
import { renderQrToDataUrl } from "./qrcode";

/**
 * 綁定 Google 驗證器（OTP）頁面邏輯。
 * 此頁為非典型 CRUD：登入流程把 otpauth URI 暫存於 sessionStorage 的 "qrcode"，
 * 本頁讀取後渲染 QR Code 供使用者掃描，掃描綁定後須重新登入。
 */
export function useBindingAuth() {
  // 密鑰是否已過期（sessionStorage 無 qrcode 視為過期）
  const expired = ref(false);
  // QR Code 圖片 dataURL
  const qrCodeImg = ref("");

  function buildQrCode() {
    const qrcode = sessionStorage.getItem("qrcode");
    if (qrcode === null || qrcode === "") {
      expired.value = true;
      return;
    }
    try {
      qrCodeImg.value = renderQrToDataUrl(qrcode, 500);
    } catch {
      // 內容過長或產生失敗，視為需重新索取
      expired.value = true;
    }
    // 沿用舊邏輯：讀取後即移除，避免重複使用
    sessionStorage.removeItem("qrcode");
  }

  // 重新登入
  function handleLogin() {
    location.href = "/login";
  }

  onMounted(() => {
    buildQrCode();
  });

  return {
    expired,
    qrCodeImg,
    handleLogin
  };
}
