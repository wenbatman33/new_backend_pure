// 單一線路進款表 列項目
interface SingleReachedItem {
  id: number;
  reportDate: string;
  reportHour: number | string;
  serviceCode?: string;
  payChannelServiceID?: number;
  payChannelServiceName?: string;
  depositNum: number;
  amount: number;
  note: string;
  updatedAt?: string;
  createdAt?: string;
}

// 搜尋條件
interface SearchFormProps {
  reportDateStart: string;
  reportDateEnd: string;
  reportHourStart: string;
  reportHourEnd: string;
  payChannelServiceID: number;
}

export type { SingleReachedItem, SearchFormProps };
