import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 社群設定假資料：member（會員用）/ agent（合營用）兩組
// openWay：1 另開 / 2 內嵌 / 3 Livechat / 4 tawk.to；show：1 顯示 / 2 隱藏
const buildItem = (i: number, prefix: string) => ({
  order: i + 1,
  iconUrl: `social/${prefix}_icon_${i + 1}.png`,
  name: `${prefix} 社群 ${i + 1}`,
  subtitle: `${prefix} 副标题 ${i + 1}`,
  openWay: (i % 4) + 1,
  link: `https://example.com/${prefix}/${i + 1}`,
  license: i % 2 === 0 ? `LIC-${1000 + i}` : "",
  group: `分组${(i % 3) + 1}`,
  show: (i % 2) + 1
});

const socialConfig = {
  member: Array.from({ length: 12 }).map((_, i) => buildItem(i, "member")),
  agent: Array.from({ length: 10 }).map((_, i) => buildItem(i, "agent"))
};

export default defineFakeRoute([
  {
    // 後台取得前台 Social 基本設定
    url: "/backend/config/social",
    method: "get",
    response: () => ({ success: true, data: socialConfig })
  },
  {
    // 後台更新 Social（整包送回）
    url: "/backend/config/social",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 後台發佈 Social 基本設定
    url: "/backend/config/deploysocial",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
