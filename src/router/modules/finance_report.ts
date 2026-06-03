import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/finance_report",
  name: "Finance_report",
  component: Layout,
  redirect: "/finance_report/day_reconciliation",
  meta: {
    icon: "ant-design:area-chart-outlined",
    title: $t("finance_report.menu"),
    rank: 73
  },
  children: [
    {
      path: "/finance_report/day_reconciliation",
      name: "FinanceReportDayReconciliation",
      component: () => import("@/views/finance_report/day_reconciliation/index.vue"),
      meta: {
        title: $t("finance_report.menuDayReconciliation")
      }
    },
    {
      path: "/finance_report/single_reached_report",
      name: "FinanceReportSingleReachedReport",
      component: () => import("@/views/finance_report/single_reached_report/index.vue"),
      meta: {
        title: $t("finance_report.menuSingleReachedReport")
      }
    },
    {
      path: "/finance_report/member_report_withdrawal",
      name: "FinanceReportMemberReportWithdrawal",
      component: () => import("@/views/finance_report/member_report_withdrawal/index.vue"),
      meta: {
        title: $t("finance_report.menuMemberReportWithdrawal")
      }
    },
    {
      path: "/finance_report/member_report",
      name: "FinanceReportMemberReport",
      component: () => import("@/views/finance_report/member_report/index.vue"),
      meta: {
        title: $t("finance_report.menuMemberReport")
      }
    },
    {
      path: "/finance_report/hour_reconciliation",
      name: "FinanceReportHourReconciliation",
      component: () => import("@/views/finance_report/hour_reconciliation/index.vue"),
      meta: {
        title: $t("finance_report.menuHourReconciliation")
      }
    },
    {
      path: "/finance_report/bankcard_report",
      name: "FinanceReportBankcardReport",
      component: () => import("@/views/finance_report/bankcard_report/index.vue"),
      meta: {
        title: $t("finance_report.menuBankcardReport")
      }
    },
    {
      path: "/finance_report/usdt_report",
      name: "FinanceReportUsdtReport",
      component: () => import("@/views/finance_report/usdt_report/index.vue"),
      meta: {
        title: $t("finance_report.menuUsdtReport")
      }
    },
    {
      path: "/finance_report/speed",
      name: "FinanceReportSpeed",
      component: () => import("@/views/finance_report/speed/index.vue"),
      meta: {
        title: $t("finance_report.menuSpeed")
      }
    },
    {
      path: "/finance_report/paychannel_report",
      name: "FinanceReportPaychannelReport",
      component: () => import("@/views/finance_report/paychannel_report/index.vue"),
      meta: {
        title: $t("finance_report.menuPaychannelReport")
      }
    },
    {
      path: "/finance_report/daily_reached_report",
      name: "FinanceReportDailyReachedReport",
      component: () => import("@/views/finance_report/daily_reached_report/index.vue"),
      meta: {
        title: $t("finance_report.menuDailyReachedReport")
      }
    },
    {
      path: "/finance_report/payChannelDepositWithdraw",
      name: "FinanceReportPayChannelDepositWithdraw",
      component: () => import("@/views/finance_report/payChannelDepositWithdraw/index.vue"),
      meta: {
        title: $t("finance_report.menuPayChannelDepositWithdraw")
      }
    }
  ]
} satisfies RouteConfigsTable;
