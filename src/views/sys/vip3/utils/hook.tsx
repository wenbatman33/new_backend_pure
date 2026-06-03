import { ref, reactive } from "vue";
import { ElPopover } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getVipJobLogById } from "@/api/sys";
import type { VipJobLogGroup, VipJobLogRecord } from "./types";

// 需要 JSON 美化彈窗顯示的欄位
const JSON_FIELDS = ["response", "bet_item"];

export function useVip3() {
  const searchForm = reactive({
    id: ""
  });
  // 多個 job 群組，每組各自渲染一張表
  const groups = ref<VipJobLogGroup[]>([]);
  const loading = ref(false);

  // 依某群組的第一筆資料動態推導欄位
  function buildColumns(list: VipJobLogRecord[]): TableColumnList {
    if (!list?.length) return [];
    return Object.keys(list[0]).map(key => {
      if (JSON_FIELDS.includes(key)) {
        return {
          label: key,
          prop: key,
          width: 180,
          showOverflowTooltip: false,
          cellRenderer: ({ row }) => {
            const val = row[key];
            const text = typeof val === "string" ? val : JSON.stringify(val);
            return (
              <ElPopover
                placement="bottom-start"
                trigger="click"
                width={400}
                popper-class="vip3-json-popover"
              >
                {{
                  reference: () => (
                    <span class="vip3-json-cell">{text}</span>
                  ),
                  default: () => (
                    <div>
                      <a
                        href={
                          "https://codebeautify.org/jsonviewer?input=" +
                          encodeURIComponent(text ?? "")
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        JSON Beautify
                      </a>
                      <p style="white-space:pre-wrap;word-break:break-all;max-height:300px;overflow:auto;margin-top:8px">
                        {text}
                      </p>
                    </div>
                  )
                }}
              </ElPopover>
            );
          }
        };
      }
      return { label: key, prop: key };
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getVipJobLogById({ id: searchForm.id });
      const next: VipJobLogGroup[] = [];
      if (success && data) {
        // 後端回傳物件：key 為 job 名稱、value 為該 job 紀錄陣列
        Object.entries(data).forEach(([name, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            next.push({ name, list: value });
          }
        });
      }
      groups.value = next;
      if (next.length === 0) {
        message($t("sys.noData"), { type: "error" });
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    groups.value = [];
  }

  return {
    searchForm,
    loading,
    groups,
    buildColumns,
    onSearch,
    resetForm
  };
}
