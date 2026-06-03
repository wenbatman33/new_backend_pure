import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 站台頁面列表假資料
const pageNames = [
  "首页",
  "活动页",
  "关于我们",
  "联系方式",
  "常见问题",
  "优惠规则",
  "代理加盟",
  "存款教学",
  "提款教学",
  "responsible-gaming",
  "隐私政策",
  "用户协议",
  "VIP 说明",
  "公告页"
];

const pages = pageNames.map((name, i) => ({
  id: i + 1,
  name,
  code: `page_${i + 1}`,
  status: i % 3 === 0 ? 0 : 1,
  content: i % 2 === 0 ? "内容一,内容二,内容三" : "段落内容",
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

// 页面内容假资料（依 type：1 文字 / 2 图片 / 3 html / 4 超连结）
const contents = Array.from({ length: 12 }).map((_, i) => {
  const type = (i % 4) + 1;
  let content = "";
  if (type === 1) content = `这是第 ${i + 1} 段文字内容，用于展示页面文本区块。`;
  if (type === 2) content = "/upload/banner/demo.png";
  if (type === 3) content = `<p>html 区块 ${i + 1}</p>`;
  if (type === 4) content = `https://example.com/link/${i + 1}`;
  return {
    id: i + 1,
    sort: i,
    type,
    content,
    contentH5: type === 2 ? "/upload/banner/demo_h5.png" : "",
    language: ["zh-CN", "en", "th"][i % 3],
    group: `group${(i % 3) + 1}`,
    description: `描述 ${i + 1}`,
    startTime: i % 2 === 0 ? "2026-05-01 00:00:00" : "",
    endTime: i % 2 === 0 ? "2026-06-01 23:59:59" : ""
  };
});

export default defineFakeRoute([
  // 站台页面列表
  {
    url: "/backend/page/list",
    method: "get",
    response: ({ query }) => {
      let list = pages;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.status !== undefined && query.status !== "") {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 站台页面新增
  {
    url: "/backend/page/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 站台页面编辑
  {
    url: "/backend/page/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 站台页面删除
  {
    url: "/backend/page/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 页面内容列表
  {
    url: "/backend/page/visible",
    method: "get",
    response: ({ query }) => {
      let list = contents;
      if (query.language) {
        list = list.filter(v => v.language === query.language);
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 页面内容新增
  {
    url: "/backend/page/create_content",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 页面内容编辑
  {
    url: "/backend/page/edit_content",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 页面内容删除
  {
    url: "/backend/page/delete_content",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 图片上传
  {
    url: "/file/file/upload",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "/upload/banner/demo.png" }
    })
  }
]);
