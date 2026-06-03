import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/payment",
  name: "Payment",
  component: Layout,
  redirect: "/payment/finance",
  meta: {
    icon: "la:money-bill",
    title: $t("payment.menu"),
    rank: 11
  },
  children: [
    {
      path: "/payment/finance",
      name: "PaymentFinance",
      component: () => import("@/views/payment/finance/index.vue"),
      meta: {
        title: $t("payment.menuFinance")
      }
    },
    {
      path: "/payment/pay_channel_service",
      name: "PaymentPayChannelService",
      component: () => import("@/views/payment/pay_channel_service/index.vue"),
      meta: {
        title: $t("payment.menuPayChannelService")
      }
    },
    {
      path: "/payment/pay_channel",
      name: "PaymentPayChannel",
      component: () => import("@/views/payment/pay_channel/index.vue"),
      meta: {
        title: $t("payment.menuPayChannel")
      }
    },
    {
      path: "/payment/pay_group",
      name: "PaymentPayGroup",
      component: () => import("@/views/payment/pay_group/index.vue"),
      meta: {
        title: $t("payment.menuPayGroup")
      }
    },
    {
      path: "/payment/pay_bank_group",
      name: "PaymentPayBankGroup",
      component: () => import("@/views/payment/pay_bank_group/index.vue"),
      meta: {
        title: $t("payment.menuPayBankGroup")
      }
    },
    {
      path: "/payment/pay_bank_card",
      name: "PaymentPayBankCard",
      component: () => import("@/views/payment/pay_bank_card/index.vue"),
      meta: {
        title: $t("payment.menuPayBankCard")
      }
    },
    {
      path: "/payment/pay_u",
      name: "PaymentPayU",
      component: () => import("@/views/payment/pay_u/index.vue"),
      meta: {
        title: $t("payment.menuPayU")
      }
    }
  ]
} satisfies RouteConfigsTable;
