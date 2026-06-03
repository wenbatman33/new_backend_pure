import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import groupForm from "../groupForm.vue";
import tagForm from "../tagForm.vue";
import {
  getMemberTagGroupList,
  getMemberTagList,
  createMemberTagGroup,
  updateMemberTagGroup,
  createMemberTag,
  updateMemberTag,
  type MemberTagItem
} from "@/api/member";
import type {
  TagGroupItem,
  GroupFormItemProps,
  TagFormItemProps
} from "./types";

export function useMemberTag() {
  // 搜尋條件
  const searchForm = reactive({
    id: "",
    name: "",
    isFuzzySearch: false
  });

  const navItems = ref<TagGroupItem[]>([]);
  // 控制各群組 Collapse 展開狀態
  const activeCollapse = ref<Record<number, string[]>>({});
  const loading = ref(false);

  const groupFormRef = ref();
  const tagFormRef = ref();

  /** 取得群組並掛載對應標籤 */
  async function loadGroups(params?: {
    id?: string;
    name?: string;
    isFuzzySearch?: boolean;
  }) {
    loading.value = true;
    try {
      const { data: groupData } = await getMemberTagGroupList();
      const { data: tagData } = await getMemberTagList(params);
      const groups = (groupData?.list ?? []) as TagGroupItem[];
      const tags = (tagData?.list ?? []) as MemberTagItem[];
      groups.forEach(group => {
        group.children = tags.filter(tag => tag.tagGroupID === group.id);
      });
      navItems.value = groups;
      return groups;
    } finally {
      loading.value = false;
    }
  }

  async function onSearch() {
    const params: { id?: string; name?: string; isFuzzySearch?: boolean } = {};
    if (searchForm.id) params.id = searchForm.id;
    if (searchForm.name) {
      params.name = searchForm.name;
      params.isFuzzySearch = searchForm.isFuzzySearch;
    }
    if (!params.id && !params.name) {
      await loadGroups();
      activeCollapse.value = {};
      return;
    }
    const result = await loadGroups(params);
    // 搜尋後自動展開全部
    const keys: Record<number, string[]> = {};
    result.forEach(group => {
      keys[group.id] = ["panel"];
    });
    activeCollapse.value = keys;
  }

  async function resetForm() {
    searchForm.id = "";
    searchForm.name = "";
    searchForm.isFuzzySearch = false;
    await loadGroups();
    activeCollapse.value = {};
  }

  /** 群組下拉選項（供標籤表單使用） */
  function buildGroupOptions() {
    return navItems.value.map(g => ({ value: g.id, label: g.name }));
  }

  /** 新增/編輯群組 */
  function openGroupDialog(isUpdate = false, row?: TagGroupItem) {
    addDialog({
      title: isUpdate ? $t("member.editTagGroup") : $t("member.addTagGroup"),
      props: {
        isUpdate,
        formInline: {
          id: isUpdate ? row?.id : undefined,
          name: isUpdate ? (row?.name ?? "") : "",
          color: isUpdate ? (row?.color ?? "#000000") : "#000000"
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(groupForm, { ref: groupFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = groupFormRef.value.getRef();
        const curData = options.props.formInline as GroupFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload = { name: curData.name, color: curData.color };
          const { success } = isUpdate
            ? await updateMemberTagGroup({
                ...payload,
                id: Number(curData.id)
              })
            : await createMemberTagGroup(payload);
          if (success) {
            message($t("member.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 新增/編輯標籤 */
  function openTagDialog(isUpdate = false, row?: Partial<MemberTagItem>) {
    const groupOptions = buildGroupOptions();
    addDialog({
      title: isUpdate ? $t("member.detailHandleTag") : $t("member.addTag"),
      props: {
        isUpdate,
        groupOptions,
        formInline: {
          id: isUpdate ? row?.id : undefined,
          createdAt: row?.createdAt ?? "",
          updatedAt: row?.updatedAt ?? "",
          name: isUpdate ? (row?.name ?? "") : "",
          // 新增時 row 為所屬群組，帶入群組 id 作為 tagGroupID
          tagGroupID: isUpdate ? row?.tagGroupID : row?.id,
          onlyBySystem: !!row?.onlyBySystem,
          loginForbidden: !!row?.loginForbidden,
          loginReason: !!row?.loginReason,
          withdrawalForbidden: !!row?.withdrawalForbidden,
          withdrawReason: !!row?.withdrawReason,
          depositForbidden: !!row?.depositForbidden,
          riskNotifyAlways: !!row?.riskNotifyAlways,
          riskNotifyOnce: !!row?.riskNotifyOnce,
          riskCondition: !!row?.riskCondition,
          financialNotifyAlways: !!row?.financialNotifyAlways,
          loginNotify: !!row?.loginNotify,
          withdrawalColor: !!row?.withdrawalColor,
          withdrawalSpecialNoColor: !!row?.withdrawalSpecialNoColor,
          loginWhiteList: !!row?.loginWhiteList
        }
      },
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(tagForm, { ref: tagFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = tagFormRef.value.getRef();
        const curData = options.props.formInline as TagFormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const { success } = isUpdate
            ? await updateMemberTag(curData)
            : await createMemberTag(curData);
          if (success) {
            message($t("member.success"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    navItems,
    activeCollapse,
    loading,
    onSearch,
    resetForm,
    openGroupDialog,
    openTagDialog
  };
}
