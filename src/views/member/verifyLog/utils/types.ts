// 验证信息详情（detailModal 显示用）
interface VerifyDetail {
  /** 验证资料 */
  verifyData: string;
  /** 验证码 */
  code: string;
  /** 内容 */
  context: string;
}

// 操作记录（operateLog 弹窗显示用）
interface OperateLogItem {
  id: number;
  /** 时间 */
  createdAt: string;
  /** 操作人 */
  adminAccount: string;
  /** 操作 */
  action: string;
  /** 状态：1 验证成功 / 其他 验证失败 */
  status: number;
  /** 说明 */
  note: string;
}

interface DetailProps {
  detail: VerifyDetail;
}

interface OperateLogProps {
  logId: number;
}

export type { VerifyDetail, OperateLogItem, DetailProps, OperateLogProps };
