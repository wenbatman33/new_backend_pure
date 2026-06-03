import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理詳情頁 mock：把詳情頁會呼叫的 endpoint 都模擬，回 { success, data }
export default defineFakeRoute([
  {
    url: "/backend/agency",
    method: "get",
    response: () => ({
      success: true,
      data: {
        id: 10001,
        account: "agencyA001",
        name: "代理張三",
        memberAccount: "memberA001",
        parentAgencyID: 9001,
        parentAgencyAccount: "topAgency",
        childAgencyCount: 5,
        memberCount: 120,
        phone: "13800001111",
        email: "a001@test.com",
        wechat: "wx_a001",
        qq: "100200300",
        adminRemark: "重點代理，注意維護",
        updateAdmin: "admin01",
        reivewAgencyTime: "2026-01-01 10:00:00",
        lastLoginTime: "2026-06-01 09:30:00",
        applyAgencyIp: "1.2.3.4",
        lastLoginIp: "5.6.7.8",
        phoneCert: 2,
        telegram: "tg_a001",
        whatsapp: "wa_a001",
        status: 1,
        depositLimit: 1,
        withdrawLimit: 1,
        transferLimit: 1,
        walletManualOperationLimit: 1,
        allowOtherBankCard: 1,
        bankcardGroups: [{ ID: 1, name: "银行卡组A" }],
        paymentGroups: [{ ID: 2, name: "三方组B" }],
        promotionLinks: [
          { id: 1, type: 1, promotionLink: "https://promo.test/default" },
          { id: 2, type: 2, promotionLink: "https://promo.test/custom1" }
        ]
      }
    })
  },
  {
    url: "/backend/agency/rankgroup",
    method: "get",
    response: () => ({
      success: true,
      data: {
        businessType: 2,
        netProfitBase: 1,
        platformCharge: 1,
        totalCharge: 1,
        totalBonus: 2,
        giveOffer: 1,
        groupID: 3,
        offerPercent: 10,
        agencyReturnProportion: 5,
        memberReturnProportion: 3
      }
    })
  },
  {
    url: "/backend/agency/rankgroup",
    method: "put",
    response: () => ({ success: true, data: { agencyID: 10001 } })
  },
  {
    url: "/backend/agency/changestatus",
    method: "put",
    response: () => ({ success: true, data: { id: 10001 } })
  },
  {
    url: "/backend/agency/bankcard/getdefault",
    method: "get",
    response: () => ({
      success: true,
      data: { cardNo: "6222021234567890", bankName: "工商银行" }
    })
  },
  {
    url: "/backend/agency/usdt/getdefault",
    method: "get",
    response: () => ({
      success: true,
      data: { address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5Kcbk" }
    })
  },
  {
    url: "/backend/agency/ecny/getdefault",
    method: "get",
    response: () => ({ success: true, data: { address: "ecny-default-addr" } })
  },
  {
    url: "/backend/agency/getrecord",
    method: "get",
    response: () => ({
      success: true,
      data: {
        money: 123456.78,
        frozenMoney: 1000,
        rechargeAmount: 50000,
        withdrawAmount: 20000,
        commission: 8000,
        manualRecharge: 3000,
        manualWithdraw: 1500,
        bonusAmount: 600
      }
    })
  },
  {
    url: "/backend/agency/getrecentmoneylog",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            useType: 1,
            amount: 1000,
            afterMoney: 124456.78,
            date: "2026-06-01 10:00:00",
            remark: "系统上分"
          },
          {
            id: 2,
            useType: 2,
            amount: -500,
            afterMoney: 123956.78,
            date: "2026-06-01 11:00:00",
            remark: "系统下分"
          }
        ]
      }
    })
  },
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { useTypeID: 1, useTypeName: "充值" },
          { useTypeID: 2, useTypeName: "提现" }
        ]
      }
    })
  },
  {
    url: "/backend/agency/:key",
    method: "put",
    response: () => ({ success: true, data: { id: 10001 } })
  },
  {
    url: "/backend/agency/changepassword",
    method: "put",
    response: () => ({ success: true, data: { id: 10001 } })
  },
  {
    url: "/backend/agency/changetradepin",
    method: "put",
    response: () => ({ success: true, data: { id: 10001 } })
  },
  {
    url: "/backend/agency/phone/certified",
    method: "put",
    response: () => ({ success: true, data: { id: 10001 } })
  },
  {
    url: "/backend/agency/promotionlink",
    method: "post",
    response: () => ({ success: true, data: { id: 99 } })
  },
  {
    url: "/backend/agency/promotionlink",
    method: "put",
    response: () => ({ success: true, data: { id: 99 } })
  },
  {
    url: "/backend/agency/promotionlink",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 銀行卡
  {
    url: "/backend/agency/bankcard/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            cardNo: "6222021234567890",
            bankAccount: "张三",
            bankName: "工商银行",
            isDefault: 1,
            status: 1,
            createdAt: "2026-01-01 10:00:00",
            updatedAt: "2026-02-01 10:00:00"
          },
          {
            id: 2,
            cardNo: "6222029876543210",
            bankAccount: "张三",
            bankName: "建设银行",
            isDefault: 2,
            status: 1,
            createdAt: "2026-03-01 10:00:00",
            updatedAt: "2026-03-01 10:00:00"
          }
        ]
      }
    })
  },
  {
    url: "/backend/agency/bankcard",
    method: "post",
    response: () => ({ success: true, data: { id: 3 } })
  },
  {
    url: "/backend/agency/bankcard/disable",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/bankcard/enable",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/bankcard/setdefault",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // USDT
  {
    url: "/backend/agency/usdt/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5Kcbk",
            isDefault: 1,
            createdAt: "2026-01-01 10:00:00",
            updatedAt: "2026-02-01 10:00:00"
          }
        ]
      }
    })
  },
  {
    url: "/backend/agency/usdt",
    method: "post",
    response: () => ({ success: true, data: { id: 2 } })
  },
  {
    url: "/backend/agency/usdt",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/agency/usdt/setdefault",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // ECNY
  {
    url: "/backend/agency/ecny/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { id: 1, address: "ecny-addr-001", status: 1 },
          { id: 2, address: "ecny-addr-002", status: 2 }
        ]
      }
    })
  },
  {
    url: "/backend/agency/ecny",
    method: "post",
    response: () => ({ success: true, data: { id: 3 } })
  },
  {
    url: "/backend/agency/ecny/disable",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 提款資料
  {
    url: "/backend/info/withdrawal",
    method: "get",
    response: () => ({
      success: true,
      data: [
        {
          id: 1,
          name: "工行卡",
          serviceName: "银行卡",
          address: "6222021234567890",
          status: 1,
          bankName: "工商银行",
          bankCode: "ICBC",
          city: "北京",
          branch: "海淀支行"
        },
        {
          id: 2,
          name: "USDT钱包",
          serviceName: "USDT",
          address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5Kcbk",
          status: 2
        }
      ]
    })
  },
  {
    url: "/backend/info/withdrawal",
    method: "post",
    response: () => ({ success: true, data: { id: 3 } })
  },
  {
    url: "/backend/info/withdrawal",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/info/withdrawal/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        services: [
          {
            name: "银行卡",
            serviceCode: "bank",
            hasInput: true,
            hasDropdown: true,
            dropdown: { 工商银行: "ICBC", 建设银行: "CCB" }
          },
          {
            name: "USDT",
            serviceCode: "usdt",
            hasInput: false,
            hasDropdown: false,
            dropdown: {}
          }
        ]
      }
    })
  },
  // 平台費率
  {
    url: "/backend/agency/platformFeeRatio/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            id: 1,
            gameGroupDisplayName: "PG电子",
            gameGroupID: 11,
            gameTypeID: 1,
            platformFeeRatio: 0.05,
            bettingFrom: 1
          },
          {
            id: 2,
            gameGroupDisplayName: "AG真人",
            gameGroupID: 12,
            gameTypeID: 2,
            platformFeeRatio: 0.08,
            bettingFrom: 2
          }
        ]
      }
    })
  },
  {
    url: "/backend/game/gamelist/type",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { key: 1, value: "电子" },
          { key: 2, value: "真人" }
        ]
      }
    })
  },
  {
    url: "/backend/agency/platformfeeratio/search",
    method: "get",
    response: () => ({
      success: true,
      data: {
        gameGroup: "PG电子",
        gameType: "电子",
        platformFeeRatio: "0.05",
        bettingFrom: "负盈利"
      }
    })
  },
  {
    url: "/backend/agency/platformFeeRatio/",
    method: "post",
    response: () => ({ success: true, data: { id: 9 } })
  },
  {
    url: "/backend/agency/platformFeeRatio/",
    method: "put",
    response: () => ({ success: true, data: { id: 9 } })
  },
  {
    url: "/backend/agency/platformFeeRatio/",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/game/dropdown/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        gameGroup: [
          { id: 11, displayName: "PG电子" },
          { id: 12, displayName: "AG真人" }
        ]
      }
    })
  },
  // 金流組別
  {
    url: "/backend/pay_group/groups",
    method: "get",
    response: () => ({
      success: true,
      data: { list: [{ ID: 1, name: "银行卡组A" }, { ID: 2, name: "三方组B" }] }
    })
  },
  {
    url: "/backend/pay_group/agency",
    method: "post",
    response: () => ({ success: true, data: { id: 1 } })
  }
]);
