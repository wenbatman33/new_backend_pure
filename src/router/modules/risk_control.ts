import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/risk_control",
  name: "Risk_control",
  component: Layout,
  redirect: "/risk_control/risk_bot_management",
  meta: {
    icon: "ant-design:alert-outlined",
    title: $t("risk_control.menu"),
    rank: 6
  },
  children: [
    {
      path: "/risk_control/risk_bot_management",
      name: "RiskControlRiskBotManagement",
      component: () => import("@/views/risk_control/risk_bot_management/index.vue"),
      meta: {
        title: $t("risk_control.menuRiskBotManagement")
      }
    },
    {
      path: "/risk_control/playerPortraitMonitoring_management",
      name: "RiskControlPlayerPortraitMonitoringManagement",
      component: () => import("@/views/risk_control/playerPortraitMonitoring_management/index.vue"),
      meta: {
        title: $t("risk_control.menuPlayerPortraitMonitoringManagement")
      }
    },
    {
      path: "/risk_control/risk_agency_tag_system",
      name: "RiskControlRiskAgencyTagSystem",
      component: () => import("@/views/risk_control/risk_agency_tag_system/index.vue"),
      meta: {
        title: $t("risk_control.menuRiskAgencyTagSystem")
      }
    },
    {
      path: "/risk_control/first_review",
      name: "RiskControlFirstReview",
      component: () => import("@/views/risk_control/first_review/index.vue"),
      meta: {
        title: $t("risk_control.menuFirstReview")
      }
    },
    {
      path: "/risk_control/blacklist",
      name: "RiskControlBlacklist",
      component: () => import("@/views/risk_control/blacklist/index.vue"),
      meta: {
        title: $t("risk_control.menuBlacklist")
      }
    },
    {
      path: "/risk_control/deviceblacklist",
      name: "RiskControlDeviceblacklist",
      component: () => import("@/views/risk_control/deviceblacklist/index.vue"),
      meta: {
        title: $t("risk_control.menuDeviceblacklist")
      }
    },
    {
      path: "/risk_control/onlinePlayerMonitoring",
      name: "RiskControlOnlinePlayerMonitoring",
      component: () => import("@/views/risk_control/onlinePlayerMonitoring/index.vue"),
      meta: {
        title: $t("risk_control.menuOnlinePlayerMonitoring")
      }
    }
  ]
} satisfies RouteConfigsTable;
