import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/cashflow",
  name: "Cashflow",
  component: Layout,
  redirect: "/cashflow/deposit",
  meta: {
    icon: "la:images",
    title: $t("cashflow.menu"),
    rank: 5
  },
  children: [
    {
      path: "/cashflow/deposit",
      name: "CashflowDeposit",
      component: () => import("@/views/cashflow/deposit/index.vue"),
      meta: {
        title: $t("cashflow.menuDeposit")
      }
    },
    {
      path: "/cashflow/withdrawal",
      name: "CashflowWithdrawal",
      component: () => import("@/views/cashflow/withdrawal/index.vue"),
      meta: {
        title: $t("cashflow.menuWithdrawal")
      }
    },
    {
      path: "/cashflow/withdrawLimit",
      name: "CashflowWithdrawLimit",
      component: () => import("@/views/cashflow/withdrawLimit/index.vue"),
      meta: {
        title: $t("cashflow.menuWithdrawLimit")
      }
    },
    {
      path: "/cashflow/payout_navi",
      name: "CashflowPayoutNavi",
      component: () => import("@/views/cashflow/payout_navi/index.vue"),
      meta: {
        title: $t("cashflow.menuPayoutNavi")
      }
    },
    {
      path: "/cashflow/withdrawRisk",
      name: "CashflowWithdrawRisk",
      component: () => import("@/views/cashflow/withdrawRisk/index.vue"),
      meta: {
        title: $t("cashflow.menuWithdrawRisk")
      }
    }
  ]
} satisfies RouteConfigsTable;
