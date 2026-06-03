import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 商戶名清單
const nameList = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `商户${String.fromCharCode(65 + i)}`
}));

// 商戶號清單
const channelList = Array.from({ length: 15 }).map((_, i) => {
  const name = nameList[i % nameList.length].name;
  const ratio = (i * 7) % 100;
  return {
    id: i + 1,
    sn: `PC${String(10000 + i)}`,
    name,
    status: (i % 3 === 0 ? 2 : 1) as number,
    method: i % 4,
    supplyAp: i % 2 === 0,
    apStatus: i % 2 === 0 ? 1 : 2,
    apLowerLimit: 100,
    apUpperLimit: 50000 + i * 1000,
    apDayLimit: 1000000,
    depositLimit: 500000,
    todayDepositTotal: 12000 + i * 333,
    todayWithdrawalTotal: 8000 + i * 222,
    thirdBalance: i % 5 === 0 ? "--" : String(100000 + i * 1234),
    thirdSecondBalance: String(50000 + i * 321),
    depositRatio: ratio,
    note: i % 2 === 0 ? "测试备注" : ""
  };
});

export default defineFakeRoute([
  {
    url: "/backend/pay/pay_channel",
    method: "get",
    response: ({ query }) => {
      let list = channelList;
      if (query.sn) list = list.filter(v => v.sn.includes(query.sn));
      if (query.name) list = list.filter(v => v.name === query.name);
      if (query.status)
        list = list.filter(v => v.status === Number(query.status));
      if (query.supplyAp === "true") list = list.filter(v => v.supplyAp);
      if (query.supplyAp === "false") list = list.filter(v => !v.supplyAp);
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/pay/pay_channel",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel_name",
    method: "get",
    response: () => ({ success: true, data: { list: nameList } })
  },
  {
    url: "/backend/pay/pay_channel_name",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel_name/offline/gcash",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel/remain/add",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel/remain/sub",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/pay/pay_channel/ap",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
