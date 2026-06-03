import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 線路管理（代收）假資料
const serviceCodes = ["alipay", "wechat", "bank", "usdt", "gw"];
const list = Array.from({ length: 14 }).map((_, i) => {
  const id = i + 1;
  const lower = (i % 3) * 100 + 100;
  return {
    id,
    type: (i % 2) + 1,
    name: `线路-${id}`,
    rate: (80 + (i % 20)).toFixed(2),
    groups: [
      { key: id * 10 + 1, value: `组别A${id}`, type: 1 },
      { key: id * 10 + 2, value: `组别B${id}`, type: 2 }
    ],
    weight: i + 1,
    weighted: String((i + 1) * 1000),
    amount: (i + 1) * 12345,
    remain: (i + 1) * 5000,
    settle: "00:00",
    lowerLimit: lower,
    upperLimit: lower + 5000,
    fee: (i % 5) + 1,
    perFee: (i % 3) + 1,
    dayLimit: 1000000,
    status: i % 4 === 0 ? "0" : "1",
    note: i % 2 === 0 ? `备注${id}` : "",
    serviceCode: serviceCodes[i % serviceCodes.length],
    payChannelID: 100 + i,
    device: "1"
  };
});

// 下拉清單（serviceCode/method 為 { key: value } 物件陣列）
const channelDropdown = {
  payChannel: [
    { key: 100, value: "商户号A" },
    { key: 101, value: "商户号B" },
    { key: 102, value: "商户号C" }
  ],
  serviceCode: [
    { alipay: "支付宝" },
    { wechat: "微信" },
    { bank: "银行卡" },
    { usdt: "USDT" },
    { gw: "网关" }
  ],
  method: [{ "1": "即时" }, { "2": "扫码" }],
  bankGroups: [
    { key: 1, value: "银行卡组别1" },
    { key: 2, value: "银行卡组别2" }
  ],
  thirdGroups: [
    { key: 11, value: "三方组别1" },
    { key: 12, value: "三方组别2" }
  ]
};

export default defineFakeRoute([
  {
    // 線路列表
    url: "/backend/pay_channel_service/",
    method: "get",
    response: ({ query }) => {
      let result = list;
      if (query?.name) {
        result = result.filter(v => v.name.includes(query.name));
      }
      if (query?.status !== undefined && query?.status !== "") {
        result = result.filter(v => String(v.status) === String(query.status));
      }
      if (query?.serviceCode) {
        result = result.filter(v => v.serviceCode === query.serviceCode);
      }
      return {
        success: true,
        data: { list: result, total: result.length }
      };
    }
  },
  {
    // 共用下拉清單
    url: "/backend/pay/pay_channel/dropdown",
    method: "get",
    response: () => ({ success: true, data: channelDropdown })
  },
  {
    // 查看/編輯單筆
    url: "/backend/pay_channel_service/edit",
    method: "get",
    response: ({ query }) => {
      const row = list.find(v => String(v.id) === String(query?.id)) ?? list[0];
      return {
        success: true,
        data: {
          ...row,
          method: 1,
          depositAllowChoosePayChannelService: true
        }
      };
    }
  },
  {
    // 編輯
    url: "/backend/pay_channel_service/edit",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 新增
    url: "/backend/pay_channel_service/create",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 排序
    url: "/backend/pay_channel_service/sort",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 取得不包含指定線路的群組
    url: "/backend/pay_channel_service/groups/exclude",
    method: "get",
    response: () => ({
      success: true,
      data: {
        groups: [
          { id: 201, value: "可选组别1", type: 1 },
          { id: 202, value: "可选组别2", type: 2 },
          { id: 203, value: "可选组别3", type: 1 }
        ]
      }
    })
  },
  {
    // 儲存線路到金流群組
    url: "/backend/pay_channel_service/groups",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
