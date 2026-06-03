import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/independentEvent",
  name: "IndependentEvent",
  component: Layout,
  redirect: "/independentEvent/missionCenter",
  meta: {
    icon: "ant-design:expand-alt-outlined",
    title: $t("independentEvent.menu"),
    rank: 8001
  },
  children: [
    {
      path: "/independentEvent/lotteryegg",
      name: "IndependentEventLotteryegg",
      component: () => import("@/views/independentEvent/lotteryegg/index.vue"),
      meta: {
        title: $t("independentEvent.menuLotteryegg")
      }
    },
    {
      path: "/independentEvent/recommend",
      name: "IndependentEventRecommend",
      component: () => import("@/views/independentEvent/recommend/index.vue"),
      meta: {
        title: $t("independentEvent.menuRecommend")
      }
    },
    {
      path: "/independentEvent/missionCenter",
      name: "IndependentEventMissionCenter",
      component: () => import("@/views/independentEvent/missionCenter/index.vue"),
      meta: {
        title: $t("independentEvent.menuMissionCenter")
      }
    },
    {
      path: "/independentEvent/signIn",
      name: "IndependentEventSignIn",
      component: () => import("@/views/independentEvent/signIn/index.vue"),
      meta: {
        title: $t("independentEvent.menuSignIn")
      }
    }
  ]
} satisfies RouteConfigsTable;
