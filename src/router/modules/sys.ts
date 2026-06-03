import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/sys",
  name: "Sys",
  component: Layout,
  redirect: "/sys/vip1",
  meta: {
    icon: "ant-design:trophy-twotone",
    title: $t("sys.menu"),
    rank: 7
  },
  children: [
    {
      path: "/sys/vip1",
      name: "SysVip1",
      component: () => import("@/views/sys/vip1/index.vue"),
      meta: {
        title: $t("sys.menuVip1")
      }
    },
    {
      path: "/sys/vip2",
      name: "SysVip2",
      component: () => import("@/views/sys/vip2/index.vue"),
      meta: {
        title: $t("sys.menuVip2")
      }
    },
    {
      path: "/sys/vip3",
      name: "SysVip3",
      component: () => import("@/views/sys/vip3/index.vue"),
      meta: {
        title: $t("sys.menuVip3")
      }
    },
    {
      path: "/sys/BindingAuth",
      name: "SysBindingAuth",
      component: () => import("@/views/sys/BindingAuth/index.vue"),
      meta: {
        title: $t("sys.menuBindingAuth")
      }
    }
  ]
} satisfies RouteConfigsTable;
