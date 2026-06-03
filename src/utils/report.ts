import { getAppEnvConfig } from "@/utils/env";
import { getToken } from "@/utils/auth";
import { getLocale } from "@/utils/country";
import axios from "axios";

interface SearchParams {
  [key: string]: any;
}

// pure-admin token 為物件 { accessToken, ... }，取出字串供下載連結使用
function getAccessToken(): string {
  const t = getToken();
  return (t as any)?.accessToken ?? "";
}

export function exportExcel(
  url: string,
  searchParams: SearchParams,
  filename = "export.csv"
): void {
  const cleanParams = removeEmpty(searchParams);
  const token = getAccessToken();
  const params = new URLSearchParams(cleanParams).toString();
  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  const exportUrl = `${VITE_GLOB_API_URL}${url}?${params}&token=${token}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", exportUrl, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Language", getLocale());

  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const blob = new Blob([xhr.response], {
          type: "application/vnd.ms-excel"
        });

        const objUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objUrl);
      } catch (error) {
        console.error("Download file error:", error);
      }
    } else {
      console.error("Export request failed:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Network error occurred during export");
  };

  xhr.send();
}

// 在 Vue 中使用 Axios 打 API 下載檔案
export const exportDownload = (
  url: string,
  searchParams: SearchParams,
  filename = "export.zip"
): void => {
  const cleanParams = removeEmpty(searchParams);
  const token = getAccessToken();
  const params = new URLSearchParams(cleanParams).toString();
  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  const exportUrl = `${VITE_GLOB_API_URL}${url}?${params}&token=${token}`;
  axios
    .get(exportUrl, {
      params: searchParams,
      responseType: "blob",
      headers: { Language: getLocale() }
    })
    .then(response => {
      const objUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = objUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    })
    .catch(error => {
      console.error("Download failed:", error);
    });
};

export const removeEmpty = (obj: SearchParams): SearchParams => {
  const newObj: SearchParams = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === "object") {
      const cleaned = removeEmpty(value);
      if (Object.keys(cleaned).length) {
        newObj[key] = cleaned;
      }
    } else if (value !== undefined && value !== null && value !== "") {
      newObj[key] = value;
    }
  });

  return newObj;
};
