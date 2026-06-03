import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/dashboard",
  name: "Dashboard",
  component: Layout,
  redirect: "/dashboard/analysis",
  meta: {
    icon: "ion:grid-outline",
    title: $t("dashboard.menu"),
    rank: 0
  },
  children: [
    {
      path: "/dashboard/analysis",
      name: "DashboardAnalysis",
      component: () => import("@/views/dashboard/analysis/index.vue"),
      meta: {
        title: $t("dashboard.menuAnalysis")
      }
    },
    {
      path: "/dashboard/website",
      name: "DashboardWebsite",
      component: () => import("@/views/dashboard/website/index.vue"),
      meta: {
        title: $t("dashboard.menuWebsite")
      }
    },
    {
      path: "/dashboard/workbench",
      name: "DashboardWorkbench",
      component: () => import("@/views/dashboard/workbench/index.vue"),
      meta: {
        title: $t("dashboard.menuWorkbench")
      }
    },
    {
      path: "/dashboard/quota",
      name: "DashboardQuota",
      component: () => import("@/views/dashboard/quota/index.vue"),
      meta: {
        title: $t("dashboard.menuQuota")
      }
    }
  ]
} satisfies RouteConfigsTable;
