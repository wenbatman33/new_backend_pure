import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/aiPromotion",
  name: "AiPromotion",
  component: Layout,
  redirect: "/aiPromotion/launched_list",
  meta: {
    icon: "ant-design:red-envelope-outlined",
    title: $t("aiPromotion.menu"),
    rank: 74
  },
  children: [
    {
      path: "/aiPromotion/list",
      name: "AiPromotionList",
      component: () => import("@/views/aiPromotion/list/index.vue"),
      meta: {
        title: $t("aiPromotion.menuList")
      }
    },
    {
      path: "/aiPromotion/launched_list",
      name: "AiPromotionLaunchedList",
      component: () => import("@/views/aiPromotion/launched_list/index.vue"),
      meta: {
        title: $t("aiPromotion.menuLaunchedList")
      }
    }
  ]
} satisfies RouteConfigsTable;
