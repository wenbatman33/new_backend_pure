import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/games",
  name: "Games",
  component: Layout,
  redirect: "/games/gameAgency",
  meta: {
    icon: "carbon:game-console",
    title: $t("games.menu"),
    rank: 3
  },
  children: [
    {
      path: "/games/gameAgency",
      name: "GamesGameAgency",
      component: () => import("@/views/games/gameAgency/index.vue"),
      meta: {
        title: $t("games.menuGameAgency")
      }
    },
    {
      path: "/games/gameGroup",
      name: "GamesGameGroup",
      component: () => import("@/views/games/gameGroup/index.vue"),
      meta: {
        title: $t("games.menuGameGroup")
      }
    },
    {
      path: "/games/game",
      name: "GamesGame",
      component: () => import("@/views/games/game/index.vue"),
      meta: {
        title: $t("games.menuGame")
      }
    },
    {
      path: "/games/tag",
      name: "GamesTag",
      component: () => import("@/views/games/tag/index.vue"),
      meta: {
        title: $t("games.menuTag")
      }
    },
    {
      path: "/games/recommendHome",
      name: "GamesRecommendHome",
      component: () => import("@/views/games/recommendHome/index.vue"),
      meta: {
        title: $t("games.menuRecommendHome")
      }
    },
    {
      path: "/games/recommendSportLobby",
      name: "GamesRecommendSportLobby",
      component: () => import("@/views/games/recommendSportLobby/index.vue"),
      meta: {
        title: $t("games.menuRecommendSportLobby")
      }
    },
    {
      path: "/games/gameLog",
      name: "GamesGameLog",
      component: () => import("@/views/games/gameLog/index.vue"),
      meta: {
        title: $t("games.menuGameLog")
      }
    },
    {
      path: "/games/leagueList",
      name: "GamesLeagueList",
      component: () => import("@/views/games/leagueList/index.vue"),
      meta: {
        title: $t("games.menuLeagueList")
      }
    },
    {
      path: "/games/gameType",
      name: "GamesGameType",
      component: () => import("@/views/games/gameType/index.vue"),
      meta: {
        title: $t("games.menuGameType")
      }
    },
    {
      path: "/games/leagueBetRecord",
      name: "GamesLeagueBetRecord",
      component: () => import("@/views/games/leagueBetRecord/index.vue"),
      meta: {
        title: $t("games.menuLeagueBetRecord")
      }
    },
    {
      path: "/games/lmGameList",
      name: "GamesLmGameList",
      component: () => import("@/views/games/lmGameList/index.vue"),
      meta: {
        title: $t("games.menuLmGameList"),
        showLink: false
      }
    },
    {
      path: "/games/lmGameLog",
      name: "GamesLmGameLog",
      component: () => import("@/views/games/lmGameLog/index.vue"),
      meta: {
        title: $t("games.menuLmGameLog"),
        showLink: false
      }
    },
    {
      path: "/games/lmGameAgency",
      name: "GamesLmGameAgency",
      component: () => import("@/views/games/lmGameAgency/index.vue"),
      meta: {
        title: $t("games.menuLmGameAgency"),
        showLink: false
      }
    },
    {
      path: "/games/lmGameGroup",
      name: "GamesLmGameGroup",
      component: () => import("@/views/games/lmGameGroup/index.vue"),
      meta: {
        title: $t("games.menuLmGameGroup"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
