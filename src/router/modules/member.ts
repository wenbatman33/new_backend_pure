import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

// 子選單順序/標題對齊舊 88_BO_ADMIN(routes/modules/member.ts)
// 舊選單未顯示的頁(luckwallet_list/luckwalletLog/walletLog)與 detail(動態參數頁)設 showLink:false
export default {
  path: "/member",
  name: "Member",
  component: Layout,
  redirect: "/member/member",
  meta: {
    icon: "ant-design:user-outlined",
    title: $t("member.menu"),
    rank: 2
  },
  children: [
    {
      path: "/member/member",
      name: "MemberMember",
      component: () => import("@/views/member/member/index.vue"),
      meta: { title: $t("member.menuMember") }
    },
    {
      path: "/member/registList",
      name: "MemberRegistList",
      component: () => import("@/views/member/registList/index.vue"),
      meta: { title: $t("member.menuRegistList") }
    },
    {
      path: "/member/lockedWallets",
      name: "MemberLockedWallets",
      component: () => import("@/views/member/lockedWallets/index.vue"),
      meta: { title: $t("member.menuLockedWallets") }
    },
    {
      path: "/member/lockedLuckWallets",
      name: "MemberLockedLuckWallets",
      component: () => import("@/views/member/lockedLuckWallets/index.vue"),
      meta: { title: $t("member.menuLockedLuckWallets") }
    },
    {
      path: "/member/tag",
      name: "MemberTag",
      component: () => import("@/views/member/tag/index.vue"),
      meta: { title: $t("member.menuTag") }
    },
    {
      path: "/member/loginLog",
      name: "MemberLoginLog",
      component: () => import("@/views/member/loginLog/index.vue"),
      meta: { title: $t("member.menuLoginLog") }
    },
    {
      path: "/member/online",
      name: "MemberOnline",
      component: () => import("@/views/member/online/index.vue"),
      meta: { title: $t("member.menuMemberOnline") }
    },
    {
      path: "/member/member_device_ghost",
      name: "MemberDeviceGhost",
      component: () => import("@/views/member/member_device_ghost/index.vue"),
      meta: { title: $t("member.menuMemberDeviceGhost") }
    },
    {
      path: "/member/verifyLog",
      name: "MemberVerifyLog",
      component: () => import("@/views/member/verifyLog/index.vue"),
      meta: { title: $t("member.menuVerifyLog") }
    },
    {
      path: "/member/adjustment",
      name: "MemberAdjustment",
      component: () => import("@/views/member/adjustment/index.vue"),
      meta: { title: $t("member.menuManualWalletAdjustment") }
    },
    {
      path: "/member/adjustment_list",
      name: "MemberAdjustmentList",
      component: () => import("@/views/member/adjustment_list/index.vue"),
      meta: { title: $t("member.menuAdjustmentList") }
    },
    {
      path: "/member/bankcardSearch",
      name: "MemberBankcardSearch",
      component: () => import("@/views/member/bankcard_search/index.vue"),
      meta: { title: $t("member.menuBankcardSearch") }
    },
    {
      path: "/member/withdrawalInfo",
      name: "MemberWithdrawalInfo",
      component: () => import("@/views/member/withdrawalInfo/index.vue"),
      meta: { title: $t("member.menuWithdrawalInfo") }
    },
    {
      path: "/member/uploadMemberList",
      name: "MemberUploadMemberList",
      component: () => import("@/views/member/uploadMemberList/index.vue"),
      meta: { title: $t("member.menuUploadMemberList") }
    },
    // ── 以下為舊選單未顯示 / 動態參數頁，隱藏於選單 ──
    {
      path: "/member/detail/:id",
      name: "MemberDetail",
      component: () => import("@/views/member/detail/index.vue"),
      meta: { title: $t("member.menuDetail"), showLink: false }
    },
    {
      path: "/member/luckwalletList",
      name: "MemberLuckwalletList",
      component: () => import("@/views/member/luckwallet_list/index.vue"),
      meta: { title: $t("member.menuLuckwalletList"), showLink: false }
    },
    {
      path: "/member/luckwalletLog",
      name: "MemberLuckwalletLog",
      component: () => import("@/views/member/luckwalletLog/index.vue"),
      meta: { title: $t("member.menuLuckwalletLog"), showLink: false }
    },
    {
      path: "/member/walletLog",
      name: "MemberWalletLog",
      component: () => import("@/views/member/walletLog/index.vue"),
      meta: { title: $t("member.menuWalletLog"), showLink: false }
    }
  ]
} satisfies RouteConfigsTable;
