<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRiskAgencyTagSystem } from "./utils/hook";
import EditForm from "./form.vue";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "RiskControlRiskAgencyTagSystem" });

const searchFormRef = ref();
const addFormCompRef = ref();
// 每一張編輯卡片的 form.vue ref（依 agencyTagGroupId 對應）
const editRefs = reactive<Record<number, any>>({});
// 每一張卡片是否進入編輯模式
const editingMap = reactive<Record<number, boolean>>({});

const {
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
} = useRiskAgencyTagSystem();

// 把頂部新增卡片的 form ref 暴露給 hook
function bindAddRef(el: any) {
  addFormRef.value = el;
  addFormCompRef.value = el;
}

function toggleEdit(id: number) {
  editingMap[id] = true;
}

async function saveEdit(row: any) {
  await handleUpdate(row, editRefs[row.agencyTagGroupId]);
  editingMap[row.agencyTagGroupId] = false;
}
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <span class="font-medium">{{ $t("risk_control.autoTagSys") }}</span>
      </template>

      <!-- 新增區 -->
      <div class="flex items-start gap-4">
        <EditForm
          :ref="bindAddRef"
          :form-inline="addForm"
          :tag-group-options="tagGroupOptions"
          :tag-options-all="tagOptionsAll"
        />
        <el-button
          v-if="hasAuth('__btn_risk_agency_tag_system')"
          type="primary"
          class="mt-1"
          @click="handleAdd"
        >
          {{ $t("risk_control.add") }}
        </el-button>
      </div>

      <el-divider />

      <!-- 搜尋區 -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="search-form"
      >
        <el-form-item :label="$t('risk_control.agencyLine')" prop="agencyID">
          <el-input
            v-model="searchForm.agencyID"
            clearable
            class="!w-[220px]"
            :placeholder="`10430,10431,10432 (${$t('risk_control.example')})`"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item :label="$t('risk_control.tagID')" prop="tagID">
          <el-select
            v-model="searchForm.tagID"
            multiple
            filterable
            collapse-tags
            clearable
            class="!w-[260px]"
            :placeholder="$t('risk_control.selectTag')"
          >
            <el-option
              v-for="t in tagOptionsAll"
              :key="t.id"
              :label="t.name"
              :value="t.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="loading"
            @click="onSearch"
          >
            {{ $t("risk_control.search") }}
          </el-button>
          <el-button :icon="Refresh" @click="resetForm(searchFormRef)">
            {{ $t("risk_control.reset") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 列表（可編輯卡片） -->
      <div v-loading="loading" class="overflow-auto">
        <el-empty
          v-if="!tagGroups.length"
          :description="$t('risk_control.noData')"
        />
        <div
          v-for="item in tagGroups"
          :key="item.agencyTagGroupId"
          class="flex justify-between items-start p-4 my-3 border rounded"
        >
          <EditForm
            :ref="el => (editRefs[item.agencyTagGroupId] = el)"
            :form-inline="item as any"
            :tag-group-options="tagGroupOptions"
            :tag-options-all="tagOptionsAll"
            :readonly="!editingMap[item.agencyTagGroupId]"
          />
          <div
            v-if="hasAuth('__btn_risk_agency_tag_system')"
            class="flex gap-2 ml-4"
          >
            <el-button
              v-if="!editingMap[item.agencyTagGroupId]"
              @click="toggleEdit(item.agencyTagGroupId)"
            >
              {{ $t("risk_control.edit") }}
            </el-button>
            <template v-else>
              <el-button type="danger" @click="handleDelete(item)">
                {{ $t("risk_control.delText") }}
              </el-button>
              <el-button type="primary" @click="saveEdit(item)">
                {{ $t("risk_control.okText") }}
              </el-button>
            </template>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  margin: 12px 0;
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
