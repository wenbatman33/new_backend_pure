import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 雲端 IP 庫假資料
const categories = ["雲端伺服器", "商業VPN", "Tor"];
const sources = ["AWS", "GCP", "Azure", "NordVPN", "TorProject", "ExpressVPN"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  ipRange: `${10 + i}.0.${i}.0/24`,
  name: `cloud-ip-${i + 1}`,
  category: categories[i % categories.length],
  source: sources[i % sources.length],
  remark: i % 3 === 0 ? "高風險網段" : "",
  status: (i % 2) + 1,
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:40:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/cloudiplibrary/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.category) {
        list = list.filter(v => v.category === query.category);
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/cloudiplibrary/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/cloudiplibrary/update",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/cloudiplibrary/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/cloudiplibrary/rescan",
    method: "post",
    response: () => ({ success: true, data: { taggedCount: 42 } })
  },
  {
    url: "/backend/cloudiplibrary/rescanall",
    method: "post",
    response: () => ({ success: true, data: { taggedCount: 318 } })
  },
  {
    url: "/backend/cloudiplibrary/syncfromsources",
    method: "post",
    response: () => ({
      success: true,
      data: {
        results: [
          { source: "AWS", added: 12 },
          { source: "Tor", added: 5 },
          { source: "NordVPN", added: 8 }
        ]
      }
    })
  }
]);
