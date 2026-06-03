import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/yuebao",
  name: "Yuebao",
  component: Layout,
  redirect: "/yuebao/application",
  meta: {
    icon: "ant-design:pay-circle-outlined",
    title: $t("yuebao.menu"),
    rank: 3
  },
  children: [
    {
      path: "/yuebao/application",
      name: "YuebaoApplication",
      component: () => import("@/views/yuebao/application/index.vue"),
      meta: {
        title: $t("yuebao.menuApplication")
      }
    }
  ]
} satisfies RouteConfigsTable;
