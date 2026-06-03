import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/withdrawal",
  name: "Withdrawal",
  component: Layout,
  redirect: "/withdrawal/financial/check/agency/:sn",
  meta: {
    icon: "la:money-bill-wave",
    title: $t("withdrawal.menu"),
    rank: 5
  },
  children: [
    {
      path: "/withdrawal/risk_check/:sn",
      name: "WithdrawalRiskCheck",
      component: () => import("@/views/withdrawal/risk_check/index.vue"),
      meta: {
        title: $t("withdrawal.menuRiskCheck"),
        showLink: false
      }
    },
    {
      path: "/withdrawal/financial/check/:sn",
      name: "WithdrawalFinancialCheck",
      component: () => import("@/views/withdrawal/financial_check/index.vue"),
      meta: {
        title: $t("withdrawal.menuFinancialCheck"),
        showLink: false
      }
    },
    {
      path: "/withdrawal/timeline",
      name: "WithdrawalTimeline",
      component: () => import("@/views/withdrawal/timeline/index.vue"),
      meta: {
        title: $t("withdrawal.menuTimeline")
      }
    },
    {
      path: "/withdrawal/payout/:sn",
      name: "WithdrawalPayout",
      component: () => import("@/views/withdrawal/payout/index.vue"),
      meta: {
        title: $t("withdrawal.menuPayout"),
        showLink: false
      }
    },
    {
      path: "/withdrawal/financial/check/agency/:sn",
      name: "FinancialCheckAgency",
      component: () => import("@/views/withdrawal/financial_check_agency/index.vue"),
      meta: {
        title: $t("withdrawal.menuFinancialCheckAgency"),
        showLink: false
      }
    },
    {
      path: "/withdrawal/payout_agency/:sn",
      name: "WithdrawalPayoutAgency",
      component: () => import("@/views/withdrawal/payout_agency/index.vue"),
      meta: {
        title: $t("withdrawal.payoutMenuAgency"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
