import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/operator",
  name: "Operator",
  component: Layout,
  redirect: "/operator/websocket",
  meta: {
    icon: "websymbol:updown-circle",
    title: $t("operator.menu"),
    rank: 70
  },
  children: [
    {
      path: "/operator/websocket",
      name: "OperatorWebsocket",
      component: () => import("@/views/operator/websocket/index.vue"),
      meta: {
        title: $t("operator.menuWebsocket")
      }
    },
    {
      path: "/operator/siteFunction",
      name: "OperatorSiteFunction",
      component: () => import("@/views/operator/siteFunction/index.vue"),
      meta: {
        title: $t("operator.menuSiteFunction")
      }
    },
    {
      path: "/operator/pagelist",
      name: "OperatorPagelist",
      component: () => import("@/views/operator/pagelist/index.vue"),
      meta: {
        title: $t("operator.menuPagelist")
      }
    },
    {
      path: "/operator/burialPointSettings",
      name: "OperatorBurialPointSettings",
      component: () => import("@/views/operator/burialPointSettings/index.vue"),
      meta: {
        title: $t("operator.menuBurialPointSettings")
      }
    },
    {
      path: "/operator/navManagement",
      name: "OperatorNavManagement",
      component: () => import("@/views/operator/navManagement/index.vue"),
      meta: {
        title: $t("operator.menuNavManagement")
      }
    },
    {
      path: "/operator/socialsetting",
      name: "OperatorSocialsetting",
      component: () => import("@/views/operator/socialsetting/index.vue"),
      meta: {
        title: $t("operator.menuSocialsetting")
      }
    },
    {
      path: "/operator/bannerCat",
      name: "OperatorBannerCat",
      component: () => import("@/views/operator/bannerCat/index.vue"),
      meta: {
        title: $t("operator.menuBannerCat")
      }
    },
    {
      path: "/operator/systemLetter",
      name: "OperatorSystemLetter",
      component: () => import("@/views/operator/systemLetter/index.vue"),
      meta: {
        title: $t("operator.menuSystemLetter")
      }
    },
    {
      path: "/operator/jackpot",
      name: "OperatorJackpot",
      component: () => import("@/views/operator/jackpot/index.vue"),
      meta: {
        title: $t("operator.menuJackpot")
      }
    },
    {
      path: "/operator/regionRestrictedPageManagement",
      name: "OperatorRegionRestrictedPageManagement",
      component: () => import("@/views/operator/regionRestrictedPageManagement/index.vue"),
      meta: {
        title: $t("operator.menuRegionRestrictedPageManagement")
      }
    },
    {
      path: "/operator/inboxList",
      name: "OperatorInboxList",
      component: () => import("@/views/operator/inboxList/index.vue"),
      meta: {
        title: $t("operator.menuInboxList")
      }
    },
    {
      path: "/operator/webprofile",
      name: "OperatorWebprofile",
      component: () => import("@/views/operator/webprofile/index.vue"),
      meta: {
        title: $t("operator.menuWebprofile")
      }
    },
    {
      path: "/operator/logoSetting",
      name: "OperatorLogoSetting",
      component: () => import("@/views/operator/logoSetting/index.vue"),
      meta: {
        title: $t("operator.menuLogoSetting")
      }
    },
    {
      path: "/operator/jpush",
      name: "OperatorJpush",
      component: () => import("@/views/operator/jpush/index.vue"),
      meta: {
        title: $t("operator.menuJpush")
      }
    },
    {
      path: "/operator/announcement",
      name: "OperatorAnnouncement",
      component: () => import("@/views/operator/announcement/index.vue"),
      meta: {
        title: $t("operator.menuAnnouncement")
      }
    },
    {
      path: "/operator/recommendList",
      name: "OperatorRecommendList",
      component: () => import("@/views/operator/recommendList/index.vue"),
      meta: {
        title: $t("operator.menuRecommendList")
      }
    },
    {
      path: "/operator/banner",
      name: "OperatorBanner",
      component: () => import("@/views/operator/banner/index.vue"),
      meta: {
        title: $t("operator.menuBanner")
      }
    },
    {
      path: "/operator/bannerUrl",
      name: "OperatorBannerUrl",
      component: () => import("@/views/operator/bannerUrl/index.vue"),
      meta: {
        title: $t("operator.menuBannerUrl")
      }
    }
  ]
} satisfies RouteConfigsTable;
