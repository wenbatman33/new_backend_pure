import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 工作台聚合資料（原 Vben 工作台為靜態資料，這裡集中由 mock 提供供頁面渲染）
const workbenchData = {
  stats: {
    todo: "2/10",
    project: 8,
    team: 300
  },
  navItems: [
    { title: "首页", icon: "ion:home-outline", color: "#1fdaca" },
    { title: "仪表盘", icon: "ion:grid-outline", color: "#bf0c2c" },
    { title: "组件", icon: "ion:layers-outline", color: "#e18525" },
    { title: "系统管理", icon: "ion:settings-outline", color: "#3fb27f" },
    { title: "权限管理", icon: "ion:key-outline", color: "#4daf1bc9" },
    { title: "图表", icon: "ion:bar-chart-outline", color: "#00d8ff" }
  ],
  groupItems: [
    {
      title: "Github",
      icon: "ri:github-fill",
      color: "#000000",
      desc: "不要等待机会，而要创造机会。",
      group: "开源组",
      date: "2026-04-01"
    },
    {
      title: "Vue",
      icon: "ri:vuejs-fill",
      color: "#3fb27f",
      desc: "现在的你决定将来的你。",
      group: "算法组",
      date: "2026-04-01"
    },
    {
      title: "Html5",
      icon: "ri:html5-fill",
      color: "#e18525",
      desc: "没有什么才能比努力更重要。",
      group: "上班摸鱼",
      date: "2026-04-01"
    },
    {
      title: "Angular",
      icon: "ri:angularjs-fill",
      color: "#bf0c2c",
      desc: "热情和欲望可以突破一切难关。",
      group: "UI",
      date: "2026-04-01"
    },
    {
      title: "React",
      icon: "ri:reactjs-fill",
      color: "#00d8ff",
      desc: "健康的身体是实现目标的基石。",
      group: "技术牛",
      date: "2026-04-01"
    },
    {
      title: "Js",
      icon: "ri:javascript-fill",
      color: "#4daf1bc9",
      desc: "路是走出来的，而不是空想出来的。",
      group: "架构组",
      date: "2026-04-01"
    }
  ],
  dynamicInfoItems: [
    {
      avatar: "",
      name: "威廉",
      date: "刚刚",
      desc: "在 <a>开源组</a> 创建了项目 <a>Vue</a>"
    },
    {
      avatar: "",
      name: "艾文",
      date: "1个小时前",
      desc: "关注了 <a>威廉</a>"
    },
    {
      avatar: "",
      name: "克里斯",
      date: "1天前",
      desc: "发布了 <a>个人动态</a>"
    },
    {
      avatar: "",
      name: "Vben",
      date: "2天前",
      desc: "发表文章 <a>如何编写一个Vite插件</a>"
    },
    {
      avatar: "",
      name: "皮特",
      date: "3天前",
      desc: "回复了 <a>杰克</a> 的问题 <a>如何进行项目优化？</a>"
    },
    {
      avatar: "",
      name: "杰克",
      date: "1周前",
      desc: "关闭了问题 <a>如何运行项目</a>"
    },
    {
      avatar: "",
      name: "威廉",
      date: "1周前",
      desc: "发布了 <a>个人动态</a>"
    },
    {
      avatar: "",
      name: "威廉",
      date: "2026-04-01 20:00",
      desc: "推送了代码到 <a>Github</a>"
    }
  ],
  saleRadar: {
    indicator: [
      { text: "2017", max: 100 },
      { text: "2018", max: 100 },
      { text: "2019", max: 100 },
      { text: "2020", max: 100 },
      { text: "2021", max: 100 },
      { text: "2022", max: 100 }
    ],
    series: [
      { name: "Visits", color: "#b6a2de", value: [90, 50, 86, 40, 50, 20] },
      { name: "Sales", color: "#67e0e3", value: [70, 75, 70, 76, 20, 85] }
    ]
  }
};

export default defineFakeRoute([
  {
    url: "/backend/dashboard/workbench",
    method: "get",
    response: () => ({ success: true, data: workbenchData })
  }
]);
