<script setup lang="ts">
import { ref } from "vue";
import { useMatch } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityMatch" });

const formRef = ref();
const {
  searchForm,
  matchType,
  matchGroup,
  leagueOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleCreateNews,
  handleCreateQuiz
} = useMatch();
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('activity.matchLeague')" prop="league">
        <el-select
          v-model="searchForm.league"
          clearable
          class="!w-[180px]"
          :placeholder="$t('activity.matchPleaseChoiceLeague')"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="showInactive">
        <el-checkbox v-model="searchForm.showInactive">
          {{ $t("activity.matchShowInactiveLeague") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('activity.matchRedPacket')" prop="redPacket">
        <el-select v-model="searchForm.redPacket" clearable class="!w-[120px]">
          <el-option :label="$t('activity.all')" value="" />
          <el-option :label="$t('activity.yes')" value="1" />
          <el-option :label="$t('activity.no')" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.matchEventTimeStart')" prop="eventTimeStart">
        <el-date-picker
          v-model="searchForm.eventTimeStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.matchEventTimeEnd')" prop="eventTimeEnd">
        <el-date-picker
          v-model="searchForm.eventTimeEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.matchEventProgress')" prop="matchType">
        <el-select v-model="searchForm.matchType" clearable class="!w-[140px]">
          <el-option
            v-for="item in matchType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.matchGroupLabel')" prop="matchGroup">
        <el-select v-model="searchForm.matchGroup" clearable class="!w-[140px]">
          <el-option
            v-for="item in matchGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区 -->
    <PureTableBar :title="$t('activity.menuMatch')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_match_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog($t('activity.add'))"
        >
          {{ $t("activity.matchAddSchedule") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_match_edit')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="EditPen"
              @click="openDialog($t('activity.edit'), row)"
            >
              {{ $t("activity.edit") }}
            </el-button>
            <el-popconfirm
              :title="$t('activity.confirmDelete')"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-if="hasAuth('__btn_match_delete')"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="Delete"
                >
                  {{ $t("activity.delete") }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
              v-if="hasAuth('__btn_matchnews_create')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleCreateNews(row)"
            >
              {{ $t("activity.matchNews") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_quiz_create')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleCreateQuiz(row)"
            >
              {{ $t("activity.matchQuiz") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
