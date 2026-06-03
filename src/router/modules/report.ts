import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/report",
  name: "Report",
  component: Layout,
  redirect: "/report/member",
  meta: {
    icon: "la:digital-tachograph",
    title: $t("report.menu"),
    rank: 74
  },
  children: [
    {
      path: "/report/member",
      name: "ReportMember",
      component: () => import("@/views/report/member/index.vue"),
      meta: {
        title: $t("report.menuMember")
      }
    },
    {
      path: "/report/deposit",
      name: "ReportDeposit",
      component: () => import("@/views/report/deposit/index.vue"),
      meta: {
        title: $t("report.menuDeposit")
      }
    },
    {
      path: "/report/withdraw",
      name: "ReportWithdraw",
      component: () => import("@/views/report/withdraw/index.vue"),
      meta: {
        title: $t("report.menuWithdraw")
      }
    },
    {
      path: "/report/promotion",
      name: "ReportPromotion",
      component: () => import("@/views/report/promotion/index.vue"),
      meta: {
        title: $t("report.menuPromotion")
      }
    },
    {
      path: "/report/gameGroup",
      name: "ReportGameGroup",
      component: () => import("@/views/report/gameGroup/index.vue"),
      meta: {
        title: $t("report.menuGameGroup")
      }
    },
    {
      path: "/report/winner",
      name: "ReportWinner",
      component: () => import("@/views/report/winner/index.vue"),
      meta: {
        title: $t("report.menuWinner")
      }
    },
    {
      path: "/report/game",
      name: "ReportGame",
      component: () => import("@/views/report/game/index.vue"),
      meta: {
        title: $t("report.menuGame")
      }
    },
    {
      path: "/report/operation",
      name: "ReportOperation",
      component: () => import("@/views/report/operation/index.vue"),
      meta: {
        title: $t("report.menuOperation")
      }
    },
    {
      path: "/report/gameSummary",
      name: "ReportGameSummary",
      component: () => import("@/views/report/gameSummary/index.vue"),
      meta: {
        title: $t("report.menuGameSummary")
      }
    },
    {
      path: "/report/adjustment",
      name: "ReportAdjustment",
      component: () => import("@/views/report/adjustment/index.vue"),
      meta: {
        title: $t("report.menuAdjustment")
      }
    },
    {
      path: "/report/risk",
      name: "ReportRisk",
      component: () => import("@/views/report/risk/index.vue"),
      meta: {
        title: $t("report.menuRisk")
      }
    },
    {
      path: "/report/lgGame",
      name: "ReportLgGame",
      component: () => import("@/views/report/lgGame/index.vue"),
      meta: {
        title: $t("report.menuLgGame")
      }
    },
    {
      path: "/report/gameList",
      name: "ReportGameList",
      component: () => import("@/views/report/gameList/index.vue"),
      meta: {
        title: $t("report.menuGameList")
      }
    },
    {
      path: "/report/bannerClick",
      name: "ReportBannerClick",
      component: () => import("@/views/report/bannerClick/index.vue"),
      meta: {
        title: $t("report.menuBannerClick")
      }
    },
    {
      path: "/report/customMember",
      name: "ReportCustomMember",
      component: () => import("@/views/report/customMember/index.vue"),
      meta: {
        title: $t("report.menuCustomMember")
      }
    },
    {
      path: "/report/leagueWinReport",
      name: "ReportLeagueWinReport",
      component: () => import("@/views/report/leagueWinReport/index.vue"),
      meta: {
        title: $t("report.menuLeagueWinReport")
      }
    },
    {
      path: "/report/customLeague",
      name: "ReportCustomLeague",
      component: () => import("@/views/report/customLeague/index.vue"),
      meta: {
        title: $t("report.menuCustomLeague")
      }
    }
  ]
} satisfies RouteConfigsTable;
