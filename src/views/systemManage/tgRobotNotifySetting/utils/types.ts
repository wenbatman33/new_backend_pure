// TG 机器人通知设定 表单结构
interface TgRobotNotifyForm {
  open: boolean; // 是否启用
  chatId: string; // Telegram Chat ID
  manual: string; // 取得 Chat ID 的说明 / 连结（只读）
}

export type { TgRobotNotifyForm };
