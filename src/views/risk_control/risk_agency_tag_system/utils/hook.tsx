import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import {
  getAgencyTags,
  addAgencyTagGroup,
  putAgencyTagGroup,
  delAgencyTagGroup,
  getMemberTagGroup,
  getMemberTag
} from "@/api/risk_control";
import type {
  AgencyTagGroup,
  TagGroup,
  TagItem,
  FormItemProps
} from "./types";

export function useRiskAgencyTagSystem() {
  const loading = ref(true);
  // 列表（每一筆 = 一張可編輯卡片）
  const tagGroups = ref<AgencyTagGroup[]>([]);
  // 標籤群組與標籤選項
  const tagGroupOptions = ref<TagGroup[]>([]);
  const tagOptionsAll = ref<TagItem[]>([]);

  // 頂部「新增」卡片表單
  const addForm = reactive<FormItemProps>({
    agencyId: "",
    tagId: [],
    remark: ""
  });
  const addFormRef = ref();

  // 搜尋條件
  const searchForm = reactive<{ agencyID: string; tagID: number[] }>({
    agencyID: "",
    tagID: []
  });

  /** 把後端逗號字串 tagId 轉為 number[] */
  function normalizeTagId(v: string | number[]): number[] {
    if (Array.isArray(v)) return v.map(Number);
    if (!v) return [];
    return String(v)
      .split(",")
      .filter(Boolean)
      .map(Number);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {};
      if (searchForm.agencyID) params.agencyID = searchForm.agencyID;
      if (searchForm.tagID?.length) params.tagID = searchForm.tagID.join(",");
      const { data } = await getAgencyTags(params);
      const list = data?.list ?? [];
      tagGroups.value = list.map(item => ({
        ...item,
        tagId: normalizeTagId(item.tagId)
      }));
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.tagID = [];
    onSearch();
  }

  /** 新增代理標籤群組 */
  async function handleAdd() {
    const FormRef = addFormRef.value?.getRef?.() ?? addFormRef.value;
    if (!FormRef) return;
    FormRef.validate(async (valid: boolean) => {
      if (!valid) return;
      const { success } = await addAgencyTagGroup({
        agencyID: addForm.agencyId,
        tagID: addForm.tagId.join(","),
        remark: addForm.remark
      });
      if (success) {
        message($t("risk_control.createSuccess"), { type: "success" });
        addForm.agencyId = "";
        addForm.tagId = [];
        addForm.remark = "";
        onSearch();
      }
    });
  }

  /** 編輯（儲存）某一張卡片 */
  async function handleUpdate(row: AgencyTagGroup, formRef) {
    const FormRef = formRef?.getRef?.() ?? formRef;
    if (!FormRef) return;
    FormRef.validate(async (valid: boolean) => {
      if (!valid) return;
      const tagId = Array.isArray(row.tagId)
        ? row.tagId.join(",")
        : String(row.tagId);
      const { success } = await putAgencyTagGroup({
        groupID: row.agencyTagGroupId,
        agencyID: row.agencyId,
        tagID: tagId,
        remark: row.remark
      });
      if (success) {
        message($t("risk_control.updateSuccess"), { type: "success" });
        onSearch();
      }
    });
  }

  /** 刪除某一張卡片 */
  function handleDelete(row: AgencyTagGroup) {
    ElMessageBox.confirm($t("risk_control.confirmDel"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await delAgencyTagGroup(row.agencyTagGroupId);
        if (success) {
          message($t("risk_control.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  /** 載入標籤群組與標籤，並為標籤帶上群組顏色 */
  async function loadTagOptions() {
    const [groupRes, tagRes] = await Promise.all([
      getMemberTagGroup(),
      getMemberTag()
    ]);
    const groups: TagGroup[] = groupRes?.data?.list ?? [];
    const tags: TagItem[] = tagRes?.data?.list ?? [];
    tags.forEach(tag => {
      tag.color = groups.find(g => g.id === tag.tagGroupID)?.color;
    });
    tagGroupOptions.value = groups;
    tagOptionsAll.value = tags;
  }

  onMounted(async () => {
    await loadTagOptions();
    await onSearch();
  });

  return {
    loading,
    tagGroups,
    tagGroupOptions,
    tagOptionsAll,
    addForm,
    addFormRef,
    searchForm,
    onSearch,
    resetForm,
    handleAdd,
    handleUpdate,
    handleDelete
  };
}
