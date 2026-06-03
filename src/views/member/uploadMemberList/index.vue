<script setup lang="ts">
import { useUploadMemberList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";

defineOptions({ name: "MemberUploadMemberList" });

const {
  memberName,
  loading,
  columns,
  dataList,
  onSearch,
  handleSelectionChange,
  handleView,
  handleExport,
  downloadTemplate,
  handleTagBatch,
  handleAddNote,
  handleMoneyBatch,
  handleLoginBatch,
  handleCheckEvent
} = useUploadMemberList();
</script>

<template>
  <div class="main">
    <!-- 搜寻 / 汇入区 -->
    <el-form
      :inline="true"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('member.memberAccount')">
        <el-input
          id="memberNameForCopy"
          v-model="memberName"
          clearable
          class="!w-[320px]"
          :placeholder="$t('member.separated')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <!-- TODO 待 Excel 汇入工具移植后接回（旧 ImpExcel） -->
        <el-button
          v-if="hasAuth('__btn_upload_member_tag_batch')"
          type="primary"
          disabled
        >
          {{ $t("member.importList") }}
        </el-button>
        <el-button type="primary" @click="downloadTemplate">
          {{ $t("member.downloadTemplate") }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          :disabled="memberName === ''"
          @click="onSearch"
        >
          {{ $t("member.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('member.menuUploadMemberList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_upload_member_export')"
          type="primary"
          @click="handleExport"
        >
          {{ $t("member.handleExport") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_upload_member_tag_batch')"
          type="primary"
          @click="handleTagBatch"
        >
          {{ $t("member.addTag") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_upload_member_comments_batch')"
          type="primary"
          @click="handleAddNote"
        >
          {{ $t("member.addNewNote") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_upload_member_deposit')"
          type="primary"
          @click="handleMoneyBatch('deposit')"
        >
          {{ $t("member.depositAWord") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_upload_member_withdrawal')"
          type="primary"
          @click="handleMoneyBatch('withdraw')"
        >
          {{ $t("member.withdraw") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_upload_member_login')"
          type="primary"
          @click="handleLoginBatch"
        >
          {{ $t("member.loginAWord") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="memberID"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #memberAccount="{ row }">
            <el-link type="primary" @click="handleView(row)">
              {{ row.memberAccount }}
            </el-link>
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_upload_member_login')"
              link
              :type="
                row.loginStatus === 1
                  ? 'success'
                  : row.loginStatus === 2
                    ? 'danger'
                    : 'warning'
              "
              @click="handleCheckEvent(row, 'status')"
            >
              {{ $t("member.loginAWord") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_upload_member_deposit')"
              link
              :type="row.depositStatus === 1 ? 'success' : 'danger'"
              @click="handleCheckEvent(row, 'depositLimit')"
            >
              {{ $t("member.depositAWord") }}
            </el-button>
            <el-button
              link
              :type="row.withdrawalStatus === 1 ? 'success' : 'danger'"
              @click="handleCheckEvent(row, 'withdrawLimit')"
            >
              {{ $t("member.withdraw") }}
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
