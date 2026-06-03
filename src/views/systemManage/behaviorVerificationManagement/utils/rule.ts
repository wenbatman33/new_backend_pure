import { reactive } from "vue";
import type { FormRules } from "element-plus";

/**
 * 行為驗證廠商編輯表單校驗規則
 * 舊模組無必填限制，這裡保持空規則物件以維持結構一致。
 */
export const formRules = reactive(<FormRules>{});
