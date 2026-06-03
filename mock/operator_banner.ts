import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 廣告分類
const categories = [
  { bannerCategoryID: 1, name: "首頁輪播", description: "尺寸 1920x600", hidden: false },
  { bannerCategoryID: 2, name: "活動橫幅", description: "尺寸 750x300", hidden: false },
  { bannerCategoryID: 3, name: "彈窗廣告", description: "尺寸 600x800", hidden: false },
  { bannerCategoryID: 4, name: "側邊欄", description: "尺寸 300x600", hidden: true }
];

// 上架平台下拉
const deviceDropdown = [
  { "1": "WEB" },
  { "2": "H5_android" },
  { "4": "H5_ios" },
  { "8": "pwa_android" },
  { "16": "pwa_ios" }
];

const statusList = ["上架中", "已下架", "即將上架", "即將下架"];
const langs = ["en", "zh", "ja"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  sort: i + 1,
  bannerCategoryID: (i % 3) + 1,
  title: `廣告活動 ${i + 1}`,
  description: `第 ${i + 1} 檔活動說明`,
  language: langs[i % langs.length],
  hidden: i % 4 === 0,
  statusStr: statusList[i % statusList.length],
  recommendType: [(i % 8) + 1, ((i + 2) % 8) + 1],
  imageWeb: i % 3 === 0 ? "" : `/banner/web_${i + 1}.png`,
  imageH5: i % 3 === 1 ? "" : `/banner/h5_${i + 1}.png`,
  logo: "",
  device: ["1", "2", "4"],
  start: `2026-05-${String((i % 28) + 1).padStart(2, "0")}T10:00:00`,
  end: `2026-06-${String((i % 28) + 1).padStart(2, "0")}T23:59:00`,
  context: "",
  note: i % 2 === 0 ? "備註內容" : "",
  editor: 1,
  editorName: i % 3 === 0 ? "admin" : "operator01",
  createdAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:30:00`
}));

export default defineFakeRoute([
  {
    // 廣告：列表
    url: "/backend/site/banner",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.title) {
        list = list.filter(v => v.title.includes(query.title));
      }
      if (query.bannerCategoryID) {
        list = list.filter(
          v => v.bannerCategoryID === Number(query.bannerCategoryID)
        );
      }
      if (query.hidden !== undefined && query.hidden !== "") {
        list = list.filter(v => String(v.hidden) === query.hidden);
      }
      if (query.language) {
        list = list.filter(v => v.language === query.language);
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 廣告：新增
    url: "/backend/site/banner",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 廣告：編輯
    url: "/backend/site/banner",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 廣告：刪除
    url: "/backend/site/banner",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    // 廣告分類：下拉選單
    url: "/backend/site/banner/dropdown",
    method: "get",
    response: () => ({ success: true, data: { list: categories } })
  },
  {
    // 上架平台下拉（舊碼取自 promotion dropdown，遷移後改由 operator 提供）
    url: "/backend/site/banner/device/dropdown",
    method: "get",
    response: () => ({ success: true, data: { device: deviceDropdown } })
  }
]);
