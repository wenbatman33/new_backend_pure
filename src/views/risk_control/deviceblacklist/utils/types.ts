interface FormItemProps {
  /** 主鍵 id（編輯時帶入） */
  id?: number;
  /** 裝置 ID */
  deviceID: string;
  /** 原因 */
  reason: string;
  /** 模式：create 新增 / update 編輯 */
  mode?: "create" | "update";
}

interface FormProps {
  formInline: FormItemProps;
}

/** 裝置黑名單列表項 */
interface DeviceBlackItem {
  id: number;
  deviceID: string;
  reason: string;
  createdAt: string;
  createUserAccount: string;
}

export type { FormItemProps, FormProps, DeviceBlackItem };
