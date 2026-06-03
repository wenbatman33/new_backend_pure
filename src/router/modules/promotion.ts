import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/promotion",
  name: "Promotion",
  component: Layout,
  redirect: "/promotion/apply",
  meta: {
    icon: "ant-design:red-envelope-outlined",
    title: $t("promotion.menu"),
    rank: 73
  },
  children: [
    {
      path: "/promotion/list",
      name: "PromotionList",
      component: () => import("@/views/promotion/list/index.vue"),
      meta: {
        title: $t("promotion.menuList")
      }
    },
    {
      path: "/promotion/batch",
      name: "PromotionBatch",
      component: () => import("@/views/promotion/batch/index.vue"),
      meta: {
        title: $t("promotion.menuBatch")
      }
    },
    {
      path: "/promotion/apply",
      name: "PromotionApply",
      component: () => import("@/views/promotion/apply/index.vue"),
      meta: {
        title: $t("promotion.menuApply")
      }
    },
    {
      path: "/promotion/launched_list",
      name: "PromotionLaunchedList",
      component: () => import("@/views/promotion/launched_list/index.vue"),
      meta: {
        title: $t("promotion.menuLaunchedList")
      }
    },
    {
      path: "/promotion/smallGame",
      name: "PromotionSmallGame",
      component: () => import("@/views/promotion/smallGame/index.vue"),
      meta: {
        title: $t("promotion.menuSmallGame"),
        showLink: false
      }
    },
    {
      path: "/promotion/eventList",
      name: "PromotionEventList",
      component: () => import("@/views/promotion/eventList/index.vue"),
      meta: {
        title: $t("promotion.menuEventList")
      }
    },
    {
      path: "/promotion/competitionList",
      name: "PromotionCompetitionList",
      component: () => import("@/views/promotion/competitionList/index.vue"),
      meta: {
        title: $t("promotion.menuCompetitionList")
      }
    },
    {
      path: "/promotion/lottery",
      name: "PromotionLottery",
      component: () => import("@/views/promotion/lottery/index.vue"),
      meta: {
        title: $t("promotion.menuLottery")
      }
    },
    {
      path: "/promotion/discountCategoryList",
      name: "PromotionDiscountCategoryList",
      component: () => import("@/views/promotion/discountCategoryList/index.vue"),
      meta: {
        title: $t("promotion.menuDiscountCategoryList")
      }
    },
    {
      path: "/promotion/winnerRank",
      name: "PromotionWinnerRank",
      component: () => import("@/views/promotion/winnerRank/index.vue"),
      meta: {
        title: $t("promotion.menuWinnerRank"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
