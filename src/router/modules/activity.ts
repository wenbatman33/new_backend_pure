import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/activity",
  name: "Activity",
  component: Layout,
  redirect: "/activity/quizList",
  meta: {
    icon: "material-symbols:stars-rounded",
    title: $t("activity.menu"),
    rank: 8000
  },
  children: [
    {
      path: "/activity/match",
      name: "ActivityMatch",
      component: () => import("@/views/activity/match/index.vue"),
      meta: {
        title: $t("activity.menuMatch")
      }
    },
    {
      path: "/activity/matchNews",
      name: "ActivityMatchNews",
      component: () => import("@/views/activity/matchNews/index.vue"),
      meta: {
        title: $t("activity.menuMatchNews")
      }
    },
    {
      path: "/activity/uefa5board1",
      name: "ActivityUefa5board1",
      component: () => import("@/views/activity/uefa5board1/index.vue"),
      meta: {
        title: $t("activity.menuUefa5board1")
      }
    },
    {
      path: "/activity/leagueSettings",
      name: "ActivityLeagueSettings",
      component: () => import("@/views/activity/leagueSettings/index.vue"),
      meta: {
        title: $t("activity.menuLeagueSettings")
      }
    },
    {
      path: "/activity/uefa5board2",
      name: "ActivityUefa5board2",
      component: () => import("@/views/activity/uefa5board2/index.vue"),
      meta: {
        title: $t("activity.menuUefa5board2")
      }
    },
    {
      path: "/activity/streaming",
      name: "ActivityStreaming",
      component: () => import("@/views/activity/streaming/index.vue"),
      meta: {
        title: $t("activity.menuStreaming")
      }
    },
    {
      path: "/activity/quiz",
      name: "ActivityQuiz",
      component: () => import("@/views/activity/quiz/index.vue"),
      meta: {
        title: $t("activity.menuQuiz")
      }
    },
    {
      path: "/activity/quiz_world_cup",
      name: "ActivityQuizWorldCup",
      component: () => import("@/views/activity/quiz_world_cup/index.vue"),
      meta: {
        title: $t("activity.menuQuizWorldCup")
      }
    },
    {
      path: "/activity/quizList",
      name: "ActivityQuizList",
      component: () => import("@/views/activity/quizList/index.vue"),
      meta: {
        title: $t("activity.menuQuizList")
      }
    },
    {
      path: "/activity/worldcup",
      name: "ActivityWorldcup",
      component: () => import("@/views/activity/worldcup/index.vue"),
      meta: {
        title: $t("activity.menuWorldcup")
      }
    },
    {
      path: "/activity/referList",
      name: "ActivityReferList",
      component: () => import("@/views/activity/referList/index.vue"),
      meta: {
        title: $t("activity.menuReferList")
      }
    },
    {
      path: "/activity/event0054Recommender",
      name: "ActivityEvent0054Recommender",
      component: () => import("@/views/activity/event0054Recommender/index.vue"),
      meta: {
        title: $t("activity.menuEvent0054Recommender")
      }
    },
    {
      path: "/activity/event0054Recommended",
      name: "ActivityEvent0054Recommended",
      component: () => import("@/views/activity/event0054Recommended/index.vue"),
      meta: {
        title: $t("activity.menuEvent0054Recommended")
      }
    },
    {
      path: "/activity/event0054Hierarchy",
      name: "ActivityEvent0054Hierarchy",
      component: () => import("@/views/activity/event0054Hierarchy/index.vue"),
      meta: {
        title: $t("activity.menuEvent0054Hierarchy")
      }
    },
    {
      path: "/activity/recommender",
      name: "ActivityRecommender",
      component: () => import("@/views/activity/recommender/index.vue"),
      meta: {
        title: $t("activity.menuRecommender")
      }
    },
    {
      path: "/activity/news",
      name: "ActivityNews",
      component: () => import("@/views/activity/news/index.vue"),
      meta: {
        title: $t("activity.menuNews")
      }
    },
    {
      path: "/activity/recommended",
      name: "ActivityRecommended",
      component: () => import("@/views/activity/recommended/index.vue"),
      meta: {
        title: $t("activity.menuRecommended"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
