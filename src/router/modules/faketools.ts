import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/faketools",
  name: "Faketools",
  component: Layout,
  redirect: "/faketools/deposit",
  meta: {
    icon: "material-symbols:stars-rounded",
    title: $t("faketools.menu"),
    rank: 9000
  },
  children: [
    {
      path: "/faketools/deposit",
      name: "FaketoolsDeposit",
      component: () => import("@/views/faketools/deposit/index.vue"),
      meta: {
        title: $t("faketools.menuDeposit")
      }
    },
    {
      path: "/faketools/agency",
      name: "FaketoolsAgency",
      component: () => import("@/views/faketools/agency/index.vue"),
      meta: {
        title: $t("faketools.menuAgency")
      }
    },
    {
      path: "/faketools/member",
      name: "FaketoolsMember",
      component: () => import("@/views/faketools/member/index.vue"),
      meta: {
        title: $t("faketools.menuMember")
      }
    },
    {
      path: "/faketools/betlog",
      name: "FaketoolsBetlog",
      component: () => import("@/views/faketools/betlog/index.vue"),
      meta: {
        title: $t("faketools.menuBetlog")
      }
    }
  ]
} satisfies RouteConfigsTable;
