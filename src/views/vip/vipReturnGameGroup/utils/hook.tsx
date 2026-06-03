import { h, ref, reactive, onMounted } from "vue";
import { ElInput } from "element-plus";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { findByValue } from "@/utils/options";
import {
  getConfigure,
  getVipGameGroupReturn,
  putVipGameGroupReturnEdit
} from "@/api/vip";
import editForm from "../form.vue";
import type { OptionItem, FormItemProps } from "./types";

export function useVipReturnGameGroup() {
  const loading = ref(true);
  const dataList = ref<Record<string, any>[]>([]);
  const formRef = ref();

  // 遊戲群組下拉選項
  // TODO: 舊碼用 gameOptions() from @/utils/dropdown 取得 gameGroup 清單，
  // dropdown 尚未移植，先以空陣列佔位，待 dropdown 移植後補上。
  const gameGroupList = ref<OptionItem[]>([]);

  // 動態欄位（每個 VIP 等級一欄）
  const levelList = ref<string[]>([]);
  // 新增列時的預設值（各等級欄位預設 0）
  const defaultRow = ref<Record<string, any>>({ gameGroupID: "" });

  const columns = ref<TableColumnList>([]);

  // 等級欄位的可編輯輸入框
  function renderLevelInput(row: Record<string, any>, level: string) {
    return h(ElInput, {
      modelValue: row[level],
      "onUpdate:modelValue": (val: string) => {
        let value = val;
        if (value === "") {
          row[level] = "";
          return;
        }
        // 僅允許數字與小數點
        const last = value[value.length - 1];
        if (/[^0-9.]/g.test(last)) {
          value = value.slice(0, -1);
        }
        // 小數最多兩位
        const parts = value.toString().split(".");
        if (parts.length > 1 && parts[1].length >= 3) {
          value = value.slice(0, value.length - 1);
        }
        row[level] = value;
      }
    });
  }

  function buildColumns() {
    const cols: TableColumnList = [
      {
        label: $t("vip.group"),
        prop: "gameGroupID",
        width: 140,
        cellRenderer: ({ row }) => (
          <span>{findByValue(gameGroupList.value, row.gameGroupID)}</span>
        )
      }
    ];
    levelList.value.forEach(level => {
      cols.push({
        label: level,
        prop: level,
        minWidth: 100,
        cellRenderer: ({ row }) => renderLevelInput(row, level)
      });
    });
    columns.value = cols;
  }

  // 取得列表資料：把 returnList[{level,refund}] 攤平成 row[level]=refund
  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getVipGameGroupReturn();
      const list = (data?.list ?? []).map((item: any) => {
        const row: Record<string, any> = { gameGroupID: item.gameGroupID };
        (item.returnList ?? []).forEach((i: any) => {
          row[i.level] = i.refund;
        });
        return row;
      });
      dataList.value = list;
    } finally {
      loading.value = false;
    }
  }

  // 批次儲存：把 row 攤平回 returnList
  async function handleSubmit() {
    const payload = dataList.value.map(item => {
      const returnList: { level: string; refund: any }[] = [];
      Object.keys(item).forEach(key => {
        if (key !== "gameGroupID") {
          returnList.push({ level: key, refund: item[key] });
        }
      });
      return { gameGroupID: item.gameGroupID, returnList };
    });
    const { success } = await putVipGameGroupReturnEdit({ list: payload });
    if (success) {
      message($t("vip.updateSuccess"), { type: "success" });
    }
    onSearch();
  }

  // 新增遊戲群組列
  function openDialog() {
    const existIDs = dataList.value.map(item => item.gameGroupID);
    const options = gameGroupList.value.filter(g => !existIDs.includes(g.id));
    addDialog({
      title: $t("vip.add"),
      props: {
        formInline: {
          gameGroupID: "",
          gameGroupOptions: options
        }
      },
      width: "400px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options: opts }) => {
        const FormRef = formRef.value.getRef();
        const curData = opts.props.formInline as FormItemProps;
        FormRef.validate((valid: boolean) => {
          if (!valid) return;
          const isExist = dataList.value.find(
            item => item.gameGroupID === curData.gameGroupID
          );
          if (!isExist) {
            const row: Record<string, any> = { ...defaultRow.value };
            row.gameGroupID = curData.gameGroupID;
            dataList.value.push(row);
          }
          done();
        });
      }
    });
  }

  async function init() {
    const { data } = await getConfigure();
    (data?.levelList ?? []).forEach((item: any) => {
      levelList.value.push(item.level);
      defaultRow.value[item.level] = 0;
    });
    buildColumns();
    await onSearch();
  }

  onMounted(() => {
    init();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    handleSubmit,
    openDialog
  };
}
