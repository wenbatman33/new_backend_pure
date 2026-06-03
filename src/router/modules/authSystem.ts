import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/authSystem",
  name: "AuthSystem",
  component: Layout,
  redirect: "/authSystem/role",
  meta: {
    icon: "ant-design:lock-outlined",
    title: $t("authSystem.menu"),
    rank: 1
  },
  children: [
    {
      path: "/authSystem/role",
      name: "RoleManagement",
      component: () => import("@/views/authSystem/role/index.vue"),
      meta: {
        title: $t("authSystem.menuRole")
      }
    },
    {
      path: "/authSystem/onlineUserManagement",
      name: "AuthSystemOnlineUserManagement",
      component: () => import("@/views/authSystem/onlineUserManagement/index.vue"),
      meta: {
        title: $t("authSystem.menuOnlineUserManagement")
      }
    },
    {
      path: "/authSystem/otpStatusList",
      name: "AuthSystemOtpStatusList",
      component: () => import("@/views/authSystem/otpStatusList/index.vue"),
      meta: {
        title: $t("authSystem.menuOtpStatusList")
      }
    },
    {
      path: "/authSystem/auth",
      name: "AuthSystemAuth",
      component: () => import("@/views/authSystem/auth/index.vue"),
      meta: {
        title: $t("authSystem.menuAuth")
      }
    },
    {
      path: "/authSystem/account",
      name: "AuthSystemAccount",
      component: () => import("@/views/authSystem/account/index.vue"),
      meta: {
        title: $t("authSystem.menuAccount")
      }
    },
    {
      path: "/authSystem/authLog",
      name: "AuthSystemAuthLog",
      component: () => import("@/views/authSystem/authLog/index.vue"),
      meta: {
        title: $t("authSystem.menuAuthLog")
      }
    }
  ]
} satisfies RouteConfigsTable;
