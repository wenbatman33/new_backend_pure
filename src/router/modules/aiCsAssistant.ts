import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/aiCsAssistant",
  name: "AiCsAssistant",
  component: Layout,
  redirect: "/aiCsAssistant/index",
  meta: {
    icon: "ri/customer-service-2-line",
    title: $t("aiCsAssistant.menu"),
    rank: 75
  },
  children: [
    {
      path: "/aiCsAssistant/index",
      name: "AiCsAssistantIndex",
      component: () => import("@/views/aiCsAssistant/index.vue"),
      meta: {
        title: $t("aiCsAssistant.menu"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
