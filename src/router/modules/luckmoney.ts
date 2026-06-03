import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/luckmoney",
  name: "Luckmoney",
  component: Layout,
  redirect: "/luckmoney/luckwallet",
  meta: {
    icon: "ant-design:dollar-circle-outlined",
    title: $t("luckmoney.menu"),
    rank: 3
  },
  children: [
    {
      path: "/luckmoney/playerReport",
      name: "LuckmoneyPlayerReport",
      component: () => import("@/views/luckmoney/playerReport/index.vue"),
      meta: {
        title: $t("luckmoney.menuPlayerReport")
      }
    },
    {
      path: "/luckmoney/gameReport",
      name: "LuckmoneyGameReport",
      component: () => import("@/views/luckmoney/gameReport/index.vue"),
      meta: {
        title: $t("luckmoney.menuGameReport")
      }
    },
    {
      path: "/luckmoney/lmGameGroup",
      name: "LuckmoneyLmGameGroup",
      component: () => import("@/views/luckmoney/lmGameGroup/index.vue"),
      meta: {
        title: $t("luckmoney.menuLmGameGroup")
      }
    },
    {
      path: "/luckmoney/luckwallet",
      name: "LuckmoneyLuckwallet",
      component: () => import("@/views/luckmoney/luckwallet/index.vue"),
      meta: {
        title: $t("luckmoney.menuLuckwallet")
      }
    }
  ]
} satisfies RouteConfigsTable;
