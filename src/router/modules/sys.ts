import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

// VIP1/VIP2/VIP3 已併入 VIP 選單(見 router/modules/vip.ts)；
// 此處只保留 BindingAuth(登入綁定流程用、非選單頁)，整個 sys 群組不顯示於選單。
export default {
  path: "/sys",
  name: "Sys",
  component: Layout,
  redirect: "/sys/BindingAuth",
  meta: {
    icon: "ant-design:trophy-twotone",
    title: $t("sys.menu"),
    rank: 7,
    showLink: false
  },
  children: [
    {
      path: "/sys/BindingAuth",
      name: "SysBindingAuth",
      component: () => import("@/views/sys/BindingAuth/index.vue"),
      meta: {
        title: $t("sys.menuBindingAuth"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
