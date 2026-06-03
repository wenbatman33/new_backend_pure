// 任務中心 - 任務列表項
interface TaskItem {
  id: number;
  /** 任務名稱（對外） */
  name: string;
  /** 內部名稱 */
  internalName: string;
  /** 狀態：1 啟用 / 0 停用 */
  status: number;
  /** 任務型別：1 每日 / 2 每週 / 3 自訂 */
  type: number;
  startTime: string;
  endTime: string;
  updatedAt: string;
  updatedUser: string;
}

// 任務編輯表單（精簡：上架/基礎設定欄位；步驟1~3 的任務型別細項以原生 TODO 佔位）
interface FormItemProps {
  /** 開啟模式：Create / Edit / Watch */
  mode: "Create" | "Edit" | "Watch";
  id?: number;
  /** 任務名稱 */
  name: string;
  /** 內部名稱 */
  internalName: string;
  /** 任務型別：1 每日 / 2 每週 / 3 自訂 */
  type: number;
  /** type=2 時的刷新星期：1~7 */
  week?: number;
  /** 刷新週期重置任務點數 */
  activeReset: boolean;
  /** 完成任務後連續可領取天數 */
  receiveDay?: number;
  startTime: string;
  endTime: string;
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { TaskItem, FormItemProps, FormProps };
