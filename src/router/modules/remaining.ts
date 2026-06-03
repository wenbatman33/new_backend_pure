import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: $t("menus.pureLogin"),
      showLink: false
    }
  },
  // 全屏403（无权访问）页面
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/error/403.vue"),
    meta: {
      title: $t("menus.pureAccessDenied"),
      showLink: false
    }
  },
  // 全屏500（服务器出错）页面
  {
    path: "/server-error",
    name: "ServerError",
    component: () => import("@/views/error/500.vue"),
    meta: {
      title: $t("menus.pureServerError"),
      showLink: false
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: $t("status.pureLoad"),
      showLink: false
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  // ── 獨立詳情頁(對齊舊 88_BO_ADMIN：window.open 開新分頁、無後台側邊欄) ──
  {
    path: "/memberDetail/detail/:id?",
    name: "MemberDetailPage",
    component: () => import("@/views/member/detail/index.vue"),
    meta: { title: $t("member.menuDetail"), showLink: false }
  },
  {
    path: "/memberDetail/walletLog/:id?",
    name: "MemberWalletLogPage",
    component: () => import("@/views/member/walletLog/index.vue"),
    meta: { title: $t("member.menuWalletLog"), showLink: false }
  },
  {
    path: "/memberDetail/luckwalletLog/:id?",
    name: "MemberLuckwalletLogPage",
    component: () => import("@/views/member/luckwalletLog/index.vue"),
    meta: { title: $t("member.menuLuckwalletLog"), showLink: false }
  },
  {
    path: "/agencyDetail/detail/:id?",
    name: "AgencyDetailPage",
    component: () => import("@/views/agency/agencyMain/detail/index.vue"),
    meta: { title: $t("agency.menuAgencyMainDetail"), showLink: false }
  }
] satisfies Array<RouteConfigsTable>;
