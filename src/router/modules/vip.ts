import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/vip",
  name: "Vip",
  component: Layout,
  redirect: "/vip/vipBlock",
  meta: {
    icon: "ant-design:trophy-twotone",
    title: $t("vip.menuVip"),
    rank: 6
  },
  children: [
    {
      path: "/vip/vipBlock",
      name: "VipBlock",
      component: () => import("@/views/vip/vipBlock/index.vue"),
      meta: {
        title: $t("vip.menuVipBlock")
      }
    },
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
      path: "/vip/vipLevelHistory",
      name: "VipLevelHistory",
      component: () => import("@/views/vip/vipLevelHistory/index.vue"),
      meta: {
        title: $t("vip.menuVipLevelHistory")
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
      path: "/vip/vipManualReplenishmentWater",
      name: "VipManualReplenishmentWater",
      component: () =>
        import("@/views/vip/vipManualReplenishmentWater/index.vue"),
      meta: {
        title: $t("vip.menuVipManualReplenishmentWater")
      }
    }
  ]
} satisfies RouteConfigsTable;
