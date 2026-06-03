<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormItemProps, TagGroup, TagItem } from "./utils/types";

const props = withDefaults(
  defineProps<{
    formInline?: FormItemProps;
    /** 標籤群組選項 */
    tagGroupOptions?: TagGroup[];
    /** 全部標籤選項 */
    tagOptionsAll?: TagItem[];
    /** 是否唯讀（編輯卡片未點「編輯」時） */
    readonly?: boolean;
  }>(),
  {
    formInline: () => ({
      agencyId: "",
      tagId: [],
      remark: ""
    }),
    tagGroupOptions: () => [],
    tagOptionsAll: () => [],
    readonly: false
  }
);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 目前選擇的群組（用以過濾下方可選標籤）
const selectedGroup = ref<number | null>(null);

// 依選擇群組過濾標籤；未選群組則顯示全部
const tagSelectOptions = computed(() => {
  if (!selectedGroup.value) return props.tagOptionsAll;
  return props.tagOptionsAll.filter(t => t.tagGroupID === selectedGroup.value);
});

// 已選標籤的完整資料（用於 tag 顯示）
const selectedTagItems = computed(() =>
  props.tagOptionsAll.filter(t => newFormInline.value.tagId.includes(t.id))
);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item :label="$t('risk_control.agencyLine')" prop="agencyId">
      <el-input
        v-model="newFormInline.agencyId"
        clearable
        :disabled="readonly"
        :placeholder="`10430,10431,10432 (${$t('risk_control.example')})`"
        class="!w-[260px]"
      />
    </el-form-item>

    <el-form-item :label="$t('risk_control.tagID')" prop="tagId">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <!-- 群組過濾 -->
          <el-select
            v-model="selectedGroup"
            clearable
            :disabled="readonly"
            :placeholder="$t('risk_control.selectGroup')"
            class="!w-[150px]"
          >
            <el-option
              v-for="g in tagGroupOptions"
              :key="g.id"
              :label="g.name"
              :value="g.id"
            />
          </el-select>
          <!-- 標籤多選 -->
          <el-select
            v-model="newFormInline.tagId"
            multiple
            filterable
            collapse-tags
            :disabled="readonly"
            :placeholder="$t('risk_control.selectTag')"
            class="!w-[260px]"
          >
            <el-option
              v-for="t in tagSelectOptions"
              :key="t.id"
              :label="t.name"
              :value="t.id"
            />
          </el-select>
        </div>
        <!-- 已選標籤展示 -->
        <div v-if="selectedTagItems.length" class="flex flex-wrap gap-1">
          <el-tag
            v-for="t in selectedTagItems"
            :key="t.id"
            :color="t.color"
            effect="light"
          >
            {{ t.name }}
          </el-tag>
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="$t('risk_control.remark')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        clearable
        :disabled="readonly"
        class="!w-[260px]"
      />
    </el-form-item>
  </el-form>
</template>
