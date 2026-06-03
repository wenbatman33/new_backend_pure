import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/agency",
  name: "Agency",
  component: Layout,
  redirect: "/agency/childapplication",
  meta: {
    icon: "ant-design:partition-outlined",
    title: $t("agency.menu"),
    rank: 3
  },
  children: [
    {
      path: "/agency/childapplication",
      name: "AgencyChildApplication",
      component: () => import("@/views/agency/childapplication/index.vue"),
      meta: {
        title: $t("agency.menuChildApplication")
      }
    },
    {
      path: "/agency/commission",
      name: "AgencyCommission",
      component: () => import("@/views/agency/commission/index.vue"),
      meta: {
        title: $t("agency.menuCommission")
      }
    },
    {
      path: "/agency/siteFunction",
      name: "AgencySiteFunction",
      component: () => import("@/views/agency/siteFunction/index.vue"),
      meta: {
        title: $t("agency.menuSiteFunction")
      }
    },
    {
      path: "/agency/adjustment",
      name: "AgencyAdjustment",
      component: () => import("@/views/agency/adjustment/index.vue"),
      meta: {
        title: $t("agency.menuAdjustment")
      }
    },
    {
      path: "/agency/deposit",
      name: "AgencyDeposit",
      component: () => import("@/views/agency/deposit/index.vue"),
      meta: {
        title: $t("agency.menuDeposit")
      }
    },
    {
      path: "/agency/walletLog",
      name: "AgencyWalletLog",
      component: () => import("@/views/agency/walletLog/index.vue"),
      meta: {
        title: $t("agency.menuWalletLog")
      }
    },
    {
      path: "/agency/dailyReport",
      name: "AgencyDailyReport",
      component: () => import("@/views/agency/dailyReport/index.vue"),
      meta: {
        title: $t("agency.menuDailyReport")
      }
    },
    {
      path: "/agency/withdrawal",
      name: "AgencyWithdrawal",
      component: () => import("@/views/agency/withdrawal/index.vue"),
      meta: {
        title: $t("agency.menuWithdrawal")
      }
    },
    {
      path: "/agency/management",
      name: "AgencyManagement",
      component: () => import("@/views/agency/management/index.vue"),
      meta: {
        title: $t("agency.menuManagement")
      }
    },
    {
      path: "/agency/agencyGroup",
      name: "AgencyAgencyGroup",
      component: () => import("@/views/agency/agencyGroup/index.vue"),
      meta: {
        title: $t("agency.menuAgencyGroup")
      }
    },
    {
      path: "/agency/phDailyReport",
      name: "AgencyPhDailyReport",
      component: () => import("@/views/agency/phDailyReport/index.vue"),
      meta: {
        title: $t("agency.menuPhDailyReport")
      }
    },
    {
      path: "/agency/lockedWallets",
      name: "AgencyLockedWallets",
      component: () => import("@/views/agency/lockedWallets/index.vue"),
      meta: {
        title: $t("agency.menuLockedWallets")
      }
    },
    {
      path: "/agency/platformFeeRatio",
      name: "AgencyPlatformFeeRatio",
      component: () => import("@/views/agency/platformFeeRatio/index.vue"),
      meta: {
        title: $t("agency.menuPlatformFeeRatio")
      }
    },
    {
      path: "/agency/team",
      name: "AgencyTeam",
      component: () => import("@/views/agency/team/index.vue"),
      meta: {
        title: $t("agency.menuTeam")
      }
    },
    {
      path: "/agency/operationRecord",
      name: "AgencyOperationRecord",
      component: () => import("@/views/agency/operationRecord/index.vue"),
      meta: {
        title: $t("agency.menuOperationRecord")
      }
    },
    {
      path: "/agency/wallet",
      name: "AgencyWallet",
      component: () => import("@/views/agency/wallet/index.vue"),
      meta: {
        title: $t("agency.menuWallet")
      }
    },
    {
      path: "/agency/agencyapplication",
      name: "AgencyAgencyapplication",
      component: () => import("@/views/agency/agencyapplication/index.vue"),
      meta: {
        title: $t("agency.menuAgencyapplication")
      }
    },
    {
      path: "/agency/contribution",
      name: "AgencyContribution",
      component: () => import("@/views/agency/contribution/index.vue"),
      meta: {
        title: $t("agency.menuContribution")
      }
    },
    {
      path: "/agency/memberReport",
      name: "AgencyMemberReport",
      component: () => import("@/views/agency/memberReport/index.vue"),
      meta: {
        title: $t("agency.menuMemberReport")
      }
    },
    {
      path: "/agency/childAgencyReport",
      name: "AgencyChildAgencyReport",
      component: () => import("@/views/agency/childAgencyReport/index.vue"),
      meta: {
        title: $t("agency.menuChildAgencyReport")
      }
    },
    {
      path: "/agency/newReg",
      name: "AgencyNewReg",
      component: () => import("@/views/agency/newReg/index.vue"),
      meta: {
        title: $t("agency.menuNewReg")
      }
    },
    {
      path: "/agency/performanceReport",
      name: "AgencyPerformanceReport",
      component: () => import("@/views/agency/performanceReport/index.vue"),
      meta: {
        title: $t("agency.menuPerformanceReport")
      }
    },
    {
      path: "/agency/agencyMain",
      name: "AgencyAgencyMain",
      component: () => import("@/views/agency/agencyMain/index.vue"),
      meta: {
        title: $t("agency.menuAgencyMain")
      }
    },
    {
      path: "/agency/memberNode",
      name: "AgencyMemberNode",
      component: () => import("@/views/agency/memberNode/index.vue"),
      meta: {
        title: $t("agency.menuMemberNode")
      }
    },
    {
      path: "/agency/agencyMainDetail",
      name: "AgencyAgencyMainDetail",
      component: () => import("@/views/agency/agencyMain/detail/index.vue"),
      meta: {
        title: $t("agency.menuAgencyMainDetail"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
