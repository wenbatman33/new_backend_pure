import { reactive } from "vue";
import type { FormRules } from "element-plus";

// 本模組編輯表單欄位皆為選填（依廠商動態顯示），無必填校驗。
// 預留 formRules 供後續擴充。
export const formRules = reactive<FormRules>({});
