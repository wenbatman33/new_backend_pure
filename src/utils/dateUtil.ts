/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from "moment";
import { checkWhichCountry } from "@/utils/country";
import { useGMTStore } from "@/store/modules/gmt";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
const DATE_FORMAT = "YYYY-MM-DD ";

// checkWhichCountry 保留 import 以維持與舊專案一致的副作用相容（部分頁面間接依賴）
void checkWhichCountry;

export function formatToDateTime(
  date: moment.MomentInput = null,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format);
}

export function formatToDate(
  date: moment.MomentInput = null,
  format = DATE_FORMAT
): string {
  return moment(date).format(format);
}

export const dateUtil = moment;

export const convertMoment = (str?: string) => {
  if (str === "") {
    return undefined;
  }
  if (str === undefined) {
    return undefined;
  }
  try {
    return moment(str);
  } catch (e) {
    return undefined;
  }
};

export const convertMomentAddMinutes = (str: string | undefined, minutes) => {
  if (str === "") {
    return undefined;
  }
  if (str === undefined) {
    return undefined;
  }
  try {
    return moment(str).add(minutes, "minutes");
  } catch (e) {
    return undefined;
  }
};

const gmtHandler = () => {
  const gmtStore = useGMTStore();
  const diff = moment().diff(gmtStore.userTime);
  const zeroTimeStampToUTC = moment.utc(Number(gmtStore.zeroTimeStamp) * 1000);
  const altered = zeroTimeStampToUTC.add(diff);
  const zeroAddServerGMT = altered.add(Number(gmtStore.currentGMT), "hour");
  return zeroAddServerGMT;
};

export const getGmtDate = () => {
  return gmtHandler();
};
