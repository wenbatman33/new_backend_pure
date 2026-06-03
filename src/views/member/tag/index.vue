<script setup lang="ts">
import { ref } from "vue";
import { useMemberTag } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "MemberTag" });

const formRef = ref();
const {
  searchForm,
  navItems,
  activeCollapse,
  loading,
  onSearch,
  resetForm,
  openGroupDialog,
  openTagDialog
} = useMemberTag();

// 標籤勾選欄位：對應 i18n key 與資料欄位
const checkColumns: { key: string; label: string }[] = [
  { key: "onlyBySystem", label: "member.memberTagCannotBeMarked" },
  { key: "loginForbidden", label: "member.loginProhibited" },
  { key: "loginReason", label: "member.memberTagCannotLoginShowReason" },
  { key: "withdrawalForbidden", label: "member.withdrawalsProhibited" },
  { key: "withdrawReason", label: "member.memberTagCannotWithdrawalShowReason" },
  { key: "depositForbidden", label: "member.noDepositsAllowed" },
  { key: "riskNotifyAlways", label: "member.memberTagRiskControlNoticeRepeat" },
  { key: "riskNotifyOnce", label: "member.memberTagRiskControlNoticeNoRepeat" },
  { key: "riskCondition", label: "member.memberTagRisk" },
  { key: "financialNotifyAlways", label: "member.memberTagWithdrawalNoticeRepeat" },
  { key: "loginNotify", label: "member.loginNotification" },
  { key: "withdrawalColor", label: "member.withdrawalColor" },
  { key: "withdrawalSpecialNoColor", label: "member.withdrawalSpecialNoColor" },
  { key: "loginWhiteList", label: "member.loginWhiteList" }
];
</script>

<template>
  <div class="main">
    <div class="bg-bg_color px-6 py-4 rounded-md">
      <!-- 標題與群組新增 -->
      <div class="flex items-center mb-4">
        <span class="text-xl font-bold mr-3">{{ $t("member.tagGroup") }}</span>
        <el-button
          v-if="hasAuth('__btn_add_tag_group')"
          type="primary"
          :icon="AddFill"
          @click="openGroupDialog(false)"
        >
          {{ $t("member.addTagGroup") }}
        </el-button>
      </div>

      <!-- 搜尋區 -->
      <el-form ref="formRef" :inline="true" :model="searchForm">
        <el-form-item :label="$t('member.tagSearchId')" prop="id">
          <el-input
            v-model="searchForm.id"
            clearable
            class="!w-[120px]"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item :label="$t('member.tagSearchName')" prop="name">
          <el-input
            v-model="searchForm.name"
            clearable
            class="!w-[160px]"
            @keyup.enter="onSearch"
          />
        </el-form-item>
        <el-form-item prop="isFuzzySearch">
          <el-radio-group v-model="searchForm.isFuzzySearch">
            <el-radio :value="false">{{ $t("member.exactSearch") }}</el-radio>
            <el-radio :value="true">{{ $t("member.fuzzySearch") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="loading"
            @click="onSearch"
          >
            {{ $t("member.tagSearch") }}
          </el-button>
          <el-button :icon="Refresh" @click="resetForm">
            {{ $t("member.reset") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 群組列表 -->
      <template v-for="group in navItems" :key="group.id">
        <el-collapse
          v-if="group.children && group.children.length > 0"
          v-model="activeCollapse[group.id]"
          class="mt-4"
        >
          <el-collapse-item name="panel">
            <template #title>
              <div
                class="flex items-center justify-between w-full pr-4"
                :style="{ color: group.color }"
              >
                <span class="text-lg font-bold">
                  {{ group.name }} {{ group.color }}
                </span>
                <span @click.stop>
                  <el-button
                    v-if="hasAuth('__btn_tag_edit_group')"
                    size="small"
                    @click="openGroupDialog(true, group)"
                  >
                    {{ $t("member.editGroup") }}
                  </el-button>
                  <el-button
                    v-if="hasAuth('__btn_add_tag')"
                    size="small"
                    type="primary"
                    @click="openTagDialog(false, group)"
                  >
                    {{ $t("member.addTag") }}
                  </el-button>
                </span>
              </div>
            </template>

            <el-table :data="group.children" border size="small" max-height="500">
              <el-table-column label="ID" prop="id" width="70" align="center" />
              <el-table-column
                :label="$t('member.tagName')"
                prop="name"
                width="160"
                align="center"
              />
              <el-table-column
                v-for="col in checkColumns"
                :key="col.key"
                :label="$t(col.label)"
                align="center"
                min-width="120"
              >
                <template #default="{ row }">
                  <span>{{ row[col.key] === true ? "✓" : "" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('member.operating')"
                fixed="right"
                width="100"
                align="center"
              >
                <template #default="{ row }">
                  <el-button
                    v-if="hasAuth('__btn_add_tag')"
                    link
                    type="primary"
                    @click="openTagDialog(true, row)"
                  >
                    {{ $t("member.edit") }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </template>
    </div>
  </div>
</template>
