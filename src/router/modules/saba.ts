import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/saba",
  name: "Saba",
  component: Layout,
  redirect: "/saba/promotion",
  meta: {
    icon: "ant-design:project-outlined",
    title: $t("saba.menu"),
    rank: 4
  },
  children: [
    {
      path: "/saba/betdetail",
      name: "SabaBetdetail",
      component: () => import("@/views/saba/betdetail/index.vue"),
      meta: {
        title: $t("saba.menuBetdetail")
      }
    },
    {
      path: "/saba/intelligenceUrl",
      name: "SabaIntelligenceUrl",
      component: () => import("@/views/saba/intelligenceUrl/index.vue"),
      meta: {
        title: $t("saba.menuIntelligenceUrl")
      }
    },
    {
      path: "/saba/promotion",
      name: "SabaPromotion",
      component: () => import("@/views/saba/promotion/index.vue"),
      meta: {
        title: $t("saba.menuPromotion")
      }
    },
    {
      path: "/saba/dashboard",
      name: "SabaDashboard",
      component: () => import("@/views/saba/dashboard/index.vue"),
      meta: {
        title: $t("saba.menuDashboard")
      }
    }
  ]
} satisfies RouteConfigsTable;
