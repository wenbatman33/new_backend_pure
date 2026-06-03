import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/systemManage",
  name: "SystemManage",
  component: Layout,
  redirect: "/systemManage/cloudIpLibrary",
  meta: {
    icon: "ant-design:setting-twotone",
    title: $t("systemManage.menu"),
    rank: 11
  },
  children: [
    {
      path: "/systemManage/cloudIpLibrary",
      name: "SystemManageCloudIpLibrary",
      component: () => import("@/views/systemManage/cloudIpLibrary/index.vue"),
      meta: {
        title: $t("systemManage.menuCloudIpLibrary")
      }
    },
    {
      path: "/systemManage/systemSwitch",
      name: "SystemManageSystemSwitch",
      component: () => import("@/views/systemManage/systemSwitch/index.vue"),
      meta: {
        title: $t("systemManage.menuSystemSwitch")
      }
    },
    {
      path: "/systemManage/deploy",
      name: "SystemManageDeploy",
      component: () => import("@/views/systemManage/deploy/index.vue"),
      meta: {
        title: $t("systemManage.menuDeploy")
      }
    },
    {
      path: "/systemManage/smsVendor",
      name: "SystemManageSmsVendor",
      component: () => import("@/views/systemManage/smsVendor/index.vue"),
      meta: {
        title: $t("systemManage.menuSmsVendor")
      }
    },
    {
      path: "/systemManage/domainManage",
      name: "SystemManageDomainManage",
      component: () => import("@/views/systemManage/domainManage/index.vue"),
      meta: {
        title: $t("systemManage.menuDomainManage")
      }
    },
    {
      path: "/systemManage/configTmpKey",
      name: "SystemManageConfigTmpKey",
      component: () => import("@/views/systemManage/configTmpKey/index.vue"),
      meta: {
        title: $t("systemManage.menuConfigTmpKey")
      }
    },
    {
      path: "/systemManage/tgRobotNotifySetting",
      name: "SystemManageTgRobotNotifySetting",
      component: () => import("@/views/systemManage/tgRobotNotifySetting/index.vue"),
      meta: {
        title: $t("systemManage.menuTgRobotNotifySetting")
      }
    },
    {
      path: "/systemManage/withdrawalTime",
      name: "SystemManageWithdrawalTime",
      component: () => import("@/views/systemManage/withdrawalTime/index.vue"),
      meta: {
        title: $t("systemManage.menuWithdrawalTime")
      }
    },
    {
      path: "/systemManage/verifyBankcard",
      name: "SystemManageVerifyBankcard",
      component: () => import("@/views/systemManage/verifyBankcard/index.vue"),
      meta: {
        title: $t("systemManage.menuVerifyBankcard")
      }
    },
    {
      path: "/systemManage/PICSizeMgt",
      name: "SystemManagePICSizeMgt",
      component: () => import("@/views/systemManage/PICSizeMgt/index.vue"),
      meta: {
        title: $t("systemManage.menuPICSizeMgt")
      }
    },
    {
      path: "/systemManage/behaviorVerificationManagement",
      name: "SystemManageBehaviorVerificationManagement",
      component: () => import("@/views/systemManage/behaviorVerificationManagement/index.vue"),
      meta: {
        title: $t("systemManage.menuBehaviorVerificationManagement")
      }
    },
    {
      path: "/systemManage/email",
      name: "SystemManageEmail",
      component: () => import("@/views/systemManage/email/index.vue"),
      meta: {
        title: $t("systemManage.menuEmail")
      }
    },
    {
      path: "/systemManage/loginSwitch",
      name: "SystemManageLoginSwitch",
      component: () => import("@/views/systemManage/loginSwitch/index.vue"),
      meta: {
        title: $t("systemManage.menuLoginSwitch")
      }
    }
  ]
} satisfies RouteConfigsTable;
