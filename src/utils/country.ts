const countryName = import.meta.env.VITE_GLOB_APP_COUNTRY;
const contentLanguageList = import.meta.env.VITE_GLOB_APP_lang;
const isVD = import.meta.env.VITE_GLOB_APP_VD;
const VDSERIAL = import.meta.env.VITE_GLOB_APP_SERIAL;
const appTitle = import.meta.env.VITE_GLOB_APP_TITLE;
const isNewServer = import.meta.env.VITE_GLOB_APP_NEW_SERVER;
const getSound = import.meta.env.VITE_GLOB_SOUND_URL;

import { i18n } from "@/plugins/i18n";

// 取得後端 Language header 用的 2 碼語系（pure-admin locale: zh/en → cn/en）
export function getLocale() {
  const loc: string = (i18n.global.locale as any)?.value ?? "zh";
  return loc === "zh" ? "cn" : loc.slice(-2).toLowerCase();
}

export function countryCheck(countryList: string | string[]) {
  if (Array.isArray(countryList)) {
    for (const c of countryList) {
      if (c === countryName) return true;
    }
  } else if (countryList === countryName) {
    return true;
  }

  return false;
}
export function checkWhichCountry() {
  return countryName;
}
export function getlanguageId() {
  switch (countryName) {
    case "IN":
      return 4;
    case "VN":
      return 8;
    case "BD":
      return 16;
  }
  return 2;
}

export function getLanguageOption() {
  const list = contentLanguageList
    ? ["en"].concat(
        contentLanguageList.split(",").filter(item => item != "en")
      )
    : "";

  const languageList = [];
  for (const l of list) {
    languageList.push({
      label: l,
      value: l,
      key: l
    });
  }
  return languageList;
}

export function currency() {
  if (countryName == "CN") return "RMB";
  return countryName;
}

export function checkIsVD() {
  return isVD === "true";
}
export function checkIsNewServer() {
  return isNewServer === "true";
}

export const checkIsXinliCN = () => {
  return appTitle === "18_BO_ADMIN";
};

export function getVDSerial() {
  return VDSERIAL || "";
}

export const makeSound = fileName => {
  const projectSoundPath = getSound ? getSound : "/sound";
  const sound = new Audio(`${projectSoundPath}/${fileName}.mp3`);
  if (!checkIsXinliCN() && (!countryCheck("PH") || checkIsVD())) {
    sound.play();
  }
};

export const checkVDSerialIncludes = (limit = ["t004", "t030"]) => {
  const vDSerial = getVDSerial();
  if (!vDSerial) {
    return false;
  }
  return limit.includes(vDSerial);
};
