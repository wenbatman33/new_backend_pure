import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/vip",
  name: "Vip",
  component: Layout,
  redirect: "/vip/vipList",
  meta: {
    icon: "ant-design:trophy-twotone",
    title: $t("vip.menuVip"),
    rank: 6
  },
  children: [
    {
      path: "/vip/vipList",
      name: "VipList",
      component: () => import("@/views/vip/vipList/index.vue"),
      meta: {
        title: $t("vip.menuVipList")
      }
    },
    {
      path: "/vip/vipLevel",
      name: "VipLevel",
      component: () => import("@/views/vip/vipLevel/index.vue"),
      meta: {
        title: $t("vip.menuVipLevel")
      }
    },
    {
      path: "/vip/vipReturn",
      name: "VipReturn",
      component: () => import("@/views/vip/vipReturn/index.vue"),
      meta: {
        title: $t("vip.menuVipReturn")
      }
    },
    {
      path: "/vip/vipReturnGameGroup",
      name: "VipReturnGameGroup",
      component: () => import("@/views/vip/vipReturnGameGroup/index.vue"),
      meta: {
        title: $t("vip.menuVipReturnGameGroup")
      }
    },
    {
      path: "/vip/vipBlock",
      name: "VipBlock",
      component: () => import("@/views/vip/vipBlock/index.vue"),
      meta: {
        title: $t("vip.menuVipBlock")
      }
    },
    {
      path: "/vip/vipLevelHistory",
      name: "VipLevelHistory",
      component: () => import("@/views/vip/vipLevelHistory/index.vue"),
      meta: {
        title: $t("vip.menuVipLevelHistory")
      }
    },
    {
      path: "/vip/vipManualReplenishmentWater",
      name: "VipManualReplenishmentWater",
      component: () =>
        import("@/views/vip/vipManualReplenishmentWater/index.vue"),
      meta: {
        title: $t("vip.menuVipManualReplenishmentWater")
      }
    },
    {
      path: "/vip/vip1",
      name: "VipVip1",
      component: () => import("@/views/sys/vip1/index.vue"),
      meta: {
        title: $t("sys.menuVip1")
      }
    },
    {
      path: "/vip/vip2",
      name: "VipVip2",
      component: () => import("@/views/sys/vip2/index.vue"),
      meta: {
        title: $t("sys.menuVip2")
      }
    },
    {
      path: "/vip/vip3",
      name: "VipVip3",
      component: () => import("@/views/sys/vip3/index.vue"),
      meta: {
        title: $t("sys.menuVip3")
      }
    }
  ]
} satisfies RouteConfigsTable;
