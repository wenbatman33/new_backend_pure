# Vben (ant-design-vue) → pure-admin (Element Plus) 模組遷移 Playbook

舊專案：`../new_backend_source`（Vben Admin / ant-design-vue / Vue 3.1.5）
新專案：本目錄（pure-admin-thin 6.2.0 / Element Plus 2.11.5 / Vue 3.5）
策略：**原生改寫**（每頁用 pure-admin 原生 el-* 重寫，不做相容層）

> 已驗證的範本：`src/views/vip/vipBlock/`（黑名單）。每個新模組照此結構產出。

## 一個模組的檔案結構

舊：`views/<域>/<模組>/index.vue` + `components/{tableData,searchSchemas,editFormSchema,data}.ts` + `EditModal.vue`
新：
```
views/<域>/<模組>/
  index.vue            # PureTableBar + pure-table + 搜尋 el-form
  form.vue             # 對話框內容（el-form），由 addDialog 開啟
  utils/hook.tsx       # columns / onSearch / openDialog / handleDelete / pagination / resetForm
  utils/rule.ts        # el-form 校驗規則（reactive<FormRules>）
  utils/types.ts       # FormItemProps / FormProps
```

## 元件對應

| Vben（舊） | pure-admin 原生（新） |
|---|---|
| `BasicTable` + `useTable({api,columns,...})` | `<PureTableBar>` + `<pure-table>` + `utils/hook.tsx` |
| `useSearchForm` + `formConfig.schemas` | `index.vue` 內手寫 `<el-form :inline>` 搜尋列 |
| `BasicColumn[]`（tableData.ts） | `TableColumnList`（hook 內 columns 陣列，`label`/`prop`，自訂渲染用 `cellRenderer:({row})=>JSX`） |
| `BasicModal` + `useModalInner` | `addDialog({title,props,contentRenderer,beforeSure})` from `@/components/ReDialog` |
| `BasicForm` + `useForm` + FormSchema | `form.vue` 內手寫 `<el-form>` + `utils/rule.ts` |
| `TableAction` + `popConfirm` | `<el-popconfirm>` 包 `<el-button>`，或行內 `<el-button>` |
| `PageWrapper` | `<div class="main">` |

> ⚠️ **JSX 在 `.vue` 內需 `<script setup lang="tsx">`**。若用 `lang="ts"` 又寫 JSX（`=> <span .../>`）會編譯報 "Unexpected token"。兩種正解：①把 script 改成 `lang="tsx"`；②或用 `h(...)`（`import { h } from "vue"`）。`.tsx` 檔（hook.tsx）本就支援 JSX。

## API 層

- 舊：`defHttp.get/post/put/delete({url,params})`，import `/@/utils/http/axios`
- 新：`http.request<T>("get"|"post"|"put"|"delete", url, { params }|{ data })`，import `@/utils/http`
  - GET/DELETE 帶查詢 → `{ params }`；POST/PUT body → `{ data }`
  - ⚠️ 舊 Vben 慣例陷阱：`defHttp.post/put({ url, params })` 的 `params` 其實是送**body**（不是 query）。所以舊碼 post/put 的 `params` 一律轉成新碼的 `{ data }`，不要照字面變成 query params。
- 回應約定：http 攔截器已把舊後端 `{statusCode,data,msg}` 正規化為 `{ success, data }`（statusCode===0 為成功）。
  api 函式型別寫成 `Result<T> = { success: boolean; data: T }`，呼叫端用 `const { success, data } = await fn()`。
- api 檔放 `src/api/<域>.ts`（一域一檔，沿用舊 endpoint 字串，例 `/backend/vip/black/list`）。
- ⚠️ **函式命名要模組化、具描述性**（例 `getOperationReport`、`getPromotionReport`），**不要用泛用名**（`getReport`/`getList`/`getData`）。同域多模組合併到同一 api 檔，泛用名會跨模組碰撞、被靜默去重導致打到錯端點。

## i18n（重要）

- pure-admin 的 `$t`（`@/plugins/i18n`）是 **no-op，只給 IDE 提示**；真正翻譯是 `transformI18n`。
- 元件/hook/rule 內一律 `import { transformI18n as $t } from "@/plugins/i18n"`，再用 `$t("域.key")`。
- **router module 例外**：維持 `import { $t }`（存 key、選單渲染時才套 transformI18n，才能切語系）。
- 文案放根目錄 `locales/zh-CN.yaml` 與 `locales/en.yaml`，巢狀 key（建議用域名當頂層 namespace，例 `vip:`）。
- **zh 一律用簡體中文**（舊專案 locale 為 zh-CN 簡體）。回傳 i18nZh 時務必簡體，勿用繁體，避免合併後繁簡不一致。
- 跨模組共用 key（如 search/reset/memberAccount/promotion…）值要一致；主程式合併時同名 key 去重，請勿對同 key 給不同值。

## Mock（每模組必做）

- 每個模組要寫一支自己的 mock：`mock/<域>_<模組>.ts`（檔名唯一以避免並行寫衝突；vite-plugin-fake-server 會自動載入 mock/ 下所有檔）。
- 用 `import { defineFakeRoute } from "vite-plugin-fake-server/client"`，把該模組所有會呼叫的 endpoint 都 mock 起來。
- 回傳格式統一 `{ success: true, data: ... }`：列表頁 `data: { list: [...], total }`（給 10~20 筆合理假資料）；設定/單物件頁 `data: { ...合理結構... }`。欄位名與 hook 讀取的一致，讓頁面能實際渲染出資料供驗證。
- 參考 `mock/vip.ts`（vipBlock 的 mock）。

## 權限

- 舊：`usePermission().hasPermission(['__btn_xxx'])`
- 新：`hasAuth('__btn_xxx')` from `@/router/utils`（按鈕用 `v-if="hasAuth('__btn_xxx')"`）

## 路由

每域一個 `src/router/modules/<域>.ts`，default export 路由物件（Layout + children）。title 用 `$t("域.menuXxx")`（no-op $t）。

## 共用 utils（已移植，可直接 import）

- `@/utils/is`、`@/utils/number`（formatNumber/commaDecimalFormat/changeRedColorForNegative…）、`@/utils/options`（findByValue/arrayToOptions/objectToOptions…）
- 尚未移植（牽涉 store/env/i18n/api，遇到再補）：`country`、`dateUtil`、`imgUrl`、`report`、`dropdown`

## 驗收標準

1. `pnpm dev` 無編譯/型別錯誤；頁面路由可開、無 console error。
2. 表格/搜尋/新增對話框/刪除確認皆可操作（資料可先用 `mock/<域>.ts` 假資料驗證）。
3. i18n 文案正確解析（非顯示原始 key）。
4. 權限按鈕受 `hasAuth` 控制。
